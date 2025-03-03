const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  sendEmail: (email, otpCode) => ipcRenderer.invoke("send-email", email, otpCode),
});
