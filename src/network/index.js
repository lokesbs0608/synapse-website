import axios from "axios";
import Cookies from "js-cookie"; // Ensure you have js-cookie installed
import { handleToast, logout } from "./helper";

// Create an Axios instance
const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_COMMON_BASE_URL,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 400,
});

// Request interceptor: Attach token from localStorage or Cookies
instance.interceptors.request.use(
    (config) => {
        // Priority 1: Get token from localStorage
        const token = localStorage.getItem("token") || Cookies.get("token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Flag to prevent multiple logouts
let isLoggingOut = false;

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { data, status } = error.response;
            let errorMessage = "An unknown error occurred";

            if ((status === 401 || status === 403) && !isLoggingOut) {
                isLoggingOut = true;

                try {
                    instance.post("/logout");
                } catch (logoutError) {
                    console.error("Logout request failed:", logoutError);
                }

                await logout();
                window.location.reload();
                return Promise.reject(error);
            }

            if (status === 404) return error?.response;

            if (data?.errors) {
                if (Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(", ");
                } else if (typeof data.errors === "object") {
                    const messages = Object.values(data.errors).flat().join(", ");
                    errorMessage = messages || "Validation errors occurred.";
                }
            } else if (data?.message) {
                errorMessage = data.message;
            } else {
                errorMessage = "Something went wrong.";
            }

            handleToast({
                err: { response: { data: { message: errorMessage } } },
            });

            return Promise.reject(error);
        } else {
            handleToast({
                err: { response: { data: { message: error?.message } } },
            });
        }

        return Promise.reject(error);
    }
);

export default instance;
