import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTexts } from "@/lib/useTranslated";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "Galeri — LPK SO KOKORO BREBES" },
      { name: "description", content: "Dokumentasi kegiatan dan alumni SO KOKORO BREBES" },
    ],
  }),
  component: GaleriPage,
});

function GaleriPage() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("galeri").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoaded(true);
    });
  }, []);

  const cleanCaption = (c: string) => String(c || "").replace(/^\[(kegiatan|pembelajaran|keberangkatan)\]\s*/i, "");
  const display = items;
  const captions = useTranslatedTexts(display.map((d: any) => cleanCaption(d.caption)));

  return (
    <div className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.gallery.title} subtitle={t.gallery.subtitle} />

        {!loaded ? (
          <div className="text-center text-muted-foreground py-12">Memuat...</div>
        ) : display.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">Belum ada foto</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {display.map((item: any, i: number) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
                onClick={() => setSelected(i)}
                className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:shadow-japan transition-all hover:scale-105 relative group"
              >
                {item.url_gambar ? (
                  <>
                    <img src={item.url_gambar} alt={captions[i]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-xs text-white font-medium">{captions[i]}</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-sakura w-full h-full flex flex-col items-center justify-center p-4">
                    <span className="text-4xl mb-2">{item.emoji || "📷"}</span>
                    <p className="text-xs text-center text-secondary-foreground font-medium">{captions[i]}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected !== null && display[selected] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-card rounded-2xl p-6 max-w-2xl w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted z-10">
              <X className="w-5 h-5" />
            </button>
            {display[selected].url_gambar ? (
              <img src={display[selected].url_gambar} alt={captions[selected]} className="w-full max-h-[60vh] object-contain rounded-xl mb-4" />
            ) : (
              <span className="text-7xl block mb-4">{display[selected].emoji || "📷"}</span>
            )}
            <p className="text-foreground font-medium">{captions[selected]}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
