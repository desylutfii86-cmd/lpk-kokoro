#!/usr/bin/env bash
# Restore backup.sql ke Supabase baru
set -euo pipefail

: "${NEW_DB_URL:?Set NEW_DB_URL=postgresql://... terlebih dahulu}"

IN="${1:-backup.sql}"
[ -f "$IN" ] || { echo "File $IN tidak ditemukan. Jalankan export-database.sh dulu."; exit 1; }

echo "PERINGATAN: ini akan menambah/menimpa data di database baru."
read -rp "Lanjut? (y/N): " ans
[[ "$ans" == "y" || "$ans" == "Y" ]] || exit 0

echo "Mengimpor $IN ke database baru ..."
psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -f "$IN"

echo ""
echo "Selesai. Verifikasi:"
psql "$NEW_DB_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
