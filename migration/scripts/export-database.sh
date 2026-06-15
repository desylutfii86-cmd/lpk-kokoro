#!/usr/bin/env bash
# Dump database lama (schema + data) ke backup.sql
set -euo pipefail

: "${OLD_DB_URL:?Set OLD_DB_URL=postgresql://... terlebih dahulu}"

OUT="${1:-backup.sql}"
echo "Mengekspor database ke $OUT ..."

pg_dump "$OLD_DB_URL" \
  --schema=public \
  --no-owner \
  --no-acl \
  --no-publications \
  --no-subscriptions \
  --quote-all-identifiers \
  -f "$OUT"

echo "Selesai. Ukuran file:"
ls -lh "$OUT"
echo ""
echo "Langkah berikutnya: bash migration/scripts/import-database.sh"
