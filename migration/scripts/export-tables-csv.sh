#!/usr/bin/env bash
# Alternatif: export setiap tabel ke CSV (untuk inspeksi manual / import via Supabase UI)
set -euo pipefail

: "${OLD_DB_URL:?Set OLD_DB_URL=postgresql://...}"

mkdir -p csv-export
TABLES=(artikel galeri jobs pendaftaran pesan program struktur_organisasi user_roles)

for t in "${TABLES[@]}"; do
  echo "Export $t ..."
  psql "$OLD_DB_URL" -c "\copy public.\"$t\" TO 'csv-export/${t}.csv' WITH CSV HEADER"
done

echo ""
echo "Selesai. File ada di folder csv-export/"
ls -lh csv-export/
