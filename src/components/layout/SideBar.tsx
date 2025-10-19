import {
  Home,
  Star,
  History,
  Download,
  Settings,
  Waves,
  BookOpen,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const actions = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "favorites", label: "Favoris", icon: Star },
  { id: "history", label: "Historique", icon: History },
  { id: "downloads", label: "Téléchargements", icon: Download },
  { id: "settings", label: "Paramètres", icon: Settings },
  { id: "gx", label: "GX Control", icon: Zap },
  { id: "setup", label: "Easy Setup", icon: Waves },
  { id: "about", label: "HyperGX", icon: BookOpen }
];

interface SideBarProps {
  active: string;
  onAction: (id: string) => void;
}

export function SideBar({ active, onAction }: SideBarProps) {
  return (
    <aside className="flex h-full w-20 flex-col items-center gap-6 border-r border-white/10 bg-slate-950/60 py-6 backdrop-blur-xl">
      <motion.div whileHover={{ rotate: 5 }} className="text-xs font-semibold tracking-widest text-white/80">
        GX
      </motion.div>
      <nav className="flex flex-col items-center gap-3">
        {actions.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onAction(id)}
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/60 text-slate-300 transition-all hover:border-[var(--accent-color)] hover:text-white",
                isActive && "border-[var(--accent-color)] text-white shadow-glow"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1 text-xs opacity-0 shadow-lg transition group-hover:opacity-100">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
