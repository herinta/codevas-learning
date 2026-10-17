import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env if present
const envPath = path.resolve(__dirname, '../.env.local');
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

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/codevas_db';

console.log('🚀 Connecting to PostgreSQL:', connectionString.replace(/:[^:]*@/, ':****@'));

const pool = new pg.Pool({ connectionString });

const DDL_SCHEMA = `
-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    xp_points INT NOT NULL DEFAULT 0 CHECK (xp_points >= 0),
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 3. Table: classes
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(30) NOT NULL CHECK (category IN ('LIVE_CODE', 'DRAG_DROP', 'QUIZ')),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_classes_category ON classes(category);
CREATE INDEX IF NOT EXISTS idx_classes_published ON classes(is_published);

-- 4. Table: challenges
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(60) PRIMARY KEY,
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'BOSS_FIGHT')),
    order_index INT NOT NULL CHECK (order_index > 0),
    instruction TEXT NOT NULL,
    locked_template JSONB NOT NULL DEFAULT '{}'::jsonb,
    initial_state TEXT NOT NULL,
    validation_rule JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_order UNIQUE (class_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_challenges_class_id ON challenges(class_id);
CREATE INDEX IF NOT EXISTS idx_challenges_order ON challenges(class_id, order_index);

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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
`;

async function main() {
  const client = await pool.connect();
  try {
    console.log('📦 Executing ERD Schema DDL...');
    await client.query(DDL_SCHEMA);
    console.log('✅ Tables created/verified according to ERD: users, classes, user_enrollments, challenges, user_progress');

    console.log('🌱 Seeding curriculum data & user enrollments...');
    // Demo accounts
    await client.query(`
      INSERT INTO users (id, username, email, password_hash, xp_points, role) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@codevas.dev', '$2a$12$demoAdminHashSecret', 1250, 'ADMIN'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'alex_coder', 'alex@codevas.dev', '$2a$12$demoUserHashSecret', 340, 'USER')
      ON CONFLICT (username) DO NOTHING;
    `);

    // Classes
    await client.query(`
      INSERT INTO classes (id, category, title, description, is_published) VALUES
      ('css-flexbox', 'LIVE_CODE', 'CSS Flexbox Mastery', 'Kuasai layouting fleksibel modern secara visual dengan validasi instan 10 level tantangan.', TRUE),
      ('css-grid', 'LIVE_CODE', 'CSS Grid Architecture', 'Bangun struktur 2D layout kompleks, sistem bento box, dan responsive grid modern.', TRUE),
      ('component-styling', 'LIVE_CODE', 'Component Styling', 'Desain komponen UI modern dengan utility classes dan design tokens Candy Light Mode.', FALSE),
      ('js-logic-blocks', 'DRAG_DROP', 'Javascript Logic Blocks', 'Latih logika percabangan, perulangan, dan manipulasi data menggunakan visual drag-and-drop.', FALSE),
      ('css-selectors-quiz', 'QUIZ', 'CSS Selectors & Specificity', 'Uji pemahaman selektor tingkat lanjut, pseudo-classes, dan hirarki specificity tanpa ragu.', FALSE)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        is_published = EXCLUDED.is_published;
    `);

    // Demo Enrollment: Alex enrolled in CSS Flexbox
    await client.query(`
      INSERT INTO user_enrollments (user_id, class_id, status)
      VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'css-flexbox', 'ACTIVE')
      ON CONFLICT (user_id, class_id) DO NOTHING;
    `);

    // Verify summary
    const resUsers = await client.query('SELECT count(*) FROM users');
    const resClasses = await client.query('SELECT count(*) FROM classes');
    const resChallenges = await client.query('SELECT count(*) FROM challenges');
    const resEnrollments = await client.query('SELECT count(*) FROM user_enrollments');
    const resProgress = await client.query('SELECT count(*) FROM user_progress');

    console.log('\n📊 Database Summary in DBeaver / PostgreSQL:');
    console.log(`- Database Name       : codevas_db`);
    console.log(`- users table         : ${resUsers.rows[0].count} rows`);
    console.log(`- classes table       : ${resClasses.rows[0].count} rows`);
    console.log(`- challenges table    : ${resChallenges.rows[0].count} rows`);
    console.log(`- user_enrollments    : ${resEnrollments.rows[0].count} rows`);
    console.log(`- user_progress       : ${resProgress.rows[0].count} rows`);
    console.log('\n✨ Database with user_enrollments is 100% ready and matches the updated ERD!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Database setup failed:', err);
  process.exit(1);
});
