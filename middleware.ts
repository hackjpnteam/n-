import { auth } from "./auth";
 
export default auth((req) => {
  // API routes are excluded by matcher, so they never reach here
});
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};