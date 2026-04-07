"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Mail, ArrowRight, Loader2, Rocket, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/cv-tool"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Credenciales inválidas. Verifica tu correo y contraseña.")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-400/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-400/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 mb-6 shadow-2xl">
            <Rocket className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
            Pierre <span className="text-amber-400 italic">PRO</span> Access
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Estrategia • Resultados • Éxito</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Email Corporativo / Personal</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-slate-950 border-2 border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all text-base"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">Contraseña de Acceso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-6 py-4 bg-slate-950 border-2 border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all text-base"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2 px-1">
                <Link 
                  href="/forgot-password" 
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-400 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-500">{error}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-400/10 transition-all active:scale-[0.98] group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Entrar al Portal PRO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

        </div>

        <footer className="mt-12 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Pierre Master Analytics • Secure Auth v3.0</p>
        </footer>
      </motion.div>
    </div>
  )
}
