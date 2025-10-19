import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeId = "aurora" | "classic" | "noir";
export type SearchEngine = "google" | "bing";

export interface SpeedDialItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  gradient: string;
  description: string;
}

export interface SettingsState {
  theme: ThemeId;
  accentColor: string;
  themeSounds: boolean;
  showSuggestions: boolean;
  showWeather: boolean;
  showNews: boolean;
  searchEngine: SearchEngine;
  startPageDefault: boolean;
  backgroundMode: "image" | "video";
  cpuLimit: number;
  ramLimit: number;
  fpsLimit: number;
  speedDial: SpeedDialItem[];
  favorites: string[];
  themes: ThemeDefinition[];
  setTheme: (theme: ThemeId) => void;
  setAccent: (color: string) => void;
  toggleThemeSounds: () => void;
  toggleSuggestions: () => void;
  toggleWeather: () => void;
  toggleNews: () => void;
  setSearchEngine: (engine: SearchEngine) => void;
  setStartPageDefault: (value: boolean) => void;
  setBackgroundMode: (mode: "image" | "video") => void;
  setCpuLimit: (value: number) => void;
  setRamLimit: (value: number) => void;
  setFpsLimit: (value: number) => void;
  addSpeedDial: (item: SpeedDialItem) => void;
  updateSpeedDial: (item: SpeedDialItem) => void;
  removeSpeedDial: (id: string) => void;
  reorderSpeedDial: (items: SpeedDialItem[]) => void;
  exportData: () => string;
  importData: (json: string) => { success: boolean; error?: string };
}

const defaultSpeedDial: SpeedDialItem[] = [
  { id: "chatgpt", title: "ChatGPT", url: "https://chat.openai.com", icon: "/assets/icons/chatgpt.svg" },
  { id: "youtube", title: "YouTube", url: "https://www.youtube.com", icon: "/assets/icons/youtube.svg" },
  { id: "gmail", title: "Gmail", url: "https://mail.google.com", icon: "/assets/icons/gmail.svg" },
  { id: "discord", title: "Discord", url: "https://discord.com/app", icon: "/assets/icons/discord.svg" },
  { id: "netflix", title: "Netflix", url: "https://www.netflix.com", icon: "/assets/icons/netflix.svg" },
  { id: "twitch", title: "Twitch", url: "https://www.twitch.tv", icon: "/assets/icons/twitch.svg" },
  { id: "spotify", title: "Spotify", url: "https://open.spotify.com", icon: "/assets/icons/spotify.svg" },
  { id: "twitter", title: "X", url: "https://twitter.com", icon: "/assets/icons/x.svg" },
  { id: "amazon", title: "Amazon", url: "https://www.amazon.com", icon: "/assets/icons/amazon.svg" },
  { id: "reddit", title: "Reddit", url: "https://www.reddit.com", icon: "/assets/icons/reddit.svg" },
  { id: "github", title: "GitHub", url: "https://github.com", icon: "/assets/icons/github.svg" },
  { id: "notion", title: "Notion", url: "https://www.notion.so", icon: "/assets/icons/notion.svg" }
];

const themePresets: ThemeDefinition[] = [
  {
    id: "aurora",
    name: "Aurora",
    gradient: "from-purple-500/60 via-sky-500/50 to-cyan-400/40",
    description: "Lueur polaire aux accents neon."
  },
  {
    id: "classic",
    name: "Classic",
    gradient: "from-slate-600/60 via-slate-700/50 to-slate-900/50",
    description: "Équilibre moderne et lisible."
  },
  {
    id: "noir",
    name: "Noir total",
    gradient: "from-black/70 via-slate-950/70 to-black/70",
    description: "Contrast maximal et immersion."
  }
];

const deserialize = (json: string): Partial<SettingsState> | undefined => {
  try {
    const data = JSON.parse(json);
    if (!data || typeof data !== "object") return undefined;
    return data as Partial<SettingsState>;
  } catch (error) {
    console.error("Failed to parse settings", error);
    return undefined;
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "aurora",
      accentColor: "#7c3aed",
      themeSounds: false,
      showSuggestions: true,
      showWeather: false,
      showNews: false,
      searchEngine: "google",
      startPageDefault: true,
      backgroundMode: "image",
      cpuLimit: 45,
      ramLimit: 60,
      fpsLimit: 120,
      speedDial: defaultSpeedDial,
      favorites: [],
      themes: themePresets,
      setTheme: (theme) => set({ theme }),
      setAccent: (accentColor) => set({ accentColor }),
      toggleThemeSounds: () => set((state) => ({ themeSounds: !state.themeSounds })),
      toggleSuggestions: () => set((state) => ({ showSuggestions: !state.showSuggestions })),
      toggleWeather: () => set((state) => ({ showWeather: !state.showWeather })),
      toggleNews: () => set((state) => ({ showNews: !state.showNews })),
      setSearchEngine: (searchEngine) => set({ searchEngine }),
      setStartPageDefault: (startPageDefault) => set({ startPageDefault }),
      setBackgroundMode: (mode) => set({ backgroundMode: mode }),
      setCpuLimit: (cpuLimit) => set({ cpuLimit }),
      setRamLimit: (ramLimit) => set({ ramLimit }),
      setFpsLimit: (fpsLimit) => set({ fpsLimit }),
      addSpeedDial: (item) => set((state) => ({ speedDial: [...state.speedDial, item] })),
      updateSpeedDial: (item) =>
        set((state) => ({
          speedDial: state.speedDial.map((entry) => (entry.id === item.id ? item : entry))
        })),
      removeSpeedDial: (id) =>
        set((state) => ({
          speedDial: state.speedDial.filter((entry) => entry.id !== id)
        })),
      reorderSpeedDial: (items) => set({ speedDial: items }),
      exportData: () => {
        const snapshot = JSON.stringify({
          theme: get().theme,
          accentColor: get().accentColor,
          themeSounds: get().themeSounds,
          showSuggestions: get().showSuggestions,
          showWeather: get().showWeather,
          showNews: get().showNews,
          searchEngine: get().searchEngine,
          startPageDefault: get().startPageDefault,
          backgroundMode: get().backgroundMode,
          cpuLimit: get().cpuLimit,
          ramLimit: get().ramLimit,
          fpsLimit: get().fpsLimit,
          speedDial: get().speedDial,
          favorites: get().favorites
        }, null, 2);
        return snapshot;
      },
      importData: (json) => {
        const parsed = deserialize(json);
        if (!parsed) {
          return { success: false, error: "JSON invalide" };
        }
        set((state) => ({
          ...state,
          ...parsed,
          speedDial: parsed.speedDial ?? state.speedDial,
          favorites: parsed.favorites ?? state.favorites
        }));
        return { success: true };
      }
    }),
    {
      name: "hypergx-settings"
    }
  )
);

export const exampleExport = () =>
  useSettingsStore.getState().exportData();
