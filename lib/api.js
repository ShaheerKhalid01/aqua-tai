// Central API helper — all fetch calls go through here

const BASE = "";

function getToken() {
  try { return localStorage.getItem("aquatai_token"); } catch { return null; }
}

function getAdminToken() {
  try { return localStorage.getItem("aquatai_admin_token"); } catch { return null; }
}

async function request(path, options = {}, useAdminToken = false) {
  const token = useAdminToken ? getAdminToken() : getToken();
  const res = await fetch(BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Auth ──────────────────────────────────────────
export const registerUser = (name, email, password) =>
  request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });

export const loginUser = (email, password) =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const loginAdmin = (id, password) =>
  request("/api/auth/admin", { method: "POST", body: JSON.stringify({ id, password }) });

// ── Products ──────────────────────────────────────
export const fetchProducts = () =>
  request("/api/products");

export const fetchProduct = (id) =>
  request(`/api/products/${id}`);

export const createProduct = (data) =>
  request("/api/products", { method: "POST", body: JSON.stringify(data) }, true);

export const updateProduct = (id, data) =>
  request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }, true);

export const deleteProduct = (id) =>
  request(`/api/products?id=${id}`, { method: "DELETE" }, true);

// ── Image Upload ──────────────────────────────────
export const uploadImage = async (file) => {
  const adminToken = localStorage.getItem("aquatai_admin_token");
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
};
export const placeOrder = (orderData) =>
  request("/api/orders", { method: "POST", body: JSON.stringify(orderData) });

// Admin uses admin token to fetch all orders
export const fetchAllOrders = () =>
  request("/api/orders", {}, true);

// Admin uses admin token to update order status
export const updateOrderStatus = (orderId, status) =>
  request(`/api/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status }) }, true);

// Client fetches their own orders
export const fetchMyOrders = () =>
  request("/api/orders/my");

// Client cancels their own order
export const cancelOrder = (orderId) =>
  request(`/api/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status: "Cancelled" }) });