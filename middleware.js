import { NextResponse } from "next/server";
import {
    PUBLIC_ROUTES,
    VIEW_ONLY_ROUTES,
    ROLE,
    RESTRICTED_FOR_USER,
} from "./middleware.constant";

const isPublicRoute = (path) =>
    PUBLIC_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));

// const isViewOnlyRoute = (path) =>
//     VIEW_ONLY_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));

// const isRestrictedForUser = (path) =>
//     RESTRICTED_FOR_USER.some((route) => path.startsWith(route));

export default async function middleware(req) {
    const path = req.nextUrl.pathname;

    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );

    const userCookie = cookies["user"];
    const isLoggedInYN = cookies["isLoggedInYN"];

    let userData = null;

    if (userCookie) {
        try {
            userData = JSON.parse(decodeURIComponent(userCookie));
        } catch (error) {
            console.error("Failed to parse user cookie:", error.message);
        }
    }

    const isAuthenticated = userData && isLoggedInYN === "true";
    const userRole = userData?.attributes?.role_numeric;

    // Redirect unauthenticated users trying to access private routes
    if (!isAuthenticated && !isPublicRoute(path)) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
