export async function apiFetch(path, options = {}, token) {
  // allow overriding the API base URL via Vite env var VITE_API_BASE
  const base = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE
    ? import.meta.env.VITE_API_BASE
    : '';
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const headers = options.headers ? { ...options.headers } : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // ask server to return JSON errors when possible
  if (!headers['Accept']) headers['Accept'] = 'application/json';
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      console.error('apiFetch error', { path, status: res.status, data });
      throw { status: res.status, data };
    }
    return data;
  } catch (e) {
    if (e && e.status) throw e;
    if (!res.ok) throw { status: res.status, data: text };
    return text;
  }
}
