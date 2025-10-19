import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
  ipc: {
    invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
    send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args)
  }
});
