const BASE = "https://functions.poehali.dev/88443950-bf1f-4bae-9f65-dcddbd356936";

function getToken(): string {
  return localStorage.getItem("admin_token") || "";
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Admin-Token": token } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  return { status: res.status, data };
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request("/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  logout: () =>
    request("/logout", { method: "POST" }),

  // Content
  getContent: () => request("/content"),
  updateContent: (section: string, key: string, value: string) =>
    request("/content", { method: "PUT", body: JSON.stringify({ section, key, value }) }),

  // Services
  getServices: () => request("/services"),
  createService: (data: object) =>
    request("/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (id: number, data: object) =>
    request(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (id: number) =>
    request(`/services/${id}`, { method: "DELETE" }),

  // Portfolio
  getPortfolio: () => request("/portfolio"),
  createPortfolioItem: (data: object) =>
    request("/portfolio", { method: "POST", body: JSON.stringify(data) }),
  updatePortfolioItem: (id: number, data: object) =>
    request(`/portfolio/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePortfolioItem: (id: number) =>
    request(`/portfolio/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request("/orders"),
  updateOrderStatus: (id: number, status: string) =>
    request(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteOrder: (id: number) =>
    request(`/orders/${id}`, { method: "DELETE" }),

  // Public: submit order
  submitOrder: (data: object) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
};
