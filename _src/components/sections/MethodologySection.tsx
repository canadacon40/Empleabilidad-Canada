"use client"

import { motion } from "framer-motion"

export default function MethodologySection() {
    const steps = [
        {
            step: "01",
            title: "Identidad Blindada (Bloques 1-3)",
            description: "Diagnóstico implacable de viabilidad, estrategia de 'Bridge Roles', y traducción de habilidades al lenguaje corporativo local."
        },
        {
            step: "02",
            title: "Interfaz al Mercado (Bloques 4-6)",
            description: "Micro-Tuning quirúrgico por cada vacante que postules, SEO en LinkedIn y Marca Personal Funcional sin ser influencer."
        },
        {
            step: "03",
            title: "Mercado Oculto (Bloques 7-9)",
            description: "Infiltración táctica. Códigos booleanos, scripts para pedir Coffee Chats que se convierten en Referrals internos, y nuestro Tracker Analítico."
        },
        {
            step: "04",
            title: "Conversión y Dominio (Bloques 10-12)",
            description: "Forecast probabilístico de entrevistas, simuladores y respuestas del Método STAR, y tu Roadmap de Crecimiento a 180 días post-contratación."
        }
    ]

    return (
        <section id="framework" className="bg-primary py-24 px-4 sm:px-6 text-primary-foreground">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-16 md:text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                        El Sistema de 12 Bloques (Tus Fases de Escalada)
                    </h2>
                    <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                        No es una asesoría donde te "hacen el CV bonito". Te instalamos un sistema predecible y táctico enfocado exclusivamente en resultados.
                    </p>
                </div>

                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-2">
                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative pl-12"
                        >
                            <div className="absolute left-0 top-0 text-4xl font-black text-white/5 selection:bg-transparent">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
                            <p className="text-primary-foreground/70 relative z-10 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
