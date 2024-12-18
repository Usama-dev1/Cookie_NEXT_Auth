import { NextResponse } from "next/server";
import { decodeToken } from "./util/decodeToken";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // Redirect logged-in user to dashboard if trying to access login/signup
  if (
    (path === "/login" || path === "/signup" || path === "/dashboard") &&
    token
  ) {
    return NextResponse.redirect(new URL("/dashboard/users", request.url));
  }

  // Redirect to login if trying to access dashboard, admin, or user pages without a token
  if (
    (path === "/dashboard" ||
      path === "/dashboard/admin" ||
      path === "/dashboard/users") &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there's a token, decode and verify it to check if the user is admin
  if (token) {
    const decodedToken = await decodeToken(request);

    console.log("Decoded Token:", decodedToken);

    if (!decodedToken) {
      // Invalid token (token is missing, expired, or invalid) - redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Debugging: Check if `isAdmin` is accessible
    console.log("isAdmin:", decodedToken.isAdmin);

    // Check for user id when accessing user dashboard
    if (path === "/dashboard/users" && !decodedToken.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If the user is admin, allow access to /dashboard/admin
    if (path === "/dashboard/admin" && decodedToken.isAdmin) {
      return NextResponse.next();
    }

    // If the user is not an admin, redirect to /dashboard/users
    if (path === "/dashboard/admin" && !decodedToken.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/users", request.url));
    }

    // Fixed: If user is admin and accessing /dashboard/users, redirect to admin dashboard
    if (path === "/dashboard/users" && decodedToken.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
  }

  // Allow the request to continue if no redirects are necessary
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/admin",
    "/dashboard/users",
  ],
};
