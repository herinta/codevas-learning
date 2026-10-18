import { query } from "@/lib/db/pool";
import { UserDailyActivityEntity } from "@/lib/db/entities";

export interface DailyTargetStatus {
  activeSeconds: number;
  targetSeconds: number;
  remainingSeconds: number;
  isCompleted: boolean;
  xpClaimed: boolean;
  percent: number;
  formattedActive: string;
  formattedTarget: string;
  bonusXpReward: number;
  weeklyHistory?: Array<{
    date: string;
    dayName: string;
    activeSeconds: number;
    activeMinutes: number;
    isCompleted: boolean;
  }>;
}

const DEFAULT_TARGET_SECONDS = 600; // 10 menit
const DAILY_TARGET_XP_BONUS = 30; // +30 XP bonus

export class DailyTargetService {
  /**
   * Format seconds to "MM:SS" or "Xm Ys"
   */
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  /**
   * Get user's today daily target progress
   */
  static async getTodayActivity(userId: string): Promise<DailyTargetStatus> {
    const rows = await query<UserDailyActivityEntity>(
      `SELECT * FROM user_daily_activity 
       WHERE user_id = $1 AND activity_date = CURRENT_DATE 
       LIMIT 1`,
      [userId]
    );

    let activeSeconds = 0;
    let targetSeconds = DEFAULT_TARGET_SECONDS;
    let isCompleted = false;
    let xpClaimed = false;

    if (rows.length > 0) {
      activeSeconds = rows[0].active_seconds;
      targetSeconds = rows[0].target_seconds || DEFAULT_TARGET_SECONDS;
      isCompleted = rows[0].is_completed;
      xpClaimed = rows[0].xp_claimed;
    }

    const remainingSeconds = Math.max(0, targetSeconds - activeSeconds);
    const percent = Math.min(100, Math.round((activeSeconds / targetSeconds) * 100));

    return {
      activeSeconds,
      targetSeconds,
      remainingSeconds,
      isCompleted,
      xpClaimed,
      percent,
      formattedActive: this.formatTime(activeSeconds),
      formattedTarget: this.formatTime(targetSeconds),
      bonusXpReward: DAILY_TARGET_XP_BONUS,
    };
  }

  /**
   * Record active learning seconds (heartbeat)
   */
  static async recordActiveSeconds(
    userId: string,
    secondsToAdd: number
  ): Promise<{
    status: DailyTargetStatus;
    justCompleted: boolean;
    xpAwarded: number;
  }> {
    // Sanitize added seconds (prevent cheating: min 1s, max 120s per heartbeat)
    const validSeconds = Math.min(120, Math.max(1, Math.round(secondsToAdd)));

    // Upsert today's activity row
    const rows = await query<UserDailyActivityEntity>(
      `INSERT INTO user_daily_activity (user_id, activity_date, active_seconds, target_seconds)
       VALUES ($1, CURRENT_DATE, $2, $3)
       ON CONFLICT (user_id, activity_date) DO UPDATE
       SET active_seconds = user_daily_activity.active_seconds + $2,
           updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, validSeconds, DEFAULT_TARGET_SECONDS]
    );

    const record = rows[0];
    let justCompleted = false;
    let xpAwarded = 0;

    // Check if target reached (10 minutes) and not yet marked/claimed
    if (record.active_seconds >= record.target_seconds && (!record.is_completed || !record.xp_claimed)) {
      justCompleted = !record.is_completed;

      // Award XP transaction if not yet claimed
      if (!record.xp_claimed) {
        xpAwarded = DAILY_TARGET_XP_BONUS;

        // 1. Ledger transaction
        await query(
          `INSERT INTO xp_transactions (user_id, amount, source, reference_id, description)
           VALUES ($1, $2, 'DAILY_TARGET_COMPLETE', 'daily_10min_' || CURRENT_DATE::text, 'Bonus Target Harian 10 Menit Fokus')`,
          [userId, DAILY_TARGET_XP_BONUS]
        );

        // 2. Add XP to users profile
        await query(
          `UPDATE users 
           SET xp_points = xp_points + $1,
               last_active_date = CURRENT_DATE,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [DAILY_TARGET_XP_BONUS, userId]
        );
      }

      // 3. Mark completed and claimed in user_daily_activity
      await query(
        `UPDATE user_daily_activity
         SET is_completed = TRUE,
             xp_claimed = TRUE,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [record.id]
      );

      record.is_completed = true;
      record.xp_claimed = true;
    }

    const remainingSeconds = Math.max(0, record.target_seconds - record.active_seconds);
    const percent = Math.min(100, Math.round((record.active_seconds / record.target_seconds) * 100));

    return {
      status: {
        activeSeconds: record.active_seconds,
        targetSeconds: record.target_seconds,
        remainingSeconds,
        isCompleted: record.is_completed,
        xpClaimed: record.xp_claimed,
        percent,
        formattedActive: this.formatTime(record.active_seconds),
        formattedTarget: this.formatTime(record.target_seconds),
        bonusXpReward: DAILY_TARGET_XP_BONUS,
      },
      justCompleted,
      xpAwarded,
    };
  }

  /**
   * Get past 7 days activity for weekly sparkline/mini-graph
   */
  static async getWeeklyHistory(userId: string): Promise<Array<{
    date: string;
    dayName: string;
    activeSeconds: number;
    activeMinutes: number;
    isCompleted: boolean;
  }>> {
    const rows = await query<{
      activity_date: string;
      active_seconds: number;
      is_completed: boolean;
    }>(
      `SELECT activity_date::text, active_seconds, is_completed
       FROM user_daily_activity
       WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '6 days'
       ORDER BY activity_date ASC`,
      [userId]
    );

    const historyMap = new Map(rows.map((r) => [r.activity_date, r]));
    const result = [];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split("T")[0];
      const found = historyMap.get(isoDate);

      const activeSeconds = found?.active_seconds || 0;
      result.push({
        date: isoDate,
        dayName: dayNames[d.getDay()],
        activeSeconds,
        activeMinutes: Math.round(activeSeconds / 60),
        isCompleted: found?.is_completed || false,
      });
    }

    return result;
  }
}
