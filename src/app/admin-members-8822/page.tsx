"use client"

import { useState } from "react"
import { ShieldCheck, UserPlus, Search, Loader2, CheckCircle, ArrowRight, Star, Copy, ExternalLink, Share2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminMembersPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string; action?: string } | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setMessage(null)
    setInviteUrl(null)

    try {
      const res = await fetch("/api/admin/upgrader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: data.message, action: data.action })
        // Generate Invite URL
        const baseUrl = window.location.origin
        setInviteUrl(`${baseUrl}/register?email=${encodeURIComponent(email.toLowerCase().trim())}&source=asesoria`)
        setEmail("")
      } else {
        setMessage({ type: "error", text: data.error || "Error al activar acceso." })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión con el motor de activación." })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 sm:py-32">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-2xl">
            <ShieldCheck className="w-3 h-3" /> Panel de Control de Miembros
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none italic">
            Pierre <span className="text-amber-400">PRO</span> Manager
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-tight max-w-sm mx-auto uppercase">
            Gestión interna de accesos para clientes de <span className="text-white">Asesoría 1:1</span>
          </p>
        </div>

        {/* Main Control Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border-4 border-slate-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-black/50 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Star className="w-20 h-20 text-amber-400" />
          </div>

          <form onSubmit={handleGrantAccess} className="relative z-10 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">
                Email del Miembro de Asesoría
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full h-18 bg-slate-950 border-4 border-slate-800 rounded-3xl px-8 text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-400 transition-all font-bold text-lg group-hover:border-slate-700"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 pointer-events-none">
                   <UserPlus className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            </div>

            <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-18 rounded-[2rem] bg-amber-400 hover:bg-amber-350 text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl shadow-amber-400/10 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                   Otorgar Acceso PRO Instantáneo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Invitation URL Generator */}
          <AnimatePresence mode="wait">
            {inviteUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 p-8 bg-amber-400 rounded-3xl space-y-6 shadow-[0_20px_50px_rgba(251,191,36,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-slate-950 font-black text-xs uppercase tracking-widest">Enlace de Invitación Generado</h3>
                    <p className="text-slate-900 text-[10px] font-bold uppercase opacity-60">Envía este link a tu cliente personalmente</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="w-full bg-slate-950/20 rounded-2xl px-6 py-4 text-slate-950 font-black text-sm truncate pr-20 border border-slate-950/10">
                    {inviteUrl}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 bg-slate-950 text-amber-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-2xl"
                  >
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-950/60 font-bold text-[10px] uppercase tracking-tighter">
                  <Info className="w-3 h-3" />
                  <span>Tu cliente verá su email ya pre-completado al abrir este link.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success/Error Message */}
          <AnimatePresence mode="wait">
            {message && !inviteUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 overflow-hidden"
              >
                <div className={`p-6 rounded-3xl border-4 flex items-start gap-4 ${
                  message.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {message.type === "success" ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                  <p className="text-sm font-black leading-tight uppercase tracking-tight">{message.text}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl text-center">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Paso 1</h4>
            <p className="text-white text-xs font-bold leading-tight uppercase tracking-tighter shadow-2xl">Activa el correo aquí</p>
          </div>
          <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl text-center">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Paso 2</h4>
            <p className="text-white text-xs font-bold leading-tight uppercase tracking-tighter shadow-2xl">Envía el link por WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
