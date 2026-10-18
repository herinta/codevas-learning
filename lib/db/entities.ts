/**
 * Codevas Database Entities & Types
 * Synchronized with PostgreSQL 16 schema
 */

export type UserRole = 'USER' | 'ADMIN';
export type ClassCategory = 'LIVE_CODE' | 'DRAG_DROP' | 'QUIZ';
export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS_FIGHT';
export type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED';

/**
 * Entity: users
 * Table mapping for user authentication, profiles, streaks, and XP points
 */
export interface UserEntity {
  id: string; // UUID
  username: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  avatar_url: string | null;
  xp_points: number;
  level: number;
  streak_days: number;
  last_active_date: string | Date;
  last_seen_at?: Date | string;
  role: UserRole;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Entity: xp_transactions
 * Ledger record for user XP gains and audit trail
 */
export interface XpTransactionEntity {
  id: string; // UUID
  user_id: string;
  amount: number;
  source: 'REGISTER_BONUS' | 'CHALLENGE_COMPLETE' | 'DAILY_STREAK' | 'ADMIN_GRANT' | string;
  reference_id?: string | null;
  description?: string | null;
  created_at: Date | string;
}

/**
 * Entity: classes
 * Table mapping for curriculum (CSS Flexbox, CSS Grid, etc.)
 */
export interface ClassEntity {
  id: string; // e.g. 'css-flexbox', 'css-grid'
  category: ClassCategory;
  title: string;
  tagline: string | null;
  description: string | null;
  difficulty_level: string;
  xp_reward: number;
  estimated_time: string;
  is_published: boolean;
  order_index: number;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Target Visual specification for dynamic Level 1 visualization
 */
export interface TargetVisualSpec {
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  description?: string;
  items?: Array<{ id: number; label: string }>;
}

export interface ValidationRuleSpec {
  goals?: Array<{
    property: string;
    accepted: string[];
  }>;
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
  xp_reward: number;
  instruction: string;
  hint: string | null;
  theory?: string | null;
  syntax_helpers?: string[];
  locked_template: Record<string, unknown> | string; // JSONB
  target_visual: TargetVisualSpec | string; // JSONB
  initial_state: string;
  validation_rules: ValidationRuleSpec | string; // JSONB
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
  completed_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Entity: user_enrollments
 * Table mapping for user class enrollments
 */
export interface UserEnrollmentEntity {
  id: string; // UUID
  user_id: string; // Foreign key -> users.id
  class_id: string; // Foreign key -> classes.id
  status: EnrollmentStatus;
  enrolled_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Challenge with user progress attached
 */
export interface ChallengeWithUserProgress extends ChallengeEntity {
  userStatus: ProgressStatus;
  codeSnapshot?: string | null;
}

/**
 * Extended Class model with challenge relations and real progress
 */
export interface ClassWithChallenges extends ClassEntity {
  challenges: ChallengeWithUserProgress[];
  totalLevels: number;
  completedLevels: number;
  progressPercent: number;
  isEnrolled: boolean;
}

/**
 * Enrolled Class Card item for Dashboard
 */
export interface EnrolledClassSummary {
  id: string;
  title: string;
  tagline: string | null;
  category: ClassCategory;
  difficulty_level: string;
  xp_reward: number;
  totalLevels: number;
  completedLevels: number;
  progressPercent: number;
  nextChallengeId: string | null;
  enrolled_at: Date | string;
}
