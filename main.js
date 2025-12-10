const { app, BrowserWindow } = require('electron');
const path = require('path');

// Check if running in dev mode (passed via flag in package.json)
const isDev = process.argv.includes('--dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "MailPrompt Architect",
    backgroundColor: '#f8fafc',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });

  if (isDev) {
    // In development, load the Vite dev server
    console.log('Running in development mode: Loading http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools automatically in dev mode for easier debugging
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built static file
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
