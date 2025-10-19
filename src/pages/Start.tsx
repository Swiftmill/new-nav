import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SpeedDial } from "@/components/SpeedDial";
import { GXControl } from "@/components/GXControl";
import { useSettingsStore } from "@/store/settings";

interface StartPageProps {
  onSearch: (url: string) => void;
  onOpenEasySetup: () => void;
  onOpenSettings: () => void;
}

export function StartPage({ onSearch, onOpenEasySetup, onOpenSettings }: StartPageProps) {
  const { searchEngine, showSuggestions, showWeather, showNews } = useSettingsStore();
  const [query, setQuery] = useState("HyperGX");

  const handleSearch = () => {
    if (!query) return;
    const encoded = encodeURIComponent(query);
    const url =
      searchEngine === "google"
        ? `https://www.google.com/search?q=${encoded}`
        : `https://www.bing.com/search?q=${encoded}`;
    onSearch(url);
  };

  return (
    <div className="space-y-10">
      <motion.div
        className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Explorez le flux neon</h1>
            <p className="text-sm text-slate-400">HyperGX synchronise vos mondes créatifs en un hub unique.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl" onClick={onOpenSettings}>
              Paramètres
            </Button>
            <Button variant="accent" className="rounded-xl" onClick={onOpenEasySetup}>
              Easy Setup
            </Button>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Button
            variant={searchEngine === "google" ? "accent" : "ghost"}
            className="rounded-xl"
            onClick={() => useSettingsStore.setState({ searchEngine: "google" })}
          >
            Google
          </Button>
          <Button
            variant={searchEngine === "bing" ? "accent" : "ghost"}
            className="rounded-xl"
            onClick={() => useSettingsStore.setState({ searchEngine: "bing" })}
          >
            Bing
          </Button>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
          <Search className="h-5 w-5 text-slate-400" />
          <Input
            className="border-none bg-transparent text-lg placeholder:text-slate-500"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
            placeholder="Tapez une recherche ou une URL"
          />
          <Button variant="accent" className="rounded-xl" onClick={handleSearch}>
            Go
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-12">
        <SpeedDial onOpen={onSearch} />
        <div id="gx-control-panel" className="xl:col-span-5">
          <GXControl />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {showSuggestions && (
          <Card className="bg-slate-900/40">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>🎮 Try the latest indie cyberpunk demo tonight.</p>
              <p>🎧 Neon Chill playlist updated with fresh synthwave.</p>
              <p>🧠 Boost focus: enable GX Control CPU limiter to 60%.</p>
            </CardContent>
          </Card>
        )}
        {showWeather && (
          <Card className="bg-slate-900/40">
            <CardHeader>
              <CardTitle>Météo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>🌌 Neo-Paris · 12°C · Brume neon.</p>
              <p>💨 Vent : 8km/h Nord-Est.</p>
              <p>💡 Conseil : activez le fond vidéo pour contraster.</p>
            </CardContent>
          </Card>
        )}
        {showNews && (
          <Card className="bg-slate-900/40">
            <CardHeader>
              <CardTitle>News</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>🚀 HyperGX 0.1.0 dévoile la navigation modulable.</p>
              <p>🛰️ Satellite Aurora diffuse un flux 8K d'aurores.</p>
              <p>🔧 Patch notes : import/export JSON stabilisé.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
