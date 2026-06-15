import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTexts } from "@/lib/useTranslated";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Program Pelatihan — LPK SO KOKORO BREBES" },
      { name: "description", content: "Program pelatihan bahasa Jepang N5, N4, N3" },
    ],
  }),
  component: ProgramPage,
});

const levelColors = [
  { bg: "from-emerald-500 to-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  { bg: "from-blue-500 to-blue-600", badge: "bg-blue-100 text-blue-700" },
  { bg: "from-amber-500 to-amber-600", badge: "bg-amber-100 text-amber-700" },
];

function ProgramPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("program").select("*").order("urutan", { ascending: true }).then(({ data }) => {
      setItems(data || []);
      setLoaded(true);
    });
  }, []);

  const display = loaded && items.length > 0
    ? items.map((p) => ({ level: p.level, name: p.nama, duration: p.durasi, desc: p.deskripsi, image: p.url_gambar }))
    : t.programs.items.map((p) => ({ ...p, image: null }));

  // Translate name/duration/desc when they come from DB (already translated when from t.programs.items)
  const fromDb = loaded && items.length > 0;
  const nameT = useTranslatedTexts(fromDb ? display.map((d: any) => d.name) : []);
  const durT = useTranslatedTexts(fromDb ? display.map((d: any) => d.duration) : []);
  const descT = useTranslatedTexts(fromDb ? display.map((d: any) => d.desc) : []);

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.programs.title} subtitle={t.programs.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {display.map((item: any, i: number) => {
            const name = fromDb ? nameT[i] || item.name : item.name;
            const duration = fromDb ? durT[i] || item.duration : item.duration;
            const desc = fromDb ? descT[i] || item.desc : item.desc;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-japan transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${levelColors[i % 3].bg}`} />
                {item.image && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={item.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-foreground">{item.level}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColors[i % 3].badge}`}>
                      {name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">⏱ {duration}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
