const { app, BrowserWindow } = require('electron');
// const customTitlebar = require('custom-electron-titlebar');
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
function isDev(env) {
  const reg = /^(development|test)$/.test(env);
  return reg;
}

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    titleBarStyle: 'hidden', // 隐藏边框
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });
  attachTitlebarToWindow(win)

  if (isDev(process.env.NODE_ENV)) {
    win.openDevTools();
    win.loadURL('http://127.0.0.1:7001/');
  } else {
    // win.loadURL()
  }

  win.on('close', onCloseWindow);
}

/**
 * @description 关闭窗口回调函数
 */
function onCloseWindow() {
  win = null
}

/**
 * @description ready回调函数
 *
 */
function onReady() {
  createWindow()
}

app.on('ready', onReady);
