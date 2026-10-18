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

      -- 1. Ensure users table columns
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='level') THEN
            ALTER TABLE users ADD COLUMN level INT NOT NULL DEFAULT 1 CHECK (level >= 1);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
            ALTER TABLE users ADD COLUMN full_name VARCHAR(100);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
            ALTER TABLE users ADD COLUMN avatar_url TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='streak_days') THEN
            ALTER TABLE users ADD COLUMN streak_days INT NOT NULL DEFAULT 1;
          END IF;
        END IF;
      END $$;

      -- 2. Ensure classes table and missing columns
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

      -- 3. Ensure challenges table theory and syntax_helpers columns
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

      -- 4. User Daily Activity Table
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
