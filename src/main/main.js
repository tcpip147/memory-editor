import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import settings from '/package.json';

import addon from 'bindings';

console.log(addon('hello').hello()); // 'world'

let mainWindow;

const createWindow = () => {
    const option = {
        width: 1400,
        height: 750,
        icon: path.resolve('assets/images/icon.png'),
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false
        }
    };

    if (settings.customTitleBar) {
        option.titleBarStyle = 'hidden';
        option.autoHideMenuBar = true;
        option.frame = false;
    }

    mainWindow = new BrowserWindow(option);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    registerTitlebarIpc();

    mainWindow.on("maximize", () => {
        mainWindow.webContents.send("window-maximized");
    });
    mainWindow.on("unmaximize", () => {
        mainWindow.webContents.send("window-unmaximized");
    });
    mainWindow.webContents.on('did-finish-load', function () {
        mainWindow.show();
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

function registerTitlebarIpc() {
    ipcMain.handle('window-minimize', () => {
        mainWindow.minimize();
    });

    ipcMain.handle('window-unmaximize', () => {
        mainWindow.unmaximize();
    });

    ipcMain.handle('window-toggle-maximize', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });

    ipcMain.handle('window-close', () => {
        mainWindow.close();
    });
}