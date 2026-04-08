"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Sparkles, ShieldCheck } from "lucide-react"

function AccesoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code") || searchParams.get("beca")

  useEffect(() => {
    if (code) {
      console.log(`[ACCESO] Validating Entry Code: ${code}`)
      // Redirect to registration with the code pre-filled
      // We use a small delay for branding/experience
      const timer = setTimeout(() => {
        router.push(`/register?beca=${code.trim().toUpperCase()}`)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      // No code found, send to login
      router.push("/login")
    }
  }, [code, router])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-slate-900 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
             <Sparkles className="w-10 h-10 text-primary animate-bounce" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">
            Activando <span className="text-primary italic">Acceso Pierre</span>
          </h1>
          
          <p className="text-slate-400 font-medium mb-8 leading-relaxed">
            Hemos detectado tu código exclusivo. Te estamos redirigiendo al portal seguro para activar tus beneficios estratégicos...
          </p>

          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Conexión Encriptada</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Pierre Strategy Master Suite • 2026</p>
    </div>
  )
}

export default function AccesoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-widest text-[10px]">Iniciando Protocolo de Acceso...</div>}>
      <AccesoContent />
    </Suspense>
  )
}
