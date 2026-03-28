"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function CtaSection() {
    return (
        <section className="bg-primary py-24 px-4 sm:px-6 text-primary-foreground relative overflow-hidden">
            {/* Massive decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
            
            <div className="container relative mx-auto max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Únete a la élite profesional</span>
                    </div>

                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-none">
                        ¿Listo para competir <br className="hidden md:block" /> de verdad en Canadá?
                    </h2>
                    
                    <p className="mx-auto max-w-2xl text-lg md:text-xl text-primary-foreground/70 font-medium leading-relaxed">
                        Deja de adivinar por qué no te llaman. Hackea el sistema de filtrado ATS y entra al mercado oculto con herramientas de nivel profesional.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Button 
                            size="lg" 
                            className="h-20 w-full sm:w-auto px-10 text-xl font-black bg-white text-primary hover:bg-slate-50 rounded-[2rem] shadow-2xl shadow-white/10 hover:scale-[1.02] transition-all group" 
                            asChild
                        >
                            <Link href="/cv-tool">
                                Diagnosticar Mi CV Gratis
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="h-20 w-full sm:w-auto px-10 text-xl font-black border-2 border-white/20 bg-transparent text-white hover:bg-white/5 rounded-[2rem] backdrop-blur-sm transition-all group" 
                            asChild
                        >
                            <Link href="#lead-form">
                                <Target className="mr-3 w-6 h-6" />
                                Analizar Viabilidad
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 opacity-40">
                         <div className="text-[10px] font-black uppercase tracking-widest">Acceso Vitalicio</div>
                         <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                         <div className="text-[10px] font-black uppercase tracking-widest">Soporte 24/7 Pierre</div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
