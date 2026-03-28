"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Play, Target, ShieldCheck } from "lucide-react"

export default function HeroSection() {
    const [showVideo, setShowVideo] = useState(false)
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-40 md:pb-32">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Content Column */}
                    <div className="lg:col-span-7 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20">
                                <Target className="w-3 h-3" />
                                Radar de Empleo
                            </span>
                            
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
                                Hazte <span className="text-primary relative inline-block">
                                    Visible
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                                    </svg>
                                </span> en el <br className="hidden md:block" />
                                Mercado Oculto.
                            </h1>
                            
                            <p className="text-lg md:text-2xl text-slate-600 font-medium max-w-xl leading-relaxed mb-12">
                                El 80% de las vacantes en Canadá <span className="text-slate-900 font-bold underline decoration-primary/30 decoration-4">nunca se publican</span>. Aprende la estrategia para entrar antes que tu competencia.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <Button size="lg" className="h-16 px-8 w-full sm:w-auto rounded-2xl text-lg font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group gap-3" asChild>
                                    <Link href="/cv-tool">
                                        <Zap className="w-5 h-5 fill-current" />
                                        ANALIZAR MI PERFIL GRATIS
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
                                    </div>
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">
                                        +50 profesionales <br/> asesorados en 2026
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-6 items-center border-t border-slate-100 pt-8">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    100% Confidencial
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Resultados Instantáneos
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* VSL Column */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group cursor-pointer"
                            onClick={() => setShowVideo(true)}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full" />

                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-8 border-white bg-slate-900 aspect-[9/16]">
                                {!showVideo ? (
                                    <div className="relative h-full w-full">
                                        <img 
                                            src="https://img.youtube.com/vi/z7_abW73Dhw/maxresdefault.jpg" 
                                            alt="Estrategia Pierre"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                                            onError={(e) => { e.currentTarget.src = "https://img.youtube.com/vi/z7_abW73Dhw/hqdefault.jpg"; }}
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-slate-900 via-transparent to-transparent">
                                            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/50 transform transition-all group-hover:scale-110 group-active:scale-95 mb-6">
                                                <Play className="w-8 h-8 fill-current ml-1" />
                                            </div>
                                            <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight">
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
