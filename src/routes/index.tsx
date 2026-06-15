import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Shield, BookOpen, Users, Award, ChevronRight } from "lucide-react";
import { useRef } from "react";
import heroBg from "@/assets/hero-group.jpg";
import logo from "@/assets/logo.png";
import gallery1 from "@/assets/gallery-1.jpeg";
import gallery2 from "@/assets/gallery-2.jpeg";
import gallery3 from "@/assets/gallery-3.jpeg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  return (
    <>
      <HeroSection />
      <AdvantagesSection />
      <QuickRegisterSection />
    </>
  );
}

function HeroSection() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.95]);
  const redWashOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.35]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background photo */}
      <motion.img
        src={heroBg}
        alt=""
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        width={1920}
        height={1080}
      />
      {/* Soft white wash so watercolor art stays visible while text is legible */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background"
      />
      {/* Subtle red wash that intensifies on scroll for a smooth brand transition */}
      <motion.div
        style={{ opacity: redWashOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-japan-red/0 via-japan-red/20 to-japan-red-dark/40"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 flex items-center justify-center"
        >
          <img src={logo} alt="SO KOKORO BREBES" className="w-full h-full object-contain drop-shadow-japan" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-japan-red drop-shadow-sm"
        >
          {t.hero.brand}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-xl md:text-2xl font-medium text-japan-red-dark"
        >
          {t.hero.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-2 text-foreground/80 text-base md:text-lg font-medium"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/pendaftaran"
            className="px-8 py-3.5 rounded-full bg-gradient-japan text-primary-foreground font-semibold shadow-japan hover:shadow-lg transition-all hover:scale-105"
          >
            {t.hero.cta}
          </Link>
          <Link
            to="/profil"
            className="px-8 py-3.5 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
          >
            {t.hero.learn}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AdvantagesSection() {
  const { t } = useI18n();
  const icons = [Shield, BookOpen, Users, Award];
  const galleryImages = [
    { src: gallery1, alt: "Pemberangkatan peserta LPK SO KOKORO BREBES di bandara internasional" },
    { src: gallery2, alt: "Tim peserta LPK SO KOKORO BREBES siap berangkat ke Jepang" },
    { src: gallery3, alt: "Peserta LPK SO KOKORO BREBES setibanya di Jepang" },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.advantages.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-japan border border-border/50 bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-japan-red-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.advantages.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-japan transition-all duration-300 hover:-translate-y-1 border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-japan flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QuickRegisterSection() {
  const { t } = useI18n();
  return (
    <section className="py-20">
      <div className="max-w-xl mx-auto px-4 text-center">
        <SectionHeading title={t.register.title} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 shadow-sm border border-border/50"
        >
          <p className="text-muted-foreground mb-6">
            Isi data diri Anda untuk mulai bergabung dengan program pelatihan bahasa Jepang dan kerja ke Jepang.
          </p>
          <Link
            to="/pendaftaran"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-japan text-primary-foreground font-semibold shadow-japan hover:shadow-lg transition-all hover:scale-105"
          >
            Isi Data Diri
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
