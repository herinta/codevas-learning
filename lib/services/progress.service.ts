import { query } from "@/lib/db/pool";
import { UserProgressEntity, ProgressStatus, ChallengeEntity } from "@/lib/db/entities";
import { UserService } from "./user.service";
import { calculateGamificationStats, GamificationStats } from "@/lib/gamification";

export interface CompleteChallengeResult {
  success: boolean;
  earnedXp: number;
  newTotalXp: number;
  newStreakDays: number;
  nextChallengeId: string | null;
  isClassCompleted: boolean;
  level: number;
  leveledUp: boolean;
  rankTitle: string;
  rankBadge: string;
  levelProgressPercent: number;
  nextLevelXp: number;
  currentLevelXp: number;
}

export class ProgressService {
  /**
   * Get all progress entries for a given user
   */
  static async getUserProgress(userId: string): Promise<UserProgressEntity[]> {
    return query<UserProgressEntity>(
      "SELECT * FROM user_progress WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId]
    );
  }

  /**
   * Save or update progress draft code
   */
  static async saveDraft(
    userId: string,
    challengeId: string,
    codeSnapshot: string
  ): Promise<UserProgressEntity> {
    const rows = await query<UserProgressEntity>(
      `INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot, updated_at)
       VALUES ($1, $2, 'IN_PROGRESS', $3, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, challenge_id) DO UPDATE SET
         code_snapshot = EXCLUDED.code_snapshot,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [userId, challengeId, codeSnapshot]
    );
    return rows[0];
  }

  /**
   * Compatibility alias for upsertProgress
   */
  static async upsertProgress(
    userId: string,
    challengeId: string,
    status: ProgressStatus,
    codeSnapshot?: string
  ): Promise<UserProgressEntity> {
    const rows = await query<UserProgressEntity>(
      `INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, challenge_id) DO UPDATE SET
         status = EXCLUDED.status,
         code_snapshot = COALESCE(EXCLUDED.code_snapshot, user_progress.code_snapshot),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [userId, challengeId, status, codeSnapshot || null]
    );
    return rows[0];
  }

  /**
   * Complete challenge: marks challenge completed, awards XP, updates streak, and unlocks next level
   */
  static async completeChallenge(
    userId: string,
    challengeId: string,
    codeSnapshot: string
  ): Promise<CompleteChallengeResult> {
    // 1. Ambil detail challenge
    const chRows = await query<ChallengeEntity>(
      "SELECT * FROM challenges WHERE id = $1 LIMIT 1",
      [challengeId]
    );
    if (!chRows.length) {
      throw new Error("Challenge tidak ditemukan.");
    }
    const currentChallenge = chRows[0];

    // 2. Cek apakah user sebelumnya sudah pernah menyelesaikan ini (cegah spam XP)
    const existingProg = await query<UserProgressEntity>(
      "SELECT * FROM user_progress WHERE user_id = $1 AND challenge_id = $2 LIMIT 1",
      [userId, challengeId]
    );
    const wasAlreadyCompleted = existingProg[0]?.status === "COMPLETED";

    // 3. Update status progress menjadi COMPLETED
    await query(
      `INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot, completed_at, updated_at)
       VALUES ($1, $2, 'COMPLETED', $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, challenge_id) DO UPDATE SET
         status = 'COMPLETED',
         code_snapshot = EXCLUDED.code_snapshot,
         completed_at = COALESCE(user_progress.completed_at, CURRENT_TIMESTAMP),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, challengeId, codeSnapshot]
    );

    // 4. Tambah XP dan Update Streak jika ini penyelesaian pertama
    let earnedXp = 0;
    let addXpResult: {
      xp_points: number;
      level: number;
      earnedXp: number;
      leveledUp: boolean;
      stats: GamificationStats;
    } | null = null;

    if (!wasAlreadyCompleted) {
      earnedXp = currentChallenge.xp_reward;
      addXpResult = await UserService.addXp(
        userId,
        earnedXp,
        "CHALLENGE_COMPLETE",
        challengeId,
        `Menyelesaikan level tantangan: ${currentChallenge.title}`
      );
    }

    const { streak_days: newStreakDays } = await UserService.recordActivity(userId);
    const updatedUser = await UserService.findById(userId);
    const newTotalXp = updatedUser?.xp_points ?? 0;
    const stats = addXpResult?.stats || calculateGamificationStats(newTotalXp);

    // 5. Buka Level Berikutnya dalam Kelas ini
    const nextChRows = await query<ChallengeEntity>(
      `SELECT * FROM challenges 
       WHERE class_id = $1 AND order_index = $2 + 1 
       LIMIT 1`,
      [currentChallenge.class_id, currentChallenge.order_index]
    );

    let nextChallengeId: string | null = null;
    let isClassCompleted = false;

    if (nextChRows.length > 0) {
      nextChallengeId = nextChRows[0].id;
      // Buka level berikutnya
      await query(
        `INSERT INTO user_progress (user_id, challenge_id, status)
         VALUES ($1, $2, 'IN_PROGRESS')
         ON CONFLICT (user_id, challenge_id) DO UPDATE SET
           status = CASE WHEN user_progress.status = 'LOCKED' THEN 'IN_PROGRESS' ELSE user_progress.status END`,
        [userId, nextChallengeId]
      );
    } else {
      // Tidak ada level berikutnya lagi -> Kelas Tamat!
      isClassCompleted = true;
      await query(
        `UPDATE user_enrollments 
         SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 AND class_id = $2`,
        [userId, currentChallenge.class_id]
      );
    }

    return {
      success: true,
      earnedXp,
      newTotalXp,
      newStreakDays,
      nextChallengeId,
      isClassCompleted,
      level: stats.level,
      leveledUp: addXpResult?.leveledUp ?? false,
      rankTitle: stats.rank_title,
      rankBadge: stats.rank_badge,
      levelProgressPercent: stats.level_progress_percent,
      nextLevelXp: stats.next_level_xp,
      currentLevelXp: stats.current_level_xp,
    };
  }
}
