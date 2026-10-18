import { pool } from './pool';

/**
 * SQL DDL Schema string derived directly from project_plan.md ERD
 */
export const DDL_SCHEMA = `
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
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    streak_days INT NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Table: xp_transactions (Ledger & Audit Trail EXP)
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
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);

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

/**
 * Seeds initial demo curriculum and accounts
 */
export async function seedInitialData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Users
    await client.query(`
      INSERT INTO users (id, username, email, password_hash, xp_points, role) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@codevas.dev', '$2a$12$demoAdminHashSecret', 1250, 'ADMIN'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'alex_coder', 'alex@codevas.dev', '$2a$12$demoUserHashSecret', 340, 'USER')
      ON CONFLICT (username) DO NOTHING;
    `);

    // 2. Classes
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

    // 3. 10 Flexbox Challenges
    const flexboxChallenges = [
      {
        id: 'flexbox-1-activation',
        class_id: 'css-flexbox',
        title: 'The Activation',
        difficulty: 'EASY',
        order_index: 1,
        instruction: 'Aktifkan Flexbox pada elemen container agar semua item tersusun secara horizontal.',
        locked_template: { html: '<div class="flex-container"><div class="item">1</div><div class="item">2</div><div class="item">3</div></div>' },
        initial_state: '.flex-container {\n  /* Tulis kode Anda di sini */\n}',
        validation_rule: { targetSelector: '.flex-container', expectedProperties: { display: 'flex' } },
      },
      {
        id: 'flexbox-2-sniper',
        class_id: 'css-flexbox',
        title: 'The Sniper',
        difficulty: 'EASY',
        order_index: 2,
        instruction: 'Posisikan item tepat di tengah-tengah sumbu utama (horizontal) menggunakan justify-content.',
        locked_template: { html: '<div class="flex-container"><div class="target-box">TARGET</div></div>' },
        initial_state: '.flex-container {\n  display: flex;\n  /* Posisikan target ke tengah */\n}',
        validation_rule: { targetSelector: '.flex-container', expectedProperties: { 'justify-content': 'center' } },
      },
      {
        id: 'flexbox-3-split',
        class_id: 'css-flexbox',
        title: 'The Split',
        difficulty: 'EASY',
        order_index: 3,
        instruction: 'Beri jarak maksimal antar item sehingga item pertama di ujung kiri dan item terakhir di ujung kanan.',
        locked_template: { html: '<div class="navbar"><span class="brand">Codevas</span><span class="menu">Profile</span></div>' },
        initial_state: '.navbar {\n  display: flex;\n  /* Bagi ruang rata ke ujung */\n}',
        validation_rule: { targetSelector: '.navbar', expectedProperties: { 'justify-content': 'space-between' } },
      },
      {
        id: 'flexbox-4-breathing-room',
        class_id: 'css-flexbox',
        title: 'The Breathing Room',
        difficulty: 'EASY',
        order_index: 4,
        instruction: 'Distribusikan item sehingga setiap item memiliki ruang kosong yang sama persis di sekitarnya.',
        locked_template: { html: '<div class="gallery"><div class="photo">A</div><div class="photo">B</div><div class="photo">C</div></div>' },
        initial_state: '.gallery {\n  display: flex;\n  /* Ruang rata seimbang */\n}',
        validation_rule: { targetSelector: '.gallery', expectedProperties: { 'justify-content': 'space-evenly' } },
      },
      {
        id: 'flexbox-5-push',
        class_id: 'css-flexbox',
        title: 'The Push',
        difficulty: 'EASY',
        order_index: 5,
        instruction: 'Dorong semua tombol aksi ke pojok kanan container menggunakan flex-end.',
        locked_template: { html: '<div class="action-bar"><button class="btn">Cancel</button><button class="btn primary">Save</button></div>' },
        initial_state: '.action-bar {\n  display: flex;\n  /* Geser ke kanan */\n}',
        validation_rule: { targetSelector: '.action-bar', expectedProperties: { 'justify-content': 'flex-end' } },
      },
      {
        id: 'flexbox-6-gravity',
        class_id: 'css-flexbox',
        title: 'The Gravity',
        difficulty: 'MEDIUM',
        order_index: 6,
        instruction: 'Selaraskan item tepat di tengah sumbu silang (vertikal) dengan align-items.',
        locked_template: { html: '<div class="card-header"><img class="avatar" /><div class="name">Developer</div></div>' },
        initial_state: '.card-header {\n  display: flex;\n  height: 80px;\n  /* Selaraskan secara vertikal */\n}',
        validation_rule: { targetSelector: '.card-header', expectedProperties: { 'align-items': 'center' } },
      },
      {
        id: 'flexbox-7-floor',
        class_id: 'css-flexbox',
        title: 'The Floor',
        difficulty: 'MEDIUM',
        order_index: 7,
        instruction: 'Tempelkan semua item ke bagian dasar (bawah) container.',
        locked_template: { html: '<div class="chart-container"><div class="bar">1</div><div class="bar">2</div></div>' },
        initial_state: '.chart-container {\n  display: flex;\n  height: 120px;\n  /* Rapatkan ke bawah */\n}',
        validation_rule: { targetSelector: '.chart-container', expectedProperties: { 'align-items': 'flex-end' } },
      },
      {
        id: 'flexbox-8-tetris-tower',
        class_id: 'css-flexbox',
        title: 'The Tetris Tower',
        difficulty: 'MEDIUM',
        order_index: 8,
        instruction: 'Ubah orientasi flow agar item tersusun ke bawah (vertikal) seperti kolom.',
        locked_template: { html: '<div class="sidebar"><a href="#">Home</a><a href="#">Courses</a></div>' },
        initial_state: '.sidebar {\n  display: flex;\n  /* Susun ke bawah */\n}',
        validation_rule: { targetSelector: '.sidebar', expectedProperties: { 'flex-direction': 'column' } },
      },
      {
        id: 'flexbox-9-gap',
        class_id: 'css-flexbox',
        title: 'The Gap',
        difficulty: 'MEDIUM',
        order_index: 9,
        instruction: 'Berikan jarak pemisah yang rapi sebesar 16px di antara setiap item tanpa menggunakan margin kotor.',
        locked_template: { html: '<div class="tag-list"><span class="tag">HTML</span><span class="tag">CSS</span></div>' },
        initial_state: '.tag-list {\n  display: flex;\n  /* Beri jarak 16px */\n}',
        validation_rule: { targetSelector: '.tag-list', expectedProperties: { gap: '16px' } },
      },
      {
        id: 'flexbox-10-boss-fight',
        class_id: 'css-flexbox',
        title: 'Boss Fight - Centering Div',
        difficulty: 'BOSS_FIGHT',
        order_index: 10,
        instruction: 'Jurus pamungkas programmer: Posisikan kotak modal tepat sempurna di tengah layar baik horizontal maupun vertikal.',
        locked_template: { html: '<div class="viewport"><div class="modal-box">Centered Victory!</div></div>' },
        initial_state: '.viewport {\n  display: flex;\n  height: 100vh;\n  /* Jurus pamungkas centering div */\n}',
        validation_rule: { targetSelector: '.viewport', expectedProperties: { display: 'flex', 'justify-content': 'center', 'align-items': 'center' } },
      },
    ];

    for (const c of flexboxChallenges) {
      await client.query(`
        INSERT INTO challenges (id, class_id, title, difficulty, order_index, instruction, locked_template, initial_state, validation_rule)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          difficulty = EXCLUDED.difficulty,
          order_index = EXCLUDED.order_index,
          instruction = EXCLUDED.instruction,
          locked_template = EXCLUDED.locked_template,
          initial_state = EXCLUDED.initial_state,
          validation_rule = EXCLUDED.validation_rule;
      `, [c.id, c.class_id, c.title, c.difficulty, c.order_index, c.instruction, JSON.stringify(c.locked_template), c.initial_state, JSON.stringify(c.validation_rule)]);
    }

    // 4. Initial Enrollments (Alex enrolled in CSS Flexbox)
    await client.query(`
      INSERT INTO user_enrollments (user_id, class_id, status)
      VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'css-flexbox', 'ACTIVE')
      ON CONFLICT (user_id, class_id) DO NOTHING;
    `);

    // 5. Initial Progress for Alex
    await client.query(`
      INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot)
      VALUES 
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-1-activation', 'COMPLETED', '.flex-container { display: flex; }'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-2-sniper', 'IN_PROGRESS', '.flex-container { display: flex; justify-content: center; }')
      ON CONFLICT (user_id, challenge_id) DO NOTHING;
    `);

    await client.query('COMMIT');
    return { success: true, message: 'Database schema and seed data loaded successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Initializes tables and returns table list & counts
 */
export async function setupDatabase() {
  const client = await pool.connect();
  try {
    // 1. Run DDL
    await client.query(DDL_SCHEMA);

    // 2. Run Seed
    await seedInitialData();

    // 3. Verify counts
    const usersCount = (await client.query('SELECT count(*) FROM users')).rows[0].count;
    const classesCount = (await client.query('SELECT count(*) FROM classes')).rows[0].count;
    const challengesCount = (await client.query('SELECT count(*) FROM challenges')).rows[0].count;
    const enrollmentsCount = (await client.query('SELECT count(*) FROM user_enrollments')).rows[0].count;
    const progressCount = (await client.query('SELECT count(*) FROM user_progress')).rows[0].count;

    return {
      status: 'ready',
      database: 'codevas_db',
      tables: {
        users: Number(usersCount),
        classes: Number(classesCount),
        challenges: Number(challengesCount),
        user_enrollments: Number(enrollmentsCount),
        user_progress: Number(progressCount),
      },
    };
  } finally {
    client.release();
  }
}
