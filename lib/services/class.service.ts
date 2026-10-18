import { query } from "@/lib/db/pool";
import {
  ClassEntity,
  ClassWithChallenges,
  ChallengeEntity,
  ChallengeWithUserProgress,
  UserProgressEntity,
  EnrolledClassSummary,
} from "@/lib/db/entities";
import { CLASSES_LIST, CLASSES_MAP } from "@/lib/classes-data";

export class ClassService {
  /**
   * Get all classes, dynamically enriched with user enrollment and progress percentage if logged in.
   * Gracefully falls back to CLASSES_LIST if DB is unavailable or empty.
   */
  static async getAllClasses(userId?: string): Promise<Array<ClassEntity & {
    totalLevels: number;
    completedLevels: number;
    progressPercent: number;
    isEnrolled: boolean;
  }>> {
    const buildFallback = () =>
      CLASSES_LIST.map((c, idx) => ({
        id: c.id,
        category: c.category,
        title: c.title,
        tagline: c.tagline ?? null,
        description: c.about ?? null,
        difficulty_level: c.level,
        xp_reward: c.xpReward,
        estimated_time: c.estimatedHours,
        is_published: c.status === "available",
        order_index: idx + 1,
        created_at: new Date(),
        updated_at: new Date(),
        totalLevels: c.modulesCount || (c.modules ? c.modules.length : 0),
        completedLevels: 0,
        progressPercent: 0,
        isEnrolled: false,
      }));

    try {
      // 1. Ambil semua kelas diurutkan berdasarkan order_index
      const classes = await query<ClassEntity>(
        "SELECT * FROM classes ORDER BY order_index ASC, created_at ASC"
      );

      if (!classes || classes.length === 0) {
        return buildFallback();
      }

      // 2. Ambil total tantangan per kelas
      let countMap = new Map<string, number>();
      try {
        const counts = await query<{ class_id: string; total: string }>(
          "SELECT class_id, count(*)::text as total FROM challenges GROUP BY class_id"
        );
        counts.forEach((c) => countMap.set(c.class_id, parseInt(c.total, 10)));
      } catch {
        // Abaikan jika tabel challenges belum ada
      }

      // 3. Jika user login, ambil data enrollments & progress
      const enrolledSet = new Set<string>();
      const completedMap = new Map<string, number>();

      if (userId) {
        try {
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
        } catch {
          // Abaikan jika tabel enrollments belum ada
        }
      }

      return classes.map((item) => {
        const staticItem = CLASSES_MAP[item.id];
        const staticLevels = staticItem?.modulesCount || (staticItem?.modules ? staticItem.modules.length : 0);
        const totalLevels = countMap.get(item.id) || staticLevels || 0;
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
    } catch (err) {
      console.warn("[ClassService.getAllClasses] DB query error, falling back to static classes:", err);
      return buildFallback();
    }
  }

  /**
   * Get class by ID with all challenges and dynamic user lock/progress status
   */
  static async getClassById(
    id: string,
    userId?: string
  ): Promise<ClassWithChallenges | null> {
    const buildStaticFallback = (): ClassWithChallenges | null => {
      const staticClass = CLASSES_MAP[id];
      if (!staticClass) return null;

      const fallbackChallenges: ChallengeWithUserProgress[] = (staticClass.modules || []).map(
        (m, idx) => ({
          id: m.id,
          class_id: staticClass.id,
          title: m.title,
          difficulty: "EASY" as const,
          order_index: m.number,
          xp_reward: m.xp,
          instruction: m.description,
          hint: null,
          theory: null,
          syntax_helpers: [],
          locked_template: {},
          target_visual: {},
          initial_state: "",
          validation_rules: {},
          created_at: new Date(),
          updated_at: new Date(),
          userStatus: idx === 0 ? "IN_PROGRESS" : "LOCKED",
          codeSnapshot: null,
        })
      );

      return {
        id: staticClass.id,
        category: staticClass.category,
        title: staticClass.title,
        tagline: staticClass.tagline,
        description: staticClass.about,
        difficulty_level: staticClass.level,
        xp_reward: staticClass.xpReward,
        estimated_time: staticClass.estimatedHours,
        is_published: staticClass.status === "available",
        order_index: 1,
        created_at: new Date(),
        updated_at: new Date(),
        challenges: fallbackChallenges,
        totalLevels: staticClass.modulesCount || fallbackChallenges.length,
        completedLevels: 0,
        progressPercent: 0,
        isEnrolled: false,
      };
    };

    try {
      const classRows = await query<ClassEntity>(
        "SELECT * FROM classes WHERE id = $1 LIMIT 1",
        [id]
      );
      if (!classRows.length) {
        return buildStaticFallback();
      }

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
    } catch (err) {
      console.warn(`[ClassService.getClassById] Error fetching class ${id}, using static fallback:`, err);
      return buildStaticFallback();
    }
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

  /**
   * Admin: Get all classes with stats (filter by category, e.g., 'LIVE_CODE')
   */
  static async getAdminClasses(category?: string): Promise<Array<ClassEntity & {
    totalChallenges: number;
    totalEnrollments: number;
    totalCompletions: number;
  }>> {
    let whereClause = "";
    const values: any[] = [];
    if (category) {
      whereClause = "WHERE c.category = $1";
      values.push(category);
    }

    const rows = await query<any>(
      `SELECT
         c.*,
         (SELECT count(*)::text FROM challenges ch WHERE ch.class_id = c.id) as total_challenges,
         (SELECT count(*)::text FROM user_enrollments ue WHERE ue.class_id = c.id AND ue.status != 'DROPPED') as total_enrollments,
         (SELECT count(*)::text FROM user_progress up JOIN challenges ch ON up.challenge_id = ch.id WHERE ch.class_id = c.id AND up.status = 'COMPLETED') as total_completions
       FROM classes c
       ${whereClause}
       ORDER BY c.order_index ASC, c.created_at ASC`,
      values
    );

    return rows.map((r) => ({
      ...r,
      totalChallenges: parseInt(r.total_challenges || "0", 10),
      totalEnrollments: parseInt(r.total_enrollments || "0", 10),
      totalCompletions: parseInt(r.total_completions || "0", 10),
    }));
  }

  /**
   * Admin: Create a new class
   */
  static async createClass(data: {
    id: string;
    category: "LIVE_CODE" | "DRAG_DROP" | "QUIZ";
    title: string;
    tagline?: string;
    description?: string;
    difficulty_level?: string;
    xp_reward?: number;
    estimated_time?: string;
    is_published?: boolean;
    order_index?: number;
  }): Promise<ClassEntity> {
    const cleanId = data.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    const rows = await query<ClassEntity>(
      `INSERT INTO classes (
         id, category, title, tagline, description, difficulty_level,
         xp_reward, estimated_time, is_published, order_index
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        cleanId,
        data.category || "LIVE_CODE",
        data.title.trim(),
        data.tagline?.trim() || null,
        data.description?.trim() || null,
        data.difficulty_level || "Pemula",
        data.xp_reward ?? 150,
        data.estimated_time || "2 Jam",
        data.is_published ?? true,
        data.order_index ?? 1,
      ]
    );

    return rows[0];
  }

  /**
   * Admin: Update class details
   */
  static async updateClass(
    id: string,
    data: {
      category?: "LIVE_CODE" | "DRAG_DROP" | "QUIZ";
      title?: string;
      tagline?: string;
      description?: string;
      difficulty_level?: string;
      xp_reward?: number;
      estimated_time?: string;
      is_published?: boolean;
      order_index?: number;
    }
  ): Promise<ClassEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.category !== undefined) {
      fields.push(`category = $${idx++}`);
      values.push(data.category);
    }
    if (data.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(data.title.trim());
    }
    if (data.tagline !== undefined) {
      fields.push(`tagline = $${idx++}`);
      values.push(data.tagline.trim());
    }
    if (data.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(data.description.trim());
    }
    if (data.difficulty_level !== undefined) {
      fields.push(`difficulty_level = $${idx++}`);
      values.push(data.difficulty_level);
    }
    if (data.xp_reward !== undefined) {
      fields.push(`xp_reward = $${idx++}`);
      values.push(data.xp_reward);
    }
    if (data.estimated_time !== undefined) {
      fields.push(`estimated_time = $${idx++}`);
      values.push(data.estimated_time);
    }
    if (data.is_published !== undefined) {
      fields.push(`is_published = $${idx++}`);
      values.push(data.is_published);
    }
    if (data.order_index !== undefined) {
      fields.push(`order_index = $${idx++}`);
      values.push(data.order_index);
    }

    if (fields.length === 0) {
      const existing = await query<ClassEntity>("SELECT * FROM classes WHERE id = $1 LIMIT 1", [id]);
      return existing[0] || null;
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const rows = await query<ClassEntity>(
      `UPDATE classes
       SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING *`,
      values
    );

    return rows[0] || null;
  }

  /**
   * Admin: Delete class (cascades to challenges)
   */
  static async deleteClass(id: string): Promise<boolean> {
    const rows = await query<{ id: string }>(
      `DELETE FROM classes WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows.length > 0;
  }
}
