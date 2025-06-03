import { QueryClient } from "@tanstack/react-query";
import cookie from "js-cookie";
import toast from "react-hot-toast";
const queryClient = new QueryClient();

// set in cookie
export const setCookie = (key, value, days = 300) => {
    if (typeof window !== "undefined") {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration time to `days` from now

        cookie.set(key, value, {
            expires: expires, // Set expiration date
            secure: process.env.NODE_ENV === "production", // Only set secure flag in production
            path: "/", // Make cookie available site-wide
        });
    }
};

// remove from cookie
export const removeCookie = (key) => {
    if (typeof window !== "undefined") {
        cookie.remove(key);
    }
};

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token
export const getCookie = (key) => {
    return getCookieFromBrowser(key);
};

export const getCookieFromBrowser = (key) => {
    return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
    if (!req.headers.cookie) {
        return undefined;
    }
    const token = req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith(`${key}=`));
    if (!token) {
        return undefined;
    }
    const tokenValue = token.split("=")[1];
    return tokenValue;
};

// set in localstoarge
export const setLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
// get from localstorage
export const getLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key) || "");
        } else {
            return false;
        }
    }
};
// remove from localstorage
export const removeLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
};

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = async (response, next) => {
    // Store user data in cookie and localStorage
    setCookie("user", JSON.stringify(response));

    // Check if next() exists and is a function before calling it
    if (next && typeof next === "function") {
        await next(); // Trigger the next step (e.g., redirect)
    } else {
        console.log("No callback provided or invalid.");
    }
};

// access user info from localstorage
export const isAuth = () => {
    if (typeof window !== "undefined") {
        const cookieChecked = getCookie("user");
        const isLoggedInYN = getCookie("isLoggedInYN");
        if (cookieChecked && isLoggedInYN === "true") {
            return true;
        } else {
            logout();
            return false;
        }
    }
};

export const logout = async () => {
    try {

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        const cookies = document.cookie.split(";");
        // Clear React Query cache
        await queryClient.cancelQueries();
        queryClient.clear();
        queryClient.removeQueries();
        queryClient.resetQueries();
        cookies.forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    } catch (error) {
        console.error("Error during logout:", error);
    }
};
export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("user")) {
            let auth = JSON.parse(localStorage.getItem("user") || "");
            auth = user;
            localStorage.setItem("user", JSON.stringify(auth));
            next();
        }
    }
};

export const getBaseUrl = (caseType) => {
    switch (caseType) {
        case "common":
            return process.env.NEXT_PUBLIC_COMMON_BASE_URL;
        case "user":
            return "https://user.example.com";
        case "admin":
            return "https://admin.example.com";
        case "api":
            return "https://api.example.com";
        default:
            return process.env.NEXT_PUBLIC_COMMON_BASE_URL;
    }
};

/**
 * Handles toast notifications for responses and errors.
 * @param {Object} params - Parameters for toast handling.
 * @param {Object} [params.res] - Response object from the server.
 * @param {Object} [params.err] - Error object from the server.
 * @param {Function} [params.next] - Optional callback function to execute on success.
 */
export const handleToast = ({ res, err, next }) => {
    if (res) {
        // Handle success
        toast.success(res.message || "Operation successful!");

        // Execute next function if provided
        if (next) next();
    } else if (err) {
        // Handle validation errors
        if (err.response?.status === 422) {
            const validationErrors = err.response.data.errors || {};
            const errorMessages = Object.values(validationErrors).flat();
            errorMessages.forEach((message) => toast.error(message));
        } else {
            // Handle other errors
            toast.error(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        }
    }
};
