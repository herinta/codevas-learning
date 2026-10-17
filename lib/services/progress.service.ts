import { query } from '@/lib/db/pool';
import { UserProgressEntity, ProgressStatus } from '@/lib/db/entities';

export class ProgressService {
  /**
   * Get all progress entries for a given user
   */
  static async getUserProgress(userId: string): Promise<UserProgressEntity[]> {
    return query<UserProgressEntity>(
      'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
  }

  /**
   * Save or update progress for a user and challenge
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
}
