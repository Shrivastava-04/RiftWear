import axios from "axios";

// 1. Create a configured instance of Axios
const api = axios.create({
  // Get the base URL from environment variables
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // 2. CRITICAL: This allows Axios to send the secure, httpOnly cookie
  // from the browser to the backend with every request.
  withCredentials: true,
});

// --- AUTHENTICATION API CALLS ---

export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const signupUser = (userData) => {
  return api.post("/auth/signup", userData);
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const googleLogin = (idToken) => {
  return api.post("/auth/google", { idToken });
};

// Password reset request

export const requestPasswordReset = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token, password) => {
  return api.post(`/auth/reset-password/${token}`, { password });
};

// --- USER API CALLS ---
export const getLoggedInUserProfile = () => {
  return api.get("/users/profile");
};

export const updateUserProfile = (profileData) => {
  return api.put("/users/profile", profileData);
};

export const addAddress = (addressData) => {
  return api.post("/users/addresses", addressData);
};

export const deleteAddress = (addressId) => {
  return api.delete(`/users/addresses/${addressId}`);
};

export const getCart = () => {
  return api.get("/users/cart");
};
export const addToCart = (cartItemData) => {
  return api.post("/users/cart", cartItemData);
};

export const deleteCartItem = (cartItemId) => {
  return api.delete(`/users/cart/${cartItemId}`);
};

export const updateCartItem = (updateData) => {
  return api.put("/users/cart", updateData);
};

export const getUserOrders = () => {
  return api.get("/users/orders");
};

export const checkIfUserCanReview = (productId) => {
  return api.get(`/users/can-review/${productId}`);
};

// --- PRODUCT API CALLS ---

export const fetchProducts = () => {
  return api.get("/products");
};

export const fetchProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const addProductReview = (productId, reviewData) => {
  // reviewData should be an object like { rating, comment }
  return api.post(`/products/${productId}/reviews`, reviewData);
};

// --- ORDER API CALLS ---
export const fetchMyOrders = () => {
  return api.get("/orders/my-orders");
};

export const fetchOrderById = (orderId) => {
  // This route is protected, but our Axios instance automatically sends the auth cookie.
  return api.get(`/orders/${orderId}`);
};

// --- DEPARTMENT API CALLS ---
export const fetchDepartments = () => {
  return api.get("/departments");
};

export const fetchDepartmentById = (id) => {
  return api.get(`/departments/${id}`);
};

// --- DROP API CALLS ---

export const checkDropStatus = (name) => {
  // This is to check if a drop is live based on its name and help in showing/hiding payment options on the frontend.
  return api.post("/drops/status", { name });
};

export const getActiveDropDetails = () => {
  return api.get("/drops/active");
};

// --- PAYMENT API CALLS ---
export const createRazorpayOrder = (amount) => {
  return api.post("/payment/create-order", { amount });
};

export const verifyPayment = (paymentData) => {
  return api.post("/payment/verify", paymentData);
};

// --- PUBLIC SITE SETTINGS (NO AUTH REQUIRED) ---
export const getPublicSiteSettings = () => {
  return api.get("/settings/public");
};

// --- ADMIN API CALLS ---
// These routes are protected by our 'adminOnly' middleware on the backend.

// --- USER MANAGEMENT API CALLS (ADMIN) ---
export const adminGetAllUsers = (params) => {
  return api.get("/admin/users", { params });
};
export const adminGetUserById = (userId) => {
  return api.get(`/admin/users/${userId}`);
};
export const adminRemoveCartItem = (userId, cartItemId) => {
  return api.delete(`/admin/users/${userId}/cart/${cartItemId}`);
};

export const adminDeleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

// --- PRODUCT MANAGEMENT API CALLS (ADMIN) ---
export const adminGetAllProducts = (params) => {
  return api.get("/admin/products", { params });
};

export const adminAddProduct = (productData) => {
  return api.post("/admin/products", productData);
};

export const adminUpdateProduct = (productId, productData) => {
  return api.put(`/admin/products/${productId}`, productData);
};

export const adminDeleteProduct = (productId) => {
  return api.delete(`/admin/products/${productId}`);
};

// --- ORDER MANAGEMENT API CALLS (ADMIN) ---

export const adminGetAllOrders = () => {
  return api.get("/admin/orders");
};

export const adminUpdateOrderStatus = (orderId, statusData) => {
  // statusData will be an object like { status: 'Packed', details: { batchNumber: '123' } }
  return api.put(`/admin/orders/${orderId}/status`, statusData);
};

export const exportOrders = (startDate, endDate) => {
  // Use URLSearchParams to safely build the query string for the API call
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const queryString = params.toString();
  const url = `/admin/export-orders?${queryString}`;

  // The responseType 'blob' remains crucial
  return api.get(url, { responseType: "blob" });
};

// --- DASHBOARD STATS API CALL (ADMIN) ---

export const fetchDashboardStats = () => {
  return api.get("/admin/stats");
};

// --- DEPARTMENT MANAGEMENT API CALLS (ADMIN) ---

export const adminGetAllDepartments = () => {
  return api.get("/admin/departments"); // This now fetches all departments for the admin view
};

export const adminCreateDepartment = (departmentData) => {
  return api.post("/admin/departments", departmentData);
};

export const adminUpdateDepartment = (id, departmentData) => {
  return api.put(`/admin/departments/${id}`, departmentData);
};

export const adminDeleteDepartment = (id) => {
  return api.delete(`/admin/departments/${id}`);
};
export const adminAddProductsToDepartment = (departmentId, productsId) => {
  console.log(departmentId, productsId);
  return api.put(`/admin/departments/${departmentId}/addProductsToDepartment`, {
    productsId, // The body should contain an array of product IDs
  });
};

export const adminRemoveProductsFromDepartment = (departmentId, productsId) => {
  console.log(departmentId, productsId);
  return api.put(
    `/admin/departments/${departmentId}/removeProductsFromDepartment`,
    {
      productsId, // The body should contain an array of product IDs
    }
  );
};
// --- SITE SETTINGS API CALLS (ADMIN) ---
export const adminGetSiteSettings = () => {
  return api.get("/admin/settings");
};

export const adminUpdateSiteSettings = (settingsData) => {
  return api.put("/admin/settings", settingsData);
};

// --- DROP API CALLS (ADMIN) ---
export const adminGetAllDrops = () => {
  return api.get("/admin/drops/all");
};

export const adminCreateDrop = (dropData) => {
  return api.post("/admin/drops", dropData);
};

export const adminUpdateDrop = (id, dropData) => {
  return api.put(`/admin/drops/${id}`, dropData);
};

export const adminDeleteDrop = (id) => {
  return api.delete(`/admin/drops/${id}`);
};

export default api;
