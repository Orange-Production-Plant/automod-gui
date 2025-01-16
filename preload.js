const { ipcRenderer, contextBridge} = require('electron')

const path = require('node:path')
const fs = require("node:fs")

contextBridge.exposeInMainWorld(
  'nativeapis',
  {
    path: path,
    fs:fs,
    openDirectoryDialog: (title) => {
      ipcRenderer.send("openDirectoryDialog", title);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (_, data) => callback(data));
    },
  }
);