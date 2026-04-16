const isDev = import.meta.env.DEV;

export const clientLogger = {
  warn(...args: unknown[]) {
    if (isDev) console.warn(...args);
  },
  error(...args: unknown[]) {
    if (isDev) console.error(...args);
  },
};
