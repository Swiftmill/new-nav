import { Cpu, Gauge, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSettingsStore } from "@/store/settings";

export function GXControl() {
  const { cpuLimit, ramLimit, fpsLimit, setCpuLimit, setRamLimit, setFpsLimit } = useSettingsStore();

  const indicators = useMemo(
    () => [
      { id: "cpu", label: "CPU", icon: Cpu, value: cpuLimit, setter: setCpuLimit },
      { id: "ram", label: "RAM", icon: Gauge, value: ramLimit, setter: setRamLimit },
      { id: "fps", label: "FPS", icon: Activity, value: fpsLimit, setter: setFpsLimit }
    ],
    [cpuLimit, ramLimit, fpsLimit, setCpuLimit, setRamLimit, setFpsLimit]
  );

  return (
    <Card className="col-span-5 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="text-2xl">GX Control</CardTitle>
        <p className="text-sm text-slate-400">Ajustez les limites pour simuler les performances.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {indicators.map(({ id, label, icon: Icon, value, setter }) => (
          <div key={id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-color)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-slate-400">Limite virtuelle {value}%</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-white">{value}%</span>
            </div>
            <Slider
              value={[value]}
              max={id === "fps" ? 240 : 100}
              step={id === "fps" ? 5 : 1}
              onValueChange={([next]) => setter(next)}
            />
            <motion.div
              className="h-2 rounded-full bg-slate-800"
              style={{
                position: "relative",
                overflow: "hidden"
              }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent-color)]/80"
                initial={{ width: "10%" }}
                animate={{ width: `${Math.min(100, (value / (id === "fps" ? 240 : 100)) * 100)}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            </motion.div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
