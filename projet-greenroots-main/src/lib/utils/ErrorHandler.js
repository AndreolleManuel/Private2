function toMessage(v, fallback = "Request failed") {
  if (!v) return fallback;
  if (typeof v === "string") return v;
  try { return JSON.stringify(v); } catch { return fallback; }
}

function httpError(status, data, fallback) {
  const msg = toMessage(data?.error || data?.message || data, fallback);
  const err = new Error(msg);
  err.status = status;
  err.data = data;
  return err;
}
export { toMessage, httpError };