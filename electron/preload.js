// ─────────────────────────────────────────────────────────────────────────────
// preload.js  —  Secure IPC bridge between Renderer (React) and Main (Node.js)
// Exposes window.electronAPI to the React app.
// ─────────────────────────────────────────────────────────────────────────────

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Auth ────────────────────────────────────────────────────────────────────
  registerUser:    (username, passwordHash, profile) =>
    ipcRenderer.invoke('auth:register', username, passwordHash, profile),

  loginUser:       (username, passwordHash) =>
    ipcRenderer.invoke('auth:login', username, passwordHash),

  updateProfile:   (username, profile) =>
    ipcRenderer.invoke('auth:updateProfile', username, profile),

  deleteAccount:   (username) =>
    ipcRenderer.invoke('auth:deleteAccount', username),

  userExists:      (username) =>
    ipcRenderer.invoke('auth:userExists', username),

  // ── Session ─────────────────────────────────────────────────────────────────
  setSession:      (user) =>
    ipcRenderer.invoke('session:set', user),

  getSession:      () =>
    ipcRenderer.invoke('session:get'),

  clearSession:    () =>
    ipcRenderer.invoke('session:clear'),

  // ── Per-User Data ───────────────────────────────────────────────────────────
  getData:         (username, key) =>
    ipcRenderer.invoke('data:get', username, key),

  setData:         (username, key, value) =>
    ipcRenderer.invoke('data:set', username, key, value),

  removeData:      (username, key) =>
    ipcRenderer.invoke('data:remove', username, key),

  getAllData:      (username) =>
    ipcRenderer.invoke('data:getAll', username),

  clearAllData:    (username) =>
    ipcRenderer.invoke('data:clearAll', username),
});
