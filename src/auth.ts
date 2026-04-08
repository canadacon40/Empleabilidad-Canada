import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // 🔒 MASTER BYPASS: Limpiamos espacios y normalizamos para evitar fallos de configuración
        const masterEmail = process.env.MASTER_EMAIL?.toLowerCase().trim();
        const masterPass = process.env.MASTER_PASSWORD?.trim();
        
        const inputEmail = (credentials.email as string).toLowerCase().trim();
        const inputPass = (credentials.password as string).trim();
        
        if (masterEmail && masterPass && 
            inputEmail === masterEmail && 
            inputPass === masterPass) {
          return {
            id: "master-admin",
            email: masterEmail,
            name: "Master Pierre Admin",
            isPro: true
          }
        }

        // 🛡️ DYNAMIC IMPORTS: This prevents the Edge runtime from seeing Node-specific modules
        const { Client } = await import("pg")
        const bcrypt = await import("bcryptjs")

        const pgClient = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        })

        try {
          await pgClient.connect()
          const normalizedEmail = (credentials.email as string).toLowerCase().trim()
          
          const res = await pgClient.query('SELECT * FROM "User" WHERE email = $1', [normalizedEmail])
          const user = res.rows[0]

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            isTrial: user.isTrial,
            credits: user.credits
          }
        } catch (error) {
          console.error("Auth.js Authorize Error (Dynamic):", error)
          return null
        } finally {
          await pgClient.end()
        }
      }
    })
  ]
})
