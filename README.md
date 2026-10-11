# MovieFlix — Streaming Movie & Series App

Aplikasi streaming film dan series mirip LK21, dibangun dengan React + Vite + Tailwind CSS, menggunakan API gratis dari **TMDB (The Movie Database)**.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS 3 (Dark theme custom) |
| **HTTP Client** | Axios |
| **Icons** | React Icons (Feather) |
| **API Source** | TMDB (The Movie Database) v3 |
| **Process Manager** | systemd (production) |
| **Reverse Proxy** | Nginx (optional, for SSL/domain) |

---

## ✨ Fitur Utama

- 🎬 **Home** — Hero carousel, Trending mingguan, Popular Film & Series, Top Rated
- 🎞️ **Film & Series** — Grid responsif, filter genre, **sort tahun rilis** (terbaru/terlama), pagination
- 🔍 **Search** — Cari film/series/aktor, filter genre, hasil real-time
- 📺 **Detail Film/Series** — Poster, info (tahun, rating, durasi), **video player (YouTube trailer/teaser/featurette)**, cast, film serupa
- 🎭 **Genre Browse** — Browse per genre (Film/Series)
- 📱 **Fully Responsive** — Mobile, tablet, desktop
- 🌙 **Dark Theme Professional** — Slate + Primary Red, custom scrollbar, skeleton loading
- ⚡ **Scroll to Top** — Otomatis ke atas saat pindah halaman
- 🔧 **Production Ready** — systemd service, auto-restart, optimized build

---

## 📦 Prasyarat Server

| Komponen | Versi Minimum | Catatan |
|----------|---------------|---------|
| **Node.js** | 20.x LTS | Install via NodeSource atau nvm |
| **npm** | 10.x | Termasuk dalam Node.js |
| **Git** | 2.x | `apt install git` |
| **Nginx** | 1.24+ | Optional, untuk reverse proxy + SSL |
| **Ubuntu/Debian** | 22.04+ | Tested on Ubuntu 24.04 LTS |

