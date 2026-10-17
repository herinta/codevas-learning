# 🚀 Panduan Lengkap Deploy Production: Codevas ke Synology NAS + Custom Domain & Cloudflare Tunnel

Dokumen ini berisi panduan end-to-end (langkah demi langkah) untuk mendeploy aplikasi **Codevas** (Next.js 15 + PostgreSQL) ke **Synology NAS** menggunakan **Container Manager / Docker**, terhubung ke domain kustom (`codevas.my.id`) secara gratis dan aman tanpa perlu IP publik statis, tanpa port forwarding, serta dilengkapi auto-update via CI/CD GitHub Actions & Watchtower.

---

## 📐 Arsitektur Sistem

```mermaid
flowchart TD
    subgraph Developer["💻 Local Machine / Developer"]
        DevCode["Code Changes"] --> GitPush["git push origin main"]
    end

    subgraph GitHub["🐙 GitHub & GitHub Actions"]
        GitPush --> GHActions["GitHub Actions CI/CD"]
        GHActions --> BuildMultiArch["Docker Buildx (AMD64 + ARM64)"]
        BuildMultiArch --> GHCR["GitHub Container Registry (GHCR)\nghcr.io/herinta/codevas-learning:latest"]
    end

    subgraph Internet["🌐 Internet & Cloudflare Edge"]
        UserBrowser["Pengunjung / Browser (https://codevas.my.id)"]
        UserBrowser --> CloudflareDNS["Cloudflare DNS & SSL (Free)"]
        CloudflareDNS --> CFTunnel["Cloudflare Tunnel Edge"]
    end

    subgraph SynologyNAS["🏠 Synology NAS (192.168.18.64 - ARM64)"]
        subgraph ContainerManager["Docker / Container Manager (codevas-net)"]
            CFTunnel <== Outbound Encrypted Tunnel ==> TunnelContainer["codevas-tunnel\n(cloudflare/cloudflared)"]
            TunnelContainer -->|"http://codevas-web:3000"| WebContainer["codevas-web\n(Next.js Standalone)"]
            WebContainer <-->|"postgresql://..."| DBContainer["codevas-db\n(Postgres 16 Alpine)"]
            DBContainer --- VolumeDB[("Volume: codevas_pgdata")]
            Watchtower["codevas-watchtower"] -.->|"Cek image baru tiap 60s"| GHCR
            Watchtower -.->|"Auto restart container jika ada update"| WebContainer
        end
    end
```

---

## 🛠️ Prasyarat (Prerequisites)

1. **Hardware & OS:**
   - Synology NAS yang mendukung **Container Manager** (contoh: DS223 / DSM 7.2+ dengan arsitektur CPU ARM64 atau AMD64).
   - Akses jaringan lokal (LAN/WiFi) ke Synology NAS.
2. **Akun & Domain:**
   - Akun **GitHub** (repository codevas).
   - Domain kustom aktif (contoh: `codevas.my.id`).
   - Akun gratis **Cloudflare**.
3. **Tools Lokal:**
   - Git & Node.js.
   - `cloudflared` CLI terpasang di komputer lokal (`winget install --id Cloudflare.cloudflared` untuk Windows).

---

## 📋 Tahap 1: Konfigurasi Next.js untuk Docker Standalone

Agar container Next.js berukuran kecil (<150 MB) dan tidak perlu menjalankan `npm install` di dalam container produksi:

### 1.1. Update `next.config.ts`
Pastikan opsi `output: "standalone"` aktif:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // konfigurasi lainnya...
};

export default nextConfig;
```

### 1.2. Buat `Dockerfile` Multi-Stage
Gunakan multi-stage build agar build cepat dan aman:
```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📋 Tahap 2: Otomasi CI/CD Multi-Arch ke GHCR

> ⚠️ **Catatan Penting CPU:** NAS Synology (seperti seri DS223) menggunakan prosesor **ARM64** (`Realtek RTD1619B`), sedangkan komputer lokal atau runner GitHub default adalah **AMD64**. Workflow CI/CD harus meng-compile kedua arsitektur menggunakan QEMU agar tidak muncul error `no matching manifest for linux/arm64/v8`.

