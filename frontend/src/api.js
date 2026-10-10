import axios from "axios";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const fallbackUrl = import.meta.env.PROD
    ? "https://student-management-system-1ct1.onrender.com/api"
    : "http://localhost:8080/api";
  const rawUrl = envUrl && envUrl.trim() ? envUrl.trim() : fallbackUrl;
  const cleanUrl = rawUrl.replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired, send the user back to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.includes("/auth/");
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("sms_token");
      localStorage.removeItem("sms_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/** Pull a readable message out of an axios error. */
export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === "ERR_NETWORK") {
    return import.meta.env.PROD
      ? "Cannot reach the server. The Render backend may be spinning up (Render free tier can take up to a minute) or CORS is blocking the request."
      : "Cannot reach the server. Is the Spring Boot backend running on port 8080?";
  }
  return fallback;
}

export default api;
