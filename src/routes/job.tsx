import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTexts } from "@/lib/useTranslated";
import { BookOpen, Users, Stethoscope, FileSignature, Languages, FileCheck2, Plane, Building2, Briefcase, GraduationCap, Trophy, Award, ArrowRight, RotateCcw } from "lucide-react";
import pertanianImg from "@/assets/jobs/pertanian.jpg";
import perhotelanImg from "@/assets/jobs/perhotelan.jpg";
import perawatImg from "@/assets/jobs/perawat.jpg";
import pengecatanImg from "@/assets/jobs/pengecatan.jpg";
import perakitanBesiImg from "@/assets/jobs/perakitan-besi.jpg";
import scaffoldingImg from "@/assets/jobs/scaffolding.jpg";
import waterproofImg from "@/assets/jobs/waterproof.jpg";
import pengelasanImg from "@/assets/jobs/pengelasan.jpg";
import sipilImg from "@/assets/jobs/sipil.jpg";
import pengolahanMakananImg from "@/assets/jobs/pengolahan-makanan.jpg";

const jobImages = [
  pertanianImg, perhotelanImg, perawatImg, pengecatanImg, perakitanBesiImg,
  scaffoldingImg, waterproofImg, pengelasanImg, sipilImg, pengolahanMakananImg,
];

export const Route = createFileRoute("/job")({
  head: () => ({
    meta: [
      { title: "Informasi Job — LPK SO KOKORO BREBES" },
      { name: "description", content: "Peluang kerja di Jepang — Tokutei Ginou dan Magang" },
    ],
  }),
  component: JobPage,
});

function JobPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("jobs").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoaded(true);
    });
  }, []);

  const fromDb = loaded && items.length > 0;
  const display = fromDb
    ? items.map((j) => ({ title: j.judul, desc: j.deskripsi, emoji: j.emoji || "💼", image: j.url_gambar }))
    : t.jobs.items.map((j, i) => ({ ...j, emoji: i === 0 ? "🏭" : i === 1 ? "🎓" : "🌏", image: null }));

  const titleT = useTranslatedTexts(fromDb ? display.map((d: any) => d.title) : []);
  const descT = useTranslatedTexts(fromDb ? display.map((d: any) => d.desc) : []);

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.jobs.title} subtitle={t.jobs.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {display.map((item: any, i: number) => {
            const title = fromDb ? titleT[i] || item.title : item.title;
            const desc = fromDb ? descT[i] || item.desc : item.desc;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-japan transition-all group"
              >
                {item.image ? (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={item.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : null}
                <div className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-japan flex items-center justify-center text-2xl mb-5">
                    {item.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-24">
          <SectionHeading
            title={t.jobTypes.title}
            subtitle={t.jobTypes.subtitle}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {t.jobTypes.items.map((name, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-japan transition-all group"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={jobImages[i]}
                    alt={name}
                    loading="lazy"
                    width={768}
                    height={512}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-foreground text-sm md:text-base">{name}</h4>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 bg-card rounded-2xl border border-border/50 shadow-sm p-6 md:p-8"
          >
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
              {t.jobTypes.description}
            </p>
            <p className="text-sm md:text-base font-semibold text-foreground mb-3">
              {t.jobTypes.prefecturesLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.jobTypes.prefectures.map((p, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-gradient-japan text-white text-xs md:text-sm font-medium shadow-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <ProcessFlow />
      </div>
    </div>
  );
}

const flowMeta = [
  { icon: BookOpen, color: "from-rose-500 to-pink-500" },
  { icon: Users, color: "from-amber-500 to-orange-500", branch: true },
  { icon: Stethoscope, color: "from-emerald-500 to-teal-500" },
  { icon: FileSignature, color: "from-cyan-500 to-sky-500" },
  { icon: Languages, color: "from-indigo-500 to-violet-500" },
  { icon: FileCheck2, color: "from-fuchsia-500 to-purple-500" },
  { icon: Plane, color: "from-red-500 to-rose-500" },
  { icon: Building2, color: "from-blue-500 to-indigo-500" },
  { icon: Briefcase, color: "from-teal-500 to-emerald-500" },
  { icon: GraduationCap, color: "from-yellow-500 to-amber-500" },
  { icon: Trophy, color: "from-orange-500 to-red-500" },
  { icon: Award, color: "from-primary to-primary/70" },
];

function ProcessFlow() {
  const { t } = useI18n();
  const flowSteps = flowMeta.map((m, i) => ({ ...m, ...t.processFlow.steps[i] }));
  return (
    <div className="mt-24">
      <SectionHeading
        title={t.processFlow.title}
        subtitle={t.processFlow.subtitle}
      />

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="relative bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-japan transition-all p-6 h-full overflow-hidden group">
                  <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="mt-2 text-center text-xs font-bold text-muted-foreground">
                        {t.processFlow.stageLabel} {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-base md:text-lg leading-tight mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      {step.branch && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2">
                          <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{t.processFlow.branchNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {i < flowSteps.length - 1 && (
                  <div className="flex justify-center md:hidden my-2">
                    <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 text-center bg-gradient-japan rounded-2xl p-8 text-white shadow-japan"
        >
          <Award className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">{t.processFlow.finalTitle}</h3>
          <p className="text-sm md:text-base opacity-90 max-w-2xl mx-auto">
            {t.processFlow.finalDesc}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
