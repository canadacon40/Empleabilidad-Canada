"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import DiscountModal from "@/components/ui/DiscountModal"
import PlanDetailsModal from "@/components/ui/PlanDetailsModal"

export default function ProblemSection() {
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const problems = [
        {
            title: "Traducción Literal de tu Experiencia",
            description: "Tratar de traducir tu experiencia internacional de manera literal, sonando jerárquico y desactualizado en la cultura corporativa igualitaria de Canadá."
        },
        {
            title: "La Táctica 'Spray & Pray'",
            description: "Enviar el mismo PDF a 100 ofertas diferentes esperando que alguien pique, en lugar de adaptar quirúrgicamente tu perfil por vacante."
        },
        {
            title: "Desconocimiento Conductual",
            description: "Quedarte mudo en entrevistas al no conocer la matriz STAR, el formato obligatorio que usa el 100% de los departamentos de HR canadienses."
        },
        {
            title: "Invisible para los Reclutadores",
            description: "En este país, si no eres visible en el formato exacto que ellos buscan (ATS), para los reclutadores estás muerto. Tu experiencia no importa si el sistema descarta tu CV antes de que un humano lo vea."
        }
    ]

    const handleClaimOffer = () => {
        setIsDetailsModalOpen(false);
        // Pequeño timeout para que la animación se vea fluida
        setTimeout(() => setIsDiscountModalOpen(true), 300);
    }

    return (
        <section className="bg-muted/30 py-24 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-16 md:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        ¿Por qué el 90% de los candidatos con gran experiencia son rechazados?
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ya sea que intentes llegar desde tu país, o que ya estés en Canadá frustrado porque no consigues empleo en tu profesión, estos son los errores fatales que estás cometiendo:
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 mb-16">
                    {problems.map((problem, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex items-start rounded-2xl border border-border/50 bg-background p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="mr-5 flex-shrink-0 mt-1">
                                <XCircle className="h-7 w-7 text-red-500/80" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">{problem.title}</h3>
                                <p className="mt-3 text-muted-foreground leading-relaxed">{problem.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center p-8 rounded-3xl bg-secondary/20 border border-secondary text-center"
                >
                    <h3 className="text-2xl font-bold text-foreground mb-4">Adquiere un Plan de Empleabilidad Estratégico únicamente para tu perfil.</h3>
                    <p className="text-muted-foreground mb-8 max-w-2xl">Deja de aplicar a ciegas. Obtén una ruta exacta para posicionarte en el mercado laboral canadiense como el candidato que realmente eres.</p>
                    <Button size="lg" variant="default" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsDetailsModalOpen(true)}>
                        Ver Detalles del Programa
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
            
            <PlanDetailsModal 
                isOpen={isDetailsModalOpen} 
                onClose={() => setIsDetailsModalOpen(false)} 
                onClaimOffer={handleClaimOffer}
            />
            <DiscountModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} />
        </section>
    )
}
