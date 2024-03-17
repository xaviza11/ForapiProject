const { app, BrowserWindow, screen } = require('electron');

function createWindow(page) {

  try {
    app.whenReady().then(() => {

      const mainScreen = screen.getPrimaryDisplay();
      const dimensions = mainScreen.size;

      const win = new BrowserWindow({
        width: dimensions.width,
        height: dimensions.height,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: false,
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          enableRemoteModule: true
        }
      });

      win.on('closed', () => {

      });

      win.loadFile(page)
    })
  } catch (error) { }
}

module.exports = createWindow