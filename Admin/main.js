const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "TPGIT Hostel Management",
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Keep it false for security
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // Preload script for IPC
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.webContents.openDevTools();

  const startUrl = url.format({
    pathname: path.join(__dirname, "./app/build/index.html"),
    protocol: "file",
  });

  mainWindow.loadURL(startUrl);
}

app.whenReady().then(createMainWindow);

// Handle file selection dialog
ipcMain.handle("open-file-dialog", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Excel Files", extensions: ["xls", "xlsx"] }],
  });

  if (canceled || filePaths.length === 0) {
    return null; // No file selected
  }

  return fs.readFileSync(filePaths[0]).buffer;
});

// Nodemailer: Handle email sending request from renderer process
ipcMain.handle("send-email", async (event, email, otpCode) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tpgithostels2025@gmail.com", // Replace with your Gmail
        pass: "fhea fpdp rxjy yotl", // Use App Password (not your regular password)
      },
    });

    let mailOptions = {
      from: "tpgithostels2025@gmail.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otpCode}. This OTP will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
