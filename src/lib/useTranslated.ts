import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const CACHE_KEY = "kokoro_translation_cache_v1";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Cache = Record<string, Record<string, string>>; // lang -> { srcText: translated }

function loadCache(): Cache {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(c: Cache) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    // ignore quota errors
  }
}

const inflight = new Map<string, Promise<string>>();

/**
 * Translate an array of source (Indonesian) strings to the current language.
 * - When lang === "id": returns inputs unchanged.
 * - When lang === "jp": returns Japanese translations (cached in localStorage).
 *
 * Empty/whitespace strings are returned as-is.
 */
export function useTranslatedTexts(texts: (string | null | undefined)[]): string[] {
  const { lang } = useI18n();
  const [version, setVersion] = useState(0);
  const cacheRef = useRef<Cache>(loadCache());

  // Stable signature so effect re-runs only on real change
  const key = useMemo(() => `${lang}::${JSON.stringify(texts)}`, [lang, texts]);

  useEffect(() => {
    if (lang === "id") return;
    const cache = (cacheRef.current[lang] = cacheRef.current[lang] || {});
    const missing: string[] = [];
    for (const t of texts) {
      const s = (t || "").toString();
      if (!s.trim()) continue;
      if (cache[s] === undefined && !inflight.has(`${lang}::${s}`)) {
        missing.push(s);
      }
    }
    if (missing.length === 0) return;

    // Dedupe
    const unique = Array.from(new Set(missing));
    const reqKey = `${lang}::${unique.join("\u0001")}`;
    const promise = (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_KEY}`,
            apikey: SUPABASE_KEY,
          },
          body: JSON.stringify({ texts: unique, target: lang }),
        });
        if (!res.ok) throw new Error(`translate ${res.status}`);
        const data = await res.json();
        const translations: string[] = data.translations || [];
        unique.forEach((src, i) => {
          cache[src] = translations[i] ?? src;
        });
        saveCache(cacheRef.current);
        setVersion((v) => v + 1);
      } catch (e) {
        console.error("translate failed", e);
        // Fallback to source
        unique.forEach((src) => {
          if (cache[src] === undefined) cache[src] = src;
        });
        setVersion((v) => v + 1);
      }
      return "done";
    })();

    unique.forEach((src) => inflight.set(`${lang}::${src}`, promise as any));
    promise.finally(() => {
      unique.forEach((src) => inflight.delete(`${lang}::${src}`));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return useMemo(() => {
    if (lang === "id") return texts.map((t) => (t ?? "").toString());
    const cache = cacheRef.current[lang] || {};
    return texts.map((t) => {
      const s = (t ?? "").toString();
      if (!s.trim()) return s;
      return cache[s] ?? s;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version, lang]);
}

/** Single string convenience wrapper. */
export function useTranslatedText(text: string | null | undefined): string {
  const arr = useTranslatedTexts([text]);
  return arr[0] ?? "";
}
