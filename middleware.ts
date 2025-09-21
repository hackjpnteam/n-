import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");
  
  // Allow auth routes always
  if (isAuthRoute) {
    return NextResponse.next();
  }
  
  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const newUrl = new URL("/auth/signin", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
    
    // Check if user is admin
    if (req.auth?.user?.role !== "admin") {
      const newUrl = new URL("/", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};