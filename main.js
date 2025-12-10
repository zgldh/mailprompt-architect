const { app, BrowserWindow } = require('electron');
const path = require('path');

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

  // In development, you might want to load 'http://localhost:5173'
  // But for the packaged app, we load the compiled HTML file.
  // The 'dist' folder is created by 'npm run build'
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
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
