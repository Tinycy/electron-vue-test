
import {
	app,
	BrowserWindow,
	Menu,
	Tray,
	dialog,
	ipcMain
} from 'electron'
'use strict'
const path = require('path')
import fs from 'fs'

if (process.mas) app.setName('data monitor')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// var Configs = fs.readFileSync(path.join(__static, './package.json'), 'utf8')
// var thisVersion = JSON.parse(Configs).version;
// var thisDetails =  JSON.parse(Configs).detail;
let mainWindow = null
const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:9080` :
	`file://${__dirname}/index.html`
let appTray = null;

function createWindow() {
	appTray = new Tray(path.join(__static, 'icon.png'))
	appTray.setTitle('electron-tiny')
	var moni_menu = Menu.buildFromTemplate([
		{
			label: '设置',
			click: function() {
				mainWindow.show();
			}
		},
		{
			label: '关于监控系统',
			click: function() {
				dialog.showMessageBox({
						type: 'none',
						title: '系统信息',
						message: '服务数据监控',
						icon: path.join(__static, 'icon.png'),
						detail:'版本号：1.0.1',
						defaultId: 0
					},
					function(index) {
						if (index === 0) {
							// mainWindow.minimize();
						} else {
							mainWindow = null;
							app.exit();
						}
					}
				)
			}

		},
		{
			label: '退出',
			click: function() {
				mainWindow = null
				app.quit()
			}
		}
	])
	appTray.setContextMenu(moni_menu)
	appTray.on('click', () => {

		mainWindow.show()
	})
	const windowOptions = {
		width: 1024,
		minWidth: 1024,
		height: 750,
		minHeight: 750,
		// frame: false, //系统自带的菜单栏
		title: app.getName(),
		autoHideMenuBar: true,
		backgroundColor: 'white',
		modal: true,
		parent: 'top',
		webPreferences: {
			nodeIntegration: true
		}
	}
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow(windowOptions)

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
app.on('close', (event) => {
	mainWindow.hide()
	mainWindow.setSkipTaskbar(true)
	event.preventDefault()
})
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
app.on('hide', () => {
	appTray.setHighlightMode('never')
})

app.on('show', () => {
	appTray.setHighlightMode('always')
	mainWindow.setSkipTaskbar(false)
})

// !(function updateHandle () {
//   let message = {
//     error: '检查更新出错',
//     checking: '正在检查更新',
//     updateAva: '检测到新版本，正在下载...',
//     updateNotAva: '已经是最新版本!'
//   }
//   // autoUpdater.autoDownload = false;//取消自动下载
//   const uploadUrl = 'http://192.168.20.14:3000/newApp/'
//   autoUpdater.setFeedURL(uploadUrl)
//   autoUpdater.on('error', function (error) {
//     sendUpdateMessage(message.error)
//   })
//   autoUpdater.on('checking-for-update', function () {
//     sendUpdateMessage(message.checking)
//   })
//   autoUpdater.on('update-available', function (info) {
//     sendUpdateMessage(message.updateAva)
//   })
//   autoUpdater.on('update-not-available', function (info) {
//     sendUpdateMessage(message.updateNotAva)
//   })
//   // 更新下载进度事件
//   autoUpdater.on('download-progress', function (progressObj) {
// 	    mainWindow.webContents.send('downloadProgress', progressObj)
//   })
//   autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

// 	ipcMain.on('isUpdateNow', (e, arg) => {
// 	        console.log(arguments)
// 	        console.log('开始更新')
// 	        // some code here to handle event
// 	        autoUpdater.quitAndInstall()
// 			mainWindow.destroy()
// 	    })

// 	    mainWindow.webContents.send('isUpdateNow')
//   })

//   ipcMain.on('checkForUpdate', () => {
// 		console.log('执行自动更新检查')
// 		// 执行自动更新检查
// 		autoUpdater.checkForUpdates()
//   })
//   ipcMain.on('downloadUpdate', () => {
//       // 下载
// 	console.log('执行下载')
//       autoUpdater.downloadUpdate()
//     })
// }())
// // 通过main进程发送事件给renderer进程，提示更新信息
// function sendUpdateMessage(text) {
// 	mainWindow.webContents.send('message', text)
// }
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})

