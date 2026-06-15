#!/usr/bin/env bash
# Download semua file dari bucket "media" Supabase lama
set -euo pipefail

: "${OLD_SUPABASE_URL:?Set OLD_SUPABASE_URL=https://...supabase.co}"
: "${OLD_SERVICE_KEY:?Set OLD_SERVICE_KEY=service_role_key}"

BUCKET="${BUCKET:-media}"
OUT="storage-backup/$BUCKET"
mkdir -p "$OUT"

list_dir() {
  local prefix="$1"
  curl -s -X POST \
    "$OLD_SUPABASE_URL/storage/v1/object/list/$BUCKET" \
    -H "Authorization: Bearer $OLD_SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"prefix\":\"$prefix\",\"limit\":1000,\"offset\":0}"
}

download_recursive() {
  local prefix="$1"
  local items
  items=$(list_dir "$prefix")
  echo "$items" | jq -c '.[]' | while read -r row; do
    name=$(echo "$row" | jq -r '.name')
    id=$(echo "$row" | jq -r '.id')
    path="${prefix:+$prefix/}$name"
    if [ "$id" = "null" ]; then
      # folder
      mkdir -p "$OUT/$path"
      download_recursive "$path"
    else
      mkdir -p "$OUT/$(dirname "$path")"
      echo "  $path"
      curl -s -o "$OUT/$path" \
        -H "Authorization: Bearer $OLD_SERVICE_KEY" \
        "$OLD_SUPABASE_URL/storage/v1/object/$BUCKET/$path"
    fi
  done
}

echo "Download bucket '$BUCKET' ke $OUT ..."
download_recursive ""
echo ""
echo "Selesai. Total file:"
find "$OUT" -type f | wc -l
