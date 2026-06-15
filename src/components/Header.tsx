import { Link, useLocation } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navItems = [
  { key: "beranda" as const, to: "/" },
  { key: "profil" as const, to: "/profil" },
  { key: "program" as const, to: "/program" },
  { key: "job" as const, to: "/job" },
  { key: "organisasi" as const, to: "/organisasi" },
  { key: "galeri" as const, to: "/galeri" },
  { key: "kontak" as const, to: "/kontak" },
  { key: "artikel" as const, to: "/artikel" },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="SO KOKORO BREBES" className="w-11 h-11 object-contain" />
            <div className="hidden sm:block">
              <span className="font-bold text-foreground text-sm leading-tight block">{t.hero.brand}</span>
              <span className="text-muted-foreground text-[10px] leading-tight block">{t.hero.tagline}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${isActive ? "text-primary font-semibold bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "id" ? "jp" : "id")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "id" ? "🇮🇩 ID" : "🇯🇵 JP"}
            </button>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-muted">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-background"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  {t.nav[item.key]}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
