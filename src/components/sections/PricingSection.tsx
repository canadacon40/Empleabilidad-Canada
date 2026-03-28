"use client"

import { useState } from "react"
import { CheckCircle2, Zap, Check, Star, ShieldCheck, Clock, ArrowRight, Loader2, Sparkles, Target, Layout, Search, Mail, FileText, User } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ProPurchaseModal from "../ui/ProPurchaseModal"

export default function PricingSection() {
    const { trackEvent } = useLeadTracking();
    const router = useRouter();
    const [isProModalOpen, setIsProModalOpen] = useState(false)
    const [isAloading, setIsAloading] = useState(false)

    const handleCheckout = async (amount: number, successUrl: string, productName: string, setLoader: (val: boolean) => void) => {
        setLoader(true);
        try {
            const res = await fetch("/api/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceOverride: amount,
                    successPath: successUrl,
                    productNameOverride: productName,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Error al procesar el pago.");
                setLoader(false);
            }
        } catch (e) {
            alert("Error de conexión.");
            setLoader(false);
        }
    };

    return (
        <section id="pricing" className="py-24 px-4 sm:px-6 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary/20 shadow-sm mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Inversión en tu Futuro</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight"
                    >
                        Elige tu Ruta <br className="hidden md:block" /> al Éxito en Canadá
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto font-medium"
                    >
                        Tanto si prefieres la velocidad de la IA como la precisión de una mentoría humana, tenemos el plan exacto para que dejes de ser invisible.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* PLAN 1: DIAGNÓSTICO GRATUITO */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative flex flex-col p-8 rounded-[2.5rem] border border-slate-200 bg-white/50 backdrop-blur-sm hover:border-slate-300 transition-all opacity-80 hover:opacity-100"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Diagnóstico IA</h3>
                            <p className="text-xs font-medium text-slate-500">Para quienes están empezando.</p>
                        </div>
                        
                        <div className="mb-8 items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900">$0</span>
                        </div>

                        <div className="space-y-3 mb-10 flex-1">
                            {[
                                { text: "Análisis de CV inicial" },
                                { text: "Score de compatibilidad" },
                                { text: "Mapeo de Keywords" },
                                { text: "Veredicto del Mercado" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Check className="w-3 h-3 text-slate-400 mt-1" />
                                    <span className="text-xs font-medium text-slate-600">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            variant="outline"
                            className="h-12 w-full rounded-xl text-sm font-bold border-slate-200 hover:bg-slate-50"
                            asChild
                        >
                            <Link href="/cv-tool">Empezar Gratis</Link>
                        </Button>
                    </motion.div>

                    {/* PLAN 2: ESTRATEGIA 1-A-1 (EL CENTRO) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative flex flex-col p-10 rounded-[3rem] border-2 border-primary bg-slate-900 text-white shadow-[0_32px_64px_-16px_rgba(37,99,235,0.3)] lg:-mt-4 lg:-mb-4 z-20 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <Star className="w-8 h-8 text-primary/20 fill-primary/20" />
                        </div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-b-2xl uppercase tracking-widest shadow-xl flex items-center gap-2">
                             MÁS ELEGIDO
                        </div>

                        <div className="mb-8 mt-4">
                            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                <User className="w-6 h-6 text-primary" />
                                Plan + Mentoría
                            </h3>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                Estrategia humana completa para perfiles de alta competitividad.
                            </p>
                        </div>
                        
                        <div className="mb-10 flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white tracking-tighter">$109</span>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">USD</span>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {[
                                { text: "Reporte Pierre AI Ilimitado", bold: true },
                                { text: "Sesión 1-a-1 Estratégica (45 min)" },
                                { text: "Revisión Humana de tu CV Adaptado" },
                                { text: "Plan de Acción Personalizado" },
                                { text: "Soporte Directo por WhatsApp" },
                                { text: "Acceso a Vacantes del Mercado Oculto" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary stroke-[3]" />
                                    </div>
                                    <span className={`text-sm tracking-tight ${item.bold ? "font-bold text-white" : "font-medium text-slate-300"}`}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="h-16 w-full rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all active:scale-95 group/btn"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Estrategia 1-a-1", price: 109 });
                                window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidades', '_blank');
                            }}
                        >
                            Agendar Mentoría
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>

                        <div className="mt-6 flex items-center justify-center gap-4 opacity-40">
                             <div className="flex items-center gap-1 text-[10px] font-black uppercase text-white">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Garantizado
                             </div>
                        </div>
                    </motion.div>

                    {/* PLAN 3: ACELERADOR PRO */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative flex flex-col p-8 rounded-[2.5rem] border border-slate-200 bg-white hover:border-slate-300 transition-all group"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" /> Acelerador IA
                            </h3>
                            <p className="text-xs font-medium text-slate-500">Base tecnológica para tu búsqueda.</p>
                        </div>
                        
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900">$29</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">USD</span>
                        </div>

                        <div className="space-y-3 mb-10 flex-1">
                            {[
                                { text: "Pierre AI: 50 interacciones", bold: true },
                                { text: "Adaptador de CV (Word/PDF)" },
                                { text: "Generador de Cover Letters" },
                                { text: "Preparador de Entrevistas" },
                                { text: "Buscador de Empresas LMIA" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-emerald-50 mt-1 flex-shrink-0">
                                        <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                                    </div>
                                    <span className={`text-xs tracking-tight ${item.bold ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="h-12 w-full rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white group/btn"
                            disabled={isAloading}
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Acelerador PRO", price: 29 });
                                setIsProModalOpen(true);
                            }}
                        >
                            {isAloading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    Comprar Herramientas
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">¿Aún tienes dudas?</p>
                    <Link href="#lead-form" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:underline transition-all">
                        Solicita una asesoría previa gratuita
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <ProPurchaseModal 
                isOpen={isProModalOpen}
                onClose={() => setIsProModalOpen(false)}
                onGoToFreeReport={() => {
                    trackEvent("MODAL_CLICK", { action: "GoToFreeReport" });
                    router.push('/cv-tool');
                }}
                onContinueToCheckout={() => {
                    trackEvent("MODAL_CLICK", { action: "ContinueToCheckout" });
                    setIsProModalOpen(false);
                    handleCheckout(2900, "/cv-tool", "Acelerador PRO (Herramientas)", setIsAloading);
                }}
            />
        </section>
    )
}
