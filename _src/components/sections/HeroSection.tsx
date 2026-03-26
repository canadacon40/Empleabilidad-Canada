"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight, Zap, Play } from "lucide-react"

export default function HeroSection() {
    const [showVideo, setShowVideo] = useState(false)
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24">
            {/* Super subtle background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container relative mx-auto max-w-5xl px-4 sm:px-6">
                <div className="flex flex-col items-center text-center">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-7xl max-w-4xl"
                    >
                        ¿Realmente puedes conseguir trabajo en Canadá?
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-4 text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
                    >
                        Descúbrelo antes de aplicar.
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg md:text-xl text-muted-foreground font-medium max-w-2xl px-4"
                    >
                        Obtén un diagnóstico claro basado en datos reales <span className="text-foreground font-bold">(no opiniones)</span> y accede al <span className="text-primary font-bold">mercado laboral oculto (70% de vacantes)</span> con nuestra metodología.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12 w-full max-w-lg"
                    >
                        <Button size="lg" className="h-24 w-full rounded-2xl text-2xl font-black shadow-2xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all group" asChild>
                            <Link href="/cv-tool">
                                <Zap className="mr-3 h-7 w-7 fill-current" />
                                REPORTE DE EMPLEABILIDAD GRATIS
                                <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                             Sin tarjetas de crédito • Resultados instantáneos
                        </p>
                    </motion.div>

                    {/* VSL YouTube Embed with High-Res Poster */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full max-w-md mx-auto mt-20 rounded-3xl overflow-hidden shadow-2xl bg-[#0f172a] border-8 border-background relative group cursor-pointer"
                        onClick={() => setShowVideo(true)}
                    >
                        {!showVideo ? (
                            <div className="relative aspect-[9/16] w-full overflow-hidden">
                                {/* High-Res Thumbnail from YouTube */}
                                <img 
                                    src="https://img.youtube.com/vi/z7_abW73Dhw/maxresdefault.jpg" 
                                    alt="Video Preview"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        // Fallback to high quality if maxres isn't available
                                        e.currentTarget.src = "https://img.youtube.com/vi/z7_abW73Dhw/hqdefault.jpg";
                                    }}
                                />
                                {/* Premium Overlay & Play Button */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl shadow-primary/40 transform transition-all group-hover:scale-115 group-active:scale-95">
                                        <Play className="w-10 h-10 fill-current ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 whitespace-nowrap">
                                    <p className="text-white text-xs font-bold tracking-wide uppercase">Ver video de estrategia</p>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                className="w-full aspect-[9/16]"
                                src="https://www.youtube.com/embed/z7_abW73Dhw?rel=0&autoplay=1&modestbranding=1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Acelerador de Entrevistas VSL"
                                style={{ border: 'none' }}
                            ></iframe>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
