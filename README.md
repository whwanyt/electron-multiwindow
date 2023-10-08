## electron-multiwindow

electron multi-window management and toolkit

### demo

```ts
// init
const multiwindow = Multiwindow.initialize({
  loadURL: process.env['ELECTRON_RENDERER_URL'],
  loadFile: join(__dirname, '../renderer/index.html'),
  baseOptions: {
    width: 920,
    height: 600,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  }
});
// new window
multiwindow.newWindow({
  width: 320,
  height: 450,
  url: '/login',
  resizable: false,
  moduleName: 'login'
});
```
