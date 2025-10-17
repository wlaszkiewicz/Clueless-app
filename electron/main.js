const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // ← CRITICAL: set to false
      contextIsolation: true, // ← CRITICAL: set to true
      enableRemoteModule: false, // ← CRITICAL: set to false
      webSecurity: false, // ← Allow loading from localhost
    },
  });

  // Load Expo web
  mainWindow.loadURL("http://localhost:8081");
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