Buat file `.github/workflows/deploy.yml`:
```yaml
name: Build and Publish Docker Image

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=latest
            type=sha,format=short

      - name: Set up QEMU (Multi-platform support)
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push Docker image (amd64 and arm64)
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

> **Akses GHCR Publik:** Masuk ke GitHub Profile -> **Packages** -> pilih `codevas-learning` -> **Package settings** -> ubah visibility menjadi **Public** agar Synology NAS dapat men-pull image tanpa perlu login manual.

---

## 📋 Tahap 3: Setup Domain & Cloudflare DNS

1. **Beli Domain:** Beli domain dari registrar pilihan (misal `.my.id` seharga ~Rp 12.000 - 15.000 / tahun).
2. **Daftarkan ke Cloudflare:**
   - Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/) -> klik **Add a Site** -> masukkan nama domain (contoh: `codevas.my.id`).
   - Pilih paket **Free**.
3. **Ubah Nameserver di Registrar:**
   - Salin 2 Nameserver dari Cloudflare (contoh: `alina.ns.cloudflare.com` & `norman.ns.cloudflare.com`).
   - Buka panel manajemen domain di registrar, ganti nameserver default dengan nameserver Cloudflare tersebut.
   - Tunggu status domain di Cloudflare berubah menjadi **Active** (biasanya 5–15 menit).

---

## 📋 Tahap 4: Setup Cloudflare Tunnel (Bebas Kartu Kredit)

> 💡 **Trik Bypassing Credit Card:** Membuat Tunnel melalui dashboard *Zero Trust* sering meminta kartu kredit meskipun memilih Free plan. Solusi resmi 100% gratis tanpa kartu kredit adalah menggunakan **Cloudflare CLI (`cloudflared`)**.

### 4.1. Login CLI
Di terminal komputer lokal, jalankan:
```bash
cloudflared tunnel login
```
Browser akan otomatis terbuka. Pilih domain `codevas.my.id` untuk mengotorisasi sertifikat. File `cert.pem` akan tersimpan di komputer lokal (`~/.cloudflared/cert.pem`).

### 4.2. Buat Named Tunnel
```bash
cloudflared tunnel create codevas-nas
```
Output akan memberikan **Tunnel ID** (UUID) dan membuat file kredensial JSON di `~/.cloudflared/<TUNNEL_ID>.json`.

### 4.3. Hubungkan Domain via CNAME DNS
Arahkan domain utama dan subdomain www ke tunnel:
```bash
cloudflared tunnel route dns codevas-nas codevas.my.id
cloudflared tunnel route dns codevas-nas www.codevas.my.id
```

### 4.4. Buat File Konfigurasi Ingress Tunnel
Di dalam folder project `docker/`, buat 2 file:

1. **`docker/tunnel-config.yml`**:
   ```yaml
   tunnel: <TUNNEL_ID_ANDA>
   credentials-file: /etc/cloudflared/tunnel-creds.json

   ingress:
     - hostname: codevas.my.id
       service: http://codevas-web:3000
     - hostname: www.codevas.my.id
       service: http://codevas-web:3000
     - service: http_status:404
   ```

2. **`docker/tunnel-creds.json`**:
   Salin seluruh isi file kredensial dari `~/.cloudflared/<TUNNEL_ID>.json` ke file ini.

---

## 📋 Tahap 5: Setup File & Folder di Synology NAS

Buka **File Station** di DSM Synology, lalu buat struktur folder berikut:

```text
/docker/
└── codevas/
    ├── docker-compose.yml
    └── docker/
        ├── init-db.sql
        ├── tunnel-config.yml
        └── tunnel-creds.json
```

### Isi File `docker-compose.yml`:
```yaml
version: '3.8'

services:
  # 1. Database PostgreSQL 16
  codevas-db:
    image: postgres:16-alpine
    container_name: codevas-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: codevas_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    volumes:
      - codevas_pgdata:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d codevas_db"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - codevas-net

  # 2. Next.js App
  codevas-web:
    image: ghcr.io/herinta/codevas-learning:latest
    container_name: codevas-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:root@codevas-db:5432/codevas_db
      DB_HOST: codevas-db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: root
      DB_NAME: codevas_db
      NEXTAUTH_URL: https://codevas.my.id
      PORT: 3000
      HOSTNAME: "0.0.0.0"
    depends_on:
      codevas-db:
        condition: service_healthy
    networks:
      - codevas-net
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  # 3. Watchtower (Auto-reloader saat ada push image baru)
  codevas-watchtower:
    image: containrrr/watchtower:latest
    container_name: codevas-watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=60
      - WATCHTOWER_LABEL_ENABLE=true
    networks:
      - codevas-net

  # 4. Cloudflare Tunnel (Koneksi Outbound Aman)
  codevas-tunnel:
    image: cloudflare/cloudflared:latest
    container_name: codevas-tunnel
    restart: unless-stopped
    command: tunnel --no-autoupdate --config /etc/cloudflared/config.yml run
    volumes:
      - ./docker/tunnel-config.yml:/etc/cloudflared/config.yml:ro
      - ./docker/tunnel-creds.json:/etc/cloudflared/tunnel-creds.json:ro
    depends_on:
      - codevas-web
    networks:
      - codevas-net

