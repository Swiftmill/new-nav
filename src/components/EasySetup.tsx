import { motion } from "framer-motion";
import { Palette, Music2, Brush } from "lucide-react";
import { useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/settings";

interface EasySetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EasySetup({ open, onOpenChange }: EasySetupProps) {
  const {
    themes,
    theme,
    setTheme,
    accentColor,
    setAccent,
    themeSounds,
    toggleThemeSounds,
    showSuggestions,
    toggleSuggestions,
    showWeather,
    toggleWeather,
    showNews,
    toggleNews,
    backgroundMode,
    setBackgroundMode
  } = useSettingsStore();

  const accentGradient = useMemo(
    () => ({ background: `linear-gradient(90deg, #6366f1, ${accentColor}, #22d3ee)` }),
    [accentColor]
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-3xl">
            <Palette className="h-7 w-7 text-[var(--accent-color)]" /> Easy Setup
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-8 overflow-y-auto pb-12">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Thèmes</h3>
            <div className="grid gap-3">
              {themes.map((preset) => (
                <motion.button
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setTheme(preset.id)}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                    theme === preset.id ? "border-[var(--accent-color)] bg-slate-900/80" : "border-white/10 bg-slate-900/40"
                  }`}
                >
                  <div>
                    <p className="text-base font-semibold">{preset.name}</p>
                    <p className="text-xs text-slate-400">{preset.description}</p>
                  </div>
                  <div className={`h-16 w-28 rounded-xl bg-gradient-to-br ${preset.gradient}`} />
                </motion.button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Accent color</h3>
              <span className="text-sm text-slate-400">{accentColor}</span>
            </div>
            <div className="h-2 rounded-full" style={accentGradient} />
            <input
              type="range"
              min="0"
              max="360"
              className="w-full accent-[var(--accent-color)]"
              value={parseInt(accentColor.slice(1), 16) % 360}
              onChange={(e) => {
                const hue = Number(e.target.value);
                const color = `hsl(${hue} 82% 62%)`;
                const temp = document.createElement("div");
                temp.style.color = color;
                document.body.appendChild(temp);
                const rgb = getComputedStyle(temp).color
                  .replace(/rgb\(|\)/g, "")
                  .split(",")
                  .map((v) => Number(v.trim()));
                document.body.removeChild(temp);
                const hex = `#${rgb
                  .map((v) => v.toString(16).padStart(2, "0"))
                  .join("")}`;
                setAccent(hex);
              }}
            />
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Music2 className="h-5 w-5" /> Ambiance
            </h3>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div>
                <p className="font-medium">Sons de thème</p>
                <p className="text-xs text-slate-400">Bips et chimes futuristes</p>
              </div>
              <Switch checked={themeSounds} onCheckedChange={toggleThemeSounds} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div>
                <p className="font-medium">Fond dynamique</p>
                <p className="text-xs text-slate-400">Image statique ou vidéo en boucle</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Button
                  size="sm"
                  variant={backgroundMode === "image" ? "accent" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setBackgroundMode("image")}
                >
                  Image
                </Button>
                <Button
                  size="sm"
                  variant={backgroundMode === "video" ? "accent" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setBackgroundMode("video")}
                >
                  Vidéo
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Brush className="h-5 w-5" /> Modules
            </h3>
            <div className="space-y-3">
              <ToggleRow label="Suggestions" active={showSuggestions} onChange={toggleSuggestions} />
              <ToggleRow label="Météo" active={showWeather} onChange={toggleWeather} />
              <ToggleRow label="News" active={showNews} onChange={toggleNews} />
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ToggleRow({ label, active, onChange }: { label: string; active: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-slate-400">Placeholder de contenu pour {label.toLowerCase()}.</p>
      </div>
      <Switch checked={active} onCheckedChange={onChange} />
    </div>
  );
}
