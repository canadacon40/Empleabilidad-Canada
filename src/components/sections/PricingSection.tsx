"use client"

import { useState } from "react"
import { CheckCircle2, CreditCard, Sparkles, ExternalLink as ExternalIcon, Zap, Check, Info, ArrowRight, User } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import PlanDetailsModal from "../ui/PlanDetailsModal"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { useRouter } from "next/navigation"

import { Loader2 } from "lucide-react"

export default function PricingSection() {
    const { trackEvent } = useLeadTracking();
    const router = useRouter();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isAloading, setIsAloading] = useState(false)
    const [isBloading, setIsBloading] = useState(false)

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
        <section className="pt-24 pb-8 px-4 bg-background relative overflow-hidden">
            {/* Subtle aesthetic backgrounds */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03),transparent_70%)] pointer-events-none" />
            
            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20"
                    >
                        Planes y Herramientas
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-foreground"
                    >
                        Invierte en tu Futuro Profesional
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Elige el camino que mejor se adapte a tu urgencia y presupuesto. Ofertas por tiempo limitado para acelerar tu llegada al mercado laboral canadiense.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {/* Plan A: Free Report */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl border border-border bg-card p-6 flex flex-col hover:border-primary/30 transition-all shadow-sm group"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-foreground">Reporte Inicial</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                Diagnóstico base con IA para entender tu estatus actual en el mercado canadiense.
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-foreground">Gratis</span>
                            </div>
                            <p className="text-[9px] text-primary font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Veredicto Técnico IA
                            </p>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            {[
                                "Diagnóstico de Perfil con IA",
                                "Veredicto Técnico de Mercado",
                                "Match % con Vacantes Reales",
                                "Opción de Upgrade PRO"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            variant="outline"
                            className="w-full py-5 text-sm font-bold rounded-xl border-2 hover:bg-primary hover:text-white transition-all shadow-sm"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Gratis", price: 0 });
                                router.push('/cv-tool');
                            }}
                        >
                            Generar Gratis
                        </Button>
                    </motion.div>

                    {/* Plan B: Acelerador PRO ($29) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl border border-primary/50 bg-primary/5 p-6 flex flex-col hover:border-primary transition-all shadow-xl shadow-primary/5 relative scale-105 z-10"
                    >
                        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-white text-[9px] font-bold rounded-bl-xl uppercase tracking-widest">Popular</div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-foreground">Acelerador PRO</h3>
                            <p className="text-[10px] text-primary/80 mt-1 leading-relaxed">
                                La base táctica para ganar entrevistas. Optimización ATS y herramientas avanzadas.
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-primary">$29</span>
                                <span className="text-xs text-primary/60">USD</span>
                            </div>
                            <p className="text-[9px] text-primary/90 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Acceso Instantáneo PRO
                            </p>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            {[
                                "Todo lo del Reporte Inicial",
                                "Optimización de Keywords ATS",
                                "Formato Profesional Exportable",
                                "50 Créditos de Herramientas",
                                "Identificación de Patrocinio"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] text-foreground font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="w-full py-5 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            disabled={isAloading}
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Acelerador", price: 29 });
                                handleCheckout(2900, "/cv-tool", "Acelerador PRO (Herramientas)", setIsAloading);
                            }}
                        >
                            {isAloading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lo quiero ahora"}
                        </Button>
                    </motion.div>

                    {/* Plan C: Plan Personalizado ($109) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="rounded-3xl border border-border bg-card p-6 flex flex-col hover:border-slate-400 transition-all shadow-sm"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-foreground">Estrategia 1-a-1</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                Mentoría experta personalizada para una hoja de ruta sin errores.
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-foreground">$109</span>
                                <span className="text-xs text-muted-foreground">USD</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                                <User className="w-3 h-3" /> Sesión Directa con Pierre
                            </p>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            {[
                                "Todo lo incluido en el Kit PRO",
                                "Sesión 1-a-1 vía Zoom",
                                "Hoja de Ruta Personalizada",
                                "Optimización de LinkedIn",
                                "Soporte VIP WhatsApp"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            variant="secondary"
                            className="w-full py-5 text-sm font-bold rounded-xl border-2 transition-all shadow-sm group"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Plan Personalizado", price: 109 });
                                window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon', '_blank');
                            }}
                        >
                            Agendar Sesión
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>

                {/* Simple Decision Guide */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 max-w-4xl mx-auto rounded-3xl bg-muted/30 border border-border/50 p-8 sm:p-10"
                >
                    <h3 className="text-xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                         ¿Cuál es el camino correcto para ti?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <h4 className="font-bold text-primary flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">1</span>
                                Elige el Acelerador si...
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                No importa tu nivel de idioma o donde estés. Si **no sabes cómo funciona el mercado de alto nivel** y quieres la tecnología que te iguale a un local, este es tu primer paso.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-bold text-primary flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">2</span>
                                Elige el Plan Personalizado si...
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Te sientes estancado, **no sabes por qué no te llaman** o quieres la seguridad total de un experto. Analizaremos tu caso 1-a-1 para optimizar tu LinkedIn y darte un plan de acción sin errores.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
