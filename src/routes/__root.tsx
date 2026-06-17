import { Outlet, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n";
import { reloadIfChunkImportError } from "@/lib/chunk-reload";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LPK SO KOKORO BREBES — Pelatihan Bahasa Jepang & Penyaluran Kerja" },
      { name: "description", content: "Lembaga Pelatihan Kerja Pendidikan Bahasa Jepang di Brebes. Penyaluran tenaga kerja resmi ke Jepang." },
      { property: "og:title", content: "LPK SO KOKORO BREBES" },
      { property: "og:description", content: "Lembaga Pelatihan Kerja Pendidikan Bahasa Jepang di Brebes" },
      { property: "og:type", content: "website" },
    ],
    links: [
  { rel: "stylesheet", href: appCss },
  { rel: "icon", type: "image/png", href: "/favicon.ico" },
],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-japan">404</h1>
        <p className="mt-4 text-muted-foreground">Halaman tidak ditemukan.</p>
        <a href="/" className="mt-6 inline-block px-6 py-2.5 rounded-full bg-gradient-japan text-primary-foreground font-medium text-sm">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  const location = useLocation();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reloadIfChunkImportError(event.error ?? event.message);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reloadIfChunkImportError(event.reason);
    };

    const handleVitePreloadError = (event: Event) => {
      const viteEvent = event as Event & {
        payload?: { error?: unknown };
        preventDefault: () => void;
      };

      const didReload = reloadIfChunkImportError(viteEvent.payload?.error);
      if (didReload) viteEvent.preventDefault();
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("vite:preloadError", handleVitePreloadError as EventListener);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("vite:preloadError", handleVitePreloadError as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Header />
        <main className="pt-16 md:pt-18">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </I18nProvider>
    </QueryClientProvider>
  );
}
