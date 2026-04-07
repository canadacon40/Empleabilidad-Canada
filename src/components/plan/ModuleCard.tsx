"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { LucideIcon, Play, Zap, Clock, ShieldCheck } from "lucide-react"

interface ModuleCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  duration: string
  category: string
  proToolLink?: string
  index: number
}

const categoryColors: Record<string, string> = {
  "Estrategia": "border-blue-500/20 text-blue-400 bg-blue-500/5",
  "Herramientas": "border-primary/20 text-primary bg-primary/5",
  "Entrevistas": "border-purple-500/20 text-purple-400 bg-purple-500/5",
  "Cierre": "border-green-500/20 text-green-400 bg-green-500/5"
}

export default function ModuleCard({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  duration, 
  category, 
  proToolLink,
  index 
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative h-full flex flex-col p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-500 overflow-hidden shadow-2xl shadow-black/20"
    >
      {/* Decorative gradient background */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-primary/20">
          <Icon className="h-7 w-7" />
        </div>
        <div className={`text-[10px] uppercase tracking-[0.2em] font-black border px-3 py-1.5 rounded-full backdrop-blur-sm ${categoryColors[category] || 'border-white/10 text-slate-400'}`}>
          {category}
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="text-2xl font-black text-white mb-3 tracking-tighter group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-black tracking-widest">
          <Clock className="w-4 h-4" />
          {duration}
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          {proToolLink && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 animate-pulse-slow">
              <Zap className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tool PRO</span>
            </div>
          )}
          <Link 
            href={`/plan-de-empleabilidad/${id}`}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/5 text-white hover:bg-primary hover:text-white border border-white/10 hover:border-primary transition-all duration-300 font-black text-xs group/btn shadow-lg"
          >
            COMENZAR
            <Play className="w-3.5 h-3.5 fill-current group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Finishing Status Overlay (Concept) */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity">
        <ShieldCheck className="w-24 h-24 text-white" />
      </div>
    </motion.div>
  )
}
