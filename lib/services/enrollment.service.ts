import { query } from '@/lib/db/pool';
import { UserEnrollmentEntity, ClassEntity } from '@/lib/db/entities';

export interface EnrolledClassWithDetails extends ClassEntity {
  enrolled_at: Date | string;
  enrollment_status: string;
}

export class EnrollmentService {
  /**
   * Get all enrolled classes for a given user
   */
  static async getUserEnrolledClasses(userId: string): Promise<EnrolledClassWithDetails[]> {
    return query<EnrolledClassWithDetails>(
      `SELECT c.*, e.enrolled_at, e.status as enrollment_status
       FROM user_enrollments e
       JOIN classes c ON c.id = e.class_id
       WHERE e.user_id = $1 AND e.status = 'ACTIVE'
       ORDER BY e.enrolled_at DESC;`,
      [userId]
    );
  }

  /**
   * Get raw enrollment records for a user
   */
  static async getUserEnrollments(userId: string): Promise<UserEnrollmentEntity[]> {
    return query<UserEnrollmentEntity>(
      'SELECT * FROM user_enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC;',
      [userId]
    );
  }

  /**
   * Check if user is enrolled in a specific class
   */
  static async isUserEnrolled(userId: string, classId: string): Promise<boolean> {
    const rows = await query<{ count: string }>(
      'SELECT count(*) as count FROM user_enrollments WHERE user_id = $1 AND class_id = $2 AND status = \'ACTIVE\';',
      [userId, classId]
    );
    return Number(rows[0]?.count || 0) > 0;
  }

  /**
   * Enroll a user in a class
   */
  static async enrollUser(userId: string, classId: string): Promise<UserEnrollmentEntity> {
    const rows = await query<UserEnrollmentEntity>(
      `INSERT INTO user_enrollments (user_id, class_id, status, enrolled_at, updated_at)
       VALUES ($1, $2, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, class_id) DO UPDATE SET
         status = 'ACTIVE',
         updated_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [userId, classId]
    );
    return rows[0];
  }
}
