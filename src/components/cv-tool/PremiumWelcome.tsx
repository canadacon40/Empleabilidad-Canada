"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, Sparkles, FileText, Loader2, ArrowRight, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface PremiumWelcomeProps {
  onResult: (data: any, originalText: string, language: string, accessCode: string, leadId?: string) => void
}

export default function PremiumWelcome({ onResult }: PremiumWelcomeProps) {
  const { data: session } = useSession()
  const [cvText, setCvText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleInyectar = async () => {
    if (!cvText.trim() || cvText.trim().length < 50) {
      setError("Pega tu CV completo para que Pierre pueda analizar tu potencial real.")
      return
    }

    setIsProcessing(true)
    setError("")

    // We mimic the lead data but marked as PREMIUM source
    const leadData = {
      name: session?.user?.name || "Cliente PRO",
      email: session?.user?.email || "pro@client.com",
      status: "asesoria_pro",
      urgency: "immediate",
      budget: "100+",
      language: "es", // Defaulting to ES for consultancy usually
      cvText: cvText.trim(),
      source: "Pierre PRO Consultancy"
    }

    try {
      // We save the lead in the background just like the free flow for record keeping
      const res = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      })
      const lead = await res.json()
      
      // Proceed to the Tactical Center!
      onResult(leadData, cvText.trim(), "es", "PREMIUM", lead?.id)
    } catch (e) {
      console.error("Inyeccion Error:", e)
      // Even if API fail, we allow them to proceed since they are PRO
      onResult(leadData, cvText.trim(), "es", "PREMIUM")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
           <Star className="w-3 h-3 fill-current" /> Acceso Exclusivo • Pierre PRO
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
          ¡Bienvenido al <br/> <span className="text-amber-500">Círculo de Estrategia</span>!
        </h1>
        <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed">
          Has sido autorizado como miembro VIP de la asesoría. Tu motor de empleabilidad está listo para ser activado.
        </p>
      </motion.div>

      {/* The "Inyeccion" Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[3rem] border-4 border-slate-900 p-8 sm:p-12 shadow-[0_40px_100px_-20px_rgba(251,191,36,0.3)] relative overflow-hidden"
      >
         {/* Decorative Ambience */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] rounded-full pointer-events-none" />
         
         <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center shadow-2xl">
                <Rocket className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic">Inicializar mi Motor Táctico</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Paso 1: Inyección de Datos de Carrera</p>
              </div>
            </div>

            <div className="space-y-4">
               <label className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" /> Contenido de tu CV Actual
                  </span>
                  <span className="text-[10px] text-emerald-500 font-black uppercase bg-emerald-50 px-2 py-1 rounded-lg">Análisis de Alta Prioridad activado</span>
               </label>
               
                <textarea
                autoFocus
                value={cvText}
                onChange={(e) => { setCvText(e.target.value); setError("") }}
                rows={10}
                placeholder="Pega aquí el texto de tu CV..."
                className="w-full px-8 py-6 rounded-[2.5rem] border-4 border-slate-100 bg-slate-50 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-amber-400 transition-all resize-none text-base leading-relaxed font-medium"
              />
              
              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>
              )}
            </div>

            <Button
              onClick={handleInyectar}
              disabled={isProcessing}
              className="w-full h-20 rounded-[2rem] bg-slate-950 hover:bg-slate-900 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-black/20 group active:scale-[0.98] transition-all"
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                   Inicializar Pierre PRO <Sparkles className="w-5 h-5 text-amber-400" /> <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              )}
            </Button>
         </div>
      </motion.div>

      {/* Social Proof / Security */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Protocolo de Encriptación Bancaria
         </div>
         <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-current" /> Soporte Prioritario 1:1 Activo
         </div>
      </div>
    </div>
  )
}
