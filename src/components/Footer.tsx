import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 flex items-center justify-center">
                <img src={logo} alt="SO KOKORO BREBES" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-lg block leading-tight">SO KOKORO BREBES</span>
              </div>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">{t.footer.desc}</p>
            <p className="mt-4 text-sakura font-bold text-sm">#SOKOKOROBREBES</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">{t.footer.quickLinks}</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-sm text-background/60 hover:text-background transition-colors">{t.nav.beranda}</Link>
              <Link to="/profil" className="text-sm text-background/60 hover:text-background transition-colors">{t.nav.profil}</Link>
              <Link to="/program" className="text-sm text-background/60 hover:text-background transition-colors">{t.nav.program}</Link>
              <Link to="/job" className="text-sm text-background/60 hover:text-background transition-colors">{t.nav.job}</Link>
              <Link to="/galeri" className="text-sm text-background/60 hover:text-background transition-colors">{t.nav.galeri}</Link>
              <Link to="/kontak" className="text-sm text-background/60 hover:text-background transition-colors">{t.nav.kontak}</Link>
            </div>
          </div>

        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
