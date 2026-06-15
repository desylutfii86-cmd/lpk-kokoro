import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import sejarah1 from "@/assets/sejarah-1.png";
import sejarah2 from "@/assets/sejarah-2.png";
import sejarah3 from "@/assets/sejarah-3.png";
import direkturImg from "@/assets/direktur.png";
import gmImg from "@/assets/general-manager.png";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — LPK SO KOKORO BREBES" },
      { name: "description", content: "Sejarah dan profil pemilik LPK SO KOKORO BREBES" },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { t } = useI18n();
  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.profile.title} />

        {/* Company Profile Video */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-japan border border-border/50 bg-card aspect-video">
            <iframe
              src="https://www.youtube.com/embed/fVoBJKqPoy0"
              title="Company Profile"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t.profile.videoCaption}
          </p>
        </motion.section>

        {/* Visi & Misi */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl p-8 border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card shadow-japan">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl shadow-md">🎯</div>
                <h3 className="text-2xl font-bold text-foreground">{t.profile.visiTitle}</h3>
              </div>
              <ul className="space-y-3">
                {t.profile.visiItems.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-justify">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-8 border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-card shadow-japan">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center text-2xl shadow-md">🚀</div>
                <h3 className="text-2xl font-bold text-foreground">{t.profile.misiTitle}</h3>
              </div>
              <ul className="space-y-3">
                {t.profile.misiItems.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent-foreground font-bold text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-justify">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-primary">📜</span> {t.profile.historyTitle}
          </h3>
          <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm space-y-8">
            {/* Certificates Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[sejarah1, sejarah2, sejarah3].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group bg-background rounded-xl p-3 border border-border/50 hover:shadow-japan transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted/30 flex items-center justify-center">
                    <img
                      src={src}
                      alt={t.certificates[i]}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="mt-3 text-xs text-center text-muted-foreground font-medium">{t.certificates[i]}</p>
                </motion.div>
              ))}
            </div>

            {/* History paragraphs */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              {t.profile.historyText.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-base text-justify">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Owners */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-primary">👤</span> {t.profile.ownerTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: t.profile.directorName, bio: t.profile.directorBio, emoji: "👨‍💼", photo: direkturImg, imageClass: "scale-[1.15] translate-y-3", bgClass: "", bgStyle: { backgroundColor: "#0369a1" } as React.CSSProperties | undefined },
              { name: t.profile.wifeName, bio: t.profile.wifeBio, emoji: "👩‍💼", photo: gmImg, imageClass: "scale-[1.15] translate-y-1", bgClass: "", bgStyle: { backgroundColor: "#0369a1" } as React.CSSProperties },
            ].map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-japan transition-shadow"
              >
                {person.photo ? (
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto ring-4 ring-primary/20 ${person.bgClass}`}
                    style={person.bgStyle}
                  >
                    <img
                      src={person.photo}
                      alt={person.name}
                      className={`w-full h-full object-cover object-top ${person.imageClass ?? ""}`}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-sakura flex items-center justify-center text-3xl mb-4 mx-auto">
                    {person.emoji}
                  </div>
                )}
                <h4 className="text-center font-bold text-foreground mb-2">{person.name}</h4>
                <p className="text-justify text-sm text-muted-foreground leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
