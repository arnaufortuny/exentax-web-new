import { memo, lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import i18n, { SUPPORTED_LANGS, LanguageService, type SupportedLang } from "@/i18n";
import { STORAGE_KEYS } from "@/lib/constants";
import { ROUTE_SLUGS, ALL_ROUTE_KEYS, type RouteKey } from "@/lib/routes";

const pageImports = {
  home: () => import("@/pages/home"),
  our_services: () => import("@/pages/servicios"),
  how_we_work: () => import("@/pages/como-funciona"),
  faq: () => import("@/pages/faq-page"),
  book: () => import("@/pages/reservar"),
  about_llc: () => import("@/pages/llc-estados-unidos"),
  blogIndex: () => import("@/pages/blog/index"),
  blogPost: () => import("@/pages/blog/post"),
  legal_terms: () => import("@/pages/legal/terminos"),
  legal_privacy: () => import("@/pages/legal/privacidad"),
  legal_cookies: () => import("@/pages/legal/cookies"),
  legal_refunds: () => import("@/pages/legal/reembolsos"),
  legal_disclaimer: () => import("@/pages/legal/disclaimer"),
  links: () => import("@/pages/go"),
  start: () => import("@/pages/empezar"),
  booking: () => import("@/pages/booking"),
  notFound: () => import("@/pages/not-found"),
};

const Home             = lazy(pageImports.home);
const PreciosPage      = lazy(pageImports.our_services);
const ComoFuncionaPage = lazy(pageImports.how_we_work);
const FAQPage          = lazy(pageImports.faq);
const ReservarPage     = lazy(pageImports.book);
const LLCEstadosUnidos = lazy(pageImports.about_llc);
const BlogIndex        = lazy(pageImports.blogIndex);
const BlogPostPage     = lazy(pageImports.blogPost);
const TerminosPage     = lazy(pageImports.legal_terms);
const PrivacidadPage   = lazy(pageImports.legal_privacy);
const CookiesPage      = lazy(pageImports.legal_cookies);
const ReembolsosPage   = lazy(pageImports.legal_refunds);
const DisclaimerPage   = lazy(pageImports.legal_disclaimer);
const LinksPage        = lazy(pageImports.links);
const StartPage        = lazy(pageImports.start);
const BookingPage      = lazy(pageImports.booking);
const NotFound         = lazy(pageImports.notFound);

const PAGE_COMPONENTS: Record<RouteKey, React.LazyExoticComponent<React.ComponentType>> = {
  home: Home,
  how_we_work: ComoFuncionaPage,
  our_services: PreciosPage,
  about_llc: LLCEstadosUnidos,
  faq: FAQPage,
  book: ReservarPage,
  legal_terms: TerminosPage,
  legal_privacy: PrivacidadPage,
  legal_cookies: CookiesPage,
  legal_refunds: ReembolsosPage,
  legal_disclaimer: DisclaimerPage,
};

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to, { replace: true }); }, [to]);
  return null;
}

function LangSyncEffect({ lang, children }: { lang: string; children: React.ReactNode }) {
  useEffect(() => {
    if (SUPPORTED_LANGS.includes(lang as SupportedLang)) {
      const current = LanguageService.getCurrent();
      if (current !== lang) {
        LanguageService.changeTransient(lang as SupportedLang);
      }
    }
  }, [lang]);
  return <>{children}</>;
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

const priorityPageKeys = new Set(["our_services", "book", "how_we_work", "about_llc", "faq"]);

function prefetchAllPages() {
  if (prefetchDone) return;
  prefetchDone = true;
  priorityPageKeys.forEach((key) => {
    const load = pageImports[key as keyof typeof pageImports];
    if (load) load().catch((e) => console.error("[prefetch]", e));
  });
  setTimeout(() => {
    Object.entries(pageImports)
      .filter(([key]) => key !== "home" && !priorityPageKeys.has(key))
      .forEach(([, load]) => load().catch((e) => console.error("[prefetch]", e)));
  }, 5000);
}

function EmptyLoader() {
  return <div style={{ minHeight: "100vh", background: "var(--bg-0, #F7F6F2)" }} />;
}

function RootRedirect() {
  const stored = LanguageService.getStoredPreference();
  if (stored && SUPPORTED_LANGS.includes(stored)) {
    return <Redirect to={`/${stored}`} />;
  }
  const browserLang = (navigator.language || "es").split("-")[0] as SupportedLang;
  const target = SUPPORTED_LANGS.includes(browserLang) ? browserLang : "es";
  return <Redirect to={`/${target}`} />;
}

function generateLocalizedRoutes() {
  const routes: React.ReactNode[] = [];

  for (const routeKey of ALL_ROUTE_KEYS) {
    const Component = PAGE_COMPONENTS[routeKey];

    for (const lang of SUPPORTED_LANGS) {
      const slug = ROUTE_SLUGS[routeKey][lang];
      const path = slug ? `/${lang}/${slug}` : `/${lang}`;

      routes.push(
        <Route key={`${routeKey}-${lang}`} path={path}>
          <LangSyncEffect lang={lang}>
            <Layout>
              <Suspense fallback={<EmptyLoader />}>
                <Component />
              </Suspense>
            </Layout>
          </LangSyncEffect>
        </Route>
      );
    }
  }

  return routes;
}

const localizedRoutes = generateLocalizedRoutes();

const AppRouter = memo(function AppRouter() {
  return (
    <Switch>
      <Route path="/links">
        <Suspense fallback={<EmptyLoader />}><LinksPage /></Suspense>
      </Route>
      <Route path="/start">
        <Suspense fallback={<EmptyLoader />}><StartPage /></Suspense>
      </Route>
      <Route path="/booking/:token">
        <Suspense fallback={<EmptyLoader />}><BookingPage /></Suspense>
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

      {localizedRoutes}

      <Route path="/go">
        <Redirect to="/links" />
      </Route>
      <Route path="/empezar">
        <Redirect to="/start" />
      </Route>
      <Route path="/servicios">
        <Redirect to="/es/nuestros-servicios" />
      </Route>
      <Route path="/como-trabajamos">
        <Redirect to="/es/como-trabajamos" />
      </Route>
      <Route path="/preguntas-frecuentes">
        <Redirect to="/es/preguntas-frecuentes" />
      </Route>
      <Route path="/sobre-las-llc">
        <Redirect to="/es/sobre-las-llc" />
      </Route>
      <Route path="/agendar-asesoria">
        <Redirect to="/es/agendar" />
      </Route>
      <Route path="/legal/terminos">
        <Redirect to="/es/legal/terminos" />
      </Route>
      <Route path="/legal/privacidad">
        <Redirect to="/es/legal/privacidad" />
      </Route>
      <Route path="/legal/cookies">
        <Redirect to="/es/legal/cookies" />
      </Route>
      <Route path="/legal/reembolsos">
        <Redirect to="/es/legal/reembolsos" />
      </Route>
      <Route path="/legal/disclaimer">
        <Redirect to="/es/legal/disclaimer" />
      </Route>

      <Route path="/">
        <RootRedirect />
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
    if (consent === "all") {
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
