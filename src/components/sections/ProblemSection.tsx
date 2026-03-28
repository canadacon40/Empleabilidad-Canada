"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { XCircle, ArrowRight, AlertTriangle, Ghost, Search, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import DiscountModal from "@/components/ui/DiscountModal"
import PlanDetailsModal from "@/components/ui/PlanDetailsModal"

export default function ProblemSection() {
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const problems = [
        {
            title: "El Fantasma del ATS",
            icon: Ghost,
            description: "Tu CV es descartado por un software antes de que un humano lo vea. No importa tu talento, para el sistema eres simplemente invisible."
        },
        {
            title: "Traducción 'Mortal'",
            icon: Ban,
            description: "Traducir tu experiencia literalmente te hace sonar sobrecalificado o desconectado de la cultura corporativa igualitaria de Canadá."
        },
        {
            title: "Quemando Oportunidades",
            icon: AlertTriangle,
            description: "Enviar el mismo CV a 100 ofertas ('Spray & Pray') solo sirve para que las empresas de tus sueños te bloqueen de por vida."
        },
        {
            title: "El Mercado Oculto",
            icon: Search,
            description: "Esperar a que publiquen vacantes es llegar tarde. El 80% de los mejores puestos se llenan por sistemas de referidos y redes de contacto que tú no estás usando."
        }
    ]

    const handleClaimOffer = () => {
        setIsDetailsModalOpen(false);
        setTimeout(() => setIsDiscountModalOpen(true), 300);
    }

    return (
        <section className="bg-slate-950 py-24 px-4 sm:px-6 relative overflow-hidden">
            {/* Background Agitation Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-600 blur-[100px] rounded-full" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto max-w-6xl relative">
                <div className="mb-20 text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
                    >
                        El Muro de Cristal
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                        ¿Por qué tu experiencia <span className="text-red-500 italic">no es suficiente</span> para Canadá?
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                        El mercado canadiense tiene reglas propias. Ignorarlas es la razón principal por la que profesionales con perfiles brillantes son rechazados sin siquiera una entrevista inicial.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:gap-8 mb-20">
                    {problems.map((problem, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="group flex flex-col p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                        >
                            <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 text-primary group-hover:scale-110 transition-transform">
                                <problem.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{problem.title}</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">{problem.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center p-12 rounded-[3rem] bg-gradient-to-br from-primary/20 to-blue-600/10 border border-primary/30 text-center backdrop-blur-sm"
                >
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight">
                        Este no es un problema de talento. <br /> Es un problema de <span className="text-primary">Estrategia</span>.
                    </h3>
                    <p className="text-slate-300 mb-10 max-w-2xl text-lg font-medium">
                        Deja de adivinar y empieza a competir con las mismas armas que usan los locales. El reporte gratuito es tu primer paso para dejar de ser invisible.
                    </p>
                    <Button size="lg" className="h-16 px-10 text-xl font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 rounded-2xl gap-3" onClick={() => (window.location.href = "/cv-tool")}>
                        ANALIZAR MI PERFIL AHORA
                        <ArrowRight className="w-6 h-6" />
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
