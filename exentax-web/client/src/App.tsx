import { memo, lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import i18n, { SUPPORTED_LANGS, LanguageService, type SupportedLang } from "@/i18n";
import { STORAGE_KEYS } from "@/lib/constants";

const pageImports = {
  home: () => import("@/pages/home"),
  servicios: () => import("@/pages/servicios"),
  comoFunciona: () => import("@/pages/como-funciona"),
  faq: () => import("@/pages/faq-page"),
  reservar: () => import("@/pages/reservar"),
  llc: () => import("@/pages/llc-estados-unidos"),
  blogIndex: () => import("@/pages/blog/index"),
  blogPost: () => import("@/pages/blog/post"),
  terminos: () => import("@/pages/legal/terminos"),
  privacidad: () => import("@/pages/legal/privacidad"),
  cookies: () => import("@/pages/legal/cookies"),
  reembolsos: () => import("@/pages/legal/reembolsos"),
  disclaimer: () => import("@/pages/legal/disclaimer"),
  go: () => import("@/pages/go"),
  empezar: () => import("@/pages/empezar"),
  booking: () => import("@/pages/booking"),
  notFound: () => import("@/pages/not-found"),
};

const Home             = lazy(pageImports.home);
const PreciosPage      = lazy(pageImports.servicios);
const ComoFuncionaPage = lazy(pageImports.comoFunciona);
const FAQPage          = lazy(pageImports.faq);
const ReservarPage     = lazy(pageImports.reservar);
const LLCEstadosUnidos = lazy(pageImports.llc);
const BlogIndex        = lazy(pageImports.blogIndex);
const BlogPostPage     = lazy(pageImports.blogPost);
const TerminosPage     = lazy(pageImports.terminos);
const PrivacidadPage   = lazy(pageImports.privacidad);
const CookiesPage      = lazy(pageImports.cookies);
const ReembolsosPage   = lazy(pageImports.reembolsos);
const DisclaimerPage   = lazy(pageImports.disclaimer);
const GoPage           = lazy(pageImports.go);
const EmpezarPage      = lazy(pageImports.empezar);
const BookingPage       = lazy(pageImports.booking);
const NotFound         = lazy(pageImports.notFound);

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to, { replace: true }); }, []);
  return null;
}

function BlogLangEffect({ lang, children }: { lang: string; children: React.ReactNode }) {
  useEffect(() => {
    const previous = LanguageService.getCurrent();
    if (SUPPORTED_LANGS.includes(lang as SupportedLang) && previous !== lang) {
      LanguageService.changeTransient(lang as SupportedLang);
    }
    return () => {
      const current = LanguageService.getCurrent();
      const storedPref = LanguageService.getStoredPreference();
      if (current === lang && storedPref && storedPref !== lang) {
        LanguageService.changeTransient(storedPref);
      } else if (current === lang && !storedPref && previous !== lang) {
        LanguageService.changeTransient(previous);
      }
    };
  }, [lang]);
  return <>{children}</>;
}

let prefetchDone = false;

const publicPageKeys = new Set([
  "home", "servicios", "comoFunciona", "faq", "reservar", "llc",
  "blogIndex", "blogPost", "terminos", "privacidad", "cookies",
  "reembolsos", "disclaimer", "go", "empezar", "notFound",
]);

const priorityPageKeys = new Set(["servicios", "reservar", "comoFunciona", "llc", "faq"]);

function prefetchAllPages() {
  if (prefetchDone) return;
  prefetchDone = true;
  priorityPageKeys.forEach((key) => {
    const load = pageImports[key as keyof typeof pageImports];
    if (load) load().catch((e) => console.error("[prefetch]", e));
  });
  setTimeout(() => {
    Object.entries(pageImports)
      .filter(([key]) => publicPageKeys.has(key) && key !== "home" && !priorityPageKeys.has(key))
      .forEach(([, load]) => load().catch((e) => console.error("[prefetch]", e)));
  }, 5000);
}

function EmptyLoader() {
  return <div style={{ minHeight: "100vh", background: "var(--bg-0, #F7F6F2)" }} />;
}

