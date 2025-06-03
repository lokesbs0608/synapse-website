// middleware.constants.js

export const PUBLIC_ROUTES = ["/login", "/", "/education", "/faq", "/aboutus", "/blogs", "/signup"];
export const VIEW_ONLY_ROUTES = [];

export const ROLE = {
    USER: 2,
    OWNER: 1,
};

export const RESTRICTED_FOR_USER = [
    "/admin/"
];
