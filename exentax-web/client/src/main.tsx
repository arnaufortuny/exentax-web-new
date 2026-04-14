import { StrictMode, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@/i18n";
import App from "./App";
import "./index.css";

function isChunkLoadError(error: unknown): boolean {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return (
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    msg.includes("dynamically imported module") ||
    msg.includes("failed to fetch dynamically") ||
    msg.includes("importing a module script") ||
    msg.includes("error loading module") ||
    msg.includes("unexpected token '<'") ||
    (error instanceof Error && error.name === "SyntaxError" && msg.includes("unexpected token"))
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorType: "chunk" | "network" | "generic";
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorType: "generic" };

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    const errorType = isChunkLoadError(error)
      ? "chunk"
      : error instanceof TypeError && (error as Error).message === "Failed to fetch"
        ? "network"
        : "generic";
    return { hasError: true, errorType };
  }

  componentDidCatch(error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[ErrorBoundary]", msg, stack);

    if (isChunkLoadError(error)) {
      const reloadKey = "exentax_chunk_reload";
      const lastReload = Number(sessionStorage.getItem(reloadKey) || "0");
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        window.location.reload();
        return;
      }
    }

    const countKey = "exentax_error_count";
    const tsKey = "exentax_error_ts";
    const now = Date.now();
    const lastTs = Number(sessionStorage.getItem(tsKey) || "0");
    let count = Number(sessionStorage.getItem(countKey) || "0");

    if (now - lastTs > 30000) count = 0;

    count++;
    sessionStorage.setItem(countKey, String(count));
    sessionStorage.setItem(tsKey, String(now));

    if (count <= 3) {
      setTimeout(() => window.location.reload(), 200);
      return;
    }
  }

  render() {
    if (this.state.hasError) {
      const countKey = "exentax_error_count";
      const count = Number(sessionStorage.getItem(countKey) || "0");
      if (count <= 3) {
        return null;
      }
      return <ErrorFallback errorType={this.state.errorType} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ errorType }: { errorType: string }) {
  const lang = (navigator.language || "es").split("-")[0].toLowerCase();

  const i18nMessages: Record<string, Record<string, { title: string; desc: string; reload: string }>> = {
    es: {
      chunk: { title: "Actualizando la página", desc: "Se ha detectado una nueva versión. La página se recargará automáticamente.", reload: "Recargar página" },
      network: { title: "Sin conexión", desc: "Parece que no hay conexión a internet. Comprueba tu red e inténtalo de nuevo.", reload: "Recargar página" },
      generic: { title: "Algo ha salido mal", desc: "Ha ocurrido un error inesperado. Por favor, recarga la página.", reload: "Recargar página" },
    },
    en: {
      chunk: { title: "Updating page", desc: "A new version has been detected. The page will reload automatically.", reload: "Reload page" },
      network: { title: "No connection", desc: "It seems there is no internet connection. Check your network and try again.", reload: "Reload page" },
      generic: { title: "Something went wrong", desc: "An unexpected error occurred. Please reload the page.", reload: "Reload page" },
    },
    ca: {
      chunk: { title: "Actualitzant la pàgina", desc: "S'ha detectat una nova versió. La pàgina es recarregarà automàticament.", reload: "Recarregar pàgina" },
      network: { title: "Sense connexió", desc: "Sembla que no hi ha connexió a internet. Comprova la teva xarxa i torna-ho a provar.", reload: "Recarregar pàgina" },
      generic: { title: "Alguna cosa ha anat malament", desc: "S'ha produït un error inesperat. Si us plau, recarrega la pàgina.", reload: "Recarregar pàgina" },
    },
    de: {
      chunk: { title: "Seite wird aktualisiert", desc: "Eine neue Version wurde erkannt. Die Seite wird automatisch neu geladen.", reload: "Seite neu laden" },
      network: { title: "Keine Verbindung", desc: "Es scheint keine Internetverbindung zu bestehen. Überprüfe dein Netzwerk und versuche es erneut.", reload: "Seite neu laden" },
      generic: { title: "Etwas ist schiefgelaufen", desc: "Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu.", reload: "Seite neu laden" },
    },
    fr: {
      chunk: { title: "Mise à jour de la page", desc: "Une nouvelle version a été détectée. La page se rechargera automatiquement.", reload: "Recharger la page" },
      network: { title: "Pas de connexion", desc: "Il semble qu'il n'y ait pas de connexion Internet. Vérifie ton réseau et réessaie.", reload: "Recharger la page" },
      generic: { title: "Quelque chose s'est mal passé", desc: "Une erreur inattendue s'est produite. Veuillez recharger la page.", reload: "Recharger la page" },
    },
    pt: {
      chunk: { title: "Atualizando a página", desc: "Uma nova versão foi detectada. A página será recarregada automaticamente.", reload: "Recarregar página" },
      network: { title: "Sem conexão", desc: "Parece que não há conexão com a internet. Verifique sua rede e tente novamente.", reload: "Recarregar página" },
      generic: { title: "Algo deu errado", desc: "Ocorreu um erro inesperado. Por favor, recarregue a página.", reload: "Recarregar página" },
    },
  };

  const msgs = i18nMessages[lang] || i18nMessages.es;
  const { title, desc, reload } = msgs[errorType] || msgs.generic;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F7F6F2",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F1A14", marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h1>
        <p style={{ fontSize: 16, color: "#6B7D73", marginBottom: 24, lineHeight: 1.6 }}>
          {desc}
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem("exentax_error_count");
            sessionStorage.removeItem("exentax_error_ts");
            sessionStorage.removeItem("exentax_chunk_reload");
            window.location.reload();
          }}
          style={{
            background: "#00E510",
            color: "#0B0D0C",
            border: "none",
            borderRadius: 999,
            padding: "12px 32px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          data-testid="button-reload"
        >
          {reload}
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
