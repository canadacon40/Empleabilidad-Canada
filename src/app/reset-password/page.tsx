"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Token inválido o ausente. Solicita un nuevo enlace.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.")
        return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
        setTimeout(() => router.push("/login?reset=true"), 3000)
      } else {
        setError(data.error || "Error al actualizar la contraseña.")
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
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 mb-6 shadow-2xl">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase leading-none">
            Nueva <span className="text-amber-400">Contraseña</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Pierre PRO • Acceso Blindado</p>
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
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block mb-2">Nueva Contraseña</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-14 pr-6 py-4 bg-slate-950 border-4 border-slate-800 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 transition-all text-base font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block mb-2">Confirmar Contraseña</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-14 pr-6 py-4 bg-slate-950 border-4 border-slate-800 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 transition-all text-base font-bold"
                      placeholder="••••••••"
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
                  disabled={isLoading || !token}
                  className="w-full h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-400/10 transition-all active:scale-[0.98] group"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Actualizar y Entrar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Contraseña Actualizada</h3>
                    <p className="text-slate-400 text-[10px] font-black leading-relaxed px-4 uppercase tracking-widest opacity-60">
                        Extrayendo credenciales de sesión... Serás redirigido en 3 segundos.
                    </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            ¿Necesitas ayuda? <Link href="mailto:soporte@canadacontrabajo.com" className="text-white hover:text-amber-400 transition-colors underline underline-offset-4">Soporte Técnico</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
