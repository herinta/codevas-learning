-- Codevas Full Database Initialization Script for Docker / PostgreSQL 16

-- Auto-executed by /docker-entrypoint-initdb.d on container startup

-- Synchronized with scripts/setup-db.mjs



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
    age_group VARCHAR(20),
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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='age_group') THEN
        ALTER TABLE users ADD COLUMN age_group VARCHAR(20);
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

-- Alter classes if columns missing (idempotent migration)
DO $$
BEGIN
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
END $$;

-- 4. Table: challenges
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(60) PRIMARY KEY,
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'ADVANCED', 'EXPERT', 'BOSS_FIGHT')),
    order_index INT NOT NULL CHECK (order_index > 0),
    xp_reward INT NOT NULL DEFAULT 20,
    instruction TEXT NOT NULL,
    hint TEXT,
    theory TEXT,
    concept_demo JSONB,
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
    ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_difficulty_check;
    ALTER TABLE challenges ADD CONSTRAINT challenges_difficulty_check CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'ADVANCED', 'EXPERT', 'BOSS_FIGHT'));
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='theory') THEN
        ALTER TABLE challenges ADD COLUMN theory TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='challenges' AND column_name='concept_demo') THEN
        ALTER TABLE challenges ADD COLUMN concept_demo JSONB;
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



INSERT INTO classes (id, category, title, tagline, description, difficulty_level, xp_reward, estimated_time, is_published, order_index) VALUES
      ('html-architecture', 'LIVE_CODE', 'HTML Architecture (The Skeletons & Hierarchy)',
       'Memahami logika "Kardus" (Container), hierarki parent-child, nesting, dan kapan harus membungkus elemen.',
       'Pondasi logika kontainer web: pahami hierarki parent-child, teknik membungkus div (kardus dalam kardus), elemen self-closing, tautan, list, hingga semantik sebelum ditata oleh CSS.',
       'Pemula', 920, '4 Jam', TRUE, 1),

      ('css-basics', 'LIVE_CODE', 'CSS Basics (The Fundamentals)',
       'Kuasai Box Model, warna, tipografi, padding, margin, border, dan bayangan neo-brutalisme dari kanvas dasar.',
       'Fondasi mutlak desain visual: kuasai Box Model, warna kanvas, tinta teks, tipografi terstruktur, padding, margin, border, box-sizing, hingga transformasi & bayangan elevasi melalui 20 level tantangan interaktif.',
       'Pemula', 920, '4 Jam', TRUE, 2),

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

DELETE FROM challenges WHERE class_id IN ('html-architecture', 'css-basics', 'css-flexbox', 'css-grid');


