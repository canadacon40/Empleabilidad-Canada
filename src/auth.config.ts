import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/cv-tool") || nextUrl.pathname.startsWith("/pro")
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to login
      } else if (isLoggedIn && (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register"))) {
        return Response.redirect(new URL("/cv-tool", nextUrl))
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isPro = (user as any).isPro
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        (session.user as any).isPro = token.isPro
      }
      return session
    }
  },
  providers: [], // Add providers with an empty array for edge-compatibility
} satisfies NextAuthConfig
