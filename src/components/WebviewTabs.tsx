import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, RefreshCcw, ArrowLeft, ArrowRight, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

interface WebviewTabsProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
  onNavigate: (id: string, url: string) => void;
  onMetadata: (id: string, payload: Partial<BrowserTab>) => void;
}

type WebviewTag = Electron.WebviewTag;

export function WebviewTabs({
  tabs,
  activeTabId,
  onSelect,
  onClose,
  onNewTab,
  onNavigate,
  onMetadata
}: WebviewTabsProps) {
  const [address, setAddress] = useState<string>("");
  const webviews = useRef(new Map<string, WebviewTag>());

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      setAddress(activeTab.url);
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        const input = document.getElementById("hypergx-address-bar");
        input?.focus();
        (input as HTMLInputElement)?.select();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    tabs.forEach((tab) => {
      const instance = webviews.current.get(tab.id);
      if (instance && instance.getURL() !== tab.url) {
        instance.loadURL(tab.url);
      }
    });
  }, [tabs]);

  const activeWebview = useMemo(() => webviews.current.get(activeTabId), [activeTabId]);

  const navigate = (url: string) => {
    const cleaned = url.startsWith("http") ? url : `https://${url}`;
    onNavigate(activeTabId, cleaned);
    activeWebview?.loadURL(cleaned);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate(address.trim());
    }
  };

  const attachListeners = (id: string, element: WebviewTag | null) => {
    if (!element) return;
    webviews.current.set(id, element);
    const update = () => {
      const title = element.getTitle();
      const url = element.getURL();
      onMetadata(id, { title, url });
      onNavigate(id, url);
    };

    element.addEventListener("did-navigate", update);
    element.addEventListener("page-title-updated", update);
    element.addEventListener("page-favicon-updated", (event: any) => {
      const favicons: string[] = event.favicons ?? [];
      const favicon = favicons[0];
      if (favicon) {
        onMetadata(id, { favicon });
      }
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => activeWebview?.goBack()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => activeWebview?.goForward()}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => activeWebview?.reload()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1">
          <Input
            id="hypergx-address-bar"
            className="font-mono"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez une URL ou une recherche"
          />
        </div>
        <Button variant="accent" className="rounded-xl" onClick={() => navigate(address.trim())}>
          Go
        </Button>
      </div>

      <Tabs value={activeTabId} onValueChange={onSelect}>
        <div className="flex items-center justify-between">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="group">
                <span className="flex items-center gap-2">
                  {tab.favicon ? (
                    <img src={tab.favicon} alt="favicon" className="h-4 w-4 rounded" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  <span className="max-w-[140px] truncate text-xs font-medium">{tab.title || tab.url}</span>
                </span>
                <button
                  className="ml-2 rounded-full p-1 opacity-0 transition group-hover:opacity-100 hover:bg-white/10"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose(tab.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="ghost" className="rounded-xl" onClick={onNewTab}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="border-none bg-transparent p-0">
            <div className="h-[60vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-inner shadow-black/50">
              <webview
                ref={(element) => attachListeners(tab.id, element as WebviewTag | null)}
                data-tab={tab.id}
                src={tab.url}
                className="h-full w-full"
                allowpopups="true"
                webpreferences="contextIsolation, nativeWindowOpen=yes"
              ></webview>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
