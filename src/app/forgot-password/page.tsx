"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, Loader2, Key, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setIsSuccess(false)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
      } else {
        setError(data.error || "Ocurrió un error inesperado. Intenta de nuevo.")
      }
    } catch (err) {
      setError("Error de conexión con el motor de acceso.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 mb-6 shadow-2xl">
            <Key className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">
            Recuperar <span className="text-amber-400">Acceso</span>
          </h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Pierre PRO • Seguridad Avanzada</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border-4 border-slate-900 p-8 sm:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block mb-2">Email de tu Cuenta</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-14 pr-6 py-4 bg-slate-950 border-4 border-slate-800 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 transition-all text-base"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-[10px] font-black text-red-500 uppercase">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-400/10 transition-all active:scale-[0.98] group"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Enviar Enlace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-500/10 border-4 border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Enlace Enviado</h3>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed px-4">
                        Si tu correo está en nuestro sistema, recibirás instrucciones para restablecer tu contraseña en los próximos minutos.
                    </p>
                </div>
                <Button 
                    onClick={() => router.push("/login")}
                    className="w-full h-14 rounded-xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                >
                    Volver al Inicio
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            ¿Recordaste tu contraseña? <Link href="/login" className="text-white hover:text-amber-400 transition-colors">Entrar aquí</Link>
        </p>

        <footer className="mt-12 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Pierre Master Analytics • Secure System</p>
        </footer>
      </motion.div>
    </div>
  )
}
