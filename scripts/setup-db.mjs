import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local, .env.development, or .env if present
const possibleEnvFiles = ['.env.local', '.env.development', '.env'];
for (const file of possibleEnvFiles) {
  const envPath = path.resolve(__dirname, `../${file}`);
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...rest] = trimmed.split('=');
        const val = rest.join('=').replace(/^["']|["']$/g, '');
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// Check CLI arguments (--local or --server)
const args = process.argv.slice(2);
const forceServer = args.includes('--server');
const forceLocal = args.includes('--local');
const dbMode = (process.env.DB_MODE || '').toLowerCase().trim();

let connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/codevas_db';
let targetLabel = 'Default';

if (forceServer || (!forceLocal && (dbMode === 'server' || dbMode === 'prod'))) {
  if (process.env.DATABASE_URL_SERVER) {
    connectionString = process.env.DATABASE_URL_SERVER;
    targetLabel = 'SERVER (Synology NAS / Remote)';
  } else {
    targetLabel = 'SERVER (DATABASE_URL)';
  }
} else if (forceLocal || dbMode === 'local' || dbMode === 'dev') {
  if (process.env.DATABASE_URL_LOCAL) {
    connectionString = process.env.DATABASE_URL_LOCAL;
    targetLabel = 'LOCAL (Dev Machine)';
  } else {
    targetLabel = 'LOCAL (DATABASE_URL)';
  }
}

console.log(`🚀 [DB Setup Migration] Target: ${targetLabel}`);
console.log('🔗 Connecting to PostgreSQL:', connectionString.replace(/:[^:@]*@/, ':****@'));

const pool = new pg.Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  try {
    console.log('📦 Executing Database Schema & Seed from docker/init-db.sql...');
    const sqlPath = path.resolve(__dirname, '../docker/init-db.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`File not found: ${sqlPath}`);
    }
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    await client.query(sqlContent);
    console.log('✅ Tables, columns, and challenges synchronized from docker/init-db.sql!');

    // Verify summary
    const resUsers = await client.query('SELECT count(*) FROM users');
    const resClasses = await client.query('SELECT count(*) FROM classes');
    const resChallenges = await client.query('SELECT count(*) FROM challenges');
    const resEnrollments = await client.query('SELECT count(*) FROM user_enrollments');
    const resProgress = await client.query('SELECT count(*) FROM user_progress');

    console.log('\n📊 Database Summary:');
    console.log(`- users table         : ${resUsers.rows[0].count} rows`);
    console.log(`- classes table       : ${resClasses.rows[0].count} rows`);
    console.log(`- challenges table    : ${resChallenges.rows[0].count} rows`);
    console.log(`- user_enrollments    : ${resEnrollments.rows[0].count} rows`);
    console.log(`- user_progress       : ${resProgress.rows[0].count} rows`);
    console.log('\n✨ Database is 100% updated with clean curriculum data!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Database setup failed:', err);
  process.exit(1);
});
