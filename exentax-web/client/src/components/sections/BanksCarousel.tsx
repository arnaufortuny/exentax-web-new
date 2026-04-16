import { useRef, useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface Bank {
  name: string;
  src: string;
  height: string;
}

const BANKS: Bank[] = [
  { name: "Mercury", src: "/img/partner-mercury.webp", height: "h-7 sm:h-8" },
  { name: "Relay", src: "/img/partner-relay.webp", height: "h-8 sm:h-10" },
  { name: "Visa", src: "/img/partner-visa.webp", height: "h-5 sm:h-6" },
  { name: "Stripe", src: "/img/partner-stripe.webp", height: "h-7 sm:h-9" },
  { name: "Wallester", src: "/img/partner-wallester.webp", height: "h-5 sm:h-7" },
  { name: "Wise", src: "/img/partner-wise.png", height: "h-20 sm:h-24" },
  { name: "Slash", src: "/img/partner-slash.webp", height: "h-14 sm:h-[4.5rem]" },
  { name: "Interactive Brokers", src: "/img/partner-interactive-brokers.png", height: "h-7 sm:h-8" },
  { name: "Kraken", src: "/img/partner-kraken.webp", height: "h-8 sm:h-10" },
];

const DUPLICATED = [...BANKS, ...BANKS];
const PX_PER_MS = 0.03;

function preloadCarouselImages(): Promise<void[]> {
  return Promise.all(
    BANKS.map(
      (b) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = b.src;
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
}

let preloadPromise: Promise<void[]> | null = null;

export default function BanksCarousel() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const prevTimeRef = useRef(0);
  const halfRef = useRef(0);
  const [imagesReady, setImagesReady] = useState(false);

  const recalcHalf = useCallback(() => {
    const track = trackRef.current;
    if (track) halfRef.current = track.scrollWidth / 2;
  }, []);

  useEffect(() => {
    if (!preloadPromise) preloadPromise = preloadCarouselImages();
    preloadPromise.then(() => setImagesReady(true));
  }, []);

  useEffect(() => {
    if (!imagesReady) return;
    const el = trackRef.current;
    if (!el) return;
    const track: HTMLDivElement = el;

    recalcHalf();

    const ro = new ResizeObserver(recalcHalf);
    ro.observe(track);

    const imgs = track.querySelectorAll("img");
    let loaded = 0;
    const onLoad = () => { loaded++; if (loaded >= imgs.length) recalcHalf(); };
    imgs.forEach(img => {
      if (img.complete) { loaded++; } else { img.addEventListener("load", onLoad, { once: true }); }
    });
    if (loaded >= imgs.length) recalcHalf();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf: number;
    function step(time: number) {
      if (!prevTimeRef.current) prevTimeRef.current = time;
      const dt = time - prevTimeRef.current;
      prevTimeRef.current = time;

      if (!prefersReduced && halfRef.current > 0) {
        posRef.current += PX_PER_MS * dt;
        if (posRef.current >= halfRef.current) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      imgs.forEach(img => img.removeEventListener("load", onLoad));
    };
  }, [recalcHalf, imagesReady]);

  return (
    <section
      className="relative w-full py-6 sm:py-10"
      aria-label={t("common.banksCarousel")}
      data-testid="banks-carousel"
    >
      <p className="text-center section-label mb-6 sm:mb-8">{t("common.banksCarouselLabel")}</p>
      <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--bg-0), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--bg-0), transparent)" }} />

      <div
        className="flex whitespace-nowrap will-change-transform"
        ref={trackRef}
        style={{ opacity: imagesReady ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        {DUPLICATED.map((b, i) => (
          <div
            key={`${b.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center px-6 sm:px-10"
          >
            <img
              src={b.src}
              alt={b.name}
              width={140}
              height={56}
              loading={i < BANKS.length ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i < BANKS.length ? "high" : "low"}
              className={`${b.height} w-auto object-contain opacity-60 dark:opacity-50 brightness-0 dark:invert`}
              data-testid={`img-bank-${b.name.toLowerCase()}`}
            />
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
