"use client"
import { motion } from "framer-motion"
import { ArrowRight, Ban, Search, AlertCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProblemSection() {
    const problems = [
        {
            icon: Ban,
            text: "Aplicas a decenas de vacantes y nadie te llama (Silencio total)."
        },
        {
            icon: Search,
            text: "No sabes si tu perfil es realmente competitivo en Canadá."
        },
        {
            icon: AlertCircle,
            text: "Tu CV es descartado por filtros ATS antes de que un humano lo vea."
        },
        {
            icon: XCircle,
            text: "No entiendes cómo funciona el 'Mercado Oculto' y sigues llegando tarde."
        }
    ]

    return (
        <section className="bg-slate-950 py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-4xl relative">
                <div className="mb-16 text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                    >
                        El Muro de Cristal
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                        ¿Te sientes <span className="text-red-500 italic">Invisible</span> en Canadá?
                    </h2>
                </div>

                <div className="space-y-6 mb-16 max-w-3xl mx-auto">
                    {problems.map((problem, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <problem.icon className="h-6 w-6" />
                            </div>
                            <p className="text-lg md:text-xl font-bold text-slate-300 leading-tight">
                                {problem.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center bg-primary/10 border border-primary/20 p-10 rounded-[3rem] backdrop-blur-sm"
                >
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
                        Si te identificas, <span className="text-primary underline underline-offset-8">no es mala suerte</span>.
                    </h3>
                    <p className="text-slate-400 mb-10 text-lg font-medium max-w-2xl mx-auto">
                        Es falta de un sistema adaptado al mercado local. El 70% de los trabajos nunca se publican en LinkedIn o Indeed. Estás peleando por las migajas del 30%.
                    </p>
                    <Button 
                        size="lg" 
                        className="h-16 px-6 sm:px-10 text-sm sm:text-lg md:text-xl font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 rounded-2xl gap-3 transition-all active:scale-95 w-full sm:w-auto mt-4 mx-auto flex items-center justify-center" 
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        QUIERO MI PLAN ESTRATÉGICO
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
