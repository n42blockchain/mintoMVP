export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/home/:path*",
    "/token/:path*",
    "/wallet/:path*",
    "/marketing/:path*",
    "/settings/:path*",
  ],
};
