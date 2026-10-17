import { query } from '@/lib/db/pool';
import { ClassEntity, ClassWithChallenges, ChallengeEntity, ClassCategory } from '@/lib/db/entities';

export class ClassService {
  /**
   * Get all published classes, optionally filtered by category
   */
  static async getAllClasses(category?: ClassCategory): Promise<ClassEntity[]> {
    if (category) {
      return query<ClassEntity>(
        'SELECT * FROM classes WHERE category = $1 ORDER BY created_at ASC',
        [category]
      );
    }
    return query<ClassEntity>(
      'SELECT * FROM classes ORDER BY category ASC, created_at ASC'
    );
  }

  /**
   * Get class by ID
   */
  static async getClassById(id: string): Promise<ClassEntity | null> {
    const rows = await query<ClassEntity>(
      'SELECT * FROM classes WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Get class with all its challenges ordered by order_index
   */
  static async getClassWithChallenges(id: string): Promise<ClassWithChallenges | null> {
    const classRows = await query<ClassEntity>(
      'SELECT * FROM classes WHERE id = $1 LIMIT 1',
      [id]
    );
    if (!classRows.length) return null;

    const courseClass = classRows[0];
    const challenges = await query<ChallengeEntity>(
      'SELECT * FROM challenges WHERE class_id = $1 ORDER BY order_index ASC',
      [id]
    );

    return {
      ...courseClass,
      challenges,
    };
  }
}
