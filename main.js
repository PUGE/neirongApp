// Modules to control application life and create native browser window
const {app, ipcMain, BrowserWindow, webContents} = require('electron')
const path = require('path')
const fs = require("fs")
let mainWindow = null
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    title: "网页内容审核工具",
    // autoHideMenuBar: true,
    icon: "./image/icon.png",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './insert/preload.js')
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  // mainWindow.loadURL("http://cms.peopleurl.cn/cms/ChannelView.shtml?id=405210")
  mainWindow.loadURL("http://www.people.com.cn/")
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.on("did-finish-load", function() {
    const js = fs.readFileSync(path.join(__dirname, './insert/neirongCore.js')).toString();
    mainWindow.webContents.executeJavaScript(js);
  });
  // mainWindow.webContents.on('found-in-page', (event, result) => {
  //   if (result.finalUpdate) {
  //     mainWindow.webContents.stopFindInPage('keepSelection');
  //   }
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('changeUrl', (event, arg) => {
  console.log(arg)
  mainWindow.loadURL(arg.url)
  event.returnValue = {err: 0}
})

ipcMain.on('search-text', (event, arg) => {
  console.log(arg)
  mainWindow.webContents.findInPage(arg);
  event.returnValue = {err: 0}
});
