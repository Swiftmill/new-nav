import { app, BrowserWindow, shell, ipcMain, nativeTheme } from "electron";
import path from "node:path";

const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#0b0f1a",
    titleBarStyle: "hiddenInset",
    vibrancy: "ultra-dark",
    trafficLightPosition: { x: 16, y: 18 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  mainWindow.setMenuBarVisibility(false);
  nativeTheme.themeSource = "dark";

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = path.join(__dirname, "../dist/index.html");
    await mainWindow.loadFile(indexHtml);
  }

  ipcMain.handle("open-external", async (_event, url: string) => {
    await shell.openExternal(url);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) void createWindow();
});
