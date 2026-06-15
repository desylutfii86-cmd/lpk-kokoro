import { createServerFn } from "@tanstack/react-start";

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
  image?: string;
  category: "internship" | "ssw" | "general";
};

const FEEDS: { url: string; category: NewsItem["category"] }[] = [
  {
    url: "https://news.google.com/rss/search?q=magang+jepang+OR+pemagangan+jepang+OR+kenshusei&hl=id&gl=ID&ceid=ID:id",
    category: "internship",
  },
  {
    url: "https://news.google.com/rss/search?q=Japan+technical+intern+trainee+OR+ginou+jisshusei&hl=en-ID&gl=ID&ceid=ID:en",
    category: "internship",
  },
  {
    url: "https://news.google.com/rss/search?q=SSW+jepang+OR+tokutei+ginou+OR+specified+skilled+worker&hl=id&gl=ID&ceid=ID:id",
    category: "ssw",
  },
  {
    url: "https://news.google.com/rss/search?q=Japan+specified+skilled+worker+visa&hl=en-ID&gl=ID&ceid=ID:en",
    category: "ssw",
  },
  {
    url: "https://news.google.com/rss/search?q=berita+jepang&hl=id&gl=ID&ceid=ID:id",
    category: "general",
  },
  {
    url: "https://news.google.com/rss/search?q=Japan+news&hl=en-ID&gl=ID&ceid=ID:en",
    category: "general",
  },
];

const KEYWORDS: Record<NewsItem["category"], RegExp> = {
  internship: /(magang|pemagangan|kenshusei|technical intern|jisshusei|trainee)/i,
  ssw: /(\bssw\b|tokutei ginou|tokutei ginō|specified skilled worker|tokuteiginou)/i,
  general: /./,
};

function classify(item: Omit<NewsItem, "category">, fallback: NewsItem["category"]): NewsItem["category"] {
  const hay = `${item.title} ${item.description}`;
  if (KEYWORDS.internship.test(hay)) return "internship";
  if (KEYWORDS.ssw.test(hay)) return "ssw";
  return fallback;
}

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string) {
  return decode(s).replace(/<[^>]+>/g, "").trim();
}

function pick(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1] : "";
}

function parseRss(xml: string, fallbackCategory: NewsItem["category"]): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item[\s\S]*?<\/item>/g;
  const matches = xml.match(itemRe) || [];
  for (const raw of matches) {
    const title = stripTags(pick(raw, "title"));
    const link = stripTags(pick(raw, "link"));
    const pubDate = stripTags(pick(raw, "pubDate"));
    const descRaw = pick(raw, "description");
    const source = stripTags(pick(raw, "source")) || "Google News";
    const imgMatch = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
    // Google News RSS wraps articles behind news.google.com which often
    // refuses to load directly. The description contains the real source
    // article URL inside the first <a href="..."> — prefer that.
    const hrefMatches = Array.from(
      decode(descRaw).matchAll(/<a[^>]+href=["']([^"']+)["']/gi)
    ).map((m) => m[1]);
    const realLink =
      hrefMatches.find((h) => !/news\.google\.com/i.test(h)) || link;
    const base = {
      title,
      link: realLink,
      pubDate,
      source,
      description: stripTags(descRaw).slice(0, 240),
      image: imgMatch ? imgMatch[1] : undefined,
    };
    items.push({ ...base, category: classify(base, fallbackCategory) });
  }
  return items;
}

export const getNews = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.allSettled(
    FEEDS.map((f) =>
      fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 KokoroNewsBot" } })
        .then((r) => r.text())
        .then((xml) => ({ xml, category: f.category }))
    )
  );

  const all: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      try {
        all.push(...parseRss(r.value.xml, r.value.category));
      } catch (e) {
        console.error("parse failed", e);
      }
    }
  }

  // Dedup by title
  const seen = new Set<string>();
  const unique = all.filter((n) => {
    const k = n.title.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return Boolean(n.title && n.link);
  });

  // Sort by date desc
  unique.sort((a, b) => {
    const da = Date.parse(a.pubDate) || 0;
    const db = Date.parse(b.pubDate) || 0;
    return db - da;
  });

  return { items: unique.slice(0, 40), fetchedAt: new Date().toISOString() };
});