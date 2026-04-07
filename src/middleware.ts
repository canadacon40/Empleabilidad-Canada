import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // Allow access to /cv-tool for verification, but keep other protections
  matcher: ['/((?!api|_next/static|_next/image|cv-tool|pro|.*\\.png$).*)'],
}
