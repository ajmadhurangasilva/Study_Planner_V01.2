// ─────────────────────────────────────────────────────────────────────────────
// database.js  —  SQLite database layer using sql.js (pure JavaScript)
// Data persisted as a binary .db file in AppData/Roaming/StudyPlanner/
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const fs = require('fs');
const { app } = require('electron');

let db = null;
let SQL = null;
let dbFilePath = null;

/**
 * Initialize sql.js and load (or create) the SQLite database.
 */
async function initDatabase() {
  // Lazy-load sql.js (WebAssembly)
  const initSqlJs = require('sql.js');

  // Point sql.js to its WASM file inside node_modules
  const wasmPath = path.join(
    __dirname,
    '../node_modules/sql.js/dist/sql-wasm.wasm'
  );

  SQL = await initSqlJs({ locateFile: () => wasmPath });

  // Determine DB file path
  const userDataPath = app.getPath('userData');
  dbFilePath = path.join(userDataPath, 'studyplanner.db');

  // Load existing DB or create new one
  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      username      TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      full_name     TEXT DEFAULT '',
      email         TEXT DEFAULT '',
      degree        TEXT DEFAULT '',
      semester      TEXT DEFAULT '',
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_data (
      username   TEXT NOT NULL,
      data_key   TEXT NOT NULL,
      data_value TEXT NOT NULL DEFAULT 'null',
      PRIMARY KEY (username, data_key)
    );
  `);

  saveDatabase();
  return db;
}

/** Persist the in-memory DB to disk. */
function saveDatabase() {
  if (!db || !dbFilePath) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFilePath, buffer);
}

// ── User Auth ─────────────────────────────────────────────────────────────────

function registerUser(username, passwordHash, profile) {
  try {
    db.run(
      `INSERT INTO users (username, password_hash, full_name, email, degree, semester, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        passwordHash,
        profile.fullName || '',
        profile.email    || '',
        profile.degree   || '',
        profile.semester || '',
        new Date().toISOString(),
      ]
    );
    saveDatabase();
    return { success: true };
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return { success: false, error: 'That username is already taken. Please choose another.' };
    }
    return { success: false, error: err.message };
  }
}

function findUser(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function userExists(username) {
  return !!findUser(username);
}

function updateUserProfile(username, profile) {
  try {
    db.run(
      `UPDATE users SET full_name=?, email=?, degree=?, semester=? WHERE username=?`,
      [
        profile.fullName || '',
        profile.email    || '',
        profile.degree   || '',
        profile.semester || '',
        username,
      ]
    );
    saveDatabase();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function deleteUser(username) {
  try {
    db.run('DELETE FROM user_data WHERE username = ?', [username]);
    db.run('DELETE FROM users WHERE username = ?', [username]);
    saveDatabase();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Per-User Data Storage ─────────────────────────────────────────────────────

function getUserData(username, key) {
  const stmt = db.prepare('SELECT data_value FROM user_data WHERE username=? AND data_key=?');
  stmt.bind([username, key]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row.data_value;
  }
  stmt.free();
  return null;
}

function setUserData(username, key, value) {
  db.run(
    `INSERT INTO user_data (username, data_key, data_value) VALUES (?, ?, ?)
     ON CONFLICT(username, data_key) DO UPDATE SET data_value=excluded.data_value`,
    [username, key, value]
  );
  saveDatabase();
}

function removeUserData(username, key) {
  db.run('DELETE FROM user_data WHERE username=? AND data_key=?', [username, key]);
  saveDatabase();
}

function getAllUserData(username) {
  const results = db.exec('SELECT data_key, data_value FROM user_data WHERE username=?', [username]);
  const out = {};
  if (results.length > 0) {
    for (const row of results[0].values) {
      const [k, v] = row;
      try { out[k] = JSON.parse(v); } catch { out[k] = v; }
    }
  }
  return out;
}

function clearAllUserData(username) {
  db.run('DELETE FROM user_data WHERE username=?', [username]);
  saveDatabase();
}

module.exports = {
  initDatabase,
  saveDatabase,
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
};
