import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/pro")
      
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
        token.email = user.email
        token.isPro = (user as any).isPro
        token.isTrial = (user as any).isTrial
        token.credits = (user as any).credits
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        (session.user as any).isPro = token.isPro;
        (session.user as any).isTrial = token.isTrial;
        (session.user as any).credits = token.credits;
      }
      return session
    }
  },
  providers: [], // Add providers with an empty array for edge-compatibility
} satisfies NextAuthConfig
