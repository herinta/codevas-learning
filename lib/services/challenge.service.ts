import { query } from '@/lib/db/pool';
import { ChallengeEntity } from '@/lib/db/entities';

export class ChallengeService {
  /**
   * Get single challenge by ID
   */
  static async getChallengeById(id: string): Promise<ChallengeEntity | null> {
    const rows = await query<ChallengeEntity>(
      'SELECT * FROM challenges WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
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
