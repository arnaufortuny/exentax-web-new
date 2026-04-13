import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const elements = el.querySelectorAll(".reveal");
    const allElements = el.classList.contains("reveal")
      ? [el, ...Array.from(elements)]
      : Array.from(elements);

    if (allElements.length === 0) return;

    const revealed = new Set<Element>();

    function revealElement(target: HTMLElement) {
      if (revealed.has(target)) return;
      revealed.add(target);
      target.style.willChange = "opacity, transform";
      requestAnimationFrame(() => {
        target.classList.add("visible");
        const duration = parseFloat(getComputedStyle(target).transitionDuration ?? "0");
        if (duration > 0) {
          const cleanup = () => {
            target.style.willChange = "auto";
          };
          target.addEventListener("transitionend", cleanup, { once: true });
        } else {
          target.style.willChange = "auto";
        }
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    allElements.forEach((element) => observer.observe(element));

    const fallbackTimer = setTimeout(() => {
      allElements.forEach((element) => {
        if (!revealed.has(element)) {
          const rect = (element as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight + 100) {
            revealElement(element as HTMLElement);
            observer.unobserve(element);
          }
        }
      });
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return ref;
}
