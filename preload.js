const { ipcRenderer, contextBridge} = require('electron');

const path = require('node:path');
const fs = require("node:fs");
const yaml = require("yaml");

contextBridge.exposeInMainWorld(
  'nativeapis',
  {
    path: path,
    fs:fs,
    yaml:yaml,
    openDirectoryDialog: (title) => {
      ipcRenderer.send("openDirectoryDialog", title);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (_, data) => callback(data));
    },
  }
);