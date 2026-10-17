import { query } from "@/lib/db/pool";
import {
  ClassEntity,
  ClassWithChallenges,
  ChallengeEntity,
  ChallengeWithUserProgress,
  UserProgressEntity,
  EnrolledClassSummary,
} from "@/lib/db/entities";

export class ClassService {
  /**
   * Get all classes, dynamically enriched with user enrollment and progress percentage if logged in
   */
  static async getAllClasses(userId?: string): Promise<Array<ClassEntity & {
    totalLevels: number;
    completedLevels: number;
    progressPercent: number;
    isEnrolled: boolean;
  }>> {
    // 1. Ambil semua kelas diurutkan berdasarkan order_index
    const classes = await query<ClassEntity>(
      "SELECT * FROM classes ORDER BY order_index ASC, created_at ASC"
    );

    // 2. Ambil total tantangan per kelas
    const counts = await query<{ class_id: string; total: string }>(
      "SELECT class_id, count(*)::text as total FROM challenges GROUP BY class_id"
    );
    const countMap = new Map<string, number>();
    counts.forEach((c) => countMap.set(c.class_id, parseInt(c.total, 10)));

    // 3. Jika user login, ambil data enrollments & progress
    const enrolledSet = new Set<string>();
    const completedMap = new Map<string, number>();

    if (userId) {
      const enrollments = await query<{ class_id: string }>(
        "SELECT class_id FROM user_enrollments WHERE user_id = $1 AND status != 'DROPPED'",
        [userId]
      );
      enrollments.forEach((e) => enrolledSet.add(e.class_id));

      const completed = await query<{ class_id: string; completed_count: string }>(
        `SELECT c.class_id, count(*)::text as completed_count
         FROM user_progress up
         JOIN challenges c ON up.challenge_id = c.id
         WHERE up.user_id = $1 AND up.status = 'COMPLETED'
         GROUP BY c.class_id`,
        [userId]
      );
      completed.forEach((c) => completedMap.set(c.class_id, parseInt(c.completed_count, 10)));
    }

    return classes.map((item) => {
      const totalLevels = countMap.get(item.id) || 0;
      const completedLevels = completedMap.get(item.id) || 0;
      const progressPercent =
        totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
      const isEnrolled = enrolledSet.has(item.id);

      return {
        ...item,
        totalLevels,
        completedLevels,
        progressPercent,
        isEnrolled,
      };
    });
  }

  /**
   * Get class by ID with all challenges and dynamic user lock/progress status
   */
  static async getClassById(
    id: string,
    userId?: string
  ): Promise<ClassWithChallenges | null> {
    const classRows = await query<ClassEntity>(
      "SELECT * FROM classes WHERE id = $1 LIMIT 1",
      [id]
    );
    if (!classRows.length) return null;

    const courseClass = classRows[0];

    // Ambil semua tantangan / level dalam kelas ini
    const challenges = await query<ChallengeEntity>(
      "SELECT * FROM challenges WHERE class_id = $1 ORDER BY order_index ASC",
      [id]
    );

    let isEnrolled = false;
    const progressMap = new Map<string, { status: string; codeSnapshot: string | null }>();

    if (userId) {
      const enrollmentRows = await query<{ id: string }>(
        "SELECT id FROM user_enrollments WHERE user_id = $1 AND class_id = $2 AND status != 'DROPPED' LIMIT 1",
        [userId, id]
      );
      isEnrolled = enrollmentRows.length > 0;

      if (challenges.length > 0) {
        const challengeIds = challenges.map((c) => c.id);
        const progressRows = await query<UserProgressEntity>(
          `SELECT * FROM user_progress 
           WHERE user_id = $1 AND challenge_id = ANY($2::text[])`,
          [userId, challengeIds]
        );
        progressRows.forEach((p) => {
          progressMap.set(p.challenge_id, {
            status: p.status,
            codeSnapshot: p.code_snapshot,
          });
        });
      }
    }

    let completedLevels = 0;

    const challengesWithProgress: ChallengeWithUserProgress[] = challenges.map((ch, idx) => {
      let userStatus: "LOCKED" | "IN_PROGRESS" | "COMPLETED" = "LOCKED";
      let codeSnapshot: string | null = null;

      if (isEnrolled) {
        const prog = progressMap.get(ch.id);
        if (prog) {
          userStatus = prog.status as "LOCKED" | "IN_PROGRESS" | "COMPLETED";
          codeSnapshot = prog.codeSnapshot;
        } else if (idx === 0) {
          // Level 1 selalu otomatis terbuka untuk user terdaftar jika belum ada progress
          userStatus = "IN_PROGRESS";
        }
      }

      if (userStatus === "COMPLETED") {
        completedLevels++;
      }

      return {
        ...ch,
        userStatus,
        codeSnapshot,
      };
    });

    const totalLevels = challenges.length;
    const progressPercent =
      totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

    return {
      ...courseClass,
      challenges: challengesWithProgress,
      totalLevels,
      completedLevels,
      progressPercent,
      isEnrolled,
    };
  }

