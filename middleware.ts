import { auth } from "./auth";
 
export default auth((req) => {
  // req.auth contains the user session
});
 
export const config = {
  matcher: [
    "/mypage",
    "/admin/:path*",
    // APIや静的は必ず除外
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};