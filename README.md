## electron-multiwindow

electron multi-window management and toolkit

### demo

#### init

```ts
const multiwindow = Multiwindow.initialize({
  loadURL: process.env["ELECTRON_RENDERER_URL"],
  loadFile: join(__dirname, "../renderer/index.html"),
  baseOptions: {
    width: 920,
    height: 600,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  },
});
```

#### Fetch manager
```ts
const multiwindow = Multiwindow.getInstance();
```

#### Create window

```ts
multiwindow.newWindow({
  width: 320,
  height: 450,
  url: "/login",
  resizable: false,
  moduleName: "login",
});
```

### Get window

```ts
multiwindow.getWin("app"); //Obtain the value by window name
// or
multiwindow.getWin(1); // Obtain the value from the window id
```

#### Delete window

```ts
multiwindow.removeWin("app");
// or
multiwindow.removeWin(1);
```