volumes:
  codevas_pgdata:
    name: codevas_pgdata

networks:
  codevas-net:
    name: codevas-net
    driver: bridge
```

---

## 📋 Tahap 6: Menjalankan Project di Synology Container Manager

1. Buka **Container Manager** di DSM Synology.
2. Masuk ke tab **Project** -> klik **Create**.
3. Isi parameter:
   - **Project Name:** `codevas`
   - **Path:** `/docker/codevas`
   - **Source:** Pilih *Use existing docker-compose.yml*.
4. Klik **Next** -> **Done**.
5. Container Manager akan otomatis:
   - Men-download image `postgres:16-alpine`, `ghcr.io/herinta/codevas-learning:latest`, `containrrr/watchtower`, dan `cloudflare/cloudflared`.
   - Menginisialisasi database dari `init-db.sql`.
   - Membuka tunnel ke Cloudflare.
6. Tunggu hingga keempat container berstatus hijau (**Running**).

---

## 📋 Tahap 7: Siklus Update Otomatis (CI/CD Workflow)

Setelah setup selesai, **kamu tidak perlu lagi login ke Synology NAS untuk setiap ada update kode baru!**

Cukup lakukan workflow standar:
```bash
# 1. Edit kode aplikasi di lokal
git add .
git commit -m "feat: fitur baru"

# 2. Push ke branch main
git push origin main
```

**Proses Otomatis yang Terjadi:**
1. **GitHub Actions** mendeteksi push -> membangun image multi-arch Docker -> mempublikasikan ke GHCR (`ghcr.io/herinta/codevas-learning:latest`).
2. **Watchtower** di Synology NAS mengecek GHCR setiap 60 detik.
3. Saat menemukan image baru, Watchtower otomatis mendownload image terbaru, mematikan container `codevas-web` lama, menyalakan container baru dengan konfigurasi yang sama, dan membersihkan image lama.
4. Perubahan langsung aktif di `https://codevas.my.id` tanpa downtime database.

---

## ❓ FAQ & Troubleshooting

### Q1: Apakah perlu mengonfigurasi DDNS di Synology DSM?
**Jawab: TIDAK PERLU.**
Cloudflare Tunnel bekerja dengan metode *outbound reverse tunnel* (container NAS yang aktif membuka koneksi keluar ke server Cloudflare). Sehingga NAS tidak memerlukan IP publik statis, tidak butuh DDNS, dan kebal terhadap CGNAT ISP (IndiHome, dsb.).

### Q2: Apakah perlu setting Port Forwarding di Router / ONT modem rumah?
**Jawab: TIDAK PERLU.**
Semua port inbound di router tetap tertutup rapat (tidak ada port 80/443 yang dibuka ke internet publik). Ini jauh lebih aman dari serangan hacking / bot scanner luar.

### Q3: Kenapa muncul `502 Bad Gateway` saat pertama kali membuka domain?
1. Pastikan container `codevas-web` sudah selesai booting (bisa dicek lewat Log di Container Manager).
2. Periksa service ingress di `docker/tunnel-config.yml`. Karena kedua container berada di dalam network bridge Docker yang sama (`codevas-net`), alamat service harus menggunakan nama container `http://codevas-web:3000`, bukan `localhost:3000`.

### Q4: Bagaimana cara memeriksa log container jika ada error?
Di DSM Synology:
- Buka **Container Manager** -> tab **Container**.
- Klik dua kali pada container yang bermasalah (misal `codevas-web` atau `codevas-tunnel`).
- Masuk ke tab **Log** untuk melihat pesan error secara real-time.

---

## 📝 Ringkasan URL & Port Penting

| Komponen | Alamat / Endpoint | Keterangan |
| :--- | :--- | :--- |
| **Domain Publik** | [https://codevas.my.id](https://codevas.my.id) | Akses HTTPS aman via Cloudflare |
| **Domain Publik (WWW)** | [https://www.codevas.my.id](https://www.codevas.my.id) | CNAME terarah ke Tunnel |
| **Akses Lokal LAN** | `http://192.168.18.64:3000` | Akses langsung dari jaringan rumah |
| **PostgreSQL Internal** | `codevas-db:5432` | Koneksi internal antar container |
| **Database Name / User** | `codevas_db` / `postgres` | Data tersimpan permanen di volume `codevas_pgdata` |
