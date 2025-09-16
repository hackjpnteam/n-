import { auth } from "./auth";
 
export default auth((req) => {
  // req.auth contains the user session
});
 
export const config = {
  // Protect pages, but EXCLUDE API & static so API never returns HTML
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};