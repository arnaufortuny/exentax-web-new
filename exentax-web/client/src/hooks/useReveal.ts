import { useRef } from "react";

// Intentionally minimal: just a stable ref. Reveal animations are driven
// by a single global IntersectionObserver wired in main.tsx so that
// adding/removing this hook does NOT change a component's hook count
// (which would crash existing fibers during HMR).
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T>(null);
}
