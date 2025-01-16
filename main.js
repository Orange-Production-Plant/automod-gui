const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')


const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false
		  }
	})
  
	win.loadFile('index.html')
	return win
}

app.whenReady().then(() => {
	let window = createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	  })

	ipcMain.on('openDirectoryDialog', (event, title) => {
	dialog
		.showOpenDialog(window, {title:title, properties: ['openDirectory']})
		.then(({ filePaths }) => {
			if (filePaths.length) {
				event.reply('folderSelected', filePaths[0]);
			}
		}).catch(()=> {
			window.close();
		});
	})
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
});



