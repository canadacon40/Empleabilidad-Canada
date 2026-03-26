"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function ObjectionsSection() {
    return (
        <section className="bg-background py-24 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="rounded-3xl bg-secondary/30 border border-secondary p-8 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6">
                            <AlertCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                            Esto NO es una simple llamadita para decirte lo lindo que es Canadá.
                        </h2>
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                Si buscas a alguien que te motive sin darte herramientas reales, estás en el lugar equivocado.
                            </p>
                            <p>
                                <span className="font-semibold text-foreground">El Plan de Empleabilidad Estratégico</span> es exactamente eso: un plan exhaustivo. Buscar trabajo en Canadá sin estrategia profesional (ya sea que estés fuera o dentro del país) es como manejar un auto al que le falta una llanta — no importa lo rápido que intentes ir, vas a chocar.
                            </p>
                            <p>
                                Antes de nuestra sesión de 60 minutos, le dedico horas a analizar tu caso, revisar tu historial, investigar The Hidden Job Market en Canadá para tu industria y estructurar la ruta exacta que necesitas seguir. 
                            </p>                           
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
