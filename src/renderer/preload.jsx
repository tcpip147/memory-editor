import { contextBridge, ipcRenderer } from 'electron';
import { MAXIMIZE_PATH, UNMAXIMIZE_PATH } from '@common/globalVariables';

contextBridge.exposeInMainWorld('electronWindow', {
    ipcContextTitlebar: {
        minimize() {
            ipcRenderer.invoke('window-minimize');
        },
        toggleMaximize() {
            ipcRenderer.invoke('window-toggle-maximize');
        },
        close() {
            ipcRenderer.invoke('window-close');
        }
    }
});

ipcRenderer.on('window-maximized', (e) => {
    const path = document.getElementById("window-btn-maximize");
    path.setAttribute("d", UNMAXIMIZE_PATH);
});

ipcRenderer.on('window-unmaximized', (e) => {
    const path = document.getElementById("window-btn-maximize");
    path.setAttribute("d", MAXIMIZE_PATH);
});

ipcRenderer.invoke('window-unmaximize');