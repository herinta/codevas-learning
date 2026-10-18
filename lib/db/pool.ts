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

/**
 * Execute a query with automatic client checkout and release
 */
export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
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