### Install Node.js 20 LTS (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x.x
npm -v    # 10.x.x
```

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/sekolah-alazhar/nonton-movie.git
cd nonton-movie
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Environment Variables
Buat file `.env` di root project:
```bash
cp .env.example .env
# Edit .env dan isi TMDB API Key
```

**Required:**
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> **Dapatkan API Key gratis:** Daftar di [themoviedb.org](https://www.themoviedb.org/settings/api) → Request API Key (v3 Auth) → Copy ke `.env`

### 4. Development Mode
```bash
npm run dev
# Akses: http://localhost:3000
```

### 5. Production Build
```bash
npm run build
# Output di folder dist/
```

### 6. Production Deploy (systemd + Nginx)

**A. systemd Service** (sudah include di repo)
```bash
sudo cp deploy/app-movie.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now app-movie
# App jalan di port 3000
```

**B. Nginx Reverse Proxy** (untuk domain + SSL)
```nginx
# /etc/nginx/sites-available/nonton-movie
server {
    listen 80;
    server_name domain.anda.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/nonton-movie /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# SSL via certbot: sudo certbot --nginx -d domain.anda.com
```

---

## 📁 Struktur Project

```
nonton-movie/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Navigation + mobile menu
│   │   ├── MovieCard.tsx   # Movie poster card
│   │   ├── MovieGrid.tsx   # Grid wrapper + skeleton
│   │   └── Skeleton.tsx    # Loading skeletons
│   ├── pages/              # Route pages
│   │   ├── Home.tsx
│   │   ├── MoviesPage.tsx  # Film + Series (shared)
│   │   ├── MovieDetailPage.tsx
│   │   ├── SeriesDetailPage.tsx
│   │   ├── SearchPage.tsx
│   │   └── GenrePage.tsx
│   ├── services/
│   │   └── api.ts          # TMDB API client (axios)
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   ├── App.tsx             # Routes + ScrollToTop
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind + global styles
├── deploy/
│   └── app-movie.service   # systemd unit file
├── .env.example            # Template env
├── tailwind.config.js      # Tailwind custom theme
├── vite.config.ts          # Vite config (port 3000)
├── tsconfig.json
└── package.json
```

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_TMDB_API_KEY` | **YES** | - | TMDB v3 API Key |

---

## 🌿 Git Workflow (Branching Strategy)

Repository ini menggunakan **2 branch utama**:

| Branch | Tujuan | Protection |
|--------|--------|------------|
| **`prod`** | **Production-ready code** — hanya kode yang sudah tested, stable, dan siap deploy | **Protected** — tidak bisa push langsung, hanya via PR dari `dev` |
| **`dev`** | **Development branch** — semua fitur baru, bugfix, eksperimen masuk sini dulu | **Default branch** — push bebas untuk development |

### Alur Kerja (Workflow)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Developer bekerja di branch `dev` (atau feature branch)  │
│    ├── Commit perubahan ke `dev`                            │
│    ├── Test lokal: `npm run build` + `npm run preview`     │
│    └── Push ke origin/dev                                   │
├─────────────────────────────────────────────────────────────┤
│ 2. Code Review / QA di `dev`                                │
│    ├── Verifikasi fitur berjalan                            │
│    ├── Cek build production sukses                          │
│    └── Tidak ada regression                                 │
├─────────────────────────────────────────────────────────────┤
│ 3. Merge ke `prod` via Pull Request                         │
│    ├── Buat PR: `dev` → `prod`                              │
│    ├── Review & approve                                     │
│    ├── Merge (squash atau merge commit)                     │
│    └── Tag release (optional): `v1.0.0`, `v1.1.0`, dll.    │
├─────────────────────────────────────────────────────────────┤
│ 4. Deploy dari `prod`                                       │
│    ├── Server pull branch `prod`                            │
│    ├── `npm ci && npm run build`                            │
│    └── `systemctl restart app-movie`                        │
└─────────────────────────────────────────────────────────────┘
```

### Quick Commands

```bash
# Kerja harian di dev
git checkout dev
git pull origin dev
# ... coding ...
git add . && git commit -m "feat: deskripsi perubahan"
git push origin dev

# Siap release → buat PR di GitHub: dev → prod
# Setelah approve & merge:
git checkout prod
git pull origin prod
# Deploy ke server
```

---

## 🛠️ Scripts NPM

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000, hot reload) |
| `npm run build` | Production build (output: `dist/`) |
| `npm run preview` | Preview production build locally (port 3000) |
| `npm run lint` | ESLint check (jika dikonfigurasi) |

---

## 🔧 Konfigurasi Tambahan

### Tailwind Custom Theme (`tailwind.config.js`)
- **Colors**: `primary` (Red), `dark` (Slate 950 base)
- **Fonts**: `display` (Space Grotesk), `body` (Inter)
- **Animations**: `fade-in`, `slide-up`, `slide-down`

### Vite Config (`vite.config.ts`)
```ts
server: { host: '0.0.0.0', port: 3000, strictPort: true }
preview: { host: '0.0.0.0', port: 3000, strictPort: true }
```

### TypeScript Strict Mode
Project menggunakan `tsconfig.json` dengan `strict: true` — semua type wajib aman.

---

## 📝 API Reference (Internal)

`src/services/api.ts` — wrapper Axios untuk TMDB:

```typescript
movieApi.getTrending('week')           // Trending mingguan
movieApi.getDiscover(type, page, sort, genre, year)  // Film/Series dengan filter
movieApi.getTopRated('movie', 1)       // Top rated
movieApi.search(query, page)           // Multi search
movieApi.getMovieDetail(id)            // Detail + videos + cast + similar
movieApi.getSeriesDetail(id)           // Detail series + seasons
movieApi.getGenres()                   // List genre (movie + tv)
```

**Sort Options:** `popularity.desc`, `vote_average.desc`, `release_date.desc`, `release_date.asc`

**Year Filter:** `primary_release_year` (movie) / `first_air_date_year` (tv)

---

## 🐛 Troubleshooting

| Issue | Solusi |
|-------|--------|
| **Video tidak muncul** | Pastikan `VITE_TMDB_API_KEY` valid. TMDB `language=id-ID` tidak punya video — kode sudah pakai `en-US` untuk videos |
| **Build error TypeScript** | Cek `npm run build` log, pastikan semua import type benar |
| **Port 3000 konflik** | Ganti di `vite.config.ts` atau stop service lain |
| **systemd tidak start** | `journalctl -u app-movie -f` untuk lihat log |
| **Nginx 502** | Pastikan service `app-movie` running (`systemctl status app-movie`) |

---

## 📄 License

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.

---

## 🤝 Contributing

1. Fork repo
2. Buat branch: `git checkout -b feat/nama-fitur` dari `dev`
3. Commit: `git commit -m "feat: deskripsi"`
4. Push: `git push origin feat/nama-fitur`
5. Buat **Pull Request** ke `dev`

---

## 📞 Support

- **Author**: Pak Pudin (sekolah-alazhar)
- **Repository**: https://github.com/sekolah-alazhar/nonton-movie
- **Issues**: Gunakan GitHub Issues untuk bug report & feature request

---

> **Dibangun dengan ❤️ untuk komunitas penggemar film Indonesia**  
> *Powered by TMDB API — Data provided by [The Movie Database](https://www.themoviedb.org/)*