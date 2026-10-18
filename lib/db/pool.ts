import { Pool } from 'pg';

// Global declaration for hot reload support in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __postgres_pool__: Pool | undefined;
}

interface DbConnectionConfig {
  connectionString: string;
  mode: 'LOCAL' | 'SERVER' | 'CUSTOM';
  targetInfo: string;
}

/**
 * Resolves the active database connection string based on environment configuration:
 * 1. Checks DB_MODE ('local' or 'server'/'remote').
 * 2. If DB_MODE === 'server', uses DATABASE_URL_SERVER (Synology NAS / Remote DB).
 * 3. If DB_MODE === 'local', uses DATABASE_URL_LOCAL (Local laptop DB).
 * 4. Fallbacks to standard DATABASE_URL.
 */
function resolveDatabaseConfig(): DbConnectionConfig {
  const dbMode = (process.env.DB_MODE || '').toLowerCase().trim();

  if (dbMode === 'server' || dbMode === 'prod' || dbMode === 'remote') {
    const serverUrl = process.env.DATABASE_URL_SERVER;
    if (serverUrl) {
      return {
        connectionString: serverUrl,
        mode: 'SERVER',
        targetInfo: 'Synology NAS / Remote Database',
      };
    }
  }

  if (dbMode === 'local' || dbMode === 'dev') {
    const localUrl = process.env.DATABASE_URL_LOCAL;
    if (localUrl) {
      return {
        connectionString: localUrl,
        mode: 'LOCAL',
        targetInfo: 'Local Machine Database',
      };
    }
  }

  const explicitUrl = process.env.DATABASE_URL;
  if (explicitUrl) {
    const isDocker = explicitUrl.includes('codevas-db');
    return {
      connectionString: explicitUrl,
      mode: isDocker ? 'SERVER' : 'CUSTOM',
      targetInfo: isDocker ? 'Docker Container (codevas-db)' : 'Custom DATABASE_URL',
    };
  }

  return {
    connectionString: 'postgresql://postgres:root@localhost:5432/codevas_db',
    mode: 'LOCAL',
    targetInfo: 'Default Fallback (localhost:5432/codevas_db)',
  };
}

const dbConfig = resolveDatabaseConfig();
const maskedUrl = dbConfig.connectionString.replace(/:[^:@]*@/, ':****@');

if (!global.__postgres_pool__) {
  console.log(
    `[Database] 🚀 Active Mode: ${dbConfig.mode} (${dbConfig.targetInfo}) -> ${maskedUrl}`
  );
}

