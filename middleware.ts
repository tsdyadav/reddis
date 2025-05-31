import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const publicRoutes = [
  "/", 
  "/search",
  "/communities", 
  "/community/:path*", 
  "/api/webhooks/clerk",
  "/api/webhooks/sanity"
];

// This is the recommended way for Next.js 13+
export default clerkMiddleware();

// Configure your public routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!static|.*\\..*|_next|favicon.ico).*)',
    '/'
  ],
};
