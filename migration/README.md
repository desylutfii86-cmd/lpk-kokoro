# Panduan Migrasi Hosting & Database

Folder ini berisi semua script & template untuk memindahkan project ini
(kode TanStack Start + database Lovable Cloud / Supabase) ke hosting lain.

## Isi Folder

```
migration/
├── README.md                       ← file ini
├── .env.example                    ← template environment variables baru
├── sql/
│   └── schema.sql                  ← schema database (tables, RLS, functions)
└── scripts/
    ├── export-database.sh          ← dump DB lama → backup.sql
    ├── import-database.sh          ← restore backup.sql ke Supabase baru
    ├── export-storage.sh           ← download semua file bucket "media"
    ├── import-storage.sh           ← upload ulang ke bucket Supabase baru
    └── export-tables-csv.sh        ← alternatif: export per-tabel ke CSV
```

## Langkah Migrasi

### 1. Siapkan Project Supabase Baru
- Daftar di https://supabase.com → buat project baru
- Catat: Project URL, anon key, service_role key, Database password
- Connection string format:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 2. Migrasi Database
```bash
export OLD_DB_URL="postgresql://..."   # Lovable Cloud lama
export NEW_DB_URL="postgresql://..."   # Supabase baru

bash migration/scripts/export-database.sh
bash migration/scripts/import-database.sh
```

### 3. Migrasi Storage (bucket `media`)
```bash
export OLD_SUPABASE_URL="https://wtweyuhkqfhowlexurli.supabase.co"
export OLD_SERVICE_KEY="<service_role_key_lama>"
export NEW_SUPABASE_URL="https://[NEW-REF].supabase.co"
export NEW_SERVICE_KEY="<service_role_key_baru>"

bash migration/scripts/export-storage.sh
bash migration/scripts/import-storage.sh
```

### 4. Migrasi Kode
- Connect GitHub via Lovable: **+ menu → GitHub → Connect**
- Clone: `git clone <repo-url>`
- Copy `migration/.env.example` → `.env`, isi kredensial Supabase baru
- `bun install && bun run build`

### 5. Deploy

**Cloudflare Workers** (native, sudah ada `wrangler.jsonc`):
```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_PUBLISHABLE_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler deploy
```

**Vercel:**
```bash
npm i -g vercel && vercel --prod
```

### 6. Verifikasi
- [ ] Semua tabel ada di Supabase baru
- [ ] RLS policies aktif
- [ ] Storage bucket `media` berisi semua file
- [ ] Website tampil & login admin berhasil
- [ ] Form pendaftaran & kontak bisa submit

## Catatan Penting

- **`LOVABLE_API_KEY`** tidak jalan di luar Lovable. Ganti dengan API key
  OpenAI/Gemini langsung jika pakai fitur AI.
- **Domain custom** Lovable: pindahkan DNS ke hosting baru.
- **Edge function `translate`** deploy ulang ke Supabase baru:
  `npx supabase functions deploy translate`

## Prasyarat

- `psql` & `pg_dump` — https://www.postgresql.org/download/
- `curl`, `jq`, `bun` atau `node` 20+
- `wrangler` (untuk Cloudflare): `npm i -g wrangler`
