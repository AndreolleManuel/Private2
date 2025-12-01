// src/lib/stores/wishlist.js
import { writable, derived, get } from "svelte/store";
import { httpError } from "$lib/utils/ErrorHandler.js";

const isBrowser = typeof window !== "undefined";
const getToken = () => (isBrowser ? localStorage.getItem("token") : null);
const isAuthMissingOrInvalid = (status) => status === 401 || status === 403;


function jsonParseSafe(str, fallback = []) {
  try { return JSON.parse(str) ?? fallback; } catch { return fallback; }
}
function readKey(key) {
  if (!isBrowser) return new Set();
  const raw = localStorage.getItem(key);
  const arr = jsonParseSafe(raw, []);
  return new Set(Array.isArray(arr) ? arr : []);
}
function writeKey(key, setVal) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify([...setVal]));
}

function createWishlist() {
  const inner = writable(new Set()); // IDs
  let key = "wishlist:guest";

  function read()    { return readKey(key); }
  function write(s)  { writeKey(key, s); }

  return {
    subscribe: inner.subscribe,

    init(userKey = "guest", initialIds = null) {
      key = `wishlist:${userKey || "guest"}`;
      const start = initialIds ? new Set(initialIds) : read();
      inner.set(start);
      write(start);
    },
    addLocal(id) {
      inner.update(s => { const n = new Set(s); n.add(id); write(n); return n; });
    },
    removeLocal(id) {
      inner.update(s => { const n = new Set(s); n.delete(id); write(n); return n; });
    },
    toggleLocal(id) {
      inner.update(s => {
        const n = new Set(s);
        n.has(id) ? n.delete(id) : n.add(id);
        write(n); return n;
      });
    },
    has(id) { return get(inner).has(id); },
    clear() { inner.set(new Set()); write(new Set()); },

    // ====== API ======

    /** Replace local wishlist with API data */
    async hydrateFromApi() {
      const token = getToken();
      const response = await fetch("http://localhost:3000/api/wishlists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (isAuthMissingOrInvalid(response.status)) {
        return read();
      }
      const text = await response.text();
      let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
      if (!response.ok) throw httpError(response.status, data, "Failed to fetch wishlist");
      const s = new Set(Array.isArray(data) ? data : []);
      inner.set(s); write(s);
      return s;
    },

    /** Replace server wishlist with local (logout). */
    async pushAllToApi() {
      const token = getToken();
      const tree_ids = [...get(inner)];
      const response = await fetch("http://localhost:3000/api/wishlists", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ tree_ids })
      });
      if (isAuthMissingOrInvalid(response.status)) {

        return tree_ids;
      }
      const text = await response.text();
      let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
      if (!response.ok) throw httpError(response.status, data, "Failed to update wishlist");
      return tree_ids;
    },

    /** Toggle : update UI or fallback */
    async toggleWithApi(id) {
      const before = new Set(get(inner));
      const wasIn = before.has(id);
      // Optimistic UI
      wasIn ? this.removeLocal(id) : this.addLocal(id);
      try {
        const token = getToken();
        const url = `http://localhost:3000/api/wishlists/${id}`;
        const method = wasIn ? "DELETE" : "POST";
        const res = await fetch(url, {
          method,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.status === 401) {
          return;
        }
        if (isAuthMissingOrInvalid(res.status)) {
          return;
        }
        const text = await res.text();
        let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
        if (!res.ok) throw httpError(res.status, data, "Failed to update wishlist");
      } catch (e) {
        if (!isAuthMissingOrInvalid(e.status)) {
          inner.set(before); write(before);
        }
        throw e;
      }
    },

    /** Merge guest wishlist with user wishlist */
    async mergeGuestAndPush(userKey) {
      const token = getToken();
      const guest = readKey("wishlist:guest");
      const currentKey = `wishlist:${userKey}`;
      const userSet = readKey(currentKey);
      const merged = new Set([...userSet, ...guest]);

      // optimistic UI
      const prevKey = key;
      const prevSet = readKey(prevKey);
      key = currentKey;
      inner.set(merged); write(merged);

      // sync server
      try {
        const response = await fetch("http://localhost:3000/api/wishlists", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ tree_ids: [...merged] })
        });
        if (response.status === 401) return merged;
        if (!response.ok) throw new Error('Failed to update wishlist');
        writeKey("wishlist:guest", new Set());
        return merged;
      } catch (e) {
        console.warn("Failed to merge wishlist:", e);
        inner.set(prevSet); key = prevKey; write(prevSet);
        return merged;
      }
    }
  };
}

export const wishlist = createWishlist();
export const isInWishlist = (id) => derived(wishlist, (s) => s.has(id));
export const wishlistSize = derived(wishlist, (s) => s.size);
export const wishlistList = derived(wishlist, (s) => [...s]);