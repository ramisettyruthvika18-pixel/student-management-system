import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
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
    const isAuthCall = err.config?.url?.startsWith("/auth/");
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
  if (err.code === "ERR_NETWORK") return "Cannot reach the server. Is the Spring Boot backend running on port 8080?";
  return fallback;
}

export default api;
