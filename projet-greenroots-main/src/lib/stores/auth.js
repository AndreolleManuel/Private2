import { writable, derived, get as getStore } from "svelte/store";
import { jwtDecode } from "jwt-decode";

// ===============================
// LOCAL STORAGE HELPERS
// ===============================

// Check if localStorage is available (SSR-safe)
const hasLocalStorage = typeof localStorage !== "undefined";

// Safe getter for localStorage
function getLocalStorage(key) {
  return hasLocalStorage ? localStorage.getItem(key) : null;
};

// Safe setter for localStorage
function setLocalStorage(key, value) {
  if (hasLocalStorage) {
    localStorage.setItem(key, value);
  }
};

// Safe remover for localStorage
function removeLocalStorage(key) {
  if (hasLocalStorage) {
    localStorage.removeItem(key);
  }
};

// ===============================
// INITIAL STATE
// ===============================

// Load persisted values from localStorage (if any)
const initialToken = getLocalStorage("token");
const initialMail = getLocalStorage("mail");
const initialId = getLocalStorage("id");

// Validate JWT token and decode payload
function validateToken(token) {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

// ===============================
// AUTH STORE CREATION
// ===============================

function createAuthStore() {
  const initialPayload = validateToken(initialToken);
  const { subscribe, set, update } = writable({
    token: initialToken || null,
    mail: initialMail ? JSON.parse(initialMail) : null,
    id: initialId ? JSON.parse(initialId) : null,
    payload: initialPayload,
  });

  // ===============================
  // AUTO LOGOUT MANAGEMENT
  // ===============================
  // Automatically logs the user out when JWT expires
  let logoutTimer;

  function scheduleAutoLogout(payload) {
    clearTimeout(logoutTimer);

    const expiresIn = payload?.exp ? payload.exp * 1000 : null;
    if (!expiresIn) return;

    const delay = expiresIn - Date.now();
    if (delay > 0) {
      logoutTimer = setTimeout(() => {
        logout();
      }, delay);
    }
  };


  // ===============================
  // STATE PERSISTENCE & TOKEN WATCH
  // ===============================
  // Sync store state with localStorage on every update
  subscribe((state) => {
    // Token
    if (state.token) setLocalStorage("token", state.token);
    else removeLocalStorage("token");

    // Email
    if (state.mail) setLocalStorage("mail", JSON.stringify(state.mail));
    else removeLocalStorage("mail");

    // User ID
    if (state.id) setLocalStorage("id", JSON.stringify(state.id));
    else removeLocalStorage("id");

    // Refresh JWT payload + schedule logout
    state.payload = validateToken(state.token);
    scheduleAutoLogout(state.payload);
  });

  // ===============================
  // STORE ACTIONS (API)
  // ===============================

  // Set token and decode payload
  function setToken(token) {
    const payload = validateToken(token);
    update((s) => ({
      ...s,
      token,
      payload,
      id:   s.id   ?? payload?.id   ?? null,
      mail: s.mail ?? payload?.mail ?? null
    }));
  };

  // Set user email
  function setMail(mail) {
    update((state) => ({ ...state, mail }));
  };

  // Set user ID
  function setId(id) {
    update((state) => ({ ...state, id }));
  };

  // Clear all auth data (logout)
  function clear() {
    clearTimeout(logoutTimer);
    set({ token: null, mail: null, id: null, payload: null });
  };

  // Synchronously get the current state (useful outside components)
  function get() {
    return getStore({ subscribe });
  }

  // Return the public API of the store
  return {
    subscribe,
    setToken,
    setMail,
    setId,
    clear,
    get,
  };
};

// ===============================
// STORE EXPORTS
// ===============================

// Main auth store instance
export const auth = createAuthStore();

// Helper functions for login / logout actions
export function login({ token, mail, id } = {}) {
  if (token) auth.setToken(token);
  if (mail) auth.setMail(mail);
  if (id) auth.setId(id);
}

export function logout() {
  auth.clear();
}

// ===============================
// DERIVED STORES
// ===============================

// Check if the user is authenticated and token is still valid
export const isAuthenticated = derived(auth, ($auth) => {
  const isValidToken = Boolean($auth.token);
  const isNotExpired = $auth.payload
    ? ($auth.payload.exp * 1000 > Date.now())
    : false;
  return isValidToken && isNotExpired;
});

// Check if the user has admin privileges (by token or user role)
export const isAdmin = derived(auth, ($auth) => {
  const roleFromUser = $auth.user?.role?.name;
  if (roleFromUser) {
    return roleFromUser === "admin";
  }
  const roleFromToken = $auth.payload?.role;
  return roleFromToken === "admin";
});

export const user = derived(auth, ($a) => ({
  id:   $a.id   ?? $a.payload?.id   ?? null,
  mail: $a.mail ?? $a.payload?.mail ?? null,
  role: $a.payload?.role ?? null
}));