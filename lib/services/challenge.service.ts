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
      `SELECT * FROM challenges 
       WHERE id = $1 
          OR id LIKE $1 || '-%'
          OR id = REPLACE($1, 'basics-', 'css-basics-')
          OR id LIKE REPLACE($1, 'basics-', 'css-basics-') || '-%'
       ORDER BY CASE WHEN id = $1 THEN 1 ELSE 2 END LIMIT 1`,
      [id]
    );
    if (!rows.length) return null;

    const challenge = rows[0];
    let codeSnapshot: string | null = null;
    let userStatus = 'LOCKED';

    if (userId) {
      const progRows = await query<UserProgressEntity>(
        'SELECT * FROM user_progress WHERE user_id = $1 AND challenge_id = $2 LIMIT 1',
        [userId, challenge.id]
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

  /**
   * Admin: Create a new challenge level under a class
   */
  static async createChallenge(data: {
    id: string;
    class_id: string;
    title: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS_FIGHT';
    order_index: number;
    xp_reward?: number;
    instruction: string;
    theory?: string;
    syntax_helpers?: string[];
    hint?: string;
    locked_template?: any;
    target_visual?: any;
    initial_state?: string;
    validation_rules?: any;
  }): Promise<ChallengeEntity> {
    const cleanId = data.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const rows = await query<ChallengeEntity>(
      `INSERT INTO challenges (
         id, class_id, title, difficulty, order_index, xp_reward,
         instruction, theory, syntax_helpers, hint,
         locked_template, target_visual, initial_state, validation_rules
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        cleanId,
        data.class_id,
        data.title.trim(),
        data.difficulty || 'EASY',
        data.order_index,
        data.xp_reward ?? 20,
        data.instruction.trim(),
        data.theory?.trim() || null,
        JSON.stringify(data.syntax_helpers || []),
        data.hint?.trim() || null,
        JSON.stringify(data.locked_template || { element: 'arena', itemsCount: 3 }),
        JSON.stringify(data.target_visual || { display: 'flex' }),
        data.initial_state || '.arena {\n  display: flex;\n}',
        JSON.stringify(data.validation_rules || {}),
      ]
    );

    return rows[0];
  }

  /**
   * Admin: Update an existing challenge
   */
  static async updateChallenge(
    id: string,
    data: {
      title?: string;
      difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS_FIGHT';
      order_index?: number;
      xp_reward?: number;
      instruction?: string;
      theory?: string;
      syntax_helpers?: string[];
      hint?: string;
      locked_template?: any;
      target_visual?: any;
      initial_state?: string;
      validation_rules?: any;
    }
  ): Promise<ChallengeEntity | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(data.title.trim());
    }
    if (data.difficulty !== undefined) {
      fields.push(`difficulty = $${idx++}`);
      values.push(data.difficulty);
    }
    if (data.order_index !== undefined) {
      fields.push(`order_index = $${idx++}`);
      values.push(data.order_index);
    }
    if (data.xp_reward !== undefined) {
      fields.push(`xp_reward = $${idx++}`);
      values.push(data.xp_reward);
    }
    if (data.instruction !== undefined) {
      fields.push(`instruction = $${idx++}`);
      values.push(data.instruction.trim());
    }
    if (data.theory !== undefined) {
      fields.push(`theory = $${idx++}`);
      values.push(data.theory.trim() || null);
    }
    if (data.syntax_helpers !== undefined) {
      fields.push(`syntax_helpers = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.syntax_helpers));
    }
    if (data.hint !== undefined) {
      fields.push(`hint = $${idx++}`);
      values.push(data.hint.trim() || null);
    }
    if (data.locked_template !== undefined) {
      fields.push(`locked_template = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.locked_template));
    }
    if (data.target_visual !== undefined) {
      fields.push(`target_visual = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.target_visual));
    }
    if (data.initial_state !== undefined) {
      fields.push(`initial_state = $${idx++}`);
      values.push(data.initial_state);
    }
    if (data.validation_rules !== undefined) {
      fields.push(`validation_rules = $${idx++}::jsonb`);
      values.push(JSON.stringify(data.validation_rules));
    }

    if (fields.length === 0) {
      const existing = await query<ChallengeEntity>('SELECT * FROM challenges WHERE id = $1 LIMIT 1', [id]);
      return existing[0] || null;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const rows = await query<ChallengeEntity>(
      `UPDATE challenges
       SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING *`,
      values
    );

    return rows[0] || null;
  }

  /**
   * Admin: Delete challenge
   */
  static async deleteChallenge(id: string): Promise<boolean> {
    const rows = await query<{ id: string }>(
      `DELETE FROM challenges WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows.length > 0;
  }
}
