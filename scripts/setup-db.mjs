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
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    streak_days INT NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='level') THEN
        ALTER TABLE users ADD COLUMN level INT NOT NULL DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='streak_days') THEN
        ALTER TABLE users ADD COLUMN streak_days INT NOT NULL DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_date') THEN
        ALTER TABLE users ADD COLUMN last_active_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_seen_at') THEN
        ALTER TABLE users ADD COLUMN last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
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

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='theory') THEN
        ALTER TABLE challenges ADD COLUMN theory TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='syntax_helpers') THEN
        ALTER TABLE challenges ADD COLUMN syntax_helpers JSONB NOT NULL DEFAULT '[]'::jsonb;
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

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

-- 7. Table: site_visits (Tracking Pengunjung Landing Page Tanpa Login)
CREATE TABLE IF NOT EXISTS site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL DEFAULT '/',
    user_agent TEXT,
    ip_hash VARCHAR(64),
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON site_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON site_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_path ON site_visits(path);

-- 8. Table: xp_transactions (Ledger & Audit Trail EXP Pengguna)
CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table: user_daily_activity (Tracking Waktu Target Harian 10 Menit & Ephemeral Progress)
CREATE TABLE IF NOT EXISTS user_daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    active_seconds INT NOT NULL DEFAULT 0,
    target_seconds INT NOT NULL DEFAULT 600,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    xp_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_activity_date UNIQUE (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_lookup ON user_daily_activity(user_id, activity_date);
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
      ('html-architecture', 'LIVE_CODE', 'HTML Architecture (The Skeletons & Hierarchy)',
       'Memahami logika "Kardus" (Container), hierarki parent-child, nesting, dan kapan harus membungkus elemen.',
       'Mulai dari teks mentah hingga struktur Profile Card. Pelajari fondasi kerangka web, tag semantik, dan nesting elemen.',
       'Pemula', 420, '3 Jam', TRUE, 1),

      ('css-basics', 'LIVE_CODE', 'CSS Basics (The Fundamentals)',
       'Menguasai Box Model, warna, tipografi, padding, margin, dan efek visual dasar.',
       'Kuasai pewarnaan background, teks, font-size, perataan, padding, margin, border, border-radius, dan bayangan box-shadow.',
       'Pemula', 450, '2.5 Jam', TRUE, 2),

      ('css-flexbox', 'LIVE_CODE', 'CSS Flexbox (The 1D Layout)', 
       'Kuasai tata letak fleksibel modern, alignment instan, dan distribusi ruang 1D.',
       'Dari aktivasi display: flex hingga trik mempusatkan elemen secara horizontal dan vertikal. Cocok untuk pemula yang ingin menguasai layouting CSS.',
       'Pemula', 550, '2.5 Jam', TRUE, 3),
      
      ('css-grid', 'LIVE_CODE', 'CSS Grid (The 2D Layout)', 
       'Bangun tata letak 2 dimensi modern, sistem bento box, dan responsive grid.',
       'Pelajari pembagian grid template columns, span, area, dan tata letak majalah digital yang rapi dan responsif di semua ukuran layar.',
       'Menengah', 500, '2.5 Jam', TRUE, 4),

      ('component-styling', 'LIVE_CODE', 'Component Styling (The Artist)', 
       'Desain komponen tombol, kartu, dan form interaktif berestetika neo-brutalist dan modern.',
       'Eksplorasi perpaduan shadow tegas, hover effects, focus rings, avatar cover, glassmorphism blur, dan E-Commerce card.',
       'Pemula', 520, '2.5 Jam', TRUE, 5),

      ('tailwind-css', 'LIVE_CODE', 'Tailwind CSS (The Modern Way)',
       'Mengkonversi pemahaman CSS murni menjadi penulisan Utility Classes standar industri.',
       'Pelajari class utilitas warna, sizer, spacing scale, flex & grid utilities, responsive breakpoint, dark mode, dan glassmorphism card.',
       'Menengah', 540, '3 Jam', TRUE, 6),

      ('js-logic-blocks', 'DRAG_DROP', 'JavaScript Logic Blocks', 
       'Latih logika pemrograman frontend dengan blok visual puzzle interaktif.',
       'Pahami kondisi if/else, perulangan for/while, dan manipulasi array secara visual tanpa takut syntax error.',
       'Pemula', 200, '2 Jam', FALSE, 7),

      ('css-selectors-quiz', 'QUIZ', 'CSS Selectors & Specificity', 
       'Tebak dan taklukkan bobot spesifisitas CSS dan pseudo-class langka.',
       'Uji pemahamanmu tentang selektor :nth-child, :has, specificity hierarchy, dan cascade inheritance.',
       'Menengah', 150, '1 Jam', FALSE, 8)

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

    // 2. Challenges Seed (HTML Architecture 12 Levels & Flexbox & Grid)
    await client.query("DELETE FROM challenges WHERE class_id IN ('html-architecture', 'css-flexbox', 'css-grid');");
    await client.query(`
      INSERT INTO challenges (
        id, class_id, title, difficulty, order_index, xp_reward, instruction, hint, theory, syntax_helpers,
        locked_template, target_visual, initial_state, validation_rules
      ) VALUES
      (
        'html-1-raw-content',
        'html-architecture',
        'Level 1: The Raw Content',
        'EASY',
        1,
        30,
        'Web dimulai dari teks mentah. Buat sebuah judul utama menggunakan tag <h1> dengan teks "Profil Saya".',
        'Ketik <h1>Profil Saya</h1> di dalam area kode.',
        'HTML adalah kerangka dasar halaman web. Tag <h1> merepresentasikan judul tingkat tertinggi (Heading 1).',
        '["<h1>Profil Saya</h1>", "<p>Profil Saya</p>", "<h3>Profil Saya</h3>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<h1>Profil Saya</h1>", "description": "Judul besar Profil Saya di bagian atas."}'::jsonb,
        '<!-- Tulis tag heading 1 di sini -->',
        '{"goals": [{"tag": "h1", "text": "Profil Saya"}]}'::jsonb
      ),
      (
        'html-2-paragraph',
        'html-architecture',
        'Level 2: The Paragraph',
        'EASY',
        2,
        30,
        'Beri penjelasan. Tambahkan tag <p> di bawah judul tadi untuk menuliskan deskripsi singkat dirimu.',
        'Tambahkan <p>Halo, ini deskripsi singkat diriku.</p> tepat di bawah tag <h1>.',
        'Tag <p> (Paragraph) digunakan untuk membungkus paragraf teks biasa.',
        '["<p>Halo, ini deskripsi singkat diriku.</p>", "<span>Deskripsi</span>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<h1>Profil Saya</h1><p>Halo, ini deskripsi singkat diriku.</p>"}'::jsonb,
        '<h1>Profil Saya</h1>\\n<!-- Tambahkan paragraf di bawah ini -->',
        '{"goals": [{"tag": "p"}]}'::jsonb
      ),
      (
        'html-3-first-box',
        'html-architecture',
        'Level 3: The First Box (Container)',
        'EASY',
        3,
        35,
        'Teksmu berserakan. Mari rapikan. Bungkus tag <h1> dan <p> tadi ke dalam sebuah kardus kosong bernama <div>. Perhatikan garis bantu di layar untuk melihat ukuran kardusmu.',
        'Gunakan <div> pembuka di atas <h1> dan </div> penutup di bawah <p>.',
        'Tag <div> (Division) adalah kontainer kosong generik yang digunakan untuk mengelompokkan elemen terkait.',
        '["<div> ... </div>", "<section> ... </section>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div><h1>Profil Saya</h1><p>Halo, ini deskripsi singkat diriku.</p></div>"}'::jsonb,
        '<h1>Profil Saya</h1>\\n<p>Halo, ini deskripsi singkat diriku.</p>',
        '{"goals": [{"tag": "div", "children": ["h1", "p"]}]}'::jsonb
      ),
      (
        'html-4-siblings',
        'html-architecture',
        'Level 4: The Siblings (Kakak Beradik)',
        'EASY',
        4,
        35,
        'Buat dua kelompok informasi yang sejajar. Buat dua buah <div> yang diletakkan atas dan bawah (bukan di dalam satu sama lain). Isi masing-masing dengan teks bebas.',
        'Buat <div>Bagian Atas</div> lalu di bawahnya buat <div>Bagian Bawah</div>.',
        'Elemen Sibling adalah elemen-elemen yang berada pada tingkatan hierarki yang sama di bawah parent yang sama.',
        '["<div>Atas</div>\\n<div>Bawah</div>", "<div><div>Nesting</div></div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div>Bagian Atas</div><div>Bagian Bawah</div>"}'::jsonb,
        '<!-- Buat dua div sejajar di sini -->',
        '{"goals": [{"count": 2, "tag": "div"}]}'::jsonb
      ),
      (
        'html-5-matryoshka',
        'html-architecture',
        'Level 5: The Matryoshka (Nesting)',
        'EASY',
        5,
        40,
        'Ini adalah rahasia layout rapi: Kardus di dalam kardus! Buat satu <div> utama (Parent), lalu di dalamnya buat dua <div> (Child) untuk memisahkan area "Foto" dan "Teks".',
        'Bungkus dua <div> di dalam satu <div> pembungkus utama.',
        'Nesting adalah teknik menempatkan elemen HTML di dalam elemen lain untuk membangun hierarki pohon DOM.',
        '["<div>\\n  <div>Foto</div>\\n  <div>Teks</div>\\n</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div><div>Foto</div><div>Teks</div></div>"}'::jsonb,
        '<!-- Buat parent div dan dua child div di sini -->',
        '{"goals": [{"nesting": "parent-with-two-children"}]}'::jsonb
      ),
      (
        'html-6-image-element',
        'html-architecture',
        'Level 6: The Image Element',
        'EASY',
        6,
        35,
        'Tampilkan gambar menggunakan tag <img>. Ingat, tag ini spesial karena tidak butuh penutup (self-closing). Jangan lupa tambahkan atribut src.',
        'Gunakan <img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150\" alt=\"Avatar\" />',
        'Tag <img> bersifat self-closing / void element dan memuat atribut wajib src dan atribut alt untuk aksesibilitas.',
        '["<img src=\\"...\\" alt=\\"Avatar\\" />", "<image>...</image>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<img src=\\"avatar.jpg\\" />"}'::jsonb,
        '<!-- Tampilkan gambar dengan tag img -->',
        '{"goals": [{"tag": "img", "hasAttr": "src"}]}'::jsonb
      ),
      (
        'html-7-action-button',
        'html-architecture',
        'Level 7: The Action (Button)',
        'EASY',
        7,
        35,
        'Tambahkan tombol interaktif. Gunakan tag <button> dan beri teks "Follow" di dalamnya.',
        'Ketik <button>Follow</button>.',
        'Tag <button> merepresentasikan elemen tombol aksi yang dapat diklik oleh pengguna.',
        '["<button>Follow</button>", "<input type=\\"button\\" value=\\"Follow\\" />"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<button>Follow</button>"}'::jsonb,
        '<!-- Buat tombol aksi di sini -->',
        '{"goals": [{"tag": "button", "text": "Follow"}]}'::jsonb
      ),
      (
        'html-8-link',
        'html-architecture',
        'Level 8: The Link',
        'EASY',
        8,
        35,
        'Buat teks yang bisa diklik. Gunakan tag <a> (Anchor) dengan atribut href untuk mengarahkan pengguna ke halaman lain.',
        'Gunakan <a href=\"https://codevas.dev\">Kunjungi Website</a>.',
        'Tag <a> (Anchor) menghubungkan dokumen web dengan URL tujuan melalui atribut href.',
        '["<a href=\\"https://codevas.dev\\">Website</a>", "<link href=\\"...\\">"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<a href=\\"#\\">Kunjungi Profil</a>"}'::jsonb,
        '<!-- Buat link anchor di sini -->',
        '{"goals": [{"tag": "a", "hasAttr": "href"}]}'::jsonb
      ),
      (
        'html-9-list-hierarchy',
        'html-architecture',
        'Level 9: The List Hierarchy',
        'EASY',
        9,
        40,
        'Membuat daftar bukan sekadar teks berjejer. Buat daftar hobi menggunakan hierarki yang benar: satu pembungkus <ul>, dan beberapa item <li> di dalamnya.',
        'Bungkus tag <li> di dalam <ul>.',
        'Tag <ul> (Unordered List) membutuhkan elemen <li> (List Item) sebagai anak langsungnya.',
        '["<ul>\\n  <li>Coding</li>\\n  <li>Design</li>\\n</ul>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<ul><li>Coding</li><li>Gaming</li></ul>"}'::jsonb,
        '<!-- Buat list bertingkat ul dan li di sini -->',
        '{"goals": [{"tag": "ul", "childTag": "li"}]}'::jsonb
      ),
      (
        'html-10-semantic-touch',
        'html-architecture',
        'Level 10: The Semantic Touch',
        'MEDIUM',
        10,
        45,
        'Kadang kita butuh kardus yang lebih punya makna ketimbang <div> biasa. Gunakan tag <section> untuk membungkus sebuah blok konten besar.',
        'Gunakan <section> ... </section> sebagai pembungkus utama.',
        'Tag semantik seperti <section>, <article>, <header>, dan <footer> memberi makna pada struktur dokumen untuk SEO dan aksesibilitas.',
        '["<section> ... </section>", "<article> ... </article>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<section><h2>Tentang Saya</h2><p>Konten...</p></section>"}'::jsonb,
        '<!-- Ganti atau bungkus dengan tag section -->',
        '{"goals": [{"tag": "section"}]}'::jsonb
      ),
      (
        'html-11-form-wrapper',
        'html-architecture',
        'Level 11: The Form Wrapper',
        'MEDIUM',
        11,
        45,
        'Kumpulkan input dari pengguna. Buat tag <form>, lalu masukkan <input> dan <button> ke dalamnya. Ini adalah hierarki standar untuk pengiriman data.',
        'Bungkus <input placeholder=\"Email...\" /> dan <button>Kirim</button> di dalam tag <form>.',
        'Tag <form> adalah wadah untuk kontrol formulir interaktif (input, select, textarea, button).',
        '["<form>\\n  <input placeholder=\\"Nama\\" />\\n  <button>Kirim</button>\\n</form>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<form><input /><button>Kirim</button></form>"}'::jsonb,
        '<!-- Buat formulir di sini -->',
        '{"goals": [{"tag": "form", "contains": ["input", "button"]}]}'::jsonb
      ),
      (
        'html-12-boss-card',
        'html-architecture',
        'Level 12: Boss Fight - The Card Structure',
        'BOSS_FIGHT',
        12,
        60,
        'Ujian kerangka! Bangun hierarki untuk sebuah "Profile Card". Kamu butuh satu <div> Parent utama. Di dalamnya ada <img/>, lalu sebuah <div> Child pembungkus untuk membungkus <h2> (Nama), <p> (Bio), dan <button> (Aksi). Jangan sampai salah memasukkan kotak!',
        'Struktur: <div> utama -> <img/> dan <div> pembungkus teks (di dalamnya ada <h2>, <p>, dan <button>).',
        'Boss Fight menguji pemahaman nesting multi-level yang merupakan arsitektur dasar semua kartu komponen antarmuka web modern.',
        '["<div>\\n  <img src=\\"avatar.jpg\\" />\\n  <div>\\n    <h2>Nama</h2>\\n    <p>Bio</p>\\n    <button>Follow</button>\\n  </div>\\n</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\\"card\\"><img src=\\"...\\" /><div><h2>Alex</h2><p>Frontend Dev</p><button>Follow</button></div></div>"}'::jsonb,
        '<!-- Bangun kerangka Profile Card di sini -->',
        '{"goals": [{"bossCardHierarchy": true}]}'::jsonb
      ),
      (
        'flexbox-1-activation',
        'css-flexbox',
        'Level 1: Rapatkan 3 Permen ke Titik Tengah',
        'EASY',
        1,
        50,
        'Tiga kotak permen saat ini berantakan dan menumpuk secara vertikal di pojok kiri atas. Tugasmu adalah membuat ketiga permen tersebut berbaris rapi secara horizontal dan berada tepat di tengah-tengah kotak arena!',
        'Gunakan display: flex; lalu tambahkan justify-content: center; dan align-items: center; untuk memposisikannya di tengah.',
        'CSS Flexbox (Flexible Box Layout) dirancang untuk menyusun elemen secara fleksibel dalam 1 dimensi. Mengaktifkan display: flex; pada kontainer mengubah anak-anaknya menjadi flex items. Gunakan justify-content: center untuk perataan sumbu utama (horizontal), dan align-items: center untuk perataan sumbu silang (vertikal).',
        '["display: flex", "justify-content: center", "align-items: center"]'::jsonb,
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
        'justify-content: space-between; mendistribusikan elemen pertama di ujung awal (paling kiri) dan elemen terakhir di ujung akhir (paling kanan), dengan ruang sela tersisa dibagi rata secara presisi di antara elemen-elemen tersebut.',
        '["display: flex", "justify-content: space-between", "align-items: center"]'::jsonb,
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
        'justify-content: space-around; memberikan ruang sela sama rata di sekeliling tiap elemen, sehingga elemen paling pinggir memiliki separuh ruang dibanding ruang di antara dua elemen. Anda juga bisa menggunakan space-evenly untuk jarak yang benar-benar identik di semua sisi.',
        '["justify-content: space-around", "justify-content: space-evenly", "align-items: center"]'::jsonb,
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
        'Kombinasi justify-content: flex-end; dan align-items: flex-end; memindahkan seluruh flex item ke sudut akhir (kanan-bawah) kontainer. Dalam CSS modern, nilai end juga diterima sebagai padanan standar.',
        '["justify-content: flex-end", "align-items: flex-end"]'::jsonb,
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
        'flex-direction menentukan arah sumbu utama (main axis). Nilai default-nya adalah row (horizontal). Mengubahnya menjadi column akan membalikkan sumbu sehingga elemen tersusun vertikal dari atas ke bawah. Saat column aktif, align-items mengontrol posisi horizontal!',
        '["flex-direction: column", "align-items: center", "justify-content: center"]'::jsonb,
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
        'flex-direction: column-reverse; menyusun elemen secara vertikal dari bawah ke atas, membalikkan urutan visual elemen tanpa perlu mengubah struktur HTML asli.',
        '["flex-direction: column-reverse", "justify-content: center"]'::jsonb,
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
        'Secara default, flex items akan dipaksa dalam satu baris (nowrap) dan bisa meluap (overflow). Properti flex-wrap: wrap; mengizinkan elemen berpindah ke baris baru saat lebar kontainer tidak lagi mencukupi. Gunakan gap untuk jarak antar baris dan kolom yang konsisten.',
        '["flex-wrap: wrap", "gap: 16px", "justify-content: center"]'::jsonb,
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
        'align-self memungkinkan satu flex item tertentu menimpa (override) aturan align-items dari kontainer induknya. Properti ini diterapkan langsung pada elemen anak (misalnya .permen-2), bukan pada .arena.',
        '[".permen-2", "align-self: flex-end", "align-self: center"]'::jsonb,
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
        'Properti order mengontrol urutan visual flex item. Semua item memiliki order default 0. Memberikan nilai negatif (seperti order: -1) membuat item tersebut tampil lebih dulu dari item lainnya tanpa mengubah urutan di berkas HTML.',
        '[".permen-3", "order: -1", "order: 1"]'::jsonb,
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
        'Tantangan Terakhir: Desain Bento Box responsif menggabungkan display: flex, flex-wrap: wrap, justify-content: space-between, dan gap. Pendekatan ini adalah pondasi membangun kartu dashboard modern di industri frontend.',
        '["display: flex", "flex-wrap: wrap", "justify-content: space-between", "gap: 16px"]'::jsonb,
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
        'CSS Grid Layout adalah sistem tata letak 2 dimensi (baris dan kolom). grid-template-columns: repeat(2, 1fr) membagi kontainer menjadi 2 kolom dengan lebar pecahan proporsional yang sama (1 fraction unit).',
        '["display: grid", "grid-template-columns: repeat(2, 1fr)", "gap: 16px"]'::jsonb,
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
        theory = EXCLUDED.theory,
        syntax_helpers = EXCLUDED.syntax_helpers,
        locked_template = EXCLUDED.locked_template,
        target_visual = EXCLUDED.target_visual,
        initial_state = EXCLUDED.initial_state,
        validation_rules = EXCLUDED.validation_rules;
    `);

    // 3. Demo Admin, Demo User, and community learners with valid scrypt password hashes
    await client.query(`
      INSERT INTO users (id, username, email, password_hash, full_name, avatar_url, xp_points, level, streak_days, role) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@codevas.dev', 'ce1e3db0de863737e9547e6bf2ac6b3f:fa55da04dbd25678f9a048fcd10ede681fa79cfe0b9bd9f17f07a21ca79da925ff0e2bba4c4ff284cadbde68fa22d7078201edf0875c4d2e352110ac9cad767a', 'Super Admin Codevas', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminCodevas', 1250, 5, 7, 'ADMIN'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'demo', 'demo@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Alex Demo Developer', 'https://api.dicebear.com/7.x/bottts/svg?seed=alex_coder', 340, 3, 3, 'USER'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'nadia_rahma', 'nadia@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Nadia Rahma', 'https://api.dicebear.com/7.x/bottts/svg?seed=NadiaRahma', 680, 4, 14, 'USER'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'budi_coder', 'budi@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Budi Santoso', 'https://api.dicebear.com/7.x/bottts/svg?seed=BudiSantoso', 520, 4, 9, 'USER'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'rian_dev', 'rian@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Rian Pratama', 'https://api.dicebear.com/7.x/bottts/svg?seed=RianPratama', 280, 3, 5, 'USER'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'citra_web', 'citra@codevas.dev', 'e21bf3d3089df63c05719504159d8f24:6148be768b1f4cf4da80cbe90b4c0715229f910eb6ee70cfff4d8f6740d0aa363a2f09fd8c6844460f11641c589c62147ccdce9346917a9e247dde65d092c62f', 'Citra Lestari', 'https://api.dicebear.com/7.x/bottts/svg?seed=CitraLestari', 190, 2, 4, 'USER')
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        xp_points = EXCLUDED.xp_points,
        level = EXCLUDED.level,
        streak_days = EXCLUDED.streak_days,
        role = EXCLUDED.role;
    `);

    // Initial XP Transactions for learners
    await client.query(`
      INSERT INTO xp_transactions (user_id, amount, source, reference_id, description) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1250, 'ADMIN_GRANT', 'system_init', 'Bonus setup awal akun Super Admin'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 50, 'REGISTER_BONUS', 'welcome', 'Bonus selamat datang registrasi akun'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 290, 'CHALLENGE_COMPLETE', 'flexbox-1-activation', 'Menyelesaikan tantangan kurikulum Codevas'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 680, 'CHALLENGE_COMPLETE', 'html-architecture', 'Menyelesaikan materi HTML & CSS'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 520, 'CHALLENGE_COMPLETE', 'css-flexbox', 'Menyelesaikan modul Flexbox'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 280, 'CHALLENGE_COMPLETE', 'css-flexbox', 'Menyelesaikan tantangan CSS'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 190, 'CHALLENGE_COMPLETE', 'html-architecture', 'Menyelesaikan tantangan HTML')
      ON CONFLICT DO NOTHING;
    `);

    // 4. Enroll Demo User to HTML Architecture and CSS Flexbox
    await client.query(`
      INSERT INTO user_enrollments (id, user_id, class_id, status) VALUES
      ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'css-flexbox', 'ACTIVE'),
      ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'html-architecture', 'ACTIVE')
      ON CONFLICT (user_id, class_id) DO UPDATE SET status = 'ACTIVE';
    `);

    // 5. User Progress (Level 1 completed, Level 2 in progress)
    await client.query(`
      INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot) VALUES
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-1-activation', 'COMPLETED', '.arena {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-2-space-between', 'IN_PROGRESS', '.arena {\n  display: flex;\n  /* Lengkapi agar terpisah ke kedua ujung */\n}'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'html-1-raw-content', 'IN_PROGRESS', '<!-- Tulis tag heading 1 di sini -->')
      ON CONFLICT (user_id, challenge_id) DO UPDATE SET
        status = EXCLUDED.status,
        code_snapshot = EXCLUDED.code_snapshot;
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
    console.log('\n✨ Database is 100% updated with full 10 levels for CSS Flexbox Mastery!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Database setup failed:', err);
  process.exit(1);
});
