import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTexts } from "@/lib/useTranslated";

export const Route = createFileRoute("/organisasi")({
  head: () => ({
    meta: [
      { title: "Struktur Organisasi — LPK SO KOKORO BREBES" },
      { name: "description", content: "Struktur organisasi LPK SO KOKORO BREBES" },
    ],
  }),
  component: OrganisasiPage,
});

const fallbackStaff = [
  { nama: "Direktur", jabatan: "Direktur Utama", emoji: "👨‍💼", url_gambar: null, deskripsi: null },
  { nama: "Wakil Direktur", jabatan: "Wakil Direktur", emoji: "👩‍💼", url_gambar: null, deskripsi: null },
];
const fallbackTeachers = [
  { nama: "Sensei Tanaka", jabatan: "Pengajar JLPT N3-N5", emoji: "👨‍🏫", url_gambar: null, deskripsi: null },
];

function OrganisasiPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("struktur_organisasi").select("*").order("urutan", { ascending: true }).then(({ data }) => {
      setItems(data || []);
      setLoaded(true);
    });
  }, []);

  const staff = loaded && items.length > 0 ? items.filter((p) => p.tipe === "staff") : fallbackStaff;
  const teachers = loaded && items.length > 0 ? items.filter((p) => p.tipe === "pengajar") : fallbackTeachers;

  // Translate jabatan + deskripsi (nama left as-is — proper noun)
  const allPeople = [...staff, ...teachers];
  const namaTranslated = useTranslatedTexts(allPeople.map((p: any) => p.nama || ""));
  const jabatanTranslated = useTranslatedTexts(allPeople.map((p: any) => p.jabatan));
  const deskripsiTranslated = useTranslatedTexts(allPeople.map((p: any) => p.deskripsi || ""));

  const enrich = (list: any[], offset: number) =>
    list.map((p, i) => ({
      ...p,
      nama: namaTranslated[offset + i] || p.nama,
      jabatan: jabatanTranslated[offset + i] || p.jabatan,
      deskripsi: p.deskripsi ? deskripsiTranslated[offset + i] : null,
    }));

  const staffT = enrich(staff, 0);
  const teachersT = enrich(teachers, staff.length);

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.organization.title} />

        <h3 className="text-xl font-bold text-foreground mb-6">🏢 {t.organization.staff}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {staffT.map((person: any, i: number) => (
            <PersonCard key={person.id || i} person={person} index={i} />
          ))}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-6">📚 {t.organization.teachers}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {teachersT.map((person: any, i: number) => (
            <PersonCard key={person.id || i} person={person} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person, index }: { person: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl p-5 border border-border/50 text-center hover:shadow-japan transition-all hover:-translate-y-1"
    >
      {person.url_gambar ? (
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-primary/20">
          <img src={person.url_gambar} alt={person.nama} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-sakura flex items-center justify-center text-2xl mx-auto mb-3">
          {person.emoji || "👤"}
        </div>
      )}
      <h4 className="font-bold text-foreground text-sm">{person.nama}</h4>
      <p className="text-xs text-muted-foreground mt-1">{person.jabatan}</p>
      {person.deskripsi && <p className="text-[11px] text-muted-foreground mt-2 leading-snug">{person.deskripsi}</p>}
    </motion.div>
  );
}
