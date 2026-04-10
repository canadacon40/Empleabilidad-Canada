"use client"

import { useState } from "react"
import { Check, ArrowRight, Loader2, Sparkles, Target, Zap, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ProPurchaseModal from "../ui/ProPurchaseModal"

export default function PricingSection() {
    const { trackEvent } = useLeadTracking();
    const router = useRouter();
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
                alert(`Error en el servidor de pagos: ${data.details || data.error || "Desconocido"}. Verifica que las claves de Stripe estén configuradas en Vercel.`);
                setLoader(false);
            }
        } catch (e: any) {
            alert(`Error de conexión al procesar el pago: ${e.message}`);
            setLoader(false);
        }
    };

    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-50 relative overflow-hidden ring-1 ring-slate-200">
            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Elige tu Ruta al Éxito</h2>
                    <p className="text-slate-500 font-medium">No dejes tu futuro al azar. Elige el plan que mejor se adapte a tu meta.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* PLAN PRINCIPAL: MENTORÍA 1-A-1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border-2 border-primary bg-slate-900 text-white shadow-2xl shadow-primary/20 transform md:scale-105 z-20"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                             ESTRATEGIA COMPLETA
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                                <Target className="w-6 h-6 text-primary" />
                                Mentoría 1-a-1
                            </h3>
                            <p className="text-sm font-medium text-slate-400">Diseño táctico de tu perfil para el mercado canadiense.</p>
                        </div>
                        
                        <div className="mb-8 flex items-baseline gap-3">
                            <span className="text-5xl font-black text-white">$109</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-primary">USD</span>
                                <s className="text-xs font-bold text-slate-500">$149</s>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {[
                                "Sesión 1-a-1 Estratégica (45 min)",
                                "Identificación de tu NOC y Roles Puente",
                                "Scripts para Dominar el Mercado Oculto",
                                "Revisión Humana de tu CV Adaptado",
                                "Plan de Acción PDF Personalizado",
                                "Soporte Directo por WhatsApp"
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary stroke-[3]" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">{text}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="h-16 w-full rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/40 group transition-all active:scale-95"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { zone: "Pricing", plan: "Mentoría 1-a-1", price: 109 });
                                window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon', '_blank');
                            }}
                        >
                            Agendar Mentoría
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        
                        <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">Satisfacción Garantizada</span>
                        </div>
                    </motion.div>

                    {/* PLAN KIT: ACELERADOR PRO */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border border-slate-200 bg-white hover:border-slate-300 transition-all"
                    >
                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-primary fill-primary" />
                                Acelerador Tools
                            </h3>
                            <p className="text-sm font-medium text-slate-500">Kit tecnológico para automatizar tu búsqueda.</p>
                        </div>
                        
                        <div className="mb-8 flex items-baseline gap-3">
                            <span className="text-5xl font-black text-slate-900">$29</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-400">USD</span>
                                <s className="text-xs font-bold text-slate-300 font-medium">$51</s>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {[
                                "Buscador de Empresas con LMIA",
                                "Generador de CV pro (PDF/Word)",
                                "Adaptador de Cover Letters IA",
                                "Simulador de Entrevistas STAR",
                                "Guía de Networking Canadiense",
                                "Acceso a Comunidad de Alumnos"
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-slate-500 stroke-[3]" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">{text}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="h-16 w-full rounded-2xl text-lg font-black bg-slate-900 hover:bg-slate-800 text-white shadow-xl group transition-all active:scale-95"
                            disabled={isAloading}
                                trackEvent("CTA_CLICK", { zone: "Pricing", plan: "Acelerador PRO", price: 29 });
                                handleCheckout(2900, "/cv-tool", "Acelerador PRO (Herramientas)", setIsAloading);
                            }}
                        >
                            {isAloading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Desbloquear Kit
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                        
                        <div className="mt-4 text-center">
                            <Link href="/cv-tool" className="text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-colors">
                                O empieza con el Reporte Gratis
                            </Link>
                        </div>
                    </motion.div>
                </div>
                <div className="mt-16 max-w-4xl mx-auto text-center border-t border-slate-200 pt-10">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-white/10 shadow-2xl">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">
                            Pierre es Estrategia de Empleabilidad • Para trámites de Visa visita <a href="https://www.canada.ca/en/services/immigration-citizenship.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Canada.ca</a>
                        </span>
                    </div>
                    <p className="mt-6 text-slate-400 text-[10px] leading-relaxed uppercase font-black tracking-widest max-w-2xl mx-auto">
                        Nuestro objetivo es que conquistes la entrevista y la oferta laboral. Los procesos migratorios y legales son responsabilidad del candidato a través de las fuentes oficiales.
                    </p>
                </div>
            </div>

        </section>
    )
}
