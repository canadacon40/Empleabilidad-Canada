"use client"

import { motion } from "framer-motion"
import { Target, Zap, Network, Rocket, ArrowRight } from "lucide-react"

export default function MethodologySection() {
    const steps = [
        {
            icon: Target,
            step: "01",
            title: "Diagnóstico y 'Bridge Roles'",
            description: "No adaptamos tu perfil a lo que eres hoy, sino a lo que el mercado canadiense quiere ver. Identificamos tu 'NOC' ganador y los roles puente para entrar rápido."
        },
        {
            icon: Zap,
            step: "02",
            title: "Ingeniería de Keywords ATS",
            description: "Micro-Tuning quirúrgico de tu CV por cada vacante. Te enseñamos a hablar el lenguaje de las máquinas para que tu perfil nunca sea descartado por error."
        },
        {
            icon: Network,
            step: "03",
            title: "Infiltración en el Mercado Oculto",
            description: "El 70% de las vacantes no se publican. Te damos los scripts exactos para pedir 'Coffee Chats' que se convierten en referidos internos de alto valor."
        },
        {
            icon: Rocket,
            step: "04",
            title: "Dominio de Entrevistas STAR",
            description: "Forecast de preguntas conductuales y simuladores basados en la matriz STAR. No vas a improvisar; vas a ejecutar una estrategia de respuesta probada."
        }
    ]

    return (
        <section id="framework" className="bg-primary py-24 px-4 sm:px-6 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
            
            <div className="container mx-auto max-w-6xl relative">
                <div className="mb-20 text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                    >
                        El Mecanismo Único
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                        El Método Pierre 2.5: <br className="hidden md:block" /> Tu Puente al Mercado Real.
                    </h2>
                    <p className="mt-4 text-lg text-primary-foreground/70 max-w-2xl mx-auto font-medium">
                        No es una asesoría para "hacer el CV bonito". Es una instalación de un sistema táctico de búsqueda de empleo enfocado exclusivamente en obtener ofertas.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:gap-12 mb-16 px-4">
                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative flex items-start gap-6 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <div className="flex-grow">
                                <span className="absolute top-6 right-8 text-4xl font-black text-white/5 select-none transition-all group-hover:text-white/10">
                                    {item.step}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-primary-foreground/60 leading-relaxed font-medium text-sm">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest animate-pulse">
                         Scroll para ver los testimonios corregidos <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </section>
    )
}
