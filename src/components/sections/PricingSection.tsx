"use client"

import { useState } from "react"
import { CheckCircle2, CreditCard, Sparkles, ExternalLink as ExternalIcon, Zap, Check, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import PlanDetailsModal from "../ui/PlanDetailsModal"
import { useLeadTracking } from "@/hooks/useLeadTracking"

export default function PricingSection() {
    const { trackEvent } = useLeadTracking();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Plan A: The Tool */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl border border-border bg-card p-8 flex flex-col hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5"
                    >
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground">Kit de Inicio Profesional</h3>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                **El punto de partida.** Obtén tu diagnóstico de empleabilidad completo y descubre exactamente qué te separa de las mejores ofertas del mercado.
                            </p>
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground">Gratis</span>
                                <span className="text-sm text-muted-foreground font-medium">*Diagnóstico Inicial</span>
                            </div>
                            <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1.5 uppercase tracking-wide">
                                <Sparkles className="w-3.5 h-3.5" />
                                Incluye Veredicto Estratégico IA
                            </p>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {[
                                "Diagnóstico de Perfil con IA",
                                "Veredicto Técnico de Mercado",
                                "Match % con Vacantes Reales",
                                "Acceso al Acelerador PRO ($29)",
                                "Optimización de Keywords ATS",
                                "Formato Profesional Exportable"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Acelerador", price: 29 });
                                window.location.href = "https://buy.stripe.com/test_7sI9E83vgeBiaWscMM";
                            }}
                        >
                            Lo quiero ahora
                        </Button>
                    </motion.div>

                    {/* Plan B: Plan de Empleabilidad Personalizado */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="rounded-3xl border-2 border-primary bg-primary/5 p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-primary/10 md:scale-105 z-10"
                    >
                        <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-xs font-bold rounded-bl-3xl uppercase tracking-widest">Recomendado</div>
                        
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground">Plan de Empleabilidad Personalizado</h3>
                            <p className="text-sm text-primary/80 mt-2 font-medium">Mentoría experta personalizada para una estrategia sin errores.</p>
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary">$109</span>
                                <span className="text-lg text-primary/80 font-medium">USD</span>
                                <s className="text-sm text-muted-foreground/60 ml-2 font-normal font-mono">$149</s>
                            </div>
                            <p className="text-xs text-primary/90 font-bold mt-2 flex items-center gap-1.5 uppercase tracking-wide">
                                💥 Acceso Prioritario y Garantía
                            </p>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {[
                                "Todo lo incluido en el Kit Profesional",
                                "Sesión 1-a-1 de Estrategia (Zoom)",
                                "Hoja de Ruta Personalizada",
                                "Optimización de LinkedIn de Alto Impacto",
                                "Guía de Búsqueda de Sponsoring",
                                "Soporte VIP por WhatsApp (30 días)"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-foreground font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all ring-offset-background group"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Plan Personalizado", price: 109 });
                                window.location.href = "https://buy.stripe.com/test_5kA5nX5DofFm4Cc9AA";
                            }}
                        >
                            Lo quiero ahora
                            <Check className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
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
