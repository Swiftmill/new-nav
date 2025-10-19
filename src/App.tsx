import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { SideBar } from "@/components/layout/SideBar";
import { EasySetup } from "@/components/EasySetup";
import { SettingsModal } from "@/components/SettingsModal";
import { WebviewTabs, type BrowserTab } from "@/components/WebviewTabs";
import { StartPage } from "@/pages/Start";
import { useSettingsStore } from "@/store/settings";
import backgroundVideo from "@/assets/demo-background.mp4?url";

const backgroundImages: Record<string, string> = {
  aurora: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2100&q=80')",
  classic: "url('https://images.unsplash.com/photo-1526481280695-3c469b99a8fb?auto=format&fit=crop&w=2100&q=80')",
  noir: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2100&q=80')"
};

const defaultTabs: BrowserTab[] = [
  {
    id: "tab-1",
    url: "https://www.perplexity.ai",
    title: "Perplexity"
  }
];

export default function App() {
  const [tabs, setTabs] = useState<BrowserTab[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabs[0].id);
  const [easySetupOpen, setEasySetupOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const theme = useSettingsStore((state) => state.theme);
  const accent = useSettingsStore((state) => state.accentColor);
  const backgroundMode = useSettingsStore((state) => state.backgroundMode);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accent);
  }, [accent]);

  const backgroundStyle = useMemo(() => {
    const overlay = "linear-gradient(135deg, rgba(12,16,30,0.92), rgba(14,22,40,0.85))";
    if (backgroundMode === "video") {
      return {
        backgroundImage: overlay,
        position: "relative"
      } as const;
    }
    return {
      backgroundImage: `${overlay}, ${backgroundImages[theme] ?? backgroundImages.aurora}`,
      backgroundSize: "cover",
      backgroundAttachment: "fixed"
    } as const;
  }, [theme, backgroundMode]);

  const handleNewTab = () => {
    const id = nanoid(6);
    const newTab: BrowserTab = { id, url: "https://www.google.com", title: "Nouvel onglet" };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
  };

  const handleCloseTab = (id: string) => {
    setTabs((prev) => {
      const remaining = prev.filter((tab) => tab.id !== id);
      if (!remaining.length) {
        const fallback = { id: nanoid(6), url: "https://www.perplexity.ai", title: "Perplexity" };
        setActiveTabId(fallback.id);
        return [fallback];
      }
      if (id === activeTabId) {
        setActiveTabId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleNavigate = (id: string, url: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? (tab.url === url ? tab : { ...tab, url }) : tab))
    );
  };

  const handleMetadata = (id: string, payload: Partial<BrowserTab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, ...payload } : tab))
    );
  };

  const handleSearch = (url: string) => {
    const currentId = activeTabId;
    handleNavigate(currentId, url);
    requestAnimationFrame(() => {
      const webview = document.querySelector(`webview[data-tab=\"${currentId}\"]`) as any;
      webview?.loadURL?.(url);
    });
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        const key = event.key.toLowerCase();
        if (key === "t") {
          event.preventDefault();
          handleNewTab();
        }
        if (key === "w") {
          event.preventDefault();
          handleCloseTab(activeTabId);
        }
        if (key === "e") {
          event.preventDefault();
          setEasySetupOpen((state) => !state);
        }
        if (key === "g") {
          event.preventDefault();
          document.getElementById("gx-control-panel")?.scrollIntoView({ behavior: "smooth" });
        }
        if (key === ",") {
          event.preventDefault();
          setSettingsOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTabId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden text-white" style={backgroundStyle}>
      {backgroundMode === "video" && (
        <video
          className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-40"
          src={backgroundVideo}
          autoPlay
          loop
          muted
        />
      )}
      <div className="relative z-10 flex w-full">
        <SideBar active="home" onAction={(action) => {
          if (action === "settings") setSettingsOpen(true);
          if (action === "setup") setEasySetupOpen(true);
          if (action === "gx") document.getElementById("gx-control-panel")?.scrollIntoView({ behavior: "smooth" });
        }} />
        <main className="flex flex-1 flex-col gap-10 overflow-y-auto p-8">
          <StartPage
            onSearch={(url) => {
              handleSearch(url);
            }}
            onOpenEasySetup={() => setEasySetupOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <WebviewTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onSelect={setActiveTabId}
            onClose={handleCloseTab}
            onNewTab={handleNewTab}
            onNavigate={handleNavigate}
            onMetadata={handleMetadata}
          />
        </main>
      </div>
      <AnimatePresence>
        {easySetupOpen && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
            <EasySetup open={easySetupOpen} onOpenChange={setEasySetupOpen} />
          </motion.div>
        )}
      </AnimatePresence>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
