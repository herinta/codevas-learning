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
    full_name VARCHAR(100),
    avatar_url TEXT,
    xp_points INT NOT NULL DEFAULT 50 CHECK (xp_points >= 0),
    streak_days INT NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Alter users if columns missing (idempotent migration)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='streak_days') THEN
        ALTER TABLE users ADD COLUMN streak_days INT NOT NULL DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_date') THEN
        ALTER TABLE users ADD COLUMN last_active_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 3. Table: classes
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

-- Alter classes if columns missing
DO $$
BEGIN
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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='order_index') THEN
        ALTER TABLE classes ADD COLUMN order_index INT NOT NULL DEFAULT 1;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_classes_category ON classes(category);
CREATE INDEX IF NOT EXISTS idx_classes_published ON classes(is_published);

-- 4. Table: challenges
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(60) PRIMARY KEY,
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'BOSS_FIGHT')),
    order_index INT NOT NULL CHECK (order_index > 0),
    xp_reward INT NOT NULL DEFAULT 20,
    instruction TEXT NOT NULL,
    hint TEXT,
    locked_template JSONB NOT NULL DEFAULT '{}'::jsonb,
    target_visual JSONB NOT NULL DEFAULT '{}'::jsonb,
    initial_state TEXT NOT NULL,
    validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_order UNIQUE (class_id, order_index)
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='xp_reward') THEN
        ALTER TABLE challenges ADD COLUMN xp_reward INT NOT NULL DEFAULT 20;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='hint') THEN
        ALTER TABLE challenges ADD COLUMN hint TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='target_visual') THEN
        ALTER TABLE challenges ADD COLUMN target_visual JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='validation_rules') THEN
        ALTER TABLE challenges ADD COLUMN validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
END $$;

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
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_progress' AND column_name='completed_at') THEN
        ALTER TABLE user_progress ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
