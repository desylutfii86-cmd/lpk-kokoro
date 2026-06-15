const CHUNK_RELOAD_STORAGE_KEY = "__lov_chunk_reload_at";
const CHUNK_RELOAD_COOLDOWN_MS = 10_000;

export function isChunkImportError(error: unknown) {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message ?? "")
          : "";

  return (
    /Importing a module script failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /ChunkLoadError/i.test(message)
  );
}

export function reloadIfChunkImportError(error: unknown) {
  if (typeof window === "undefined" || !isChunkImportError(error)) return false;

  const last = Number(window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY) || 0);
  if (Date.now() - last <= CHUNK_RELOAD_COOLDOWN_MS) return false;

  window.sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, String(Date.now()));
  window.location.reload();
  return true;
}