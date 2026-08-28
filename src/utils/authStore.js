// ─────────────────────────────────────────────────────────────────────────────
// authStore.js  —  Auth & per-user storage helpers
//
// In Electron: uses window.electronAPI (IPC → SQLite in main process)
// In Browser (dev/web): falls back to localStorage for compatibility
// ─────────────────────────────────────────────────────────────────────────────

const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

// ── Password Hashing ──────────────────────────────────────────────────────────

/** SHA-256 hash a string using the Web Crypto API (async). */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Auth Operations ───────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {string} username
 * @param {string} password  (plain — will be hashed)
 * @param {{ fullName, email, degree, semester }} profile
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export async function registerUser(username, password, profile = {}) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const trimmed = username.trim().toLowerCase();
  if (trimmed.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const passwordHash = await hashPassword(password);

  if (isElectron) {
    // ── Electron / SQLite path ──
    const result = await window.electronAPI.registerUser(trimmed, passwordHash, profile);
    if (!result.success) return result;

    const publicUser = {
      username: trimmed,
      profile: {
        fullName: (profile.fullName || '').trim(),
        email:    (profile.email    || '').trim(),
        degree:   (profile.degree   || '').trim(),
        semester: (profile.semester || '').trim(),
      },
      createdAt: new Date().toISOString(),
    };
    await window.electronAPI.setSession(publicUser);
    return { success: true, user: publicUser };
  } else {
    // ── Browser / localStorage fallback ──
    const USERS_KEY = 'slqf_users';
    let users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch {}

    if (users.find((u) => u.username === trimmed)) {
      return { success: false, error: 'That username is already taken. Please choose another.' };
    }

    const newUser = {
      username: trimmed,
      passwordHash,
      profile: {
        fullName: (profile.fullName || '').trim(),
        email:    (profile.email    || '').trim(),
        degree:   (profile.degree   || '').trim(),
        semester: (profile.semester || '').trim(),
      },
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const publicUser = { username: newUser.username, profile: newUser.profile, createdAt: newUser.createdAt };
    setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  }
}

/**
 * Log in an existing user.
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export async function loginUser(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Please enter your username and password.' };
  }

  const trimmed = username.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  if (isElectron) {
    // ── Electron / SQLite path ──
    const result = await window.electronAPI.loginUser(trimmed, passwordHash);
    if (!result.success) return result;

    await window.electronAPI.setSession(result.user);
    return result;
  } else {
    // ── Browser / localStorage fallback ──
    const USERS_KEY = 'slqf_users';
    let users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch {}

    const found = users.find((u) => u.username === trimmed);
    if (!found) return { success: false, error: 'No account found with that username.' };
    if (found.passwordHash !== passwordHash) return { success: false, error: 'Incorrect password. Please try again.' };

    const publicUser = { username: found.username, profile: found.profile, createdAt: found.createdAt };
    setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  }
}

// ── Session Management ────────────────────────────────────────────────────────

/** Persist the logged-in user (sync wrapper for IPC). */
export function setCurrentUser(user) {
  if (isElectron) {
    window.electronAPI.setSession(user); // fire-and-forget
  } else {
    localStorage.setItem('slqf_current_user', JSON.stringify(user));
  }
}

/** Read the currently logged-in user (sync from memory/localStorage). */
export function getCurrentUser() {
  if (isElectron) {
    // Electron session is in-memory in main process — bootstrapped async on app start.
    // Return from localStorage mirror we keep during the session.
    try {
      const raw = sessionStorage.getItem('slqf_electron_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  } else {
    try {
      const raw = localStorage.getItem('slqf_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

/**
 * Bootstrap session on Electron app start.
 * Call this once in main.jsx / App.jsx before rendering.
 */
export async function bootstrapSession() {
  if (!isElectron) return getCurrentUser();
  try {
    const user = await window.electronAPI.getSession();
    if (user) {
      sessionStorage.setItem('slqf_electron_session', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('slqf_electron_session');
    }
    return user;
  } catch {
    return null;
  }
}

/** Log out — clears session. */
export function logoutUser() {
  if (isElectron) {
    window.electronAPI.clearSession();
    sessionStorage.removeItem('slqf_electron_session');
  } else {
    localStorage.removeItem('slqf_current_user');
  }
}

// ── Profile Update ────────────────────────────────────────────────────────────

export async function updateUserProfile(username, newProfile) {
  if (isElectron) {
    const result = await window.electronAPI.updateProfile(username, newProfile);
    if (result.success) {
      sessionStorage.setItem('slqf_electron_session', JSON.stringify(result.user));
      window.electronAPI.setSession(result.user);
    }
    return result;
  } else {
    const USERS_KEY = 'slqf_users';
    let users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch {}
    const idx = users.findIndex((u) => u.username === username);
    if (idx === -1) return { success: false };
    users[idx].profile = { ...users[idx].profile, ...newProfile };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const publicUser = { username: users[idx].username, profile: users[idx].profile, createdAt: users[idx].createdAt };
    setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  }
}

// ── Per-User Scoped Storage ───────────────────────────────────────────────────

/**
 * Returns a namespaced storage wrapper for `username`.
 * Electron: → SQLite via IPC
 * Browser:  → localStorage (keys: slqf_data__<username>__<key>)
 */
export function getScopedStorage(username) {
  if (isElectron) {
    return {
      async get(key, fallback = null) {
        try {
          const val = await window.electronAPI.getData(username, key);
          return val !== null ? val : fallback;
        } catch { return fallback; }
      },
      async set(key, value) {
        await window.electronAPI.setData(username, key, value);
      },
      async remove(key) {
        await window.electronAPI.removeData(username, key);
      },
      async getAll() {
        return window.electronAPI.getAllData(username);
      },
      async clearAll() {
        await window.electronAPI.clearAllData(username);
      },
    };
  } else {
    // localStorage fallback
    const ns = (key) => `slqf_data__${username}__${key}`;
    return {
      get(key, fallback = null) {
        try {
          const raw = localStorage.getItem(ns(key));
          return raw !== null ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
      },
      set(key, value) {
        localStorage.setItem(ns(key), JSON.stringify(value));
      },
      remove(key) {
        localStorage.removeItem(ns(key));
      },
      getAll() {
        const result = {};
        const prefix = ns('');
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            const subKey = k.slice(prefix.length);
            try { result[subKey] = JSON.parse(localStorage.getItem(k)); }
            catch { result[subKey] = localStorage.getItem(k); }
          }
        }
        return result;
      },
      clearAll() {
        const prefix = ns('');
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) toRemove.push(k);
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
      },
    };
  }
}

// ── Account Deletion ──────────────────────────────────────────────────────────

export async function deleteAccount(username) {
  if (isElectron) {
    await window.electronAPI.deleteAccount(username);
    logoutUser();
  } else {
    const store = getScopedStorage(username);
    store.clearAll();
    const USERS_KEY = 'slqf_users';
    let users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch {}
    localStorage.setItem(USERS_KEY, JSON.stringify(users.filter((u) => u.username !== username)));
    logoutUser();
  }
}
