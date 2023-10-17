import { BrowserWindow, shell } from "electron";
import { is } from "./is";

export type Options = {
  loadURL: string | undefined;
  loadFile: string;
  baseOptions: Electron.BrowserWindowConstructorOptions;
};

export interface MultiNewOptions
  extends Electron.BrowserWindowConstructorOptions {
  moduleName: string;
  url?: string;
}
export class Multiwindow {
  loadURL?: string;
  loadFile: string;
  baseOptions: Electron.BrowserWindowConstructorOptions;
  private winModalMap: Map<string, BrowserWindow>;
  private winIdsMap: Map<number, string>;
  constructor(options: Options) {
    this.loadURL = options.loadURL;
    this.loadFile = options.loadFile;
    this.baseOptions = options.baseOptions;
    this.winModalMap = new Map();
    this.winIdsMap = new Map();
  }

  static instance: Multiwindow;

  static initialize(options: Options) {
    if (!this.instance) {
      this.instance = new Multiwindow(options);
    }
    return this.instance;
  }

  static getInstance() {
    return this.instance;
  }

  getWin(moduleName: string): BrowserWindow | undefined;
  getWin(winId: number): BrowserWindow | undefined;
  getWin(val: string | number) {
    if (typeof val === "number") {
      const moduleName = this.winIdsMap.get(val);
      if (moduleName == undefined) return;
      const win = this.winModalMap.get(moduleName);
      return win;
    }
    return this.winModalMap.get(val);
  }

  getWinds() {
    return this.winModalMap;
  }

  removeWin(winName: string): void;
  removeWin(winId: number): void;
  removeWin(val: string | number) {
    try {
      if (typeof val === "number") {
        const moduleName = this.winIdsMap.get(val);
        if (moduleName == undefined) return;
        const win = this.winModalMap.get(moduleName);
        this.winIdsMap.delete(val);
        this.winModalMap.delete(moduleName);
        win?.close();
      } else {
        const win = this.winModalMap.get(val);
        this.winModalMap.delete(val);
        win && this.winIdsMap.delete(win.id);
        win?.close();
      }
    } catch (error) {}
  }

  getNewWindowOptions(
    options: MultiNewOptions
  ): Electron.BrowserWindowConstructorOptions {
    return { ...this.baseOptions, ...options };
  }

  newWindow(options: MultiNewOptions) {
    const moduleName = options.moduleName;
    if (this.winModalMap.has(moduleName)) {
      return this.winModalMap.get(moduleName);
    }
    const win = new BrowserWindow({ ...this.baseOptions, ...options });
    this.winIdsMap.set(win.id, moduleName);
    this.winModalMap.set(moduleName, win);
    win.on("close", () => {
      this.removeWin(win.id);
    });

    win.on("ready-to-show", () => {
      win.webContents.send("setWinInfo", {
        winViewId: win.id,
        winViewModule: moduleName,
      });
      win.show();
    });

    win.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });
    let path = options.url || "";
    path = "#" + path;
    if (is.dev && this.loadURL) {
      win.loadURL(this.loadURL + path);
    } else {
      win.loadFile(this.loadFile, {
        hash: path,
      });
    }
    return win;
  }
}
