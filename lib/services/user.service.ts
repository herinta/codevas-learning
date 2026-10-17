import { query } from "@/lib/db/pool";
import { UserEntity } from "@/lib/db/entities";
import { hashPassword } from "@/lib/auth/password";

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  avatar_url?: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
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
   * Register a new user with hashed password, initial 50 XP bonus, and streak = 1
   */
  static async createUser(input: CreateUserInput): Promise<UserEntity> {
    const cleanUsername = input.username.trim().replace(/^@+/, "");
    const cleanEmail = input.email.trim().toLowerCase();
    const hashedPassword = await hashPassword(input.password);
    const fullName = input.full_name?.trim() || cleanUsername;
    const avatarUrl =
      input.avatar_url ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`;

    const rows = await query<UserEntity>(
      `INSERT INTO users (username, email, password_hash, full_name, avatar_url, xp_points, streak_days, last_active_date, role)
       VALUES ($1, $2, $3, $4, $5, 50, 1, CURRENT_DATE, 'USER')
       RETURNING *`,
      [cleanUsername, cleanEmail, hashedPassword, fullName, avatarUrl]
    );

    return rows[0];
  }

  /**
   * Update full_name and avatar_url
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
   * Update user XP points
   */
  static async addXp(userId: string, pointsToAdd: number): Promise<number> {
    const rows = await query<{ xp_points: number }>(
      `UPDATE users 
       SET xp_points = xp_points + $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING xp_points`,
      [pointsToAdd, userId]
    );
    return rows[0]?.xp_points ?? 0;
  }
}
