-- Codevas Database Initialization Script for Docker / PostgreSQL 16
-- Auto-executed by /docker-entrypoint-initdb.d on container startup

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
    streak_days INT NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS idx_classes_category ON classes(category);
CREATE INDEX IF NOT EXISTS idx_classes_published ON classes(is_published);

-- 3. Table: challenges
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(60) PRIMARY KEY,
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'BOSS_FIGHT')),
    order_index INT NOT NULL CHECK (order_index > 0),
    xp_reward INT NOT NULL DEFAULT 20,
    instruction TEXT NOT NULL,
    theory TEXT,
    syntax_helpers JSONB NOT NULL DEFAULT '[]'::jsonb,
    hint TEXT,
    locked_template JSONB NOT NULL DEFAULT '{}'::jsonb,
    target_visual JSONB NOT NULL DEFAULT '{}'::jsonb,
    initial_state TEXT NOT NULL,
    validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_order UNIQUE (class_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_challenges_class_id ON challenges(class_id);
CREATE INDEX IF NOT EXISTS idx_challenges_order ON challenges(class_id, order_index);

-- 4. Table: user_enrollments
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

-- 5. Table: user_progress
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

-- ========================================================
-- SEED DATA: Classes & Full 10 Levels for CSS Flexbox
-- ========================================================

INSERT INTO classes (id, category, title, tagline, description, difficulty_level, xp_reward, estimated_time, is_published, order_index) VALUES
('css-flexbox', 'LIVE_CODE', 'CSS Flexbox Mastery', 
 'Kuasai tata letak fleksibel modern, alignment instan, dan distribusi ruang.',
 'Dari aktivasi display: flex hingga trik mempusatkan elemen secara horizontal dan vertikal. Cocok untuk pemula yang ingin menguasai layouting CSS.',
 'Pemula', 550, '2.5 Jam', TRUE, 1),

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

INSERT INTO challenges (
  id, class_id, title, difficulty, order_index, xp_reward, instruction, hint,
  locked_template, target_visual, initial_state, validation_rules
) VALUES
(
  'flexbox-1-activation',
  'css-flexbox',
  'Level 1: Rapatkan 3 Permen ke Titik Tengah',
  'EASY',
  1,
  50,
  'Tiga kotak permen saat ini berantakan dan menumpuk secara vertikal di pojok kiri atas. Tugasmu adalah membuat ketiga permen tersebut berbaris rapi secara horizontal dan berada tepat di tengah-tengah kotak arena!',
  'Gunakan display: flex; lalu tambahkan justify-content: center; dan align-items: center; untuk memposisikannya di tengah.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["🍬 Permen 1", "🍭 Permen 2", "🍫 Permen 3"]}'::jsonb,
  '{"display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "center", "gap": "16px", "description": "Tiga permen berbaris horizontal di titik tengah arena dengan jarak serasi."}'::jsonb,
  '.arena {\n  /* Tulis kode CSS Flexbox kamu di sini */\n}',
  '{"goals": [{"property": "display", "accepted": ["flex", "inline-flex"]}, {"property": "justify-content", "accepted": ["center", "space-around"]}, {"property": "align-items", "accepted": ["center"]}]}'::jsonb
),
(
  'flexbox-2-space-between',
  'css-flexbox',
  'Level 2: Sebarkan Elemen ke Kedua Ujung Tepi',
  'EASY',
  2,
  50,
  'Buat ketiga kartu tersebar merata dari batas paling kiri sampai batas paling kanan arena dengan jarak antar elemen yang sama.',
  'Gunakan display: flex; justify-content: space-between; align-items: center;.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["Permen A", "Permen B", "Permen C"]}'::jsonb,
  '{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "description": "Permen A di pojok kiri, C di pojok kanan, dan B tepat di tengah."}'::jsonb,
  '.arena {\n  display: flex;\n  /* Lengkapi agar terpisah ke kedua ujung */\n}',
  '{"goals": [{"property": "justify-content", "accepted": ["space-between"]}]}'::jsonb
),
(
  'flexbox-3-space-around',
  'css-flexbox',
  'Level 3: Distribusi Jarak Merata (Space Around)',
  'EASY',
  3,
  50,
  'Berikan ruang sela yang seimbang di sekeliling tiap permen agar tidak menempel ke dinding pinggir arena.',
  'Gunakan justify-content: space-around; atau space-evenly; dengan align-items: center;.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["Permen 1", "Permen 2", "Permen 3"]}'::jsonb,
  '{"display": "flex", "justifyContent": "space-around", "alignItems": "center", "description": "Seluruh permen memiliki bantalan ruang sela merata di kiri dan kanannya."}'::jsonb,
  '.arena {\n  display: flex;\n  /* Berikan ruang sela merata */\n}',
  '{"goals": [{"property": "justify-content", "accepted": ["space-around", "space-evenly"]}]}'::jsonb
),
(
  'flexbox-4-flex-end',
  'css-flexbox',
  'Level 4: Dorong Semua Permen ke Pojok Kanan Bawah',
  'EASY',
  4,
  50,
  'Pindahkan ketiga permen ke sudut paling bawah dan paling kanan dari arena.',
  'Gunakan justify-content: flex-end; dan align-items: flex-end; (atau nilai end).',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["Permen 1", "Permen 2", "Permen 3"]}'::jsonb,
  '{"display": "flex", "justifyContent": "flex-end", "alignItems": "flex-end", "gap": "16px", "description": "Semua permen berkumpul di sudut pojok kanan bawah arena."}'::jsonb,
  '.arena {\n  display: flex;\n  /* Pindahkan ke pojok kanan bawah */\n}',
  '{"goals": [{"property": "justify-content", "accepted": ["flex-end", "end"]}, {"property": "align-items", "accepted": ["flex-end", "end"]}]}'::jsonb
),
(
  'flexbox-5-direction-column',
  'css-flexbox',
  'Level 5: Ubah Alur Menjadi Kolom Vertikal',
  'MEDIUM',
  5,
  60,
  'Ubah alur permen agar berjejer lurus dari atas ke bawah secara vertikal di tengah-tengah arena.',
  'Gunakan flex-direction: column; dan align-items: center; serta justify-content: center;.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["Top", "Mid", "Bot"]}'::jsonb,
  '{"display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center", "gap": "12px", "description": "Permen berjejer ke bawah seperti tumpukan vertikal di tengah arena."}'::jsonb,
  '.arena {\n  display: flex;\n  /* Ubah alur menjadi kolom vertikal terpusat */\n}',
  '{"goals": [{"property": "flex-direction", "accepted": ["column"]}, {"property": "align-items", "accepted": ["center"]}]}'::jsonb
),
(
  'flexbox-6-column-reverse',
  'css-flexbox',
  'Level 6: Balikkan Urutan Kolom Terbalik',
  'MEDIUM',
  6,
  60,
  'Susun permen ke bawah secara vertikal, namun dengan urutan terbalik (Permen 3 di puncak atas, Permen 1 di paling bawah).',
  'Gunakan flex-direction: column-reverse;.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["1", "2", "3"]}'::jsonb,
  '{"display": "flex", "flexDirection": "column-reverse", "justifyContent": "center", "alignItems": "center", "gap": "12px", "description": "Urutan terbalik vertikal: 3 di atas, 1 di bawah."}'::jsonb,
  '.arena {\n  display: flex;\n  /* Balikkan urutan kolom di sini */\n}',
  '{"goals": [{"property": "flex-direction", "accepted": ["column-reverse"]}]}'::jsonb
),
(
  'flexbox-7-flex-wrap',
  'css-flexbox',
  'Level 7: Atasi Elemen Meluap dengan Multi-Baris (Wrap)',
  'MEDIUM',
  7,
  60,
  'Ada 6 permen yang meluap ke luar arena! Izinkan permen membungkus ke baris baru saat ruang horizontal penuh dengan jarak 16px.',
  'Gunakan flex-wrap: wrap; dan gap: 16px;.',
  '{"element": "arena", "itemsCount": 6, "itemLabels": ["P1", "P2", "P3", "P4", "P5", "P6"]}'::jsonb,
  '{"display": "flex", "flexWrap": "wrap", "gap": "16px", "justifyContent": "center", "description": "Permen membungkus ke baris kedua dengan rapi tanpa keluar arena."}'::jsonb,
  '.arena {\n  display: flex;\n  /* Izinkan membungkus ke baris baru */\n}',
  '{"goals": [{"property": "flex-wrap", "accepted": ["wrap"]}, {"property": "gap", "accepted": ["16px", "1rem", "12px"]}]}'::jsonb
),
(
  'flexbox-8-align-self',
  'css-flexbox',
  'Level 8: Turunkan Permen Bintang Sendirian (Align Self)',
  'HARD',
  8,
  70,
  'Permen 1 dan 3 tetap berada di atas, tapi permen kedua (bintang) harus turun sendirian ke dasar arena!',
  'Gunakan selector .permen-2 { align-self: flex-end; } atau align-self: end;.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["P1", "⭐ Permen 2", "P3"]}'::jsonb,
  '{"display": "flex", "alignItems": "flex-start", "justifyContent": "space-around", "description": "Permen 1 dan 3 di atas, sedangkan Permen 2 turun ke dasar arena."}'::jsonb,
  '.arena {\n  display: flex;\n  justify-content: space-around;\n  align-items: flex-start;\n}\n\n.permen-2 {\n  /* Turunkan permen ini sendirian ke bawah */\n}',
  '{"goals": [{"property": "align-self", "accepted": ["flex-end", "end"]}]}'::jsonb
),
(
  'flexbox-9-order',
  'css-flexbox',
  'Level 9: Tukar Posisi Permen Juara Tanpa Ubah HTML (Order)',
  'HARD',
  9,
  70,
  'Pindahkan permen nomor 3 ke posisi paling depan (paling kiri) menggunakan properti order!',
  'Gunakan order: -1; pada .permen-3.',
  '{"element": "arena", "itemsCount": 3, "itemLabels": ["P1", "P2", "🏆 Permen 3"]}'::jsonb,
  '{"display": "flex", "justifyContent": "center", "gap": "16px", "description": "Permen 3 tampil pertama di depan Permen 1 dan 2."}'::jsonb,
  '.arena {\n  display: flex;\n  justify-content: center;\n  gap: 16px;\n}\n\n.permen-3 {\n  /* Pindahkan permen juara ke baris terdepan */\n}',
  '{"goals": [{"property": "order", "accepted": ["-1", "0"]}]}'::jsonb
),
(
  'flexbox-10-boss-fight',
  'css-flexbox',
  'Level 10: BOSS FIGHT — Responsive Bento Dashboard Layout',
  'BOSS_FIGHT',
  10,
  80,
  'Pertarungan Terakhir: Gabungkan display: flex, wrap multi-baris, distribusi space-between, dan perataan tengah untuk merapikan 4 panel bento kartu!',
  'Kombinasikan display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;.',
  '{"element": "arena", "itemsCount": 4, "itemLabels": ["📊 Analytics", "⚡ Speed", "🛡️ Security", "⭐ Reputasi"]}'::jsonb,
  '{"display": "flex", "flexWrap": "wrap", "justifyContent": "space-between", "alignItems": "center", "gap": "16px", "description": "4 kartu bento tersusun 2x2 proporsional dan presisi."}'::jsonb,
  '.arena {\n  /* BOSS FIGHT: Terapkan tata letak bento dashboard modern */\n}',
  '{"goals": [{"property": "display", "accepted": ["flex"]}, {"property": "flex-wrap", "accepted": ["wrap"]}, {"property": "justify-content", "accepted": ["space-between", "center"]}, {"property": "gap", "accepted": ["16px", "1rem", "12px", "20px"]}]}'::jsonb
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

-- Demo Users
INSERT INTO users (id, username, email, password_hash, full_name, avatar_url, xp_points, streak_days, role) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@codevas.dev', 'ce1e3db0de863737e9547e6bf2ac6b3f:fa55da04dbd25678f9a048fcd10ede681fa79cfe0b9bd9f17f07a21ca79da925ff0e2bba4c4ff284cadbde68fa22d7078201edf0875c4d2e352110ac9cad767a', 'Super Admin Codevas', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminCodevas', 1250, 7, 'ADMIN'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'demo', 'demo@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Alex Demo Developer', 'https://api.dicebear.com/7.x/bottts/svg?seed=alex_coder', 340, 3, 'USER')
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  xp_points = EXCLUDED.xp_points,
  streak_days = EXCLUDED.streak_days,
  role = EXCLUDED.role;

-- Enroll Demo User to CSS Flexbox
INSERT INTO user_enrollments (id, user_id, class_id, status) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'css-flexbox', 'ACTIVE')
ON CONFLICT (user_id, class_id) DO UPDATE SET status = 'ACTIVE';

-- User Progress for Demo User
INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-1-activation', 'COMPLETED', '.arena {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-2-space-between', 'IN_PROGRESS', '.arena {\n  display: flex;\n  /* Lengkapi agar terpisah ke kedua ujung */\n}')
ON CONFLICT (user_id, challenge_id) DO UPDATE SET
  status = EXCLUDED.status,
  code_snapshot = EXCLUDED.code_snapshot;