const AppRouter = memo(function AppRouter() {
  return (
    <Switch>
      <Route path="/go">
        <Suspense fallback={<EmptyLoader />}><GoPage /></Suspense>
      </Route>
      <Route path="/empezar">
        <Suspense fallback={<EmptyLoader />}><EmpezarPage /></Suspense>
      </Route>
      <Route path="/booking/:token">
        <Suspense fallback={<EmptyLoader />}><BookingPage /></Suspense>
      </Route>

      <Route path="/">
        <Layout><Suspense fallback={<EmptyLoader />}><Home /></Suspense></Layout>
      </Route>
      <Route path="/servicios">
        <Layout><Suspense fallback={<EmptyLoader />}><PreciosPage /></Suspense></Layout>
      </Route>
      <Route path="/como-trabajamos">
        <Layout><Suspense fallback={<EmptyLoader />}><ComoFuncionaPage /></Suspense></Layout>
      </Route>
      <Route path="/preguntas-frecuentes">
        <Layout><Suspense fallback={<EmptyLoader />}><FAQPage /></Suspense></Layout>
      </Route>
      <Route path="/agendar-asesoria">
        <Layout><Suspense fallback={<EmptyLoader />}><ReservarPage /></Suspense></Layout>
      </Route>
      <Route path="/sobre-las-llc">
        <Layout><Suspense fallback={<EmptyLoader />}><LLCEstadosUnidos /></Suspense></Layout>
      </Route>

      <Route path="/:lang/blog/:slug">
        {(params: { lang: string; slug: string }) => {
          if (!SUPPORTED_LANGS.includes(params.lang as SupportedLang)) {
            return <Redirect to={`/blog/${params.slug}`} />;
          }
          return (
            <BlogLangEffect lang={params.lang}>
              <Layout><Suspense fallback={<EmptyLoader />}><BlogPostPage /></Suspense></Layout>
            </BlogLangEffect>
          );
        }}
      </Route>
      <Route path="/:lang/blog">
        {(params: { lang: string }) => {
          if (!SUPPORTED_LANGS.includes(params.lang as SupportedLang)) {
            return <Redirect to="/blog" />;
          }
          return (
            <BlogLangEffect lang={params.lang}>
              <Layout><Suspense fallback={<EmptyLoader />}><BlogIndex /></Suspense></Layout>
            </BlogLangEffect>
          );
        }}
      </Route>

      <Route path="/blog/:slug">
        <Layout><Suspense fallback={<EmptyLoader />}><BlogPostPage /></Suspense></Layout>
      </Route>
      <Route path="/blog">
        <Layout><Suspense fallback={<EmptyLoader />}><BlogIndex /></Suspense></Layout>
      </Route>

      <Route path="/legal/terminos">
        <Layout><Suspense fallback={<EmptyLoader />}><TerminosPage /></Suspense></Layout>
      </Route>
      <Route path="/legal/privacidad">
        <Layout><Suspense fallback={<EmptyLoader />}><PrivacidadPage /></Suspense></Layout>
      </Route>
      <Route path="/legal/cookies">
        <Layout><Suspense fallback={<EmptyLoader />}><CookiesPage /></Suspense></Layout>
      </Route>
      <Route path="/legal/reembolsos">
        <Layout><Suspense fallback={<EmptyLoader />}><ReembolsosPage /></Suspense></Layout>
      </Route>
      <Route path="/legal/disclaimer">
        <Layout><Suspense fallback={<EmptyLoader />}><DisclaimerPage /></Suspense></Layout>
      </Route>

      <Route>
        <Layout>
          <Suspense fallback={<EmptyLoader />}><NotFound /></Suspense>
        </Layout>
      </Route>
    </Switch>
  );
});

function useHashScroll() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    let attempts = 0;
    const maxAttempts = 20;
    let rafId = 0;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        return;
      }
      if (++attempts < maxAttempts) rafId = requestAnimationFrame(tryScroll);
    };
    rafId = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(rafId);
  }, []);
}

function App() {
  useHashScroll();

  useEffect(() => {
    const syncLang = (lng: string) => {
      document.documentElement.lang = lng.split("-")[0];
    };
    syncLang(i18n.language || "es");
    i18n.on("languageChanged", syncLang);
    return () => { i18n.off("languageChanged", syncLang); };
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    if (consent === "all" || consent === "essential") {
      fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: window.location.pathname, consent }),
      }).catch((e) => console.error("[visitor]", e));
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(prefetchAllPages, { timeout: 3000 });
    } else {
      setTimeout(prefetchAllPages, 1500);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
