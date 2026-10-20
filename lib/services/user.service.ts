import { query } from "@/lib/db/pool";
import { UserEntity, XpTransactionEntity } from "@/lib/db/entities";
import { hashPassword } from "@/lib/auth/password";
import { calculateGamificationStats, GamificationStats } from "@/lib/gamification";

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  avatar_url?: string;
  age_group?: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
  age_group?: string;
}

export class UserService {
  /**
   * Find user by unique email address
   */
  static async findByEmail(email: string): Promise<UserEntity | null> {
    const rows = await query<UserEntity>(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [email.trim()]
    );
    return rows[0] || null;
  }

  /**
   * Find user by unique username (handles optional '@' prefix)
   */
  static async findByUsername(username: string): Promise<UserEntity | null> {
    const cleanUsername = username.trim().replace(/^@+/, "");
    const rows = await query<UserEntity>(
      "SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1",
      [cleanUsername]
    );
    return rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<UserEntity | null> {
    const rows = await query<UserEntity>(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Find user by email OR username (used for unified login input)
   */
  static async findByIdentifier(identifier: string): Promise<UserEntity | null> {
    const clean = identifier.trim().replace(/^@+/, "");
    const rows = await query<UserEntity>(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2) LIMIT 1",
      [clean, clean]
    );
    return rows[0] || null;
  }

  /**
   * Register a new user with hashed password, initial 50 XP bonus, level calculation, and streak = 1
   */
  static async createUser(input: CreateUserInput): Promise<UserEntity> {
    const cleanUsername = input.username.trim().replace(/^@+/, "");
    const cleanEmail = input.email.trim().toLowerCase();
    const hashedPassword = await hashPassword(input.password);
    const fullName = input.full_name?.trim() || cleanUsername;
    const avatarUrl =
      input.avatar_url ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`;
    const ageGroup = input.age_group?.trim() || null;

    const initialXp = 50;
    const initialStats = calculateGamificationStats(initialXp);

    const rows = await query<UserEntity>(
      `INSERT INTO users (username, email, password_hash, full_name, avatar_url, xp_points, level, streak_days, last_active_date, role, age_group)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 1, CURRENT_DATE, 'USER', $8)
       RETURNING *`,
      [cleanUsername, cleanEmail, hashedPassword, fullName, avatarUrl, initialXp, initialStats.level, ageGroup]
    );

    const newUser = rows[0];
    if (newUser) {
      try {
        await query(
          `INSERT INTO xp_transactions (user_id, amount, source, reference_id, description)
           VALUES ($1, $2, 'REGISTER_BONUS', 'welcome', 'Bonus selamat datang registrasi akun baru')`,
          [newUser.id, initialXp]
        );
      } catch (txErr) {
        console.warn("[UserService.createUser] xp_transactions warning:", txErr);
      }
    }

    return newUser;
  }

  /**
   * Update full_name, avatar_url, and age_group
   */
  static async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserEntity | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (input.full_name !== undefined) {
      fields.push(`full_name = $${idx++}`);
      values.push(input.full_name.trim());
    }

    if (input.avatar_url !== undefined) {
      fields.push(`avatar_url = $${idx++}`);
      values.push(input.avatar_url.trim());
    }

    if (input.age_group !== undefined) {
      fields.push(`age_group = $${idx++}`);
      values.push(input.age_group ? input.age_group.trim() : null);
    }

    if (fields.length === 0) {
      return this.findById(userId);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const rows = await query<UserEntity>(
      `UPDATE users 
       SET ${fields.join(", ")} 
       WHERE id = $${idx} 
       RETURNING *`,
      values
    );

    return rows[0] || null;
  }

  /**
   * Update streak days based on current date
   */
  static async recordActivity(userId: string): Promise<{ streak_days: number }> {
    const user = await this.findById(userId);
    if (!user) return { streak_days: 1 };

    const lastActive = new Date(user.last_active_date);
    const today = new Date();

    // Normalisasi ke tanggal (YYYY-MM-DD)
    const lastDateStr = lastActive.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];

    if (lastDateStr === todayStr) {
      // Sudah aktif hari ini
      return { streak_days: user.streak_days };
    }

    // Hitung selisih hari
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = user.streak_days;
    if (diffDays === 1) {
      // Berurutan kemarin -> tambah streak
      newStreak += 1;
    } else {
      // Bolong > 1 hari -> reset ke 1
      newStreak = 1;
    }

    const rows = await query<UserEntity>(
      `UPDATE users 
       SET streak_days = $1, last_active_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING streak_days`,
      [newStreak, userId]
    );

    return { streak_days: rows[0]?.streak_days ?? newStreak };
  }

  /**
   * Update user XP points, compute new level, and record ledger transaction
   */
  static async addXp(
    userId: string,
    pointsToAdd: number,
    source: string = "CHALLENGE_COMPLETE",
    referenceId?: string,
    description?: string
  ): Promise<{
    xp_points: number;
    level: number;
    earnedXp: number;
    leveledUp: boolean;
    stats: GamificationStats;
  }> {
    const user = await this.findById(userId);
    const prevXp = user?.xp_points ?? 0;
    const oldLevel = user?.level ?? 1;
    const newXp = Math.max(0, prevXp + pointsToAdd);
    const stats = calculateGamificationStats(newXp);
    const leveledUp = stats.level > oldLevel;

    const rows = await query<{ xp_points: number; level: number }>(
      `UPDATE users 
       SET xp_points = $1, level = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING xp_points, level`,
      [newXp, stats.level, userId]
    );

    // Record transaction audit trail
    if (pointsToAdd !== 0) {
      try {
        await query(
          `INSERT INTO xp_transactions (user_id, amount, source, reference_id, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, pointsToAdd, source, referenceId || null, description || `Perolehan EXP dari ${source}`]
        );
      } catch (txErr) {
        console.warn("[UserService.addXp] xp_transactions warning:", txErr);
      }
    }

    return {
      xp_points: rows[0]?.xp_points ?? newXp,
      level: rows[0]?.level ?? stats.level,
      earnedXp: pointsToAdd,
      leveledUp,
      stats,
    };
  }

  /**
   * Get XP Transaction History for a user
   */
  static async getXpHistory(userId: string, limit: number = 10): Promise<XpTransactionEntity[]> {
    return query<XpTransactionEntity>(
      `SELECT * FROM xp_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
  }

  /**
   * Get Leaderboard rankings based on XP points
   */
  static async getLeaderboard(limit: number = 10): Promise<Array<{
    rank: number;
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    xp_points: number;
    level: number;
    rank_title: string;
    rank_badge: string;
    streak_days: number;
    completed_challenges_count: number;
  }>> {
    const rows = await query<{
      id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      xp_points: number;
      level: number;
      streak_days: number;
      completed_challenges_count: string;
    }>(
      `SELECT 
         u.id,
         u.username,
         u.full_name,
         u.avatar_url,
         u.xp_points,
         u.level,
         u.streak_days,
         COUNT(up.id) FILTER (WHERE up.status = 'COMPLETED')::text AS completed_challenges_count
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id
       WHERE u.role = 'USER'
       GROUP BY u.id
       ORDER BY u.xp_points DESC, u.created_at ASC
       LIMIT $1`,
      [limit]
    );

    return rows.map((row, index) => {
      const stats = calculateGamificationStats(row.xp_points);
      return {
        rank: index + 1,
        id: row.id,
        username: row.username,
        full_name: row.full_name || row.username,
        avatar_url: row.avatar_url,
        xp_points: row.xp_points,
        level: stats.level,
        rank_title: stats.rank_title,
        rank_badge: stats.rank_badge,
        streak_days: row.streak_days,
        completed_challenges_count: parseInt(row.completed_challenges_count || "0", 10),
      };
    });
  }

  /**
   * Get specific user's leaderboard rank
   */
  static async getUserRank(userId: string): Promise<number> {
    const rows = await query<{ rank: string }>(
      `WITH ranked_users AS (
         SELECT id, ROW_NUMBER() OVER (ORDER BY xp_points DESC, created_at ASC) as rank
         FROM users
         WHERE role = 'USER'
       )
       SELECT rank FROM ranked_users WHERE id = $1`,
      [userId]
    );
    return parseInt(rows[0]?.rank || "0", 10);
  }

  /**
   * Update last seen timestamp when active
   */
  static async touchLastSeen(userId: string): Promise<void> {
    try {
      await query(
        `UPDATE users 
         SET last_seen_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [userId]
      );
    } catch (err) {
      console.error("[UserService.touchLastSeen Error]:", err);
    }
  }

  /**
   * Get administrative stats (online, active today, total users, classes, completions)
   */
  static async getAdminUserStats(): Promise<{
    totalUsers: number;
    onlineUsers: number;
    activeUsersToday: number;
    adminCount: number;
    totalClasses: number;
    liveCodeClasses: number;
    totalChallenges: number;
    totalEnrollments: number;
    totalCompletions: number;
  }> {
    const [uStats] = await query<{
      total_users: string;
      online_users: string;
      active_today: string;
      admin_count: string;
    }>(
      `SELECT
         count(*)::text as total_users,
         count(*) FILTER (WHERE last_seen_at >= NOW() - INTERVAL '15 minutes')::text as online_users,
         count(*) FILTER (WHERE last_active_date = CURRENT_DATE OR last_seen_at >= CURRENT_DATE)::text as active_today,
         count(*) FILTER (WHERE role = 'ADMIN')::text as admin_count
       FROM users`
    );

    const [cStats] = await query<{
      total_classes: string;
      live_code_classes: string;
    }>(
      `SELECT
         count(*)::text as total_classes,
         count(*) FILTER (WHERE category = 'LIVE_CODE')::text as live_code_classes
       FROM classes`
    );

    const [chStats] = await query<{ total_challenges: string }>(
      `SELECT count(*)::text as total_challenges FROM challenges`
    );

    const [eStats] = await query<{ total_enrollments: string }>(
      `SELECT count(*)::text as total_enrollments FROM user_enrollments WHERE status != 'DROPPED'`
    );

    const [pStats] = await query<{ total_completions: string }>(
      `SELECT count(*)::text as total_completions FROM user_progress WHERE status = 'COMPLETED'`
    );

    return {
      totalUsers: parseInt(uStats?.total_users || '0', 10),
      onlineUsers: parseInt(uStats?.online_users || '0', 10),
      activeUsersToday: parseInt(uStats?.active_today || '0', 10),
      adminCount: parseInt(uStats?.admin_count || '0', 10),
      totalClasses: parseInt(cStats?.total_classes || '0', 10),
      liveCodeClasses: parseInt(cStats?.live_code_classes || '0', 10),
      totalChallenges: parseInt(chStats?.total_challenges || '0', 10),
      totalEnrollments: parseInt(eStats?.total_enrollments || '0', 10),
      totalCompletions: parseInt(pStats?.total_completions || '0', 10),
    };
  }

  /**
   * Search and paginate users list for admin dashboard
   */
  static async getUsersList(options: {
    search?: string;
    role?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: UserEntity[]; total: number }> {
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (options.search && options.search.trim()) {
      const s = `%${options.search.trim().toLowerCase()}%`;
      conditions.push(
        `(LOWER(username) LIKE $${idx} OR LOWER(email) LIKE $${idx} OR LOWER(full_name) LIKE $${idx})`
      );
      values.push(s);
      idx++;
    }

    if (options.role && (options.role === "USER" || options.role === "ADMIN")) {
      conditions.push(`role = $${idx}`);
      values.push(options.role);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRow] = await query<{ count: string }>(
      `SELECT count(*)::text as count FROM users ${whereClause}`,
      values
    );

    values.push(limit);
    values.push(offset);

    const users = await query<UserEntity>(
      `SELECT id, username, email, full_name, avatar_url, xp_points, level, streak_days, last_active_date, last_seen_at, role, created_at, updated_at
       FROM users
       ${whereClause}
       ORDER BY last_seen_at DESC NULLS LAST, created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      values
    );

    return {
      users,
      total: parseInt(countRow?.count || "0", 10),
    };
  }

  /**
   * Admin: Update user's role
   */
  static async updateUserRole(userId: string, role: "USER" | "ADMIN"): Promise<UserEntity | null> {
    const rows = await query<UserEntity>(
      `UPDATE users
       SET role = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [role, userId]
    );
    return rows[0] || null;
  }

  /**
   * Admin: Edit user fields
   */
  static async updateUserAdmin(
    userId: string,
    data: {
      username?: string;
      email?: string;
      full_name?: string;
      xp_points?: number;
      streak_days?: number;
      role?: "USER" | "ADMIN";
    }
  ): Promise<UserEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.username !== undefined) {
      fields.push(`username = $${idx++}`);
      values.push(data.username.trim().replace(/^@+/, ""));
    }
    if (data.email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(data.email.trim().toLowerCase());
    }
    if (data.full_name !== undefined) {
      fields.push(`full_name = $${idx++}`);
      values.push(data.full_name.trim());
    }
    if (data.xp_points !== undefined) {
      const newXp = Math.max(0, data.xp_points);
      const stats = calculateGamificationStats(newXp);
      fields.push(`xp_points = $${idx++}`);
      values.push(newXp);
      fields.push(`level = $${idx++}`);
      values.push(stats.level);
    }
    if (data.streak_days !== undefined) {
      fields.push(`streak_days = $${idx++}`);
      values.push(Math.max(0, data.streak_days));
    }
    if (data.role !== undefined) {
      fields.push(`role = $${idx++}`);
      values.push(data.role);
    }

    if (fields.length === 0) return this.findById(userId);

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(userId);

    const rows = await query<UserEntity>(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE id = $${idx}
       RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  /**
   * Admin: Delete user (safeguarded against self-deletion)
   */
  static async deleteUser(userId: string, currentAdminId: string): Promise<boolean> {
    if (userId === currentAdminId) {
      throw new Error("Anda tidak diperbolehkan menghapus akun admin yang sedang Anda gunakan.");
    }

    const rows = await query<{ id: string }>(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [userId]
    );
    return rows.length > 0;
  }
}