  /**
   * Enroll a user into a class and automatically unlock Level 1
   */
  static async enrollUser(userId: string, classId: string): Promise<boolean> {
    // 1. Pastikan kelas ada
    const classRows = await query<ClassEntity>(
      "SELECT * FROM classes WHERE id = $1 LIMIT 1",
      [classId]
    );
    if (!classRows.length) {
      throw new Error("Kelas tidak ditemukan.");
    }

    // 2. Insert enrollment (idempotent)
    await query(
      `INSERT INTO user_enrollments (user_id, class_id, status)
       VALUES ($1, $2, 'ACTIVE')
       ON CONFLICT (user_id, class_id) DO UPDATE SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP`,
      [userId, classId]
    );

    // 3. Ambil tantangan Level 1
    const challenges = await query<ChallengeEntity>(
      "SELECT id FROM challenges WHERE class_id = $1 ORDER BY order_index ASC LIMIT 1",
      [classId]
    );

    if (challenges.length > 0) {
      const level1Id = challenges[0].id;
      // Unlock Level 1 jika belum pernah dibuat
      await query(
        `INSERT INTO user_progress (user_id, challenge_id, status)
         VALUES ($1, $2, 'IN_PROGRESS')
         ON CONFLICT (user_id, challenge_id) DO NOTHING`,
        [userId, level1Id]
      );
    }

    return true;
  }

  /**
   * Get ONLY enrolled classes for Dashboard "Kelas Saya"
   */
  static async getUserEnrolledClasses(userId: string): Promise<EnrolledClassSummary[]> {
    const rows = await query<{
      id: string;
      title: string;
      tagline: string | null;
      category: string;
      difficulty_level: string;
      xp_reward: number;
      enrolled_at: string;
      total_levels: string;
      completed_levels: string;
      active_challenge_id: string | null;
    }>(
      `SELECT 
         c.id, c.title, c.tagline, c.category, c.difficulty_level, c.xp_reward,
         ue.enrolled_at,
         (SELECT count(*)::text FROM challenges ch WHERE ch.class_id = c.id) as total_levels,
         (SELECT count(*)::text 
          FROM user_progress up 
          JOIN challenges ch ON up.challenge_id = ch.id 
          WHERE up.user_id = ue.user_id AND ch.class_id = c.id AND up.status = 'COMPLETED') as completed_levels,
         (SELECT ch.id 
          FROM challenges ch
          LEFT JOIN user_progress up ON up.challenge_id = ch.id AND up.user_id = ue.user_id
          WHERE ch.class_id = c.id AND (up.status IS NULL OR up.status != 'COMPLETED')
          ORDER BY ch.order_index ASC LIMIT 1) as active_challenge_id
       FROM user_enrollments ue
       JOIN classes c ON ue.class_id = c.id
       WHERE ue.user_id = $1 AND ue.status = 'ACTIVE'
       ORDER BY ue.enrolled_at DESC`,
      [userId]
    );

    return rows.map((r) => {
      const totalLevels = parseInt(r.total_levels, 10) || 0;
      const completedLevels = parseInt(r.completed_levels, 10) || 0;
      const progressPercent =
        totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

      return {
        id: r.id,
        title: r.title,
        tagline: r.tagline,
        category: r.category as any,
        difficulty_level: r.difficulty_level,
        xp_reward: r.xp_reward,
        totalLevels,
        completedLevels,
        progressPercent,
        nextChallengeId: r.active_challenge_id || `${r.id}-1-activation`,
        enrolled_at: r.enrolled_at,
      };
    });
  }
}
