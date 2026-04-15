import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingMobileCTA from "@/components/layout/FloatingMobileCTA";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Tracking from "@/components/Tracking";
import CookieBanner from "@/components/CookieBanner";

function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);
  useEffect(() => {
    if (location === prevLocation.current) return;
    prevLocation.current = location;
    if (location.includes("#")) return;
    const go = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    go();
    requestAnimationFrame(go);
    const t = setTimeout(go, 50);
    return () => clearTimeout(t);
  }, [location]);
  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-x-hidden flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-0)" }}>
      <Tracking />
      <ScrollToTop />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg focus:text-sm">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="pt-[110px] lg:pt-[116px] xl:pt-[120px] 2xl:pt-[126px] flex-1 bg-[var(--bg-0)]">
        {children}
      </main>
      <Footer />
      <FloatingMobileCTA />
      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}
