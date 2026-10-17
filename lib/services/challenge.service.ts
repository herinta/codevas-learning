import { query } from '@/lib/db/pool';
import { ChallengeEntity, UserProgressEntity } from '@/lib/db/entities';

export class ChallengeService {
  /**
   * Get single challenge by ID with user progress code snapshot if authenticated
   */
  static async getChallengeById(
    id: string,
    userId?: string
  ): Promise<(ChallengeEntity & { codeSnapshot?: string | null; userStatus?: string }) | null> {
    const rows = await query<ChallengeEntity>(
      'SELECT * FROM challenges WHERE id = $1 LIMIT 1',
      [id]
    );
    if (!rows.length) return null;

    const challenge = rows[0];
    let codeSnapshot: string | null = null;
    let userStatus = 'LOCKED';

    if (userId) {
      const progRows = await query<UserProgressEntity>(
        'SELECT * FROM user_progress WHERE user_id = $1 AND challenge_id = $2 LIMIT 1',
        [userId, id]
      );
      if (progRows.length) {
        codeSnapshot = progRows[0].code_snapshot;
        userStatus = progRows[0].status;
      }
    }

    return {
      ...challenge,
      codeSnapshot,
      userStatus,
    };
  }

  /**
   * Get all challenges for a specific class
   */
  static async getChallengesByClass(classId: string): Promise<ChallengeEntity[]> {
    return query<ChallengeEntity>(
      'SELECT * FROM challenges WHERE class_id = $1 ORDER BY order_index ASC',
      [classId]
    );
  }
}
