const { app, BrowserWindow, Menu, dialog, ipcMain  } = require('electron');
const url = require("url")
const path = require("path")
const path = require('path'); // Import path module for cross-platform support
const fs = require('fs');
function createMainWindow () {
  const mainWindow = new BrowserWindow({
    title: "TPGIT Hostel Management",
    width: 1000,
    height: 600
  })
Menu.setApplicationMenu(null);
mainWindow.webContents.openDevTools();

  const startUrl = url.format({
    pathname: path.join(__dirname, './app/build/index.html'),
    protocol: 'file',
  })

  mainWindow.loadURL(startUrl)
}

app.whenReady().then(createMainWindow);
ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx'] }]
  });

  if (canceled || filePaths.length === 0) {
    return null; // No file selected
  }

  // Read file as ArrayBuffer
  return fs.readFileSync(filePaths[0]).buffer;
});


