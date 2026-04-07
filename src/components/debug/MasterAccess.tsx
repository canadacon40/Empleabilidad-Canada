"use client"

import { useState, useEffect } from "react"
import { ShieldAlert, Zap, ArrowRight, UserPlus, FileText, ShoppingCart, Lock, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function MasterAccess() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
      setIsDev(true)
    }
  }, [])

  if (!isDev) return null

  const steps = [
    { label: "1. Libre", path: "/cv-tool", icon: <FileText className="w-3 h-3" />, color: "bg-blue-500" },
    { label: "2. Upsell (Sim)", path: "/upsell?session_id=DEBUG_PAYMENT", icon: <ShoppingCart className="w-3 h-3" />, color: "bg-amber-500" },
    { label: "3. Registro", path: "/thank-you?session_id=DEBUG_PAYMENT", icon: <UserPlus className="w-3 h-3" />, color: "bg-emerald-500" },
    { label: "4. Onboarding PRO", path: "/cv-tool?onboarding=true", icon: <Zap className="w-3 h-3" />, color: "bg-purple-500" },
    { label: "5. Login", path: "/login", icon: <Lock className="w-3 h-3" />, color: "bg-slate-500" },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-slate-900 border-2 border-amber-500/30 p-4 rounded-3xl shadow-2xl w-64 space-y-3 pointer-events-auto"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Funnel Access</span>
            </div>

            <div className="space-y-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => window.location.href = step.path}
                  className="w-full h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <div className={`${step.color} w-6 h-6 rounded-lg flex items-center justify-center text-white`}>
                      {step.icon}
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{step.label}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
              
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full h-10 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 transition-all flex items-center justify-between group mt-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-red-500 w-6 h-6 rounded-lg flex items-center justify-center text-white">
                    <LogOut className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Cerrar Sesión</span>
                </div>
                <ArrowRight className="w-3 h-3 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest text-center pt-2">
              DEBUG MODE ONLY • LOCALHOST
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-slate-950 border-2 border-white/10 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all pointer-events-auto relative group"
      >
        <Zap className={`w-6 h-6 ${isOpen ? 'text-amber-400' : 'text-white'} transition-colors`} />
        {!isOpen && (
           <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-pulse border-2 border-slate-950" />
        )}
      </button>
    </div>
  )
}
