/**
 * Codevas Database Entities & Types
 * Defined strictly according to project_plan.md ERD
 */

export type UserRole = 'USER' | 'ADMIN';
export type ClassCategory = 'LIVE_CODE' | 'DRAG_DROP' | 'QUIZ';
export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS_FIGHT';
export type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * Entity: users
 * Table mapping for user authentication, profiles, and XP points
 */
export interface UserEntity {
  id: string; // UUID
  username: string;
  email: string;
  password_hash: string;
  xp_points: number;
  role: UserRole;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Entity: classes
 * Table mapping for course curriculum (CSS Flexbox, CSS Grid, etc.)
 */
export interface ClassEntity {
  id: string; // e.g. 'css-flexbox', 'css-grid'
  category: ClassCategory;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Entity: challenges
 * Table mapping for interactive levels inside a class
 */
export interface ChallengeEntity {
  id: string; // e.g. 'flexbox-1-activation'
  class_id: string; // Foreign key -> classes.id
  title: string;
  difficulty: ChallengeDifficulty;
  order_index: number;
  instruction: string;
  locked_template: Record<string, unknown> | string; // JSONB
  initial_state: string;
  validation_rule: Record<string, unknown> | string; // JSONB
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Entity: user_progress
 * Table mapping for tracking completion and code snapshots
 */
export interface UserProgressEntity {
  id: string; // UUID
  user_id: string; // Foreign key -> users.id
  challenge_id: string; // Foreign key -> challenges.id
  status: ProgressStatus;
  code_snapshot: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Extended Class model with challenge relations
 */
export interface ClassWithChallenges extends ClassEntity {
  challenges: ChallengeEntity[];
  completedCount?: number;
}