`;

async function main() {
  const client = await pool.connect();
  try {
    console.log('📦 Executing ERD Schema DDL...');
    await client.query(DDL_SCHEMA);
    console.log('✅ Tables & columns synchronized according to updated ERD!');

    console.log('🌱 Seeding curriculum data & user enrollments...');

    // 1. Classes Seed
    await client.query(`
      INSERT INTO classes (id, category, title, tagline, description, difficulty_level, xp_reward, estimated_time, is_published, order_index) VALUES
      ('css-flexbox', 'LIVE_CODE', 'CSS Flexbox Mastery', 
       'Kuasai tata letak fleksibel modern, alignment instan, dan distribusi ruang.',
       'Dari aktivasi display: flex hingga trik mempusatkan elemen secara horizontal dan vertikal. Cocok untuk pemula yang ingin menguasai layouting CSS.',
       'Pemula', 250, '1.5 Jam', TRUE, 1),
      
      ('css-grid', 'LIVE_CODE', 'CSS Grid Architecture', 
       'Bangun tata letak 2 dimensi modern, sistem bento box, dan responsive grid.',
       'Pelajari pembagian grid template columns, span, area, dan tata letak majalah digital yang rapi dan responsif di semua ukuran layar.',
       'Menengah', 300, '2.5 Jam', TRUE, 2),

      ('component-styling', 'LIVE_CODE', 'Component Styling & Effects', 
       'Desain komponen tombol, kartu, dan form interaktif berestetika neo-brutalist.',
       'Eksplorasi perpaduan shadow tegas, border tebal, warna-warna vibrant candy, dan micro-interactions modern.',
       'Pemula', 180, '1.5 Jam', FALSE, 3),

      ('js-logic-blocks', 'DRAG_DROP', 'JavaScript Logic Blocks', 
       'Latih logika pemrograman frontend dengan blok visual puzzle interaktif.',
       'Pahami kondisi if/else, perulangan for/while, dan manipulasi array secara visual tanpa takut syntax error.',
       'Pemula', 200, '2 Jam', FALSE, 4),

      ('css-selectors-quiz', 'QUIZ', 'CSS Selectors & Specificity', 
       'Tebak dan taklukkan bobot spesifisitas CSS dan pseudo-class langka.',
       'Uji pemahamanmu tentang selektor :nth-child, :has, specificity hierarchy, dan cascade inheritance.',
       'Menengah', 150, '1 Jam', FALSE, 5)

      ON CONFLICT (id) DO UPDATE SET
        category = EXCLUDED.category,
        title = EXCLUDED.title,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        difficulty_level = EXCLUDED.difficulty_level,
        xp_reward = EXCLUDED.xp_reward,
        estimated_time = EXCLUDED.estimated_time,
        is_published = EXCLUDED.is_published,
        order_index = EXCLUDED.order_index;
    `);

    // 2. Challenges Seed (Levels inside CSS Flexbox)
    await client.query(`
      INSERT INTO challenges (
        id, class_id, title, difficulty, order_index, xp_reward, instruction, hint,
        locked_template, target_visual, initial_state, validation_rules
      ) VALUES
      (
        'flexbox-1-activation',
        'css-flexbox',
        'Level 1: Rapatkan 3 Permen ke Tengah Layar',
        'EASY',
        1,
        50,
        'Tiga kotak permen saat ini berantakan dan menumpuk secara vertikal di pojok kiri atas. Tugasmu adalah membuat ketiga permen tersebut berbaris rapi secara horizontal dan berada tepat di tengah-tengah kotak arena!',
        'Gunakan display: flex untuk menyusun horizontal, lalu gunakan justify-content: center dan align-items: center untuk memposisikannya di tengah.',
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["🍬 Permen 1", "🍭 Permen 2", "🍫 Permen 3"]}'::jsonb,
        '{"display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "gap": "16px", "description": "Tiga permen berbaris horizontal di titik tengah arena dengan jarak serasi."}'::jsonb,
        '.arena {\n  /* Tulis kode CSS Flexbox kamu di sini */\n}',
        '{"goals": [{"property": "display", "accepted": ["flex", "inline-flex"]}, {"property": "justify-content", "accepted": ["center", "space-around"]}, {"property": "align-items", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'flexbox-2-space-between',
        'css-flexbox',
        'Level 2: Sebarkan Kotak ke Ujung Arena',
        'EASY',
        2,
        60,
        'Buat ketiga kartu tersebar merata dari ujung kiri sampai ujung kanan arena dengan jarak antar elemen yang sama.',
        'Atur display: flex lalu pilih nilai justify-content yang mendorong elemen ke batas tepi arena.',
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Card A", "Card B", "Card C"]}'::jsonb,
        '{"display": "flex", "justifyContent": "space-between", "alignItems": "center"}'::jsonb,
        '.arena {\n  display: flex;\n  /* Lengkapi agar terpisah ke kedua ujung */\n}',
        '{"goals": [{"property": "justify-content", "accepted": ["space-between"]}]}'::jsonb
      ),
      (
        'flexbox-3-column-reverse',
        'css-flexbox',
        'Level 3: Balikkan Urutan Menjadi Kolom Terbalik',
        'MEDIUM',
        3,
        70,
        'Ubah alur permen agar tersusun ke bawah secara vertikal, namun dengan urutan terbalik (Permen 3 di atas, Permen 1 di bawah).',
        'Gunakan flex-direction: column-reverse.',
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["1", "2", "3"]}'::jsonb,
        '{"display": "flex", "flexDirection": "column-reverse", "justifyContent": "center"}'::jsonb,
        '.arena {\n  display: flex;\n  /* Ubah arah flex di sini */\n}',
        '{"goals": [{"property": "flex-direction", "accepted": ["column-reverse"]}]}'::jsonb
      ),
      (
        'grid-1-two-columns',
        'css-grid',
        'Level 1: Susun 4 Panel Menjadi 2x2 Grid',
        'EASY',
        1,
        60,
        'Susun keempat panel menjadi format 2 kolom dan 2 baris yang simetris.',
        'Gunakan display: grid dan grid-template-columns: repeat(2, 1fr) atau 1fr 1fr.',
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["Panel 1", "Panel 2", "Panel 3", "Panel 4"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "16px"}'::jsonb,
        '.grid-arena {\n  /* Tulis CSS Grid di sini */\n}',
        '{"goals": [{"property": "display", "accepted": ["grid"]}, {"property": "grid-template-columns", "accepted": ["1fr 1fr", "repeat(2, 1fr)", "50% 50%"]}]}'::jsonb
      )
      ON CONFLICT (class_id, order_index) DO UPDATE SET
        title = EXCLUDED.title,
        difficulty = EXCLUDED.difficulty,
        xp_reward = EXCLUDED.xp_reward,
        instruction = EXCLUDED.instruction,
        hint = EXCLUDED.hint,
        locked_template = EXCLUDED.locked_template,
        target_visual = EXCLUDED.target_visual,
        initial_state = EXCLUDED.initial_state,
        validation_rules = EXCLUDED.validation_rules;
    `);

    // 3. Demo Admin User update with full_name & avatar
    await client.query(`
      INSERT INTO users (id, username, email, password_hash, full_name, avatar_url, xp_points, streak_days, role) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@codevas.dev', '$2a$12$demoAdminHashSecret', 'Admin Codevas', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminCodevas', 1250, 5, 'ADMIN'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'alex_coder', 'alex@codevas.dev', '$2a$12$demoUserHashSecret', 'Alex Developer', 'https://api.dicebear.com/7.x/bottts/svg?seed=alex_coder', 340, 3, 'USER')
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        streak_days = EXCLUDED.streak_days;
    `);

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
    console.log('\n✨ Database is 100% updated and populated with dynamic challenges & level 1!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Database setup failed:', err);
  process.exit(1);
});
