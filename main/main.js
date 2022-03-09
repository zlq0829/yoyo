const { app, BrowserWindow } = require('electron');
const path = require('path');


function isDev(env) {
  const reg = /^(development|test)$/.test(env);
  return reg;
}

let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    frame: false,
    titleBarStyle: 'hidden', // 隐藏边框
    center: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '../preload.js'),
      enableRemoteModule: true, // 允許在 Render Process 使用 Remote Module
      contextIsolation: false, // 讓在 preload.js 的定義可以傳遞到 Render Process (React)
      webSecurity: false,
    },
  });

  // 设置窗口最小尺寸
  mainWindow.setMinimumSize(1100, 720)

  // 根据环境执行
  if (isDev(process.env.NODE_ENV)) {
    mainWindow.loadURL(`http://127.0.0.1:7001/`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/../app.asar.unpacked/index.html`);
  }

  mainWindow.on('close', onCloseWindow);
  return mainWindow;
}

// 关闭窗口回调函数
function onCloseWindow() {
  mainWindow = null
}

// 进程调用
let workerProcess = null;
let autoLiveFlag = false;
function launchVideoProcess(flag) {
  if (!workerProcess || flag) {
    let childProcessCallback = (err, stdout, stderr) => {
      autoLiveFlag = false;
      if (err) {
        log.error('error:', err);
      }
      log.warn('stdout:', stdout);
      log.error('stderr:', stderr);
    };

    log.info(process.env.ENABLE_SERVER_CONSOLE);
    const cmdStr = 'server.exe'; // 本地需要启动的后台服务可执行文件的路径
    if (!!process.env.ENABLE_SERVER_CONSOLE) {
      log.info('spawn');
      autoLiveFlag = false;
      workerProcess = spawn(cmdStr, [] , { cwd: cwd, detached: true });
    } else {
      log.info('exec');
      autoLiveFlag = false;
      workerProcess = exec(cmdStr, { cwd: cwd }, childProcessCallback);
    }
    workerProcess.on('close', () => {
      console.log('close!!!!');
      workerProcess = null;
      autoLiveFlag = false;
    })
    workerProcess.on('exit', () => {
      console.log('exit!!!!');
      workerProcess = null;
      autoLiveFlag = false;
    })
    workerProcess.on('data', () => {
      log.info(`workerProcess.stdout:${data}`);
    })
    workerProcess.stderr.on('data', (error) => {
      log.error(`workerProcess.stderr:${error}`);
    });
  }
}

function onReady() {
  createWindow()
}

app.on('ready', onReady);
