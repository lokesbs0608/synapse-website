// middleware.constants.js

export const PUBLIC_ROUTES = ["/login", "/", "/education", "/faq", "/aboutus", "/blogs", "/signup"];
export const VIEW_ONLY_ROUTES = [];

export const ROLE = {
    USER: 4,
    OWNER: 1,
    ADMIN: 2,
    MANAGER: 3
};

export const RESTRICTED_FOR_USER = [
    "/admin/"
];
