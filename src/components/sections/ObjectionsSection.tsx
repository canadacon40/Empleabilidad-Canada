"use client"

import { motion } from "framer-motion"
import { AlertTriangle, ShieldX, Zap } from "lucide-react"

export default function ObjectionsSection() {
    return (
        <section className="bg-slate-50 py-24 px-4 sm:px-6 relative overflow-hidden">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-[3rem] bg-slate-900 border border-white/5 p-10 md:p-16 text-center shadow-2xl shadow-slate-900/40 relative overflow-hidden"
                >
                    {/* Decorative Warning Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-3xl mb-10 border border-amber-500/20">
                        <AlertTriangle className="h-10 w-10 text-amber-500" />
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-8 leading-tight">
                        Esto NO es una "charlita" <br className="hidden md:block" /> para hablar de tus sueños.
                    </h2>
                    
                    <div className="space-y-8 text-lg text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
                        <p>
                            Si buscas a un "coach" que te motive sin darte herramientas reales para pagar la renta en Canadá, <span className="text-white font-bold underline decoration-amber-500 underline-offset-4">estás en el lugar equivocado.</span>
                        </p>
                        <p>
                            El <span className="text-white font-bold">Acelerador Pierre 2.5</span> es ingeniería pura. Buscar trabajo en Canadá sin una estrategia táctica es como intentar cruzar el Ártico en shorts: no importa cuánto entusiasmo tengas, <span className="text-amber-500 font-black italic">vas a fracasar.</span>
                        </p>
                        <p className="text-sm md:text-base opacity-70">
                            Analizamos el "Hidden Job Market", hackeamos el ATS con keywords reales de tu industria y te damos el guion exacto. <br className="hidden md:block" /> **No perdemos tiempo. Venimos a ganar ofertas.**
                        </p>                           
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-30">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                            <ShieldX className="w-4 h-4" /> Zero Bullshit
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                            <Zap className="w-4 h-4" /> 100% Ejecución
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
