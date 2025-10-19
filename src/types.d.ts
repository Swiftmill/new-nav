export {}; 

declare global {
  interface Window {
    electron?: {
      openExternal?: (url: string) => void;
      ipc?: {
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
        send: (channel: string, ...args: unknown[]) => void;
      };
    };
  }
}
