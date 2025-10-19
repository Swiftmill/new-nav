import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/settings";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    startPageDefault,
    setStartPageDefault,
    searchEngine,
    setSearchEngine,
    exportData,
    importData
  } = useSettingsStore();
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hypergx-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Export réalisé ✔");
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = importData(text);
    if (result.success) {
      setStatus("Import réussi ✨");
    } else {
      setStatus(result.error ?? "Import impossible");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Paramètres HyperGX</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Page d'accueil</h3>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <div>
                <p className="font-medium">Start Page par défaut</p>
                <p className="text-xs text-slate-400">Utiliser HyperGX comme page d'accueil au démarrage.</p>
              </div>
              <Switch checked={startPageDefault} onCheckedChange={setStartPageDefault} />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Moteur de recherche</h3>
            <div className="flex items-center gap-3">
              {[
                { id: "google", label: "Google" },
                { id: "bing", label: "Bing" }
              ].map((option) => (
                <Button
                  key={option.id}
                  variant={searchEngine === option.id ? "accent" : "ghost"}
                  className="rounded-xl"
                  onClick={() => setSearchEngine(option.id as "google" | "bing")}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Import / Export</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="accent" className="rounded-xl" onClick={handleExport}>
                Exporter JSON
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                Importer JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleImport(file);
                    event.target.value = "";
                  }
                }}
              />
              {status && (
                <motion.span
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-slate-300"
                >
                  {status}
                </motion.span>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Données locales</h3>
            <p className="text-sm text-slate-400">
              Les favoris, speed-dials et thèmes sont sauvegardés en localStorage. Utilisez l'export pour partager vos setups.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="favorites">Favoris (séparés par des virgules)</Label>
                <Input
                  id="favorites"
                  placeholder="https://hypergx.app, https://openai.com"
                  onBlur={(event) => {
                    const entries = event.target.value
                      .split(",")
                      .map((entry) => entry.trim())
                      .filter(Boolean);
                    useSettingsStore.setState({ favorites: entries });
                    setStatus("Favoris mis à jour");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Export rapide</Label>
                <textarea
                  className="h-32 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-200"
                  readOnly
                  value={exportData()}
                />
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
