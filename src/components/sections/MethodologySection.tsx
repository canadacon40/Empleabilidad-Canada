"use client"

import { motion } from "framer-motion"
import { Target, Zap, Network, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react"

export default function MethodologySection() {
    return (
        <section id="framework" className="bg-white py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative">
                <div className="mb-20 text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                    >
                        El Mecanismo Único
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
                        No es Suerte. <br /> Es <span className="text-primary">Posicionamiento</span> Estratégico.
                    </h2>
                    <p className="mt-8 text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        En Canadá, <span className="text-slate-900 font-bold">7 de cada 10 trabajos nunca se publican.</span> Si solo aplicas por portales, invisible para el verdadero mercado laboral.
                    </p>
                </div>

                <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-start mb-20">
                    {/* Concept 1: Positioning */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50 shadow-sm relative group hover:border-primary/20 transition-all"
                    >
                        <div className="absolute -top-6 -left-6 w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 mt-4">
                            Posicionamiento sobre Aplicación
                        </h3>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            No "arreglamos tu CV". Construimos tu marca profesional canadiense basándonos en tu <span className="text-slate-900 font-bold">NOC específico</span>. Te posicionamos como la solución a sus problemas de reclutamiento.
                        </p>
                    </motion.div>

                    {/* Concept 2: Hidden Market */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50 shadow-sm relative group hover:border-primary/20 transition-all"
                    >
                        <div className="absolute -top-6 -left-6 w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Network className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 mt-4">
                            Infiltración en el Mercado Oculto
                        </h3>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Te instalamos el sistema de networking táctico. No es ir a convenciones, es saber pedir un <span className="text-slate-900 font-bold">Coffee Chat</span> que genere un referido interno directo.
                        </p>
                    </motion.div>
                </div>

                <div className="text-center">
                    <div className="inline-flex flex-col items-center gap-6 p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
                        <p className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                            "Deja de ser un número en Excel. <br className="hidden md:block" /> Conviértete en el candidato esperado."
                        </p>
                        <button 
                            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:scale-105 transition-all text-sm group"
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Ver mi nueva estrategia
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