export const pool: Pool =
  global.__postgres_pool__ ||
  new Pool({
    connectionString: dbConfig.connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__postgres_pool__ = pool;
}

let schemaInitialized = false;

async function ensureSchema() {
  if (schemaInitialized) return;
  schemaInitialized = true;
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- 1. Table: users
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        avatar_url TEXT,
        xp_points INT NOT NULL DEFAULT 50 CHECK (xp_points >= 0),
        level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
        streak_days INT NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
        last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
        role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
        last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
            ALTER TABLE users ADD COLUMN full_name VARCHAR(100);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
            ALTER TABLE users ADD COLUMN avatar_url TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='level') THEN
            ALTER TABLE users ADD COLUMN level INT NOT NULL DEFAULT 1 CHECK (level >= 1);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='streak_days') THEN
            ALTER TABLE users ADD COLUMN streak_days INT NOT NULL DEFAULT 1;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_date') THEN
            ALTER TABLE users ADD COLUMN last_active_date DATE NOT NULL DEFAULT CURRENT_DATE;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
            ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN'));
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_seen_at') THEN
            ALTER TABLE users ADD COLUMN last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
          END IF;
        END IF;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

      -- 2. Table: classes
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(30) NOT NULL CHECK (category IN ('LIVE_CODE', 'DRAG_DROP', 'QUIZ')),
        title VARCHAR(100) NOT NULL,
        tagline TEXT,
        description TEXT,
        difficulty_level VARCHAR(30) NOT NULL DEFAULT 'Pemula',
        xp_reward INT NOT NULL DEFAULT 150,
        estimated_time VARCHAR(50) NOT NULL DEFAULT '2 Jam',
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        order_index INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classes') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='order_index') THEN
            ALTER TABLE classes ADD COLUMN order_index INT NOT NULL DEFAULT 1;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='tagline') THEN
            ALTER TABLE classes ADD COLUMN tagline TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='difficulty_level') THEN
            ALTER TABLE classes ADD COLUMN difficulty_level VARCHAR(30) NOT NULL DEFAULT 'Pemula';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='xp_reward') THEN
            ALTER TABLE classes ADD COLUMN xp_reward INT NOT NULL DEFAULT 150;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='estimated_time') THEN
            ALTER TABLE classes ADD COLUMN estimated_time VARCHAR(50) NOT NULL DEFAULT '2 Jam';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='is_published') THEN
            ALTER TABLE classes ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT TRUE;
          END IF;
        END IF;
      END $$;

      -- 3. Table: challenges
      CREATE TABLE IF NOT EXISTS challenges (
        id VARCHAR(60) PRIMARY KEY,
        class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'BOSS_FIGHT')),
        order_index INT NOT NULL CHECK (order_index > 0),
        xp_reward INT NOT NULL DEFAULT 20,
        instruction TEXT NOT NULL,
        hint TEXT,
        theory TEXT,
        syntax_helpers JSONB NOT NULL DEFAULT '[]'::jsonb,
        locked_template JSONB NOT NULL DEFAULT '{}'::jsonb,
        target_visual JSONB NOT NULL DEFAULT '{}'::jsonb,
        initial_state TEXT NOT NULL,
        validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_class_order UNIQUE (class_id, order_index)
      );

      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'challenges') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='theory') THEN
            ALTER TABLE challenges ADD COLUMN theory TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='syntax_helpers') THEN
            ALTER TABLE challenges ADD COLUMN syntax_helpers JSONB NOT NULL DEFAULT '[]'::jsonb;
          END IF;
        END IF;
      END $$;

      -- 4. Table: xp_transactions (Ledger & Audit Trail EXP)
      CREATE TABLE IF NOT EXISTS xp_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INT NOT NULL,
        source VARCHAR(50) NOT NULL,
        reference_id VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);

      -- 5. Table: user_enrollments
      CREATE TABLE IF NOT EXISTS user_enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DROPPED')),
        enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_user_class UNIQUE (user_id, class_id)
      );
      CREATE INDEX IF NOT EXISTS idx_user_enrollments_user ON user_enrollments(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_enrollments_class ON user_enrollments(class_id);

      -- 6. Table: user_progress
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        challenge_id VARCHAR(60) NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'IN_PROGRESS', 'COMPLETED')),
        code_snapshot TEXT,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
      );
      CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_challenge ON user_progress(challenge_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

      -- 7. Table: site_visits (Visitor Tracking)
      CREATE TABLE IF NOT EXISTS site_visits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        visitor_id VARCHAR(100) NOT NULL,
        path VARCHAR(255) NOT NULL DEFAULT '/',
        user_agent TEXT,
        ip_hash VARCHAR(64),
        visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON site_visits(visited_at);

      -- 8. Table: user_daily_activity
      CREATE TABLE IF NOT EXISTS user_daily_activity (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
        study_seconds INT NOT NULL DEFAULT 0,
        daily_target_completed BOOLEAN NOT NULL DEFAULT FALSE,
        xp_earned_today INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_user_activity_date UNIQUE (user_id, activity_date)
      );
      CREATE INDEX IF NOT EXISTS idx_user_daily_activity_lookup ON user_daily_activity(user_id, activity_date);

      -- 9. Seed default admin & demo user if not present
      INSERT INTO users (id, username, email, password_hash, full_name, avatar_url, xp_points, level, streak_days, role) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@codevas.dev', 'ce1e3db0de863737e9547e6bf2ac6b3f:fa55da04dbd25678f9a048fcd10ede681fa79cfe0b9bd9f17f07a21ca79da925ff0e2bba4c4ff284cadbde68fa22d7078201edf0875c4d2e352110ac9cad767a', 'Super Admin Codevas', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminCodevas', 1250, 5, 7, 'ADMIN'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'demo', 'demo@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Alex Demo Developer', 'https://api.dicebear.com/7.x/bottts/svg?seed=alex_coder', 340, 3, 3, 'USER')
      ON CONFLICT (id) DO NOTHING;
    `);
  } catch (err) {
    console.warn('[Database] Auto-schema verification warning:', err);
  }
}

/**
 * Execute a query with automatic client checkout and release
 */
export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  if (!schemaInitialized) {
    await ensureSchema();
  }
  const start = performance.now();
  const res = await pool.query(text, params);
  const duration = Math.round(performance.now() - start);
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[SQL Query - ${dbConfig.mode}] (${duration}ms):`,
      text.replace(/\s+/g, ' ').slice(0, 100)
    );
  }
  return res.rows as T[];
}
