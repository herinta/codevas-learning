import { Pool } from 'pg';

// Global declaration for hot reload support in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __postgres_pool__: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:root@localhost:5432/codevas_db';

export const pool: Pool =
  global.__postgres_pool__ ||
  new Pool({
    connectionString,
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
    console.log(`[SQL Query] (${duration}ms):`, text.replace(/\s+/g, ' ').slice(0, 100));
  }
  return res.rows as T[];
}
