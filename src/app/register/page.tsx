"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, UserPlus, Mail, Lock, ArrowRight, Loader2, Star, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

function RegistrationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const activeSessionId = searchParams.get("session_id")
  const becaParam = searchParams.get("beca") || searchParams.get("code")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    becaCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAsesoria, setIsAsesoria] = useState(false)

    useEffect(() => {
    const emailParam = searchParams.get("email")
    const sourceParam = searchParams.get("source")
    
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }))
    }

    if (becaParam) {
      setFormData(prev => ({ ...prev, becaCode: becaParam.toUpperCase() }))
    }
    
    if (sourceParam === "asesoria") {
      setIsAsesoria(true)
    }

    // ⚡ NEW: Capture email from checkout session if available
    const fetchSessionEmail = async (id: string) => {
        try {
            const res = await fetch(`/api/checkout-session?session_id=${id}`);
            const data = await res.json();
            if (data.email) {
                setFormData(prev => ({ ...prev, email: data.email }));
            }
        } catch (e) {
            console.error("No se pudo pre-cargar el correo.");
        }
    }

    if (activeSessionId) {
        fetchSessionEmail(activeSessionId);
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        router.push("/login?registered=true&callbackUrl=/cv-tool%3Fonboarding=true")
      } else {
        setError(data.error || "Error al crear la cuenta.")
      }
    } catch (err) {
      setError("Error de conexión con el motor de acceso.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
             <ShieldCheck className="w-3 h-3" /> Pierre PRO
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">
            Crea tu <span className="text-amber-400">Acceso</span>
          </h1>
        </div>

        {/* Special Welcome for Asesoria */}
        <AnimatePresence>
          {isAsesoria && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-amber-400 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(251,191,36,0.2)] relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-10">
                <Sparkles className="w-24 h-24 text-slate-950" />
              </div>
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 shadow-lg">
                  <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-slate-950 font-black text-xs uppercase tracking-widest leading-none mb-1">Plan Especial Detectado</h3>
                  <p className="text-slate-900 text-[11px] font-bold uppercase leading-tight italic">
                    ¡Bienvenido a la asesoría! Tu acceso PRO ya está autorizado. <br/>Solo crea tu contraseña para empezar.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Container */}
        <div className="bg-slate-900/50 backdrop-blur-xl border-4 border-slate-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-black/50 overflow-hidden relative">
          
          {/* Premium Beca Badge */}
          <AnimatePresence>
            {formData.becaCode && !isAsesoria && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8 p-6 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center gap-5 shadow-[0_20px_50px_-15px_rgba(251,191,36,0.1)] relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Sparkles className="w-12 h-12 text-amber-400" />
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
                    <Star className="w-7 h-7 text-black fill-black" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
                        Acceso Exclusivo Pierre <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    </h3>
                    <p className="text-white text-xs font-bold font-mono tracking-wider">
                        CÓDIGO: <span className="text-white">{formData.becaCode}</span> • DETECTADO 
                    </p>
                    <p className="text-amber-400/50 text-[10px] font-black uppercase tracking-widest mt-2 leading-none">
                       {formData.becaCode.includes("BECA") ? "Soporte de Muestreo Activo (10 USOS)" : "Acceso PRO Estratégico Autorizado"}
                    </p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
             {/* Name Field */}
             <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre Completo</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Tu nombre"
                  className="w-full h-14 bg-slate-950 border-4 border-slate-800 rounded-2xl px-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-400 transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Tu Correo</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  disabled={isAsesoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="ejemplo@correo.com"
                  className={`w-full h-14 bg-slate-950 border-4 border-slate-800 rounded-2xl px-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-400 transition-all font-bold text-sm ${isAsesoria ? 'opacity-50 grayscale' : ''}`}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 pointer-events-none">
                   <Mail className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Beca Code Field */}
            {!activeSessionId && !isAsesoria && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest ml-4">¿Tienes un Código de Beca?</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.becaCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, becaCode: e.target.value.toUpperCase() }))}
                    placeholder="INGRESAR CÓDIGO"
                    className="w-full h-14 bg-slate-950 border-4 border-amber-400/20 rounded-2xl px-6 text-white placeholder:text-slate-800 focus:outline-none focus:border-amber-400 transition-all font-black text-sm uppercase tracking-widest"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 pointer-events-none">
                     <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 font-bold px-4 leading-tight italic">
                  Si ya compraste el plan de $29, usa el correo con el que hiciste el pago y deja este campo vacío.
                </p>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-950 border-4 border-slate-800 rounded-2xl px-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-400 transition-all font-bold text-sm"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 pointer-events-none">
                   <Lock className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] font-black uppercase text-center tracking-widest animate-pulse">
                {error}
              </p>
            )}

            <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-16 rounded-2xl bg-amber-400 hover:bg-amber-350 text-slate-950 font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-amber-400/10 transition-all active:scale-[0.98] group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                   Activar mi Acceso PRO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Social Proof Mini */}
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
             <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Seguro</div>
             <div className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> Alta Prioridad</div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          ¿Ya tienes cuenta? <Link href="/login" className="text-white hover:text-amber-400 transition-colors">Entra aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    }>
      <RegistrationForm />
    </Suspense>
  )
}
