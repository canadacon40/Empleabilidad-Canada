"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { ArrowRight, Zap, Play, Target, ShieldCheck, CheckCircle2 } from "lucide-react"

export default function HeroSection() {
    const { data: session } = useSession()
    const [showVideo, setShowVideo] = useState(false)
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-44 md:pb-40">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    {/* Content Column */}
                    <div className="lg:col-span-7 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/5">
                                <Target className="w-3 h-3" />
                                Radar de Empleo v2.5
                            </span>
                            
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.93] mb-8 italic">
                                <span className="text-slate-400 block text-2xl md:text-4xl tracking-normal mb-5 not-italic">¿Buscando trabajo sin éxito?</span>
                                No es tu Experiencia. Es tu <span className="text-primary relative inline-block">
                                    Estrategia
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                                    </svg>
                                </span>.
                            </h1>
                            
                            <p className="text-xl md:text-3xl text-slate-600 font-medium max-w-xl leading-snug mb-12">
                                <span className="text-slate-900 font-bold">El 70% de las vacantes nunca se publican.</span> Te doy el plan táctico para entrar al mercado oculto de Canadá antes que tu competencia.
                            </p>

                            <div className="space-y-8">
                                <Button size="lg" className="h-16 sm:h-24 px-8 sm:px-12 w-full sm:w-auto rounded-2xl sm:rounded-[2rem] text-sm sm:text-2xl font-black shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all group gap-4 relative overflow-hidden" asChild>
                                    <Link href="/cv-tool">
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 italic" />
                                        OBTENER MI REPORTE GRATIS
                                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </Button>

                                {/* Value Bullets */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 max-w-lg">
                                    {[
                                        "Score de Empleabilidad Real",
                                        "Análisis de NOC (Clasificación)",
                                        "3 Errores Tóxicos a eliminar hoy",
                                        "Estrategia de Mercado Oculto"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 flex flex-wrap gap-6 items-center border-t border-slate-100 pt-8">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    100% Confidencial
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Resultados Instantáneos
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                                    <Target className="w-4 h-4 text-primary" />
                                    No Inmigración • Solo Empleabilidad
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* VSL Column */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group cursor-pointer"
                            onClick={() => setShowVideo(true)}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[100px] rounded-full" />

                            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.3)] border-[12px] border-white bg-slate-900 aspect-[9/16] max-w-[400px] mx-auto lg:ml-auto">
                                {!showVideo ? (
                                    <div className="relative h-full w-full">
                                        <img 
                                            src="https://img.youtube.com/vi/z7_abW73Dhw/maxresdefault.jpg" 
                                            alt="Estrategia Pierre"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                                            onError={(e) => { e.currentTarget.src = "https://img.youtube.com/vi/z7_abW73Dhw/hqdefault.jpg"; }}
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-slate-900 via-transparent to-transparent">
                                            <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary),0.5)] transform transition-all group-hover:scale-110 group-active:scale-95 mb-8">
                                                <Play className="w-10 h-10 fill-current ml-1" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
                                                Mira el método para <br/> hackear el mercado <br/> oculto
                                            </h3>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/z7_abW73Dhw?rel=0&autoplay=1&modestbranding=1"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Acelerador de Entrevistas"
                                    ></iframe>
                                )}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
