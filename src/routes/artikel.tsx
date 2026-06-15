import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeading } from "@/components/SectionHeading";
import { useI18n } from "@/lib/i18n";
import { useTranslatedTexts } from "@/lib/useTranslated";

export const Route = createFileRoute("/artikel")({
  head: () => ({
    meta: [
      { title: "Artikel Informasi — LPK SO KOKORO BREBES" },
      {
        name: "description",
        content:
          "Artikel & informasi terbaru seputar program magang, SSW, dan kehidupan kerja di Jepang dari LPK SO Kokoro Brebes.",
      },
    ],
  }),
  component: ArtikelPage,
});

type Artikel = {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  url_gambar: string | null;
  emoji: string | null;
  gambar_tambahan?: string[] | null;
};

function ArtikelPage() {
  const { lang } = useI18n();
  const [items, setItems] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Artikel | null>(null);

  const isVideo = (url?: string | null) =>
    !!url && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .order("tanggal", { ascending: false });
      if (!error) setItems((data as Artikel[]) || []);
      setLoading(false);
    })();
  }, []);

  const t = {
    title: lang === "jp" ? "情報記事" : "Artikel Informasi",
    subtitle:
      lang === "jp"
        ? "最新ニュース情報"
        : "Informasi berita terbaru",
    empty: lang === "jp" ? "まだ記事がありません。" : "Belum ada artikel.",
    loading: lang === "jp" ? "読み込み中..." : "Memuat...",
    read: lang === "jp" ? "続きを読む" : "Baca selengkapnya",
    close: lang === "jp" ? "閉じる" : "Tutup",
  };

  const titlesT = useTranslatedTexts(items.map((i) => i.judul));
  const descsT = useTranslatedTexts(items.map((i) => i.deskripsi));
  const activeTitleT = useTranslatedTexts([active?.judul ?? ""])[0];
  const activeDescT = useTranslatedTexts([active?.deskripsi ?? ""])[0];

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === "jp" ? "ja-JP" : "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.title} subtitle={t.subtitle} />

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">{t.loading}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">{t.empty}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => setActive(item)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                className="text-left bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-japan transition-all hover:-translate-y-1 flex flex-col group"
              >
                <div className="relative h-48 bg-gradient-japan flex items-center justify-center overflow-hidden">
                  {item.url_gambar ? (
                    isVideo(item.url_gambar) ? (
                      <video
                        src={item.url_gambar}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <img
                        src={item.url_gambar}
                        alt={titlesT[i] || item.judul}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )
                  ) : (
                    <div className="text-5xl">{item.emoji || <Newspaper className="w-12 h-12 text-primary-foreground" />}</div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {fmtDate(item.tanggal)}
                  </div>
                  <h3 className="font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {titlesT[i] || item.judul}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {descsT[i] || item.deskripsi}
                  </p>
                  <span className="mt-auto text-sm text-primary font-medium">
                    {t.read} →
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {active.url_gambar && (
                <div className="w-full bg-black flex items-center justify-center">
                  {isVideo(active.url_gambar) ? (
                    <video
                      src={active.url_gambar}
                      controls
                      playsInline
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  ) : (
                    <img
                      src={active.url_gambar}
                      alt={activeTitleT || active.judul}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {fmtDate(active.tanggal)}
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="p-1 rounded hover:bg-muted"
                    aria-label={t.close}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {activeTitleT || active.judul}
                </h2>
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {activeDescT || active.deskripsi}
                </div>
                {Array.isArray(active.gambar_tambahan) && active.gambar_tambahan.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {active.gambar_tambahan.map((url, idx) => (
                      isVideo(url) ? (
                        <video
                          key={idx}
                          src={url}
                          controls
                          playsInline
                          preload="metadata"
                          className="block rounded-lg overflow-hidden bg-black aspect-square w-full h-full object-cover"
                        />
                      ) : (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg overflow-hidden bg-muted aspect-square hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={url}
                            alt={`${activeTitleT || active.judul} - ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}