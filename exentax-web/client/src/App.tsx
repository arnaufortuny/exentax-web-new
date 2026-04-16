import { memo, lazy, Suspense, useEffect, useRef, Component, type ReactNode } from "react";
import { Switch, Route, useLocation } from "wouter";
import { clientLogger } from "@/lib/clientLogger";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import i18n, { SUPPORTED_LANGS, LanguageService, type SupportedLang } from "@/i18n";
import { ROUTE_SLUGS, ALL_ROUTE_KEYS, type RouteKey } from "@/lib/routes";

const pageImports = {
  home: () => import("@/pages/home"),
  our_services: () => import("@/pages/services"),
  how_we_work: () => import("@/pages/how-we-work"),
  faq: () => import("@/pages/faq-page"),
  book: () => import("@/pages/book"),
  about_llc: () => import("@/pages/about-llc"),
  blogIndex: () => import("@/pages/blog/index"),
  blogPost: () => import("@/pages/blog/post"),
  legal_terms: () => import("@/pages/legal/terms"),
  legal_privacy: () => import("@/pages/legal/privacy"),
  legal_cookies: () => import("@/pages/legal/cookies"),
  legal_refunds: () => import("@/pages/legal/refunds"),
  legal_disclaimer: () => import("@/pages/legal/disclaimer"),
  links: () => import("@/pages/go"),
  start: () => import("@/pages/start"),
  booking: () => import("@/pages/booking"),
  adminAgenda: () => import("@/pages/admin/agenda"),
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
const AdminAgendaPage  = lazy(pageImports.adminAgenda);
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
    if (load) load().catch((e) => clientLogger.warn("[prefetch]", e));
  });
  setTimeout(() => {
    Object.entries(pageImports)
      .filter(([key]) => key !== "home" && !priorityPageKeys.has(key))
      .forEach(([, load]) => load().catch((e) => clientLogger.warn("[prefetch]", e)));
  }, 5000);
}

interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeKey: string;
}
interface RouteErrorBoundaryState {
  hasError: boolean;
  key: string;
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false, key: this.props.routeKey };

  static getDerivedStateFromError(): Partial<RouteErrorBoundaryState> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props: RouteErrorBoundaryProps, state: RouteErrorBoundaryState): Partial<RouteErrorBoundaryState> | null {
    if (props.routeKey !== state.key) {
      return { hasError: false, key: props.routeKey };
    }
    return null;
  }

  componentDidCatch(error: unknown) {
    clientLogger.error("[RouteErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return <EmptyLoader />;
    }
    return this.props.children;
  }
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
  const [location] = useLocation();
  return (
    <RouteErrorBoundary routeKey={location}>
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
      <Route path="/admin/agenda/:bookingId">
        <Suspense fallback={<EmptyLoader />}><AdminAgendaPage /></Suspense>
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

      <Route path="/">
        <RootRedirect />
      </Route>

      <Route>
        <Layout>
          <Suspense fallback={<EmptyLoader />}><NotFound /></Suspense>
        </Layout>
      </Route>
    </Switch>
    </RouteErrorBoundary>
  );
});

function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef<string | null>(null);
  useEffect(() => {
    if (prevLocation.current !== null && location === prevLocation.current) return;
    prevLocation.current = location;
    if (location.includes("#")) return;
    const go = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    go();
    requestAnimationFrame(go);
    const t1 = setTimeout(go, 50);
    const t2 = setTimeout(go, 150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location]);
  return null;
}

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
    if ("requestIdleCallback" in window) {
      requestIdleCallback(prefetchAllPages, { timeout: 3000 });
    } else {
      setTimeout(prefetchAllPages, 1500);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ScrollToTop />
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
