"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, Sparkles, Star } from "lucide-react"
import { motion } from "framer-motion"

function AccesoContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get("code") || "PRO"

    useEffect(() => {
        // Save code for future reference in case of multi-step registration
        if (code) {
            localStorage.setItem("pierre_last_access_code", code.toUpperCase())
        }

        // Professional delay to allow user to see the "Authorization" state
        const timer = setTimeout(() => {
            router.push(`/register?code=${code.toUpperCase()}`)
        }, 2500)

        return () => clearTimeout(timer)
    }, [code, router])

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-sm text-center space-y-12">
                {/* Master Key Visual */}
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="w-32 h-32 bg-slate-900 border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(251,191,36,0.5)] relative">
                        <ShieldCheck className="w-16 h-16 text-amber-400" />
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                            <Star className="w-6 h-6 text-slate-950 fill-slate-950" />
                        </div>
                    </div>
                </motion.div>

                {/* Status Message */}
                <div className="space-y-4">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black text-white italic uppercase tracking-tighter"
                    >
                        Acceso <span className="text-amber-400">Autorizado</span>
                    </motion.h1>
                    
                    <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.6 }}
                         className="flex flex-col items-center gap-4"
                    >
                        <div className="px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] shadow-xl">
                            Código Detectado: {code.toUpperCase()}
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                            Validando Credenciales Tácticas...
                        </p>
                    </motion.div>
                </div>

                {/* Progress Indicator */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-1.5 bg-amber-400/20 rounded-full overflow-hidden w-48 mx-auto"
                >
                    <div className="h-full bg-amber-400 w-full animate-progress-fast" />
                </motion.div>

                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] pt-4 leading-relaxed">
                    Pierre PRO Strategist • Secure Access System
                </p>
            </div>
        </div>
    )
}

export default function AccesoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
        }>
            <AccesoContent />
        </Suspense>
    )
}
