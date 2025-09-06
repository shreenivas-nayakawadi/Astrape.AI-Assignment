import axios from "axios";
import toast from "react-hot-toast";

// adjust baseURL if your backend is different:
const api = axios.create({
      baseURL: "http://localhost:8000/api",
      withCredentials: false,
});

// attach token automatically
api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token") || "";
      if (token) {
            config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
});

// centralize error handling
api.interceptors.response.use(
      (res) => res,
      (error) => {
            const status = error?.response?.status;
            const msg =
                  error?.response?.data?.message ||
                  error?.response?.data?.detail ||
                  error?.message ||
                  "Something went wrong";

            // map common cases to friendly text
            const friendly =
                  status === 400
                        ? "Invalid request. Please check your input."
                        : status === 401
                        ? "You’re not authorized. Please log in."
                        : status === 403
                        ? "You don’t have permission to do that."
                        : status === 404
                        ? "Not found."
                        : status >= 500
                        ? "Server error. Please try again later."
                        : msg;

            toast.error(friendly);
            return Promise.reject(error);
      }
);

export default api;
