"use client"
import { CheckCircle2, Lightbulb, Target } from "lucide-react"
import { motion } from "framer-motion"

interface ModuleContentProps {
  objectives: string[]
  keyTakeaways: string[]
}

export default function ModuleContent({ objectives, keyTakeaways }: ModuleContentProps) {
  return (
    <div className="space-y-12">
      {/* Objectives Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Objetivos del Módulo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectives.map((objective, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">
                {objective}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Takeaways Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Puntos Clave de Estrategia</h3>
        </div>

        <div className="space-y-4">
          {keyTakeaways.map((takeaway, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="relative overflow-hidden p-6 rounded-3xl bg-slate-900 border border-white/5"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
              <p className="text-slate-300 italic font-medium leading-relaxed">
                "{takeaway}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resources Section Placeholder */}
      <section className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-white font-black text-lg mb-4">Material de Apoyo</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-lg">
            Descarga las guías oficiales y plantillas necesarias para ejecutar la estrategia de este módulo.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all border border-white/10 flex items-center gap-2">
              DESCARGAR GUÍA PDF
            </button>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-bold text-xs transition-all border border-white/5 flex items-center gap-2">
              PLANTILLAS DE TRABAJO
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