INSERT INTO challenges (
        id, class_id, title, difficulty, order_index, xp_reward, instruction, hint, theory, syntax_helpers,
        locked_template, target_visual, initial_state, validation_rules
      ) VALUES
      (
        'html-1-raw-content',
        'html-architecture',
        'Level 1: The Raw Canvas & Floating Elements',
        'EASY',
        1,
        30,
        'Website portofolio dimulai dari identitas dirimu! Buat judul utama menggunakan tag <h1> bertuliskan "Profil Developer", lalu tambahkan data pribadimu menggunakan tag <p> untuk Nama dan Umur kamu. Perhatikan format kode pada editor acuan di bawah!',
        'Ketik <h1>Profil Developer</h1> lalu di bawahnya tambahkan tag <p> untuk Nama dan Umur kamu (perhatikan format contoh kode di bawah).',
        'HTML adalah kerangka dasar halaman web. Tag <h1> merepresentasikan judul tingkat tertinggi, sedangkan tag <p> digunakan untuk memuat data teks paragraf seperti nama dan usia.',
        '["<h1>Profil Developer</h1>", "<p>Nama: Alex Coder</p>", "<p>Umur: 16 Tahun</p>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<h1>Profil Developer</h1>\n<p>Nama: Alex Coder</p>\n<p>Umur: 16 Tahun</p>","description":"Judul besar Profil Developer di bagian atas diikuti nama dan umur.","concept_demo":{"conceptTitle":"Kerangka Dasar: Judul (h1) & Paragraf (p)","whyItMatters":"HTML adalah fondasi dasar setiap halaman web. Tag <h1> digunakan untuk judul utama dokumen (Heading 1), sedangkan tag <p> (Paragraph) digunakan untuk teks informasi seperti nama dan umur.","whatIfWithout":"Tanpa tag HTML, browser akan menampilkan teks polos bertumpuk tanpa hierarki judul atau batas paragraf semantik.","visualComparison":{"withoutLabel":"Teks Polos Melayang","withoutDesc":"Teks tercampur baur tanpa judul yang tegas dan tanpa pemisah baris terstruktur.","withLabel":"Struktur Semantik (h1 + p)","withDesc":"Judul utama menonjol tebal di atas, diikuti informasi nama dan umur yang rapi di bawahnya."},"codeExample":"<h1>Profil Developer</h1>\n<p>Nama: Alex Coder</p>\n<p>Umur: 16 Tahun</p>","keyTakeaways":["<h1> merepresentasikan judul tingkat tertinggi pada sebuah halaman.","<p> digunakan untuk membungkus satu paragraf teks data.","Kamu bebas mengganti teks nama dan umur sesuai identitasmu sendiri."]}}'::jsonb,
        '<!-- Tulis judul h1 \"Profil Developer\" dan data nama & umurmu dengan tag p di sini -->',
        '{"goals": [{"tag": "h1", "text": "Profil Developer"}, {"tag": "p", "text": "Nama:"}, {"tag": "p", "text": "Umur:"}]}'::jsonb
      ),
      (
        'html-2-first-box',
        'html-architecture',
        'Level 2: The First Container (Kardus Pertama)',
        'EASY',
        2,
        30,
        'Teks biodatamu saat ini melayang bebas di kanvas tanpa batas tepi. Mari satukan! Bungkus seluruh teks profilmu ke dalam satu kardus generik pertama menggunakan tag <div> ... </div>. Perhatikan garis batas bantu di layar yang kini menyatukan teksmu dalam satu kotak!',
        'Gunakan <div> di bagian paling atas dan </div> di bagian paling bawah untuk membungkus semuanya.',
        'Tag <div> (Division) adalah elemen pembungkus generik (kardus transparan). Mengelompokkan seluruh elemen terkait ke dalam satu <div> adalah langkah pertama agar elemen dapat dipindahkan bersamaan, diberi latar belakang, atau ditata oleh CSS.',
        '["<div>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<div><h1>Profil Developer</h1><p>Nama: Alex Coder</p><p>Umur: 16 Tahun</p></div>","description":"Kontainer div membungkus seluruh teks profil.","concept_demo":{"conceptTitle":"Filosofi Kardus: Kenapa Harus Dibungkus <div>?","whyItMatters":"Tag <div> adalah kotak pembungkus generik (kontainer). Tanpa pembungkus, elemen teks mengambang bebas di layar tanpa batas tepi. Dengan membungkus elemen ke dalam <div>, kita menciptakan satu kesatuan unit yang kokoh sehingga dapat diposisikan bersamaan, diberi warna latar, padding, border, dan ditata oleh CSS.","whatIfWithout":"Jika tidak dibungkus, setiap elemen melayang mandiri. Ketika kamu ingin memindahkan profil ke tengah atau memberi background kartu, kamu terpaksa memindahkannya satu-persatu dan background-nya akan terputus-putus!","visualComparison":{"withoutLabel":"Tanpa Pembungkus (Melayang Bebas)","withoutDesc":"Teks judul dan biodata tercecer di kanvas tanpa batas tepi yang menyatukan mereka.","withLabel":"Dengan Pembungkus <div> (Satu Kesatuan)","withDesc":"Seluruh elemen profil menyatu dalam satu kotak kokoh yang siap didekorasi dan digeser bersamaan."},"codeExample":"<div>\n  <h1>Profil Developer</h1>\n  <p>Nama: Alex Coder</p>\n  <p>Umur: 16 Tahun</p>\n</div>","keyTakeaways":["<div> berfungsi sebagai wadah/container tak terlihat.","Semua elemen di dalam <div> menjadi satu kesatuan anak (children).","Langkah pertama sebelum mendesain dengan CSS adalah membungkus elemen terkait ke dalam <div>."]}}'::jsonb,
        '<h1>Profil Developer</h1>\n<p>Nama: Alex Coder</p>\n<p>Umur: 16 Tahun</p>',
        '{"goals": [{"tag": "div", "enclosed": true}]}'::jsonb
      ),
      (
        'html-3-named-container',
        'html-architecture',
        'Level 3: The Named Box (Identitas Kontainer)',
        'EASY',
        3,
        35,
        'Kardus polos tanpa label sulit dibedakan jika ada banyak kotak di web. Berikan identitas pada kardusmu! Tambahkan atribut class bernama "profile-card" pada tag div pembungkus (<div class=\"profile-card\">). Nama class inilah yang menjadi alamat bagi CSS untuk memberi warna dan dekorasi.',
        'Ubah <div> menjadi <div class=\"profile-card\">.',
        'Atribut class adalah identifier yang disematkan pada tag HTML untuk mengelompokkan elemen dengan gaya atau perilaku serupa, dan menjadi jembatan utama antara kerangka HTML dan stylesheet CSS.',
        '["<div class=\"profile-card\">", "class=\"profile-card\""]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"profile-card\"><h1>Profil Developer</h1><p>Nama: Alex Coder</p><p>Umur: 16 Tahun</p></div>", "description": "Kontainer div dengan class profile-card."}'::jsonb,
        '<!-- Tambahkan atribut class=\"profile-card\" pada tag <div> pembungkus di bawah ini -->\n<div>\n  <h1>Profil Developer</h1>\n  <p>Nama: Alex Coder</p>\n  <p>Umur: 16 Tahun</p>\n</div>',
        '{"goals": [{"tag": "div", "class": "profile-card"}]}'::jsonb
      ),
      (
        'html-4-siblings',
        'html-architecture',
        'Level 4: The Siblings (Dua Kardus Bersaudara)',
        'EASY',
        4,
        35,
        'Kartu profilmu membutuhkan kartu pelengkap: Kartu Catatan Pengembang! Buat dua buah <div> bersaudara (sejajar atas-bawah, bukan di dalam satu sama lain). Kontainer pertama <div class=\"profile-card\"> berisi biodatamu, dan di bawahnya buat kontainer kedua <div class=\"notes-card\"> yang berisi judul <h3>Catatan Belajar</h3> dan <p>Fokus mendalami arsitektur web modern.</p>. Tuliskan catatan belajarmu sendiri!',
        'Buat <div class=\"notes-card\"><h3>Catatan Belajar</h3><p>Catatan: Sedang mendalami arsitektur web modern!</p></div> tepat setelah penutup </div> kartu profil pertama.',
        'Elemen Siblings adalah elemen yang berada pada tingkatan hierarki sejajar (berdampingan) dan berbagi parent yang sama, bukan saling bersarang (nested) di dalam satu sama lain.',
        '["<div class=\"notes-card\">", "<h3>Catatan Belajar</h3>", "<p>Fokus Arsitektur Web</p>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<div class=\"profile-card\"><h1>Profil Developer</h1></div><div class=\"notes-card\"><h3>Catatan Belajar</h3><p>Fokus Belajar</p></div>","description":"Dua div sejajar berdampingan.","concept_demo":{"conceptTitle":"Hierarki Bersaudara (Siblings vs Nesting)","whyItMatters":"Dalam arsitektur web, tidak semua elemen harus dimasukkan ke dalam wadah yang sama. Ketika dua bagian memiliki tujuan berbeda (misal: Kartu Profil dan Kartu Catatan), keduanya harus berdiri berdampingan sebagai saudara (siblings), bukan dimasukkan ke dalam satu sama lain.","whatIfWithout":"Jika kartu catatan dimasukkan ke dalam kartu profil, catatan tersebut akan mewarisi semua batasan dan styling kartu profil, sehingga struktur tata letak menjadi kacau dan sulit dipisah di masa depan.","visualComparison":{"withoutLabel":"Salah Bersarang (Over-nesting)","withoutDesc":"Catatan tertimbun di dalam profil, membatasi fleksibilitas layout.","withLabel":"Sejajar Bersaudara (Clean Siblings)","withDesc":"Dua kartu mandiri yang dapat disusun atas-bawah atau kiri-kanan dengan leluasa."},"codeExample":"<div class=\"profile-card\">\n  <h1>Profil Developer</h1>\n  <p>Nama: Alex Coder</p>\n</div>\n<div class=\"notes-card\">\n  <h3>Catatan Belajar</h3>\n  <p>Fokus arsitektur web.</p>\n</div>","keyTakeaways":["Elemen siblings berbagi parent yang sama dan berada di level hierarki sejajar.","Gunakan penutup </div> sebelum memulai kontainer baru untuk bagian terpisah."]}}'::jsonb,
        '<!-- Kardus 1: Profile Card -->\n<div class=\"profile-card\">\n  <h1>Profil Developer</h1>\n  <p>Nama: Alex Coder</p>\n</div>\n\n<!-- Buat Kardus 2 (Sibling): <div class=\"notes-card\"> berisi <h3> dan <p> di bawah ini -->',
        '{"goals": [{"count": 2, "tag": "div"}, {"class": "notes-card"}]}'::jsonb
      ),
      (
        'html-5-triple-stack',
        'html-architecture',
        'Level 5: The Triple Stack (Tiga Zona Vertikal)',
        'EASY',
        5,
        35,
        'Bagi halaman webmu menjadi tiga zona vertikal mandiri! Buat 3 buah <div> bertumpuk: <div class=\"top-bar\"> (berisi judul situs <h2>Codevas Portfolio</h2>), <div class=\"content-area\"> (berisi paragraf cerita atau minat kodingmu), dan <div class=\"bottom-bar\"> (berisi teks hak cipta <p>&copy; 2026 Developer</p>). Tuliskan ceritamu sendiri!',
        'Buat 3 tag div bertumpuk dengan class top-bar, content-area, dan bottom-bar.',
        'Memisahkan halaman ke dalam 3 zona utama (Header Bar, Content Area, Footer Bar) menggunakan kontainer terpisah adalah pola dasar arsitektur web modern.',
        '["<div class=\"top-bar\">", "<div class=\"content-area\">", "<div class=\"bottom-bar\">", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"top-bar\"><h2>Codevas</h2></div><div class=\"content-area\"><p>Cerita koding...</p></div><div class=\"bottom-bar\"><p>&copy; 2026</p></div>", "description": "Tiga zona vertikal bertumpuk."}'::jsonb,
        '<!-- Buat 3 kardus bertumpuk vertikal: <div class=\"top-bar\">, <div class=\"content-area\">, dan <div class=\"bottom-bar\"> -->',
        '{"goals": [{"class": "top-bar"}, {"class": "content-area"}, {"class": "bottom-bar"}]}'::jsonb
      ),
      (
        'html-6-matryoshka',
        'html-architecture',
        'Level 6: The Matryoshka (Nesting Kolom Ganda)',
        'MEDIUM',
        6,
        40,
        'Inilah rahasia layout 2 kolom: Kardus di dalam kardus! Di dalam satu <div class=\"card\"> utama (Parent), buat dua buah <div> anak (Child): <div class=\"avatar-box\"> (untuk area foto) dan <div class=\"info-box\"> (untuk nama dan peranmu). Di dalam info-box, tuliskan namamu dan peranmu.',
        'Bungkus <div class=\"avatar-box\">Area Foto</div> dan <div class=\"info-box\">...</div> di dalam <div class=\"card\">.',
        'Pola Parent container yang membungkus Child containers (Nesting) adalah syarat mutlak untuk tata letak multi-kolom di CSS.',
        '["<div class=\"card\">", "<div class=\"avatar-box\">Area Foto</div>", "<div class=\"info-box\">\\n  <h2>Alex Coder</h2>\\n  <p>Frontend Developer</p>\\n</div>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<div class=\"card\"><div class=\"avatar-box\">Area Foto</div><div class=\"info-box\"><h2>Alex Coder</h2><p>Frontend Developer</p></div></div>","description":"Parent card membungkus dua child div.","concept_demo":{"conceptTitle":"Prinsip Matryoshka: Nesting Kolom Ganda","whyItMatters":"Untuk membuat layout dua kolom (kiri avatar, kanan info biodata), kita butuh 1 parent pembungkus utama dan 2 child pembungkus di dalamnya. Inilah pola arsitektur paling fundamental dalam web modern.","whatIfWithout":"Tanpa parent luar, dua kolom tidak tahu bahwa mereka satu kartu. Tanpa pembungkus child masing-masing, foto avatar dan teks akan bercampur baur dan CSS tidak bisa menatanya berdampingan.","visualComparison":{"withoutLabel":"Kolom Tercampur Baur","withoutDesc":"Foto dan teks saling menabrak tanpa batasan kolom yang jelas.","withLabel":"Parent + 2 Kolom Child","withDesc":"Kolom avatar dan kolom teks terisolasi rapi di dalam 1 wadah kartu."},"codeExample":"<div class=\"card\">\n  <div class=\"avatar-box\">\n    <p>[Avatar]</p>\n  </div>\n  <div class=\"info-box\">\n    <h3>Alex Coder</h3>\n  </div>\n</div>","keyTakeaways":["Parent mengendalikan orientasi tata letak (arah baris/kolom).","Child mengendalikan konten masing-masing kolom."]}}'::jsonb,
        '<!-- Buat 1 div parent class=\"card\", lalu di dalamnya buat 2 div child: avatar-box & info-box -->',
        '{"goals": [{"parent": "card", "children": ["avatar-box", "info-box"]}]}'::jsonb
      ),
      (
        'html-7-avatar-frame',
        'html-architecture',
        'Level 7: The Frame (Div Pembungkus Media)',
        'MEDIUM',
        7,
        40,
        'Jangan biarkan gambar berdiri telanjang tanpa perlindungan! Di dunia profesional, elemen <img> selalu dibungkus oleh <div> bingkai khusus (Frame) agar ukurannya tidak meluap dan mudah dibulatkan oleh CSS. Di dalam <div class=\"avatar-frame\">, letakkan tag <img> dengan atribut src dan alt foto profilmu!',
        'Bungkus tag <img src=\"...\" alt=\"Foto Profil\" /> di dalam <div class=\"avatar-frame\"> ... </div>.',
        'Tag <img> bersifat self-closing / void element dan memuat atribut src untuk sumber file serta alt untuk deskripsi aksesibilitas. Membungkusnya dengan frame div mencegah pergeseran tata letak (CLS - Cumulative Layout Shift).',
        '["<div class=\"avatar-frame\">", "<img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150\" alt=\"Foto Profil\" />", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"card\"><div class=\"avatar-frame\"><img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150\" alt=\"Avatar\" /></div><div class=\"info-box\"><h2>Alex Coder</h2><p>Junior Web Developer</p></div></div>", "description": "Foto profil di dalam avatar-frame div."}'::jsonb,
        '<div class=\"card\">\n  <!-- Bungkus foto profil dengan <div class=\"avatar-frame\"> di sini -->\n  <div class=\"avatar-frame\">\n    <img src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150\" alt=\"Avatar Alex\" />\n  </div>\n  <div class=\"info-box\">\n    <h2>Alex Coder</h2>\n    <p>Junior Web Developer</p>\n  </div>\n</div>',
        '{"goals": [{"class": "avatar-frame", "contains": "img"}]}'::jsonb
      ),
      (
        'html-8-card-anatomy',
        'html-architecture',
        'Level 8: Card Anatomy (Header & Body Div)',
        'MEDIUM',
        8,
        40,
        'Bedah anatomi kartu profesional! Di dalam satu <div class=\"card\">, pisahkan konten menjadi dua wadah kardus teratur: <div class=\"card-header\"> (berisi foto dan judul) dan <div class=\"card-body\"> (berisi paragraf bio cerita dirimu). Tuliskan ceritamu sendiri!',
        'Buat <div class=\"card-header\">...</div> lalu di bawahnya buat <div class=\"card-body\">...</div> di dalam <div class=\"card\">.',
        'Memisahkan kartu menjadi Card Header dan Card Body adalah standar komponen UI (seperti Bootstrap, Tailwind UI, atau Chakra UI).',
        '["<div class=\"card-header\">", "<div class=\"card-body\">", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"card\"><div class=\"card-header\"><h2>Alex Coder</h2></div><div class=\"card-body\"><p>Cerita koding...</p></div></div>", "description": "Pemisahan card-header dan card-body."}'::jsonb,
        '<div class=\"card\">\n  <!-- Pisahkan menjadi <div class=\"card-header\"> dan <div class=\"card-body\"> -->\n</div>',
        '{"goals": [{"class": "card-header"}, {"class": "card-body"}]}'::jsonb
      ),
      (
        'html-9-action-row',
        'html-architecture',
        'Level 9: The Action Row (Kardus Tombol Aksi)',
        'EASY',
        9,
        40,
        'Tombol interaksi yang tercecer sulit dirapikan jaraknya. Kelompokkan tombol interaksimu ke dalam satu baris kardus pembungkus <div class=\"action-row\">. Di dalamnya, masukkan minimal 2 tag <button> (tombol "Follow" dan "Kirim Pesan" atau tombol lainnya). Bebas tentukan label tombolmu!',
        'Bungkus minimal dua tombol <button> di dalam <div class=\"action-row\"> ... </div>.',
        'Action row (atau button group) membungkus beberapa tombol aksi agar dapat disejajarkan ke kanan, ke tengah, atau diberi jarak sela (gap) secara seragam di CSS.',
        '["<div class=\"action-row\">", "<button>Follow</button>", "<button>Kirim Pesan</button>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"action-row\"><button>Follow</button><button>Kirim Pesan</button></div>", "description": "Baris aksi pembungkus tombol."}'::jsonb,
        '<div class=\"card\">\n  <div class=\"card-body\">\n    <h3>Alex Coder</h3>\n    <p>Web Developer antusias.</p>\n    <!-- Bungkus 2 tombol <button> ke dalam <div class=\"action-row\"> di bawah ini -->\n  </div>\n</div>',
        '{"goals": [{"class": "action-row", "minButtons": 2}]}'::jsonb
      ),
      (
        'html-10-badge-overlay',
        'html-architecture',
        'Level 10: The Badge Pill (Label Kategori & Tag Profesi)',
        'EASY',
        10,
        40,
        'Berikan label spesialisasi atau tag peran pada profil! Buat kontainer mini berbentuk badge: <div class=\"badge-role\">Frontend Developer</div> atau <div class=\"badge-tag\">UI Engineer</div>. Letakkan di dalam header profil dekat judul.',
        'Tambahkan <div class=\"badge-role\">Frontend Developer</div> di dalam area judul profil.',
        'Badge atau pill tag adalah micro-container div yang diformat untuk menampilkan metadata ringkas seperti label keahlian, peran developer, atau kategori materi.',
        '["<div class=\"badge-role\">Frontend Developer</div>", "<div class=\"badge-tag\">UI Engineer</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"card-header\"><h2>Alex Coder</h2><div class=\"badge-role\">Frontend Developer</div></div>", "description": "Badge label peran di header."}'::jsonb,
        '<div class=\"card\">\n  <div class=\"card-header\">\n    <h2>Alex Coder</h2>\n    <!-- Tambahkan <div class=\"badge-role\">Frontend Developer</div> di sini -->\n  </div>\n</div>',
        '{"goals": [{"class": "badge-role"}]}'::jsonb
      ),
      (
        'html-11-stats-columns',
        'html-architecture',
        'Level 11: The Metrics Summary (3 Kolom Metrik)',
        'MEDIUM',
        11,
        45,
        'Tampilkan metrik ringkasan portofoliomu! Buat satu kontainer baris pembungkus <div class=\"metrics-row\">, lalu di dalamnya buat 3 kotak anak <div class=\"metric-box\"> yang masing-masing berisi angka dan label metrik (perhatikan contoh kode acuan di bawah). Tuliskan data metrik pencapaianmu sendiri!',
        'Buat <div class=\"metrics-row\"> yang membungkus tiga <div class=\"metric-box\">.',
        'Pola Metrics Row dengan 3 Metric Box mengajarkan komposisi 1 row parent dengan N child boxes yang menjadi standar tampilan statistik di dashboard atau profile page.',
        '["<div class=\"metrics-row\">", "<div class=\"metric-box\">\\n  <h4>12</h4>\\n  <p>Proyek</p>\\n</div>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"metrics-row\"><div class=\"metric-box\"><h4>12</h4><p>Proyek</p></div><div class=\"metric-box\"><h4>1.5K</h4><p>Kontribusi</p></div><div class=\"metric-box\"><h4>24</h4><p>Repo</p></div></div>", "description": "Tiga kolom metric-box di dalam metrics-row."}'::jsonb,
        '<div class=\"card\">\n  <!-- Buat <div class=\"metrics-row\"> yang membungkus 3 <div class=\"metric-box\"> di sini -->\n</div>',
        '{"goals": [{"class": "metrics-row"}, {"class": "metric-box", "count": 3}]}'::jsonb
      ),
      (
        'html-12-modular-card',
        'html-architecture',
        'Level 12: Capstone Project - The Modular Profile Card',
        'ADVANCED',
        12,
        60,
        'PROYEK CAPSTONE: RAKIT MODULAR PROFILE CARD! Gabungkan 5 tingkatan kontainer menjadi satu Profile Card modular: 1 Parent <div class=\"profile-card\">, di dalamnya terdapat <div class=\"card-header\"> (memuat avatar-frame foto dan badge-role), <div class=\"card-body\"> (memuat nama, bio, dan metrics-row dengan 3 metric-box), serta <div class=\"card-footer\"> yang membungkus action-row dengan 2 tombol aksi. Susun hierarki DOM dengan rapi!',
        'Susun hierarki: profile-card -> (card-header -> avatar-frame + badge) -> (card-body -> text + stats-row 3 stat-box) -> (card-footer -> action-row 2 button).',
        'Proyek Capstone menguji penguasaan arsitektur bertingkat: parent utama, pembagian zona (header, body, footer), framing media, penataan data statistik kolom, dan pengelompokan tombol aksi.',
        '["<div class=\"profile-card\">", "<div class=\"card-header\">", "<div class=\"card-body\">", "<div class=\"card-footer\">", "<div class=\"stats-row\">", "<div class=\"action-row\">"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<div class=\"profile-card\"><div class=\"card-header\">Header</div><div class=\"card-body\">Body</div><div class=\"card-footer\">Footer</div></div>","description":"Profile Card modular lengkap 5 lapisan div.","concept_demo":{"conceptTitle":"Capstone Blueprint: 5 Lapisan Arsitektur Kartu","whyItMatters":"Komponen kartu standar industri disusun dari 5 lapisan hierarkis: Card Outer -> Header & Body -> Avatar & Info -> Action Row & Badges. Menguasai arsitektur berlapis ini adalah fondasi slicing desain Figma ke web nyata.","whatIfWithout":"Menyatukan semua elemen secara acak tanpa hierarki berlapis membuat kode CSS menjadi berantakan dan kartu akan hancur saat ukuran layar ponsel berubah.","codeExample":"<div class=\"profile-card\">\n  <div class=\"card-header\">\n    <div class=\"avatar-box\">...</div>\n    <div class=\"info-box\">...</div>\n  </div>\n  <div class=\"card-body\">...</div>\n  <div class=\"action-row\">...</div>\n</div>","keyTakeaways":["Setiap lapisan memiliki tanggung jawab tunggal (Single Responsibility Principle).","Hierarki yang bersih memudahkan penataan CSS responsif di layar ponsel maupun desktop."]}}'::jsonb,
        '<!-- CAPSTONE PROJECT: Rakit Profile Card modular lengkap dengan 5 lapisan div! -->',
        '{"goals": [{"class": "profile-card"}, {"class": "card-header"}, {"class": "card-body"}, {"class": "card-footer"}]}'::jsonb
      ),
      (
        'html-13-split-layout',
        'html-architecture',
        'Level 13: The Two-Panel Split (Sidebar & Main)',
        'MEDIUM',
        13,
        45,
        'Keluar dari skala kartu kecil, mari bangun skala halaman web aplikasi! Buat satu kardus pembungkus layar <div class=\"app-layout\">, lalu belah menjadi dua kardus utama: <div class=\"sidebar\"> di sebelah kiri dan <div class=\"main-content\"> di sebelah kanan.',
        'Bungkus <div class=\"sidebar\">...</div> dan <div class=\"main-content\">...</div> di dalam <div class=\"app-layout\">.',
        'Tata letak Two-Panel Split (Sidebar + Main Content) adalah kerangka dasar dari 90% web dashboard, CMS, IDE, dan aplikasi modern di internet saat ini.',
        '["<div class=\"app-layout\">", "<div class=\"sidebar\">\\n  <!-- Sidebar Nav -->\\n</div>", "<div class=\"main-content\">\\n  <!-- Area Kerja Utama -->\\n</div>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"app-layout\"><div class=\"sidebar\">Sidebar</div><div class=\"main-content\">Main Content</div></div>", "description": "Split screen layout sidebar dan main-content."}'::jsonb,
        '<!-- Buat <div class=\"app-layout\"> yang memuat <div class=\"sidebar\"> dan <div class=\"main-content\"> -->',
        '{"goals": [{"class": "app-layout"}, {"class": "sidebar"}, {"class": "main-content"}]}'::jsonb
      ),
      (
        'html-14-sidebar-nav',
        'html-architecture',
        'Level 14: Sidebar Navigation Box',
        'MEDIUM',
        14,
        45,
        'Rakit isi bilah samping aplikasimu! Di dalam <div class=\"sidebar\">, buat dua kardus terpisah: <div class=\"brand-box\"> (berisi judul logo <h2>Codevas App</h2>) dan <div class=\"menu-box\"> yang membungkus daftar navigasi <ul> dengan minimal 3 item menu <li> (Dashboard, Kelas, Portofolio). Tuliskan nama menumu sendiri!',
        'Di dalam <div class=\"sidebar\">, buat <div class=\"brand-box\"> dan <div class=\"menu-box\"> yang berisi <ul> dengan 3 <li>.',
        'Memisahkan area Brand/Logo dan Navigation Menu ke dalam div terpisah mempermudah pengaturan jarak dan scrolling independen pada sidebar.',
        '["<div class=\"brand-box\">\\n  <h2>Codevas App</h2>\\n</div>", "<div class=\"menu-box\">\\n  <ul>\\n    <li>Dashboard</li>\\n    <li>Kelas</li>\\n    <li>Portofolio</li>\\n  </ul>\\n</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"sidebar\"><div class=\"brand-box\"><h2>Codevas</h2></div><div class=\"menu-box\"><ul><li>Dashboard</li><li>Kelas</li><li>Portofolio</li></ul></div></div>", "description": "Sidebar dengan brand-box dan menu-box."}'::jsonb,
        '<div class=\"sidebar\">\n  <!-- Buat <div class=\"brand-box\"> dan <div class=\"menu-box\"> (berisi <ul> dengan 3 <li>) di sini -->\n</div>',
        '{"goals": [{"class": "brand-box"}, {"class": "menu-box"}, {"tag": "ul", "childCount": 3}]}'::jsonb
      ),
      (
        'html-15-content-cards',
        'html-architecture',
        'Level 15: The Content Stack',
        'MEDIUM',
        15,
        50,
        'Isi area kerja utama dengan beberapa kartu mandiri! Di dalam <div class=\"main-content\">, buat dua buah kardus terpisah: <div class=\"banner-card\"> (berisi pesan selamat datang) dan <div class=\"overview-card\"> (berisi ringkasan target belajarmu). Tuliskan target belajarmu sendiri!',
        'Buat dua kartu terpisah <div class=\"banner-card\"> dan <div class=\"overview-card\"> di dalam main-content.',
        'Content Stacking memungkinkan komponen-komponen mandiri hidup berdampingan di dalam area kerja utama tanpa saling merusak struktur elemen lainnya.',
        '["<div class=\"banner-card\">\\n  <h3>Selamat Datang!</h3>\\n</div>", "<div class=\"overview-card\">\\n  <h3>Target Belajar</h3>\\n</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"main-content\"><div class=\"banner-card\">Banner</div><div class=\"overview-card\">Overview</div></div>", "description": "Dua kartu bertumpuk di main-content."}'::jsonb,
        '<div class=\"main-content\">\n  <!-- Buat <div class=\"banner-card\"> dan <div class=\"overview-card\"> di sini -->\n</div>',
        '{"goals": [{"class": "banner-card"}, {"class": "overview-card"}]}'::jsonb
      ),
      (
        'html-16-form-group',
        'html-architecture',
        'Level 16: The Form & Field Groups',
        'MEDIUM',
        16,
        50,
        'Formulir yang rapi membutuhkan kardus di setiap field-nya! Di dalam tag <form>, bungkus setiap baris masukan ke dalam <div class=\"form-group\"> yang berisi <label> dan <input>. Buat dua grup (untuk Nama dan Email), lalu akhiri dengan tombol <button type=\"submit\">Kirim</button>.',
        'Gunakan <div class=\"form-group\"><label>Nama</label><input type=\"text\" /></div> untuk setiap field di dalam <form>.',
        'Pola Form Group membungkus label teks dan input control bersama-sama agar teks label dan input selalu terikat dalam satu kesatuan visual dan spasial.',
        '["<form>", "<div class=\"form-group\">\\n  <label>Nama</label>\\n  <input type=\"text\" />\\n</div>", "<button type=\"submit\">Kirim</button>", "</form>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<form><div class=\"form-group\"><label>Nama</label><input type=\"text\" /></div><div class=\"form-group\"><label>Email</label><input type=\"email\" /></div><button>Kirim</button></form>","description":"Formulir rapi dengan div form-group.","concept_demo":{"conceptTitle":"Form Architecture: Logika Pembungkus Form-Group","whyItMatters":"Setiap pasang <label> dan <input> wajib dibungkus dalam satu <div class=\"form-group\">. Ini menjaga jarak vertikal antar pertanyaan dan memberi ruang khusus untuk pesan error validasi.","whatIfWithout":"Label dan input akan bertabrakan ke samping atau berantakan saat pengguna mengetik di layar ponsel.","codeExample":"<form class=\"profile-form\">\n  <div class=\"form-group\">\n    <label>Nama Lengkap</label>\n    <input type=\"text\" />\n  </div>\n</form>","keyTakeaways":["form-group mengisolasi satu unit input data.","Memudahkan styling jarak, ikon input, dan status error validasi."]}}'::jsonb,
        '<!-- Buat formulir <form> dengan 2 <div class=\"form-group\"> dan 1 submit button -->',
        '{"goals": [{"tag": "form"}, {"class": "form-group", "count": 2}, {"tag": "button"}]}'::jsonb
      ),
      (
        'html-17-modal-dialog',
        'html-architecture',
        'Level 17: The Modal Dialog (Overlay & Modal Box)',
        'MEDIUM',
        17,
        50,
        'Pernah melihat jendela popup di web? Arsitekturnya selalu menggunakan 2 kardus bertingkat! Buat kardus luar <div class=\"modal-overlay\"> (lapisan gelap layar penuh), dan di dalamnya buat kardus tengah <div class=\"modal-box\"> yang membungkus judul popup <h3>Konfirmasi Proyek</h3>, paragraf teks, dan tombol tutup <button>Tutup</button>.',
        'Bungkus <div class=\"modal-box\"> di dalam <div class=\"modal-overlay\">.',
        'Modal Overlay bertindak sebagai backdrop gelap yang mengunci interaksi layar belakang, sedangkan Modal Box adalah kotak dialog terapung tempat konten pesan ditampilkan.',
        '["<div class=\"modal-overlay\">", "<div class=\"modal-box\">\\n  <h3>Konfirmasi Proyek</h3>\\n  <p>Apakah kamu yakin ingin menyimpan?</p>\\n  <button>Tutup</button>\\n</div>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"modal-overlay\"><div class=\"modal-box\"><h3>Konfirmasi</h3><p>Pesan...</p><button>Tutup</button></div></div>", "description": "Popup modal dengan overlay dan modal-box."}'::jsonb,
        '<!-- Buat arsitektur popup modal: <div class=\"modal-overlay\"> membungkus <div class=\"modal-box\"> -->',
        '{"goals": [{"class": "modal-overlay"}, {"class": "modal-box"}, {"contains": ["h3", "p", "button"]}]}'::jsonb
      ),
      (
        'html-18-bento-grid',
        'html-architecture',
        'Level 18: The Bento Grid Blocks',
        'MEDIUM',
        18,
        55,
        'Gaya desain Bento Box ala Apple sangat populer! Buat satu wadah induk <div class=\"bento-container\">, lalu letakkan minimal 4 buah kardus modular <div class=\"bento-item\"> di dalamnya. Isi masing-masing kardus dengan topik berbeda (Profil Singkat, Proyek Terkini, Skill List, dan Kontak Cepat).',
        'Buat satu <div class=\"bento-container\"> yang membungkus 4 buah <div class=\"bento-item\">.',
        'Bento Grid mengelompokkan berbagai konten ke dalam modular blocks bersegi empat dengan ukuran proporsional layaknya kotak bekal makanan Jepang (Bento).',
        '["<div class=\"bento-container\">", "<div class=\"bento-item\">\\n  <h3>Profil Singkat</h3>\\n</div>", "</div>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"bento-container\"><div class=\"bento-item\">1</div><div class=\"bento-item\">2</div><div class=\"bento-item\">3</div><div class=\"bento-item\">4</div></div>", "description": "Wadah bento-container membungkus 4 bento-item."}'::jsonb,
        '<!-- Buat <div class=\"bento-container\"> yang membungkus 4 <div class=\"bento-item\"> -->',
        '{"goals": [{"class": "bento-container"}, {"class": "bento-item", "count": 4}]}'::jsonb
      ),
      (
        'html-19-semantic-hybrid',
        'html-architecture',
        'Level 19: The Semantic Hybrid',
        'MEDIUM',
        19,
        55,
        'Developer kelas dunia menggabungkan tag Semantik untuk SEO dengan <div> untuk tata letak! Buat struktur semantik: tag <header>, <main>, dan <footer>. Di dalam masing-masing tag semantik tersebut, letakkan <div class=\"container\"> sebagai kardus penahan lebar konten agar tidak melebar tak terkontrol!',
        'Gunakan <header><div class=\"container\">...</div></header>, <main><div class=\"container\">...</div></main>, dan <footer><div class=\"container\">...</div></footer>.',
        'Pola Semantic-Div Hybrid memisahkan tanggung jawab: tag semantik (header, main, footer) memberikan arti bagi robot SEO & screen reader, sedangkan inner div container bertugas membatasi max-width dan centering layout di CSS.',
        '["<header>\\n  <div class=\"container\">\\n    <h1>Situs Koding</h1>\\n  </div>\\n</header>", "<main>\\n  <div class=\"container\">\\n    <p>Konten utama...</p>\\n  </div>\\n</main>", "<footer>\\n  <div class=\"container\">\\n    <p>&copy; 2026</p>\\n  </div>\\n</footer>"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview":"<header><div class=\"container\">Header</div></header><main><div class=\"container\">Main</div></main><footer><div class=\"container\">Footer</div></footer>","description":"Tiga tag semantik masing-masing membungkus div container.","concept_demo":{"conceptTitle":"Semantic vs Div: Kapan Menggunakan Apa?","whyItMatters":"Gunakan tag semantik (<header>, <main>, <footer>) untuk menandai makna arsitektur halaman bagi mesin pencari (SEO) dan pembaca layar (Aksesibilitas). Lalu gunakan <div> di dalamnya sebagai wadah penata layout.","whatIfWithout":"Memakai 100% semantik tanpa div membuat tata letak kaku; sebaliknya memakai 100% div tanpa semantik merusak skor SEO dan aksesibilitas situs.","codeExample":"<header class=\"site-header\">\n  <div class=\"container\">\n    <!-- Navigasi -->\n  </div>\n</header>","keyTakeaways":["Tag semantik memberi makna struktural bagi search engine & screen reader.","Tag div memberi kontrol visual dan fleksibilitas tata letak (CSS styling)."]}}'::jsonb,
        '<!-- Susun tag semantik <header>, <main>, dan <footer> yang masing-masing membungkus <div class=\"container\"> -->',
        '{"goals": [{"tags": ["header", "main", "footer"]}, {"class": "container", "count": 3}]}'::jsonb
      ),
      (
        'html-20-boss-dashboard',
        'html-architecture',
        'Level 20: Final Project - Complete Web Dashboard Architecture',
        'ADVANCED',
        20,
        100,
        'PROYEK AKHIR KURIKULUM: Bangun kerangka Web Dashboard lengkap dari nol: Satu kontainer utama <div class=\"dashboard-layout\">. Di dalamnya terdapat: 1) Panel navigasi <div class=\"sidebar\"> (Brand h2 & Menu navigasi ul-li), 2) Panel kerja <div class=\"main-panel\"> yang berisi Header Bar (Avatar Frame + Badge Tag), 3 Bento Card modular (Ringkasan Metrik, Profil Singkat, dan Form Pesan Cepat), serta Footer Bar hak cipta. Buktikan penguasaan arsitektur DOM profesionalmu tanpa ada tag yang bocor!',
        'Satukan semua konsep: dashboard-layout -> (sidebar dengan brand & menu ul-li) + (main-panel dengan header bar, 3 bento cards, form kontak, dan footer bar).',
        'Proyek akhir menguji sintesis lengkap seluruh kemampuan: macro layout (sidebar + main-panel), micro containers (brand, menu, avatar-frame, badge, metrics), content stack, form grouping, dan footer.',
        '["<div class=\"dashboard-layout\">", "<div class=\"sidebar\">", "<div class=\"main-panel\">", "<div class=\"bento-item\">", "<div class=\"form-group\">"]'::jsonb,
        '{"element": "html-arena"}'::jsonb,
        '{"preview": "<div class=\"dashboard-layout\"><div class=\"sidebar\">Nav</div><div class=\"main-panel\">Header, Bento Cards, Footer</div></div>", "description": "Arsitektur Dashboard Web lengkap dari nol."}'::jsonb,
        '<!-- FINAL PROJECT: Bangun kerangka Dashboard Web lengkap dari nol! -->\n<!-- Satukan <div class=\"dashboard-layout\">, sidebar, main-panel, bento cards, dan footer -->',
        '{"goals": [{"class": "dashboard-layout"}, {"class": "sidebar"}, {"class": "main-panel"}]}'::jsonb
      ),
                  (
        'css-basics-1-background-color',
        'css-basics',
        'Level 1: The Canvas (Warna Latar Belakang)',
        'EASY',
        1,
        30,
        'Dunia desain web dimulai dari kanvas kosong. Warnai latar belakang kotak ini menjadi biru muda menggunakan background-color: lightblue; (atau warna hex favoritmu seperti #e0f2fe).',
        'Ketik background-color: lightblue; di dalam selektor .box.',
        'Properti background-color mengatur warna latar belakang elemen. Anda bisa menggunakan nama warna standar (lightblue), format heksadesimal (#38bdf8), atau rgb().',
        '["background-color: lightblue;", "color: lightblue;", "background-color: #f1f5f9;", "background-color: #e0f2fe;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan background biru muda", "description": "Warna latar kanvas.", "concept_demo": {"conceptTitle": "Kanvas & Warna Dasar", "whyItMatters": "Warna latar belakang mendefinisikan bidang kerja komponen dan memisahkannya dari halaman utama.", "whatIfWithout": "Tanpa background-color, elemen transparan menyatu dengan layar sehingga batas komponen tidak terlihat.", "codeExample": ".box {\n  background-color: lightblue;\n}", "keyTakeaways": ["background-color mewarnai seluruh area di dalam border.", "Bisa menggunakan nama warna, hex code (#38bdf8), atau RGB."]}}'::jsonb,
        '.box {\n  /* Beri warna latar belakang di sini */\n}',
        '{"goals": [{"property": "background-color", "accepted": ["lightblue", "#add8e6", "#38bdf8", "#e0f2fe", "#60a5fa"]}]}'::jsonb
      ),
      (
        'css-basics-2-text-color',
        'css-basics',
        'Level 2: The Typography Ink (Warna Teks & Kontras)',
        'EASY',
        2,
        30,
        'Teks di dalam kotak perlu terlihat kontras dan nyaman dibaca. Ubah warna teks menjadi gelap menggunakan color: #0f172a; (atau #333333).',
        'Gunakan color: #0f172a; atau color: #333; di dalam selektor .box.',
        'Properti color digunakan khusus untuk mewarnai teks dan karakter huruf. Kontras yang baik antara warna teks dan latar belakang adalah aturan emas aksesibilitas (WCAG).',
        '["color: #0f172a;", "color: #333;", "text-color: #0f172a;", "font-color: #0f172a;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Teks gelap kontras", "description": "Warna teks kontras.", "concept_demo": {"conceptTitle": "Kontras Teks & Keterbacaan", "whyItMatters": "Teks yang kontras menjamin keterbacaan (readability) bagi seluruh pengguna di berbagai kondisi pencahayaan layar.", "whatIfWithout": "Warna teks yang terlalu redup atau serupa dengan background membuat mata lelah dan melanggar standar aksesibilitas.", "codeExample": ".box {\n  color: #0f172a;\n}", "keyTakeaways": ["color mengatur warna teks font.", "Pilih warna teks yang kontras tinggi terhadap background."]}}'::jsonb,
        '.box {\n  background-color: #f1f5f9;\n  /* Tulis warna teks di sini */\n}',
        '{"goals": [{"property": "color", "accepted": ["#0f172a", "#333", "#333333", "black", "#000", "#1e293b"]}]}'::jsonb
      ),
      (
        'css-basics-3-font-size',
        'css-basics',
        'Level 3: The Visual Scale (Ukuran Huruf)',
        'EASY',
        3,
        35,
        'Teks judul harus lebih dominan daripada teks isi. Perbesar ukuran huruf pada kotak ini menggunakan font-size: 24px;',
        'Ketik font-size: 24px; di dalam selektor .box.',
        'Properti font-size mengatur ukuran fisik huruf. Satuan umum meliputi px (pixel absolut) dan rem (relatif terhadap root font).',
        '["font-size: 24px;", "text-size: 24px;", "font-weight: 24px;", "font-size: 1.5rem;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Ukuran huruf 24px", "description": "Hierarki ukuran teks.", "concept_demo": {"conceptTitle": "Skala Tipografi & Fokal Poin", "whyItMatters": "Skala tipografi yang konsisten membantu pembaca membedakan judul utama, subjudul, dan paragraf dengan sekilas pandang.", "codeExample": ".box {\n  font-size: 24px;\n}"}}'::jsonb,
        '.box {\n  background-color: #f1f5f9;\n  color: #0f172a;\n  /* Perbesar ukuran huruf di sini */\n}',
        '{"goals": [{"property": "font-size", "accepted": ["24px", "1.5rem"]}]}'::jsonb
      ),
      (
        'css-basics-4-font-weight',
        'css-basics',
        'Level 4: The Bold Statement (Ketebalan Huruf)',
        'EASY',
        4,
        35,
        'Buat teks judul tampak tegas dan memiliki bobot fokal! Tambahkan ketebalan huruf menggunakan font-weight: bold; (atau font-weight: 700;).',
        'Ketik font-weight: bold; atau font-weight: 700;',
        'font-weight menentukan ketebalan karakter font. Skala berkisar dari 100 (thin), 400 (normal), 700 (bold), hingga 900 (black).',
        '["font-weight: bold;", "font-weight: 700;", "font-style: bold;", "text-weight: bold;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Teks tebal berwibawa", "description": "Bobot fokal teks."}'::jsonb,
        '.box {\n  font-size: 24px;\n  /* Buat teks menjadi tebal di sini */\n}',
        '{"goals": [{"property": "font-weight", "accepted": ["bold", "700", "800", "900"]}]}'::jsonb
      ),
      (
        'css-basics-5-text-align',
        'css-basics',
        'Level 5: The Alignment (Perataan Teks)',
        'EASY',
        5,
        35,
        'Pusatkan alur teks horizontal pada kartu ini agar seimbang menggunakan text-align: center;',
        'Ketik text-align: center; di dalam selektor .box.',
        'text-align mengendalikan perataan teks inline di dalam blok kontainer. Opsi utama meliputi left, center, right, dan justify.',
        '["text-align: center;", "align-text: center;", "align: center;", "text-align: left;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Teks rata tengah seimbang", "description": "Perataan teks horizontal."}'::jsonb,
        '.box {\n  /* Pusatkan teks secara horizontal di sini */\n}',
        '{"goals": [{"property": "text-align", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'css-basics-6-line-height',
        'css-basics',
        'Level 6: The Breathing Space (Line Height)',
        'EASY',
        6,
        40,
        'Teks yang terlalu rapat membuat mata lelah saat membaca. Berikan ruang bernapas antar baris teks menggunakan line-height: 1.6;',
        'Ketik line-height: 1.6; di dalam selektor .box.',
        'line-height menentukan tinggi vertikal dari satu baris teks. Standar web modern merekomendasikan nilai 1.5 - 1.7 tanpa satuan (unitless).',
        '["line-height: 1.6;", "line-height: 1.5;", "line-spacing: 1.6;", "line-height: 24px;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Teks dengan jarak baris lapang", "description": "Irama vertikal teks.", "concept_demo": {"conceptTitle": "Checkpoint 1: Tipografi & Irama Vertikal", "whyItMatters": "Tanpa line-height memadai, baris-baris kalimat panjang akan bertumpuk rapat dan menyulitkan mata melacak baris berikutnya saat membaca.", "whatIfWithout": "Kalimat bertumpuk padat dan tampak sesak seperti teks mentah unstyled.", "codeExample": ".box {\n  font-size: 16px;\n  line-height: 1.6;\n}", "keyTakeaways": ["Gunakan nilai unitless seperti 1.5 atau 1.6 agar proporsional otomatis.", "Line-height ideal untuk paragraf adalah 1.5 hingga 1.7."]}}'::jsonb,
        '.box {\n  /* Beri jarak antar baris teks di sini */\n}',
        '{"goals": [{"property": "line-height", "accepted": ["1.6", "1.5", "1.7", "24px", "28px"]}]}'::jsonb
      ),
      (
        'css-basics-7-padding',
        'css-basics',
        'Level 7: The Inner Space (Padding)',
        'EASY',
        7,
        40,
        'Teks saat ini menempel kaku ke tepi dinding kotak! Berikan ruang napas di dalam kotak menggunakan padding: 20px;',
        'Ketik padding: 20px; di dalam selektor .box.',
        'padding adalah ruang kosong antara konten elemen dan batas garis tepinya (border). Padding memperbesar ruang bagian dalam kotak.',
        '["padding: 20px;", "margin: 20px;", "padding: 10px;", "inner-space: 20px;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan ruang napas dalam", "description": "Ruang dalam kotak.", "concept_demo": {"conceptTitle": "Checkpoint 2: The Box Model - Ruang Dalam (Padding)", "whyItMatters": "Komponen tanpa padding terlihat amatir karena teks menabrak dinding border. Padding memberikan ruang bernapas esensial.", "whatIfWithout": "Konten teks menabrak dinding border, kartu terlihat sesak dan tidak rapi.", "codeExample": ".box {\n  padding: 20px;\n}", "keyTakeaways": ["Padding berada di dalam garis border.", "Shorthand padding: 20px berlaku untuk keempat sisi (atas, kanan, bawah, kiri)."]}}'::jsonb,
        '.box {\n  background-color: #f1f5f9;\n  /* Beri ruang napas bagian dalam dengan padding */\n}',
        '{"goals": [{"property": "padding", "accepted": ["20px", "1.25rem", "24px", "16px"]}]}'::jsonb
      ),
      (
        'css-basics-8-margin',
        'css-basics',
        'Level 8: The Outer Boundary (Margin)',
        'EASY',
        8,
        40,
        'Kotak perlu menjaga jarak sopan dari elemen luar di sekitarnya. Berikan jarak luar menggunakan margin: 20px;',
        'Ketik margin: 20px; di dalam selektor .box.',
        'margin adalah ruang kosong di luar garis border elemen, yang mendorong elemen-elemen tetangga agar tidak berdempetan.',
        '["margin: 20px;", "padding: 20px;", "margin-bottom: 20px;", "outer-space: 20px;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan jarak luar", "description": "Pemisah elemen tetangga."}'::jsonb,
        '.box {\n  /* Beri jarak luar menggunakan margin */\n}',
        '{"goals": [{"property": "margin", "accepted": ["20px", "15px", "16px", "1rem", "24px"]}]}'::jsonb
      ),
      (
        'css-basics-9-border',
        'css-basics',
        'Level 9: The Border Frame (Garis Tepi)',
        'EASY',
        9,
        40,
        'Tegaskan batasan visual kotak dengan garis tepi hitam neo-brutalisme! Gunakan border: 2px solid #0f172a;',
        'Ketik border: 2px solid #0f172a; di dalam selektor .box.',
        'border membungkus padding dan konten dengan garis nyata. Shorthand border terdiri dari: [lebar] [gaya: solid/dashed/dotted] [warna].',
        '["border: 2px solid #0f172a;", "border: 3px solid #0f172a;", "outline: 2px solid #0f172a;", "border-width: 2px;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan border tegas", "description": "Garis tepi penegas batas."}'::jsonb,
        '.box {\n  background-color: white;\n  padding: 20px;\n  /* Beri border tegas di sini */\n}',
        '{"goals": [{"property": "border", "accepted": ["2px solid #0f172a", "2px solid black", "3px solid #0f172a"]}]}'::jsonb
      ),
      (
        'css-basics-10-border-radius',
        'css-basics',
        'Level 10: The Smooth Edge (Sudut Membulat)',
        'EASY',
        10,
        45,
        'Ubah sudut siku yang kaku dan tajam menjadi kurva lembut modern menggunakan border-radius: 16px;',
        'Ketik border-radius: 16px; di dalam selektor .box.',
        'border-radius membulatkan sudut terluar dari kotak elemen. Nilai yang lebih besar menciptakan sudut yang semakin bulat.',
        '["border-radius: 16px;", "border-radius: 12px;", "border-radius: 20px;", "border-radius: 50%;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan sudut melengkung", "description": "Kelengkungan sudut elemen."}'::jsonb,
        '.box {\n  border: 2px solid #0f172a;\n  /* Bulatkan sudut kotak di sini */\n}',
        '{"goals": [{"property": "border-radius", "accepted": ["16px", "12px", "1rem", "20px"]}]}'::jsonb
      ),
      (
        'css-basics-11-dimensions',
        'css-basics',
        'Level 11: Controlling Dimensions (Width & Min-Height)',
        'MEDIUM',
        11,
        45,
        'Kendalikan proporsi kartu komponen agar pas di layar. Atur lebarnya menjadi width: 320px; dan beri ruang tinggi minimal min-height: 160px;',
        'Ketik width: 320px; dan min-height: 160px; di dalam selektor .box.',
        'Menetapkan width membatasi ekspansi horizontal, sedangkan menggunakan min-height lebih aman daripada height kaku karena konten teks tidak akan terpotong jika bertambah panjang.',
        '["width: 320px;", "min-height: 160px;", "height: 160px;", "width: 100%;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak berukuran terukur", "description": "Dimensi kartu proporsional."}'::jsonb,
        '.box {\n  /* Atur width dan min-height di sini */\n}',
        '{"goals": [{"property": "width", "accepted": ["320px", "280px", "300px"]}, {"property": "min-height", "accepted": ["160px", "200px", "150px"]}]}'::jsonb
      ),
      (
        'css-basics-12-box-sizing',
        'css-basics',
        'Level 12: The Box-Sizing Revelation (Border-Box)',
        'MEDIUM',
        12,
        50,
        'Saat memberi padding pada kotak berukuran tetap, kotaknya membengkak melebihi batas kanvas! Amankan kalkulasi kotak dengan box-sizing: border-box;',
        'Ketik box-sizing: border-box; di dalam selektor .box.',
        'Secara default (content-box), browser menambahkan padding ke luar dari nilai width. Dengan box-sizing: border-box;, padding dihitung ke dalam nilai width sehingga dimensi kotak tetap presisi.',
        '["box-sizing: border-box;", "box-sizing: content-box;", "box-sizing: initial;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak terkunci aman", "description": "Pencegahan luapan kotak.", "concept_demo": {"conceptTitle": "Checkpoint 3: Filosofi Box-Sizing (Border-Box)", "whyItMatters": "Masalah layout web nomor 1 pada CSS klasik adalah elemen meluap (overflow) saat diberi padding. border-box adalah penyelamat arsitektur CSS modern.", "whatIfWithout": "Kotak selebar 300px + padding 20px membengkak menjadi 340px dan merusak layout kolom!", "codeExample": ".box {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 20px;\n}", "keyTakeaways": ["box-sizing: border-box memasukkan padding & border ke dalam hitungan width/height.", "Sangat esensial untuk mencegah overflow dan horizontal scrolling."]}}'::jsonb,
        '.box {\n  width: 100%;\n  padding: 20px;\n  /* Kunci kalkulasi dimensi kotak di sini */\n}',
        '{"goals": [{"property": "box-sizing", "accepted": ["border-box"]}]}'::jsonb
      ),
      (
        'css-basics-13-capstone-card',
        'css-basics',
        'Level 13: Capstone Card - Neo-Brutalist Badge',
        'MEDIUM',
        13,
        60,
        'Uji kemampuan Box Model-mu! Rakit kartu badge pengembang dengan latar kuning cerah background-color: #fef08a;, ruang napas padding: 16px;, border tegas border: 3px solid #0f172a;, dan sudut membulat border-radius: 16px;',
        'Gunakan background-color: #fef08a; padding: 16px; border: 3px solid #0f172a; border-radius: 16px;',
        'Proyek Tengah: Mengintegrasikan warna latar, padding, border tebal, dan border-radius menjadi satu komponen kartu bernilai estetika tinggi.',
        '["background-color: #fef08a;", "padding: 16px;", "border: 3px solid #0f172a;", "border-radius: 16px;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kartu Neo-Brutalist Kuning", "description": "Komponen kartu neo-brutalisme lengkap."}'::jsonb,
        '.box {\n  /* Bangun kartu badge neo-brutalisme lengkap di sini */\n}',
        '{"goals": [{"property": "background-color", "accepted": ["#fef08a"]}, {"property": "padding", "accepted": ["16px"]}, {"property": "border", "accepted": ["3px solid #0f172a"]}, {"property": "border-radius", "accepted": ["16px"]}]}'::jsonb
      ),
      (
        'css-basics-14-box-shadow',
        'css-basics',
        'Level 14: The Elevation & Depth (Box Shadow)',
        'MEDIUM',
        14,
        45,
        'Beri ilusi kedalaman 3D neo-brutalisme yang kuat! Tambahkan bayangan tegas dengan offset 4px ke kanan dan 4px ke bawah tanpa blur: box-shadow: 4px 4px 0px #0f172a;',
        'Ketik box-shadow: 4px 4px 0px #0f172a; di dalam selektor .box.',
        'box-shadow menerima parameter: [offset-x] [offset-y] [blur-radius] [warna]. Pada desain neo-brutalisme, blur disetel 0px untuk menciptakan bayangan solid seperti stiker fisik.',
        '["box-shadow: 4px 4px 0px #0f172a;", "box-shadow: 0 4px 10px rgba(0,0,0,0.1);", "drop-shadow: 4px 4px 0px #0f172a;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan bayangan tegas 3D", "description": "Elevasi bayangan fisik."}'::jsonb,
        '.box {\n  border: 2px solid #0f172a;\n  /* Beri bayangan tegas di sini */\n}',
        '{"goals": [{"property": "box-shadow"}]}'::jsonb
      ),
      (
        'css-basics-15-opacity',
        'css-basics',
        'Level 15: Transparency & Muting (Opacity)',
        'MEDIUM',
        15,
        45,
        'Ketika elemen dalam kondisi sekunder atau non-aktif, redupkan intensitas visualnya menggunakan opacity: 0.75; (atau 0.8).',
        'Ketik opacity: 0.75; di dalam selektor .box.',
        'opacity mengatur tingkat tembus pandang seluruh elemen beserta isinya dari skala 0 (transparan total) hingga 1 (pekat sempurna).',
        '["opacity: 0.75;", "opacity: 0.8;", "opacity: 0.5;", "visibility: hidden;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak transparan redup", "description": "Tingkat transparansi elemen."}'::jsonb,
        '.box {\n  /* Redupkan transparansi elemen di sini */\n}',
        '{"goals": [{"property": "opacity", "accepted": ["0.75", "0.8", "0.7", "0.85"]}]}'::jsonb
      ),
      (
        'css-basics-16-cursor-overflow',
        'css-basics',
        'Level 16: Interactive Cues & Overflow Containment',
        'MEDIUM',
        16,
        50,
        'Beri tanda bahwa kartu ini dapat diklik dengan cursor: pointer;, dan pastikan konten di dalamnya tidak bocor keluar dari sudut melengkung dengan overflow: hidden;',
        'Ketik cursor: pointer; dan overflow: hidden; di dalam selektor .box.',
        'cursor: pointer; memberikan isyarat visual kursor jari penunjuk bagi pengguna. Sementara overflow: hidden; memotong setiap konten anak yang meluap melewati batas lengkungan border.',
        '["cursor: pointer;", "overflow: hidden;", "overflow: auto;", "cursor: default;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak interaktif terkunci", "description": "Isyarat klik & overflow.", "concept_demo": {"conceptTitle": "Checkpoint 4: Isyarat Interaktif & Overflow", "whyItMatters": "Pengguna mengenali elemen interaktif lewat kursor tangan. Dan overflow: hidden memastikan clipping sudut lengkung rapi tanpa gambar yang bocor di pojok kartu.", "codeExample": ".box {\n  cursor: pointer;\n  overflow: hidden;\n}"}}'::jsonb,
        '.box {\n  border-radius: 16px;\n  /* Beri kursor pointer dan overflow hidden */\n}',
        '{"goals": [{"property": "cursor", "accepted": ["pointer"]}, {"property": "overflow", "accepted": ["hidden"]}]}'::jsonb
      ),
      (
        'css-basics-17-gradient',
        'css-basics',
        'Level 17: Color Energy (Linear Gradient)',
        'MEDIUM',
        17,
        50,
        'Warna solid terasa datar. Berikan transisi warna gradasi dua nada yang energik menggunakan background: linear-gradient(135deg, #fef08a, #fed7aa);',
        'Ketik background: linear-gradient(135deg, #fef08a, #fed7aa); di dalam selektor .box.',
        'linear-gradient() menciptakan transisi halus antara dua warna atau lebih sepanjang garis sudut derajat tertentu (misal 135deg dari pojok kiri atas ke kanan bawah).',
        '["background: linear-gradient(135deg, #fef08a, #fed7aa);", "background-color: linear-gradient(135deg, #fef08a, #fed7aa);"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan gradasi cerah", "description": "Gradasi latar belakang dua nada."}'::jsonb,
        '.box {\n  /* Buat gradasi latar belakang di sini */\n}',
        '{"goals": [{"property": "background", "accepted": ["linear-gradient"]}]}'::jsonb
      ),
      (
        'css-basics-18-transform',
        'css-basics',
        'Level 18: Spatial Dynamics (Transform)',
        'MEDIUM',
        18,
        50,
        'Ciptakan efek melayang secara fisik! Geser kartu sedikit ke atas menggunakan transform: translateY(-4px); (atau perbesar sedikit dengan transform: scale(1.05);).',
        'Ketik transform: translateY(-4px); di dalam selektor .box.',
        'transform memanipulasi posisi, rotasi, atau skala elemen secara hardware-accelerated tanpa mengubah layout atau posisi elemen lain di sekitarnya.',
        '["transform: translateY(-4px);", "transform: scale(1.05);", "translate: 0 -4px;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak melayang terangkat", "description": "Transformasi posisi spasial."}'::jsonb,
        '.box {\n  /* Geser posisi elemen dengan transform */\n}',
        '{"goals": [{"property": "transform", "accepted": ["translatey", "scale", "translate"]}]}'::jsonb
      ),
      (
        'css-basics-19-transitions',
        'css-basics',
        'Level 19: Smooth Motion (CSS Transitions)',
        'MEDIUM',
        19,
        55,
        'Perubahan posisi yang instan terasa kaku. Buat setiap animasi perpindahan menjadi lembut dan elastis menggunakan transition: all 0.2s ease-in-out;',
        'Ketik transition: all 0.2s ease-in-out; di dalam selektor .box.',
        'transition mendefinisikan durasi dan kurva akselerasi saat properti CSS berubah, menciptakan pergerakan mulus 60 FPS pada antarmuka.',
        '["transition: all 0.2s ease-in-out;", "transition: transform 0.2s ease;", "transition: 0.3s;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Kotak dengan animasi halus", "description": "Animasi mikro elastis.", "concept_demo": {"conceptTitle": "Checkpoint 5: Animasi Mikro & Interaksi Halus", "whyItMatters": "Perubahan instan membuat mata pengguna terkejut. Transisi 200ms memberikan umpan balik taktil seperti menekan tombol fisik di dunia nyata.", "codeExample": ".box {\n  transition: all 0.2s ease-in-out;\n}"}}'::jsonb,
        '.box {\n  /* Tambahkan durasi transisi halus di sini */\n}',
        '{"goals": [{"property": "transition"}]}'::jsonb
      ),
      (
        'css-basics-20-boss-card',
        'css-basics',
        'Level 20: Final Project - Complete Interactive Component',
        'BOSS_FIGHT',
        20,
        100,
        'Proyek Akhir CSS Basics: Bangun komponen kartu interaktif neo-brutalisme lengkap! Berikan latar background-color: #fef08a;, ruang napas padding: 24px;, border border: 3px solid #0f172a;, sudut membulat border-radius: 20px;, bayangan tegas box-shadow: 6px 6px 0px #0f172a;, dan transisi halus transition: all 0.2s ease-in-out;!',
        'Gunakan background-color: #fef08a; padding: 24px; border: 3px solid #0f172a; border-radius: 20px; box-shadow: 6px 6px 0px #0f172a; transition: all 0.2s ease-in-out;',
        'Proyek Akhir Komprehensif: Menggabungkan seluruh prinsip Box Model, pewarnaan, tipografi, bayangan elevasi, dan transisi menjadi komponen web siap produksi berstandar portofolio profesional.',
        '["background-color: #fef08a;", "padding: 24px;", "border: 3px solid #0f172a;", "border-radius: 20px;", "box-shadow: 6px 6px 0px #0f172a;", "transition: all 0.2s ease-in-out;"]'::jsonb,
        '{"element": "css-arena"}'::jsonb,
        '{"preview": "Komponen Neo-Brutalisme Masterpiece", "description": "Kartu produk profesional lengkap."}'::jsonb,
        '.box {\n  /* Bangun mahakarya komponen Neo-Brutalisme lengkap dari nol */\n}',
        '{"goals": [{"property": "background-color"}, {"property": "border"}, {"property": "border-radius"}, {"property": "box-shadow"}]}'::jsonb
      ),
      (
        'flexbox-1-activation',
        'css-flexbox',
        'Level 1: The Activation',
        'EASY',
        1,
        30,
        'Elemen-elemen ini menumpuk ke bawah secara kaku. Nyalakan mode sakti Flexbox pada container utama dengan display: flex; untuk membariskan mereka ke samping.',
        'Ketik display: flex; di dalam selektor .arena.',
        'Secara default, elemen div bertumpuk ke bawah (block). Dengan menyalakan display: flex, container langsung berubah menjadi Flex Container dan elemen anaknya otomatis berbaris ke samping (row).',
        '["display: flex;", "display: block;", "display: grid;", "flex-direction: row;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak 1", "Kotak 2", "Kotak 3"]}'::jsonb,
        '{"display": "flex", "description": "Tiga kotak berbaris horizontal ke samping."}'::jsonb,
        '.arena {\n  /* Nyalakan mode sakti Flexbox di sini */\n}',
        '{"goals": [{"property": "display", "accepted": ["flex", "inline-flex"]}]}'::jsonb
      ),
      (
        'flexbox-2-push-justify-end',
        'css-flexbox',
        'Level 2: The Push (Justify End)',
        'EASY',
        2,
        30,
        'Dorong semua kotak ini ke ujung kanan ruangan. Gunakan justify-content: flex-end;',
        'Tambahkan justify-content: flex-end; pada .arena.',
        'justify-content mengontrol distribusi elemen di sepanjang sumbu utama (main axis, default horizontal). Nilai flex-end mendorong semua item ke ujung akhir container.',
        '["justify-content: flex-end;", "justify-content: flex-start;", "justify-content: center;", "align-items: flex-end;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak 1", "Kotak 2", "Kotak 3"]}'::jsonb,
        '{"display": "flex", "justifyContent": "flex-end", "description": "Semua kotak terdorong ke ujung kanan."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Dorong semua kotak ke ujung kanan */\n}',
        '{"goals": [{"property": "justify-content", "accepted": ["flex-end", "end"]}]}'::jsonb
      ),
      (
        'flexbox-3-center-stage',
        'css-flexbox',
        'Level 3: The Center Stage',
        'EASY',
        3,
        35,
        'Kumpulkan semua kotak tepat di tengah panggung (secara horizontal) menggunakan justify-content: center;',
        'Ketik justify-content: center; di dalam .arena.',
        'justify-content: center meratakan dan memusatkan seluruh elemen anak tepat di tengah sumbu utama (horizontal).',
        '["justify-content: center;", "text-align: center;", "justify-content: space-between;", "align-items: center;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak 1", "Kotak 2", "Kotak 3"]}'::jsonb,
        '{"display": "flex", "justifyContent": "center", "description": "Semua kotak berkumpul tepat di tengah panggung."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Kumpulkan kotak tepat di tengah horizontal */\n}',
        '{"goals": [{"property": "justify-content", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'flexbox-4-split-space-between',
        'css-flexbox',
        'Level 4: The Split',
        'EASY',
        4,
        35,
        'Pisahkan kotak kiri dan kanan sejauh mungkin menyentuh dinding layar! Gunakan justify-content: space-between;',
        'Ketik justify-content: space-between;.',
        'justify-content: space-between menempelkan item pertama ke dinding paling kiri dan item terakhir ke dinding paling kanan, membagi sisa ruang secara merata di antaranya.',
        '["justify-content: space-between;", "justify-content: space-around;", "justify-content: space-evenly;", "justify-content: center;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kiri", "Tengah", "Kanan"]}'::jsonb,
        '{"display": "flex", "justifyContent": "space-between", "description": "Kotak pertama di pojok kiri, kotak terakhir di pojok kanan."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Pisahkan kotak ke kedua ujung dinding */\n}',
        '{"goals": [{"property": "justify-content", "accepted": ["space-between"]}]}'::jsonb
      ),
      (
        'flexbox-5-social-distancing',
        'css-flexbox',
        'Level 5: The Social Distancing',
        'EASY',
        5,
        35,
        'Beri jarak yang adil di antara semua kotak ini. Gunakan justify-content: space-evenly; agar jarak tepi dan jarak antar kotak sama persis.',
        'Ketik justify-content: space-evenly;.',
        'justify-content: space-evenly membagi ruang sela secara identik, baik jarak antar item maupun jarak ke tepian dinding container.',
        '["justify-content: space-evenly;", "justify-content: space-around;", "justify-content: space-between;", "gap: 20px;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak A", "Kotak B", "Kotak C"]}'::jsonb,
        '{"display": "flex", "justifyContent": "space-evenly", "description": "Semua kotak memiliki jarak tepi dan jarak sela yang sama rata."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Berikan jarak yang sama rata ke semua sisi */\n}',
        '{"goals": [{"property": "justify-content", "accepted": ["space-evenly", "space-around"]}]}'::jsonb
      ),
      (
        'flexbox-6-gravity-align-items',
        'css-flexbox',
        'Level 6: The Gravity (Align Items)',
        'EASY',
        6,
        40,
        'Kotak-kotak ini melayang di atap ruangan. Tarik mereka ke tengah secara vertikal menggunakan align-items: center;',
        'Tambahkan align-items: center; pada .arena.',
        'align-items mengontrol perataan di sepanjang sumbu silang (cross axis, default vertikal). center meratakan seluruh item tepat di tengah ketinggian container.',
        '["align-items: center;", "justify-content: center;", "vertical-align: middle;", "align-items: flex-end;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak 1", "Kotak 2", "Kotak 3"]}'::jsonb,
        '{"display": "flex", "alignItems": "center", "description": "Kotak berada di tengah ketinggian vertikal."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Tarik kotak ke tengah secara vertikal */\n}',
        '{"goals": [{"property": "align-items", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'flexbox-7-floor-align-end',
        'css-flexbox',
        'Level 7: The Floor',
        'EASY',
        7,
        40,
        'Jatuhkan semua kotak agar bersandar ke lantai dasar kanvas menggunakan align-items: flex-end;',
        'Ketik align-items: flex-end;.',
        'align-items: flex-end menjatuhkan seluruh item ke garis akhir sumbu silang (dasar / lantai container).',
        '["align-items: flex-end;", "align-items: flex-start;", "justify-content: flex-end;", "align-items: baseline;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak 1", "Kotak 2", "Kotak 3"]}'::jsonb,
        '{"display": "flex", "alignItems": "flex-end", "description": "Semua kotak mendarat di lantai dasar arena."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Jatuhkan kotak ke lantai dasar arena */\n}',
        '{"goals": [{"property": "align-items", "accepted": ["flex-end", "end"]}]}'::jsonb
      ),
      (
        'flexbox-8-column-direction',
        'css-flexbox',
        'Level 8: The Column',
        'MEDIUM',
        8,
        45,
        'Ubah arah aliran Flexbox. Tumpuk kembali kotak ini dari atas ke bawah, namun tetap pertahankan sifat fleksibelnya menggunakan flex-direction: column;',
        'Ketik flex-direction: column;.',
        'flex-direction menentukan arah sumbu utama. Default-nya adalah row (horizontal). Mengubahnya ke column menyusun item secara vertikal dari atas ke bawah.',
        '["flex-direction: column;", "flex-direction: column-reverse;", "flex-direction: row;", "display: block;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Atas", "Tengah", "Bawah"]}'::jsonb,
        '{"display": "flex", "flexDirection": "column", "description": "Kotak tersusun lurus dari atas ke bawah."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Ubah aliran arah menjadi kolom */\n}',
        '{"goals": [{"property": "flex-direction", "accepted": ["column"]}]}'::jsonb
      ),
      (
        'flexbox-9-gap',
        'css-flexbox',
        'Level 9: The Gap',
        'MEDIUM',
        9,
        45,
        'Mereka terlalu rapat! Beri jarak yang rapi antar kotak tanpa repot menghitung margin, cukup gunakan gap: 20px;',
        'Ketik gap: 20px; di dalam .arena.',
        'Properti modern gap memberi jarak kosong seragam antar item di dalam flex container tanpa perlu menambahkan margin manual pada elemen anak.',
        '["gap: 20px;", "margin: 20px;", "padding: 20px;", "gap: 10px;"]'::jsonb,
        '{"element": "arena", "itemsCount": 3, "itemLabels": ["Kotak 1", "Kotak 2", "Kotak 3"]}'::jsonb,
        '{"display": "flex", "gap": "20px", "description": "Terdapat jarak lorong 20px yang rapi antar kotak."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Beri jarak 20px antar kotak */\n}',
        '{"goals": [{"property": "gap", "accepted": ["20px", "1.25rem"]}]}'::jsonb
      ),
      (
        'flexbox-10-overflow-wrap',
        'css-flexbox',
        'Level 10: The Overflow (Wrap)',
        'MEDIUM',
        10,
        50,
        'Kotaknya terlalu banyak dan menyusut hancur! Izinkan mereka turun ke baris baru jika ruang tidak cukup dengan flex-wrap: wrap;',
        'Ketik flex-wrap: wrap;.',
        'Secara bawaan flex-wrap bernilai nowrap yang memaksa elemen berjejer dalam 1 baris. Mengubahnya menjadi wrap memungkinkan item turun rapi ke baris berikutnya saat lebar kontainer tidak mencukupi.',
        '["flex-wrap: wrap;", "flex-wrap: nowrap;", "overflow: auto;", "white-space: normal;"]'::jsonb,
        '{"element": "arena", "itemsCount": 6, "itemLabels": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]}'::jsonb,
        '{"display": "flex", "flexWrap": "wrap", "gap": "16px", "description": "Item membungkus ke baris baru secara proporsional."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Izinkan kotak membungkus ke baris baru */\n}',
        '{"goals": [{"property": "flex-wrap", "accepted": ["wrap"]}]}'::jsonb
      ),
      (
        'flexbox-11-perfect-center',
        'css-flexbox',
        'Level 11: The Perfect Center',
        'HARD',
        11,
        60,
        'Ini adalah pertanyaan interview developer paling legendaris. Posisikan kotak ini tepat di tengah kanvas (vertikal & horizontal) dengan menggabungkan justify-content: center; dan align-items: center;',
        'Gunakan justify-content: center; dan align-items: center; bersamaan.',
        'Kombinasi justify-content: center (sumbu utama) dan align-items: center (sumbu silang) di dalam Flexbox container adalah cara paling andal dan modern untuk memusatkan elemen di tengah kanvas.',
        '["justify-content: center;", "align-items: center;", "place-items: center;", "margin: auto;"]'::jsonb,
        '{"element": "arena", "itemsCount": 1, "itemLabels": ["🎯 Pusat Target"]}'::jsonb,
        '{"display": "flex", "justifyContent": "center", "alignItems": "center", "description": "Kotak berada presisi di titik pusat vertikal dan horizontal kanvas."}'::jsonb,
        '.arena {\n  display: flex;\n  /* Pusatkan di tengah horizontal & vertikal */\n}',
        '{"goals": [{"property": "justify-content", "accepted": ["center"]}, {"property": "align-items", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'flexbox-12-boss-modern-navbar',
        'css-flexbox',
        'Level 12: Final Component - The Modern Navbar',
        'ADVANCED',
        12,
        100,
        'Rakit Navbar modern ini. Gunakan space-between untuk memisahkan Logo di kiri dan Menu di kanan, lalu pastikan posisinya sejajar sempurna secara vertikal dengan align-items: center',
        'Ketik display: flex; justify-content: space-between; align-items: center;.',
        'Membangun navigation bar (Navbar) modern adalah implementasi Flexbox paling esensial di dunia industri. Pola justify-content: space-between memisahkan brand dan navigasi, sementara align-items: center menyeimbangkan tinggi elemen.',
        '["display: flex;", "justify-content: space-between;", "align-items: center;", "gap: 16px;"]'::jsonb,
        '{"element": "navbar", "isNavbar": true}'::jsonb,
        '{"display": "flex", "justifyContent": "space-between", "alignItems": "center", "description": "Logo di ujung kiri, menu di ujung kanan, sejajar rapi secara vertikal."}'::jsonb,
        '.navbar {\n  /* Rakit tata letak Modern Navbar di sini */\n}',
        '{"goals": [{"property": "display", "accepted": ["flex"]}, {"property": "justify-content", "accepted": ["space-between"]}, {"property": "align-items", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'grid-1-blueprint',
        'css-grid',
        'Level 1: The Blueprint',
        'EASY',
        1,
        35,
        'Ubah container ini menjadi lahan Grid, lalu belah menjadi 2 kolom dengan ukuran sama besar menggunakan grid-template-columns: 1fr 1fr;',
        'Ketik display: grid; dan grid-template-columns: 1fr 1fr; di dalam .arena.',
        'CSS Grid Layout adalah sistem tata letak 2 dimensi (baris dan kolom). Properti grid-template-columns membagi kolom kontainer, dan 1fr (fractional unit) membagi sisa ruang secara proporsional seimbang.',
        '["display: grid;", "grid-template-columns: 1fr 1fr;", "grid-template-columns: repeat(2, 1fr);", "display: flex;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["Panel 1", "Panel 2", "Panel 3", "Panel 4"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "1fr 1fr", "description": "4 panel terbelah rapi menjadi 2 kolom simetris."}'::jsonb,
        '.arena {\n  /* Aktifkan grid dan buat 2 kolom 1fr 1fr */\n}',
        '{"goals": [{"property": "display", "accepted": ["grid"]}, {"property": "grid-template-columns", "accepted": ["1fr 1fr", "repeat(2, 1fr)", "50% 50%"]}]}'::jsonb
      ),
      (
        'grid-2-triplets',
        'css-grid',
        'Level 2: The Triplets',
        'EASY',
        2,
        35,
        'Buat 3 kolom yang sama besar. Agar kodenya singkat, gunakan fungsi repeat(3, 1fr) pada grid-template-columns',
        'Gunakan grid-template-columns: repeat(3, 1fr);.',
        'Fungsi repeat(n, pattern) adalah utilitas shorthand cerdas di CSS Grid untuk mengulang definisi kolom atau baris sebanyak n kali tanpa mengetik manual.',
        '["grid-template-columns: repeat(3, 1fr);", "grid-template-columns: 1fr 1fr 1fr;", "repeat(3, 1fr)", "grid-template-rows: repeat(3, 1fr);"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 6, "itemLabels": ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "repeat(3, 1fr)", "description": "6 kartu tersusun rapi dalam format 3 kolom sama besar."}'::jsonb,
        '.arena {\n  display: grid;\n  /* Buat 3 kolom sama besar menggunakan fungsi repeat */\n}',
        '{"goals": [{"property": "grid-template-columns", "accepted": ["repeat(3, 1fr)", "1fr 1fr 1fr"]}]}'::jsonb
      ),
      (
        'grid-3-asymmetry',
        'css-grid',
        'Level 3: The Asymmetry',
        'EASY',
        3,
        40,
        'Buat layout Sidebar. Kolom pertama harus selebar fix 250px, dan kolom kedua memakan seluruh sisa ruangnya (1fr).',
        'Ketik grid-template-columns: 250px 1fr;.',
        'Kekuatan CSS Grid terletak pada fleksibilitas memadukan ukuran absolut (pixel) dan dinamis (fractional). Kolom 250px 1fr adalah pola standar dunia nyata untuk tata letak Sidebar + Konten Utama.',
        '["grid-template-columns: 250px 1fr;", "grid-template-columns: 1fr 250px;", "grid-template-columns: 250px auto;", "width: 250px;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 2, "itemLabels": ["📁 Sidebar (250px)", "📄 Konten Utama (1fr)"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "250px 1fr", "description": "Kolom pertama sidebar 250px tetap, dan kolom konten mengisi seluruh sisa ruang kanvas."}'::jsonb,
        '.arena {\n  display: grid;\n  /* Kolom 1 selebar 250px, kolom 2 selebar 1fr */\n}',
        '{"goals": [{"property": "grid-template-columns", "accepted": ["250px 1fr", "250px auto"]}]}'::jsonb
      ),
      (
        'grid-4-alleyway',
        'css-grid',
        'Level 4: The Alleyway',
        'EASY',
        4,
        40,
        'Beri lorong pemisah yang rapi antar sel Grid sebesar 24 pixel menggunakan properti gap: 24px;',
        'Ketik gap: 24px; di dalam .arena.',
        'Properti gap mengatur jarak sela (gutter) antar baris dan antar kolom secara simultan di dalam CSS Grid, tanpa perlu trik margin atau padding yang berantakan.',
        '["gap: 24px;", "grid-gap: 24px;", "margin: 24px;", "padding: 24px;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["Item A", "Item B", "Item C", "Item D"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "24px", "description": "Pemisah lorong 24px yang proporsional di antara 4 panel."}'::jsonb,
        '.arena {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  /* Beri pemisah lorong sel sebesar 24px */\n}',
        '{"goals": [{"property": "gap", "accepted": ["24px", "1.5rem"]}]}'::jsonb
      ),
      (
        'grid-5-header-expansion',
        'css-grid',
        'Level 5: The Header Expansion',
        'MEDIUM',
        5,
        45,
        'Kotak Header ini harus membentang menutupi layar! Suruh dia memakan 3 kolom sekaligus menggunakan grid-column: span 3; pada elemen anaknya.',
        'Ketik grid-column: span 3; pada selektor .header.',
        'Kata kunci span menginstruksikan sel anak untuk membentang melintasi sejumlah kolom yang ditentukan. grid-column: span 3 membuat elemen memakan 3 track kolom penuh.',
        '["grid-column: span 3;", "grid-column: 1 / 4;", "grid-row: span 3;", "width: 100%;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["🌟 Header (Span 3)", "Card 1", "Card 2", "Card 3"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "repeat(3, 1fr)", "description": "Header membentang penuh melintasi 3 kolom di bagian atas."}'::jsonb,
        '.arena {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.header {\n  /* Bentangkan sel header ini memakan 3 kolom */\n}',
        '{"goals": [{"property": "grid-column", "accepted": ["span 3", "1 / 4", "1 / -1"]}]}'::jsonb
      ),
      (
        'grid-6-tower-expansion',
        'css-grid',
        'Level 6: The Tower Expansion',
        'MEDIUM',
        6,
        45,
        'Jadikan kotak Sidebar ini menara yang tinggi ke bawah dengan memakan 2 baris menggunakan grid-row: span 2;',
        'Ketik grid-row: span 2; pada selektor .sidebar.',
        'Sama seperti span pada kolom, properti grid-row: span 2 memperluas sel ke bawah melintasi 2 baris grid secara vertikal, menciptakan struktur menara sidebar yang tinggi.',
        '["grid-row: span 2;", "grid-row: 1 / 3;", "grid-column: span 2;", "height: 100%;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["🏰 Sidebar Menara (Span 2)", "Konten 1", "Konten 2", "Konten 3"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "200px 1fr", "description": "Sidebar membentang vertikal ke bawah memakan 2 baris penuh."}'::jsonb,
        '.arena {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  gap: 16px;\n}\n\n.sidebar {\n  /* Tinggikan menara sidebar ini memakan 2 baris */\n}',
        '{"goals": [{"property": "grid-row", "accepted": ["span 2", "1 / 3"]}]}'::jsonb
      ),
      (
        'grid-7-absolute-placement',
        'css-grid',
        'Level 7: The Absolute Placement',
        'MEDIUM',
        7,
        50,
        'Pindahkan kotak merah ini secara spesifik agar membentang dari garis grid ke-1 hingga ke-3. Gunakan grid-column: 1 / 3;',
        'Ketik grid-column: 1 / 3; pada .item-1.',
        'Garis kisi (grid lines) dihitung mulai dari 1 di paling kiri. Notasi start / end seperti 1 / 3 menempatkan elemen mulai dari garis kisi ke-1 hingga garis kisi ke-3 secara presisi.',
        '["grid-column: 1 / 3;", "grid-column: 1 / 4;", "grid-column: span 2;", "grid-row: 1 / 3;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["🎯 Target Box (1 / 3)", "Panel 2", "Panel 3", "Panel 4"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "repeat(3, 1fr)", "description": "Target box ditempatkan presisi membentang dari garis grid 1 ke 3."}'::jsonb,
        '.arena {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.item-1 {\n  /* Bentangkan dari garis ke-1 hingga ke-3 */\n}',
        '{"goals": [{"property": "grid-column", "accepted": ["1 / 3", "1 / span 2"]}]}'::jsonb
      ),
      (
        'grid-8-grid-center',
        'css-grid',
        'Level 8: The Grid Center',
        'MEDIUM',
        8,
        50,
        'Memusatkan elemen di Grid lebih singkat dari Flexbox. Cukup gunakan satu jurus: place-items: center;',
        'Ketik place-items: center; di dalam .arena.',
        'place-items: center adalah properti shorthand sakti di CSS Grid yang menggabungkan align-items: center dan justify-items: center sekaligus dalam satu baris deklarasi yang sangat ringkas.',
        '["place-items: center;", "justify-items: center;", "align-items: center;", "justify-content: center;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["Pusat 1", "Pusat 2", "Pusat 3", "Pusat 4"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "repeat(2, 1fr)", "placeItems": "center", "description": "Seluruh elemen terpusat sempurna di dalam sel grid masing-masing."}'::jsonb,
        '.arena {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  /* Pusatkan seluruh item dengan satu baris sakti */\n}',
        '{"goals": [{"property": "place-items", "accepted": ["center"]}]}'::jsonb
      ),
      (
        'grid-9-responsive-magic',
        'css-grid',
        'Level 9: The Responsive Magic',
        'HARD',
        9,
        55,
        'Buat grid yang otomatis menyesuaikan layar tanpa media query! Gunakan grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));',
        'Ketik grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));.',
        'Formula repeat(auto-fit, minmax(200px, 1fr)) adalah teknik paling terkenal di CSS modern untuk membuat layout responsif: jumlah kolom akan otomatis bertambah atau membungkus menyesuaikan lebar layar tanpa perlu media query!',
        '["grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));", "grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));", "minmax(200px, 1fr)", "repeat(3, 1fr)"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["Adaptif 1", "Adaptif 2", "Adaptif 3", "Adaptif 4"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))", "description": "Grid responsif otomatis beradaptasi tanpa satu pun media query."}'::jsonb,
        '.arena {\n  display: grid;\n  gap: 16px;\n  /* Buat grid responsif otomatis tanpa media query */\n}',
        '{"goals": [{"property": "grid-template-columns", "accepted": ["repeat(auto-fit, minmax(200px, 1fr))", "repeat(auto-fill, minmax(200px, 1fr))"]}]}'::jsonb
      ),
      (
        'grid-10-grid-areas',
        'css-grid',
        'Level 10: The Canvas Paint (Grid Areas)',
        'HARD',
        10,
        55,
        'Mari menamai area. Beri nama area kotak ini menjadi grid-area: header; agar bisa dipanggil oleh container.',
        'Ketik grid-area: header; pada .box-header.',
        'grid-area memberi nama semantik pada sel anak sehingga dapat diposisikan langsung melalui template cetak biru visual grid-template-areas pada container induk layaknya melukis denah rumah.',
        '["grid-area: header;", "grid-area: sidebar;", "grid-area: main;", "grid-column: header;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 3, "itemLabels": ["🎨 Box Header", "Sidebar Area", "Content Area"]}'::jsonb,
        '{"display": "grid", "description": "Elemen dinamai area header secara semantik."}'::jsonb,
        '.box-header {\n  /* Beri nama area kotak ini sebagai header */\n}',
        '{"goals": [{"property": "grid-area", "accepted": ["header"]}]}'::jsonb
      ),
      (
        'grid-11-inception',
        'css-grid',
        'Level 11: The Inception',
        'HARD',
        11,
        60,
        'Grid dan Flexbox adalah teman baik. Jadikan kotak yang ada di dalam sel Grid ini sebagai Flexbox (display: flex) untuk memusatkan teks di dalamnya.',
        'Ketik display: flex; justify-content: center; align-items: center; pada selektor .card.',
        'Arsitektur web profesional memadukan Grid dan Flexbox: Grid bertugas membagi tata letak makro halaman (kolom & baris), sedangkan Flexbox menangani alignment mikro di dalam setiap komponen kartu (Inception).',
        '["display: flex;", "justify-content: center;", "align-items: center;", "place-items: center;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 4, "itemLabels": ["Kartu 1", "Kartu 2", "Kartu 3", "Kartu 4"]}'::jsonb,
        '{"display": "grid", "description": "Setiap sel grid menjadi Flex container yang memusatkan isinya."}'::jsonb,
        '.arena {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}\n\n.card {\n  /* Jadikan kotak ini flexbox untuk memusatkan isinya */\n}',
        '{"goals": [{"property": "display", "accepted": ["flex", "inline-flex"]}]}'::jsonb
      ),
      (
        'grid-12-boss-bento-dashboard',
        'css-grid',
        'Level 12: Final Layout - The Bento Box Dashboard',
        'ADVANCED',
        12,
        100,
        'Proyek akhir Grid: Gunakan repeat(4, 1fr) pada container, lalu gabungkan elemen menggunakan span untuk merakit layout Dashboard bergaya Bento Box ala Apple!',
        'Gunakan grid-template-columns: repeat(4, 1fr); pada .arena dan beri grid-column: span 2; pada .card-1.',
        'Desain Bento Box Dashboard menggabungkan grid 4 kolom dengan kartu-kartu berukuran span dinamis. Ini adalah standar industri modern yang digunakan oleh Apple, Stripe, dan platform teknologi terdepan di dunia.',
        '["grid-template-columns: repeat(4, 1fr);", "grid-column: span 2;", "grid-row: span 2;", "gap: 16px;"]'::jsonb,
        '{"element": "grid-arena", "itemsCount": 5, "itemLabels": ["📊 Analytics Overview (Span 2)", "⚡ Speed 99", "🛡️ Firewall Active", "⭐ Community Rank (Span 2)", "💎 Pro Badge"]}'::jsonb,
        '{"display": "grid", "gridTemplateColumns": "repeat(4, 1fr)", "gap": "16px", "description": "Dashboard Bento Box modern dengan kartu-kartu proporsional bervariasi."}'::jsonb,
        '.arena {\n  display: grid;\n  /* Atur 4 kolom grid dan gap di sini */\n}\n\n.card-1 {\n  /* Bentangkan kartu utama */\n}',
        '{"goals": [{"property": "grid-template-columns", "accepted": ["repeat(4, 1fr)", "1fr 1fr 1fr 1fr"]}, {"property": "grid-column", "accepted": ["span 2"]}]}'::jsonb
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

INSERT INTO xp_transactions (user_id, amount, source, reference_id, description) VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1250, 'ADMIN_GRANT', 'system_init', 'Bonus setup awal akun Super Admin'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 50, 'REGISTER_BONUS', 'welcome', 'Bonus selamat datang registrasi akun'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 290, 'CHALLENGE_COMPLETE', 'flexbox-1-activation', 'Menyelesaikan tantangan kurikulum Codevas'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 680, 'CHALLENGE_COMPLETE', 'html-architecture', 'Menyelesaikan materi HTML & CSS'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 520, 'CHALLENGE_COMPLETE', 'css-flexbox', 'Menyelesaikan modul Flexbox'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 280, 'CHALLENGE_COMPLETE', 'css-flexbox', 'Menyelesaikan tantangan CSS'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 190, 'CHALLENGE_COMPLETE', 'html-architecture', 'Menyelesaikan tantangan HTML')
      ON CONFLICT DO NOTHING;

INSERT INTO user_enrollments (id, user_id, class_id, status) VALUES
      ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'css-flexbox', 'ACTIVE'),
      ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'html-architecture', 'ACTIVE'),
      ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'css-grid', 'ACTIVE')
      ON CONFLICT (user_id, class_id) DO UPDATE SET status = 'ACTIVE';

INSERT INTO user_progress (user_id, challenge_id, status, code_snapshot) VALUES
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-1-activation', 'COMPLETED', '.arena {\n  display: flex;\n}'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'flexbox-2-push-justify-end', 'IN_PROGRESS', '.arena {\n  display: flex;\n  /* Lengkapi agar terdorong ke ujung kanan */\n}'),
      ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'html-1-raw-content', 'IN_PROGRESS', '<!-- Tulis judul h1 "Profil Saya" dan data nama & umurmu dengan tag p di sini -->')
      ON CONFLICT (user_id, challenge_id) DO UPDATE SET
        status = EXCLUDED.status,
        code_snapshot = EXCLUDED.code_snapshot;

SELECT count(*) FROM users;

SELECT count(*) FROM classes;

SELECT count(*) FROM challenges;

SELECT count(*) FROM user_enrollments;

SELECT count(*) FROM user_progress;

