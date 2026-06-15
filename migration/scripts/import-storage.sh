#!/usr/bin/env bash
# Upload ulang isi storage-backup/<bucket>/ ke Supabase baru
set -euo pipefail

: "${NEW_SUPABASE_URL:?Set NEW_SUPABASE_URL=https://...supabase.co}"
: "${NEW_SERVICE_KEY:?Set NEW_SERVICE_KEY=service_role_key}"

BUCKET="${BUCKET:-media}"
SRC="storage-backup/$BUCKET"
[ -d "$SRC" ] || { echo "Folder $SRC tidak ada. Jalankan export-storage.sh dulu."; exit 1; }

# Buat bucket (publik) — abaikan error kalau sudah ada
echo "Membuat bucket '$BUCKET' (jika belum ada) ..."
curl -s -X POST "$NEW_SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $NEW_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$BUCKET\",\"name\":\"$BUCKET\",\"public\":true}" \
  | jq . || true

echo "Upload file ..."
cd "$SRC"
find . -type f | while read -r f; do
  path="${f#./}"
  mime=$(file --mime-type -b "$f")
  echo "  $path ($mime)"
  curl -s -X POST \
    "$NEW_SUPABASE_URL/storage/v1/object/$BUCKET/$path" \
    -H "Authorization: Bearer $NEW_SERVICE_KEY" \
    -H "Content-Type: $mime" \
    -H "x-upsert: true" \
    --data-binary "@$f" > /dev/null
done

echo ""
echo "Selesai upload ke bucket '$BUCKET'."
