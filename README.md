# HyperGX

HyperGX est un MVP de navigateur cyberpunk construit avec **Electron + React + TypeScript + TailwindCSS (Vite)**. L'application combine une Start Page inspirée d'Opera GX, une gestion d'onglets webview et des panneaux de personnalisation instantanés.

## Fonctionnalités

- 🎛️ **Start Page modulable** avec barre de recherche (Google/Bing), modules suggestions/météo/news et Speed Dial 4×3.
- 🧊 **Speed Dial néon** : glisser-déposer, ajout/suppression, persistance locale et icônes SVG incluses.
- 🎨 **Easy Setup drawer** : thèmes Aurora/Classic/Noir, slider d'accent dynamique, fond image ou vidéo et switches de modules.
- 🚀 **GX Control** : sliders CPU/RAM/FPS avec feedback visuel en temps réel.
- ⚙️ **Paramètres** : choix du moteur de recherche, Start Page par défaut, import/export JSON des préférences.
- 🗂️ **Onglets webview** : création/fermeture, navigation back/forward/reload, favicon, raccourcis clavier (Ctrl+T/W/L/E/G/,).
- 💾 **Persistance** via Zustand + localStorage avec un exemple d'export JSON prêt à l'emploi.

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance Vite et Electron en mode développement (hot reload). |
| `npm run build` | Build du frontend React/Vite. |
| `npm run build:electron` | Compilation TypeScript des fichiers Electron. |
| `npm run lint` | Lint des sources TypeScript/TSX. |
| `npm run typecheck` | Vérifie les types sans émettre. |
| `npm run package` | Build complet + packaging avec electron-builder. |

## Structure

```
.
├── electron/
│   ├── main.ts          # Fenêtre Electron, IPC, configuration webview
│   └── preload.ts       # API sécurisée exposée au renderer
├── src/
│   ├── App.tsx
│   ├── assets/
│   │   ├── demo-background.mp4 (placeholder)
│   │   └── sample-export.json
├── public/assets/icons/*.svg  # 12 icônes néon prêtes à l'emploi
│   ├── components/
│   │   ├── SpeedDial.tsx, GXControl.tsx, EasySetup.tsx, SettingsModal.tsx, WebviewTabs.tsx
│   │   └── ui/          # Composants shadcn/ui adaptés (Card, Dialog, Drawer, Slider, Switch, Tabs...)
│   ├── pages/Start.tsx
│   └── store/settings.ts
├── tailwind.config.ts
├── electron-builder.yml
└── README.md
```

## Données incluses

- **Icônes SVG** : YouTube, ChatGPT, Gmail, Discord, Netflix, Twitch, Spotify, X, Amazon, Reddit, GitHub, Notion.
- **Thèmes prédéfinis** : Aurora, Classic, Noir total.
- **Speed Dial** : 12 tuiles pré-remplies (YouTube, ChatGPT, Gmail, Discord, Netflix, etc.).
- **Export JSON exemple** : `src/assets/sample-export.json`.

## Notes

- Le fichier `src/assets/demo-background.mp4` est un placeholder : remplacez-le par une boucle vidéo muette (1080p) pour l'expérience complète.
- Les données sont enregistrées en localStorage (`hypergx-settings`). Pour synchroniser via fichiers, utilisez l'import/export JSON.
- Les raccourcis clavier sont disponibles sur Windows/Linux (Ctrl) et macOS (Cmd, via la touche Cmd map à metaKey dans Electron).

## Licence

MIT
