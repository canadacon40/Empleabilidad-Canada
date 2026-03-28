"use client"

import { ShieldCheck, TrendingUp, Users, Zap, Target, Network } from "lucide-react"
import { motion } from "framer-motion"

export default function ProofSection() {
    const stats = [
        {
            icon: Zap,
            title: "Tracción Rápida",
            description: "De 0 respuestas a conseguir invitaciones a entrevistas en un promedio de 4 semanas tras adaptar los perfiles a formatos 100% compatibles con ATS."
        },
        {
            icon: Target,
            title: "Pivote Seguro",
            description: "Identificación exacta del 'Bridge Role' viable para frenar el rechazo inmediato al aplicar a posiciones jerárquicas irrealistas para recién llegados."
        },
        {
            icon: Network,
            title: "Mercado Oculto",
            description: "El 80% de los roles no se publican. El Sistema de Acceso te enseña a infiltrarte en el networking directo con Hiring Managers para asegurar ofertas."
        }
    ]

    return (
        <section className="bg-slate-900 py-24 px-4 sm:px-6 relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="mb-20 text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                    >
                        Ingeniería de Carrera
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                        Resultados basados en estrategia, <br className="hidden md:block" /> no en la suerte.
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                        No garantizamos empleos; garantizamos un sistema. Estos profesionales descartaron tácticas obsoletas y ejecutaron su parte del plan norteamericano al pie de la letra.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {stats.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <item.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
