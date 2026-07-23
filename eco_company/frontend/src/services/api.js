const API_BASE_URL = (
  window.localStorage.getItem("ecocompany_api_url") ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT = 6000;

function emitConnection(online) {
  window.dispatchEvent(new CustomEvent("ecocompany:connection", {
    detail: { online }
  }));
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const headers = { Accept: "application/json", ...options.headers };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || payload.error || `Erro ${response.status} ao acessar o servidor.`);
    }

    emitConnection(true);
    if (response.status === 204) return null;
    return response.json().catch(() => null);
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError) emitConnection(false);
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  return [payload.data, payload.records, payload.items, payload.content, payload.result].find(Array.isArray) || [];
}

export const api = {
  baseUrl: API_BASE_URL,
  async checkConnection() {
    try {
      await request("/health");
      return true;
    } catch {
      emitConnection(false);
      return false;
    }
  },
  async list(resource) {
    return toArray(await request(`/api/${resource}`));
  },
  create(resource, data) {
    return request(`/api/${resource}`, { method: "POST", body: JSON.stringify(data) });
  },
  update(resource, id, data) {
    return request(`/api/${resource}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) });
  },
  remove(resource, id) {
    return request(`/api/${resource}/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
};
