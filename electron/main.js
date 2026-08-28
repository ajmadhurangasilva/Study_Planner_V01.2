// ─────────────────────────────────────────────────────────────────────────────
// main.js  —  Electron Main Process
// Manages the browser window, SQLite database, session state, and IPC handlers.
// ─────────────────────────────────────────────────────────────────────────────

const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

const {
  initDatabase,
  registerUser,
  findUser,
  userExists,
  updateUserProfile,
  deleteUser,
  getUserData,
  setUserData,
  removeUserData,
  getAllUserData,
  clearAllUserData,
} = require('./database');

// ── In-memory session (username of logged-in user) ────────────────────────────
let currentSession = null;

// ── Create Main Window ────────────────────────────────────────────────────────

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Study Planner',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    backgroundColor: '#0f172a',
    show: false, // show after ready-to-show to avoid flash
  });

  // Gracefully show after content is ready
  win.once('ready-to-show', () => win.show());

  if (isDev) {
    // Development: load from Vite dev server
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Production: load built files
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// ── App Lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC Handlers: Auth ────────────────────────────────────────────────────────

ipcMain.handle('auth:register', async (_, username, passwordHash, profile) => {
  return registerUser(username, passwordHash, profile);
});

ipcMain.handle('auth:login', async (_, username, passwordHash) => {
  const user = findUser(username);
  if (!user) {
    return { success: false, error: 'No account found with that username.' };
  }
  if (user.password_hash !== passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }
  const publicUser = {
    username: user.username,
    profile: {
      fullName: user.full_name,
      email: user.email,
      degree: user.degree,
      semester: user.semester,
    },
    createdAt: user.created_at,
  };
  return { success: true, user: publicUser };
});

ipcMain.handle('auth:userExists', async (_, username) => {
  return userExists(username);
});

ipcMain.handle('auth:updateProfile', async (_, username, profile) => {
  const result = updateUserProfile(username, profile);
  if (!result.success) return result;
  const user = findUser(username);
  const publicUser = {
    username: user.username,
    profile: {
      fullName: user.full_name,
      email: user.email,
      degree: user.degree,
      semester: user.semester,
    },
    createdAt: user.created_at,
  };
  return { success: true, user: publicUser };
});

ipcMain.handle('auth:deleteAccount', async (_, username) => {
  clearAllUserData(username);
  return deleteUser(username);
});

// ── IPC Handlers: Session ─────────────────────────────────────────────────────

ipcMain.handle('session:set', async (_, user) => {
  currentSession = user;
  return true;
});

ipcMain.handle('session:get', async () => {
  return currentSession;
});

ipcMain.handle('session:clear', async () => {
  currentSession = null;
  return true;
});

// ── IPC Handlers: Per-User Data ───────────────────────────────────────────────

ipcMain.handle('data:get', async (_, username, key) => {
  const raw = getUserData(username, key);
  if (raw === null) return null;
  try { return JSON.parse(raw); } catch { return raw; }
});

ipcMain.handle('data:set', async (_, username, key, value) => {
  setUserData(username, key, JSON.stringify(value));
  return true;
});

ipcMain.handle('data:remove', async (_, username, key) => {
  removeUserData(username, key);
  return true;
});

ipcMain.handle('data:getAll', async (_, username) => {
  return getAllUserData(username);
});

ipcMain.handle('data:clearAll', async (_, username) => {
  clearAllUserData(username);
  return true;
});
