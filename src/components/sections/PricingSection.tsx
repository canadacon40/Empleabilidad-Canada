"use client"

import { useState } from "react"
import { CheckCircle2, CreditCard, Sparkles, ExternalLink as ExternalIcon, Zap, Check, Info, ArrowRight, User, Loader2, Target, Search, FileText, Layout, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { useRouter } from "next/navigation"
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
        <section className="pt-24 pb-16 px-4 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03),transparent_70%)] pointer-events-none" />
            
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20"
                    >
                        Oferta de Lanzamiento
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight"
                    >
                        Elige tu Ruta al Éxito
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Herramientas de nivel profesional y mentoría experta para que tu llegada al mercado canadiense sea inevitable.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* PLAN 1: ACELERADOR PRO */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[40px] border-2 border-primary/20 bg-card p-8 flex flex-col hover:border-primary/40 transition-all shadow-2xl shadow-primary/5 relative group"
                    >
                        <div className="absolute -top-4 left-8 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Más Popular</div>
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-foreground mb-2 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-primary fill-primary" />
                                Acelerador PRO
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                La base tecnológica completa para dominar el mercado oculto y ganar entrevistas de alto nivel.
                            </p>
                        </div>
                        
                        <div className="mb-8 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg text-muted-foreground line-through font-medium">$51 USD</span>
                                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">Ahorra 43%</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-primary">$29</span>
                                <span className="text-sm font-bold text-primary/60">USD</span>
                            </div>
                            <p className="text-[10px] text-primary/70 font-bold mt-2 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> Acceso Instantáneo Vitalicio
                            </p>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            <p className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-4">¿Qué incluye el Kit PRO?</p>
                            {[
                                { icon: target, text: "Optimización de Keywords ATS (Filtros de Reclutadores)", highlight: true },
                                { icon: Layout, text: "Formato Canadiense Profesional Exportable (PDF/Docx)" },
                                { icon: Search, text: "Acceso a +10 Portales de Empleo Estratégicos" },
                                { icon: Sparkles, text: "50 Créditos para Generación de CV con IA" },
                                { icon: Mail, text: "Plantillas de Networking de Alto Impacto" },
                                { icon: FileText, text: "Guía de Adaptación Cultural para Entrevistas" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-foreground">
                                    <div className="p-1 rounded-full bg-primary/10 mt-1 flex-shrink-0">
                                        <Check className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className={item.highlight ? "font-bold" : "font-medium"}>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="w-full h-14 text-base font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            disabled={isAloading}
                            onClick={() => setIsProModalOpen(true)}
                        >
                            {isAloading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lo quiero ahora"}
                        </Button>
                    </motion.div>

                    {/* PLAN 2: ESTRATEGIA 1-A-1 */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[40px] border border-border bg-muted/30 p-8 flex flex-col hover:border-foreground/20 transition-all shadow-sm group"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-foreground mb-2 flex items-center gap-2">
                                <User className="w-6 h-6 text-foreground" />
                                Estrategia 1-a-1
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Mentoría experta con Pierre para diseñar tu hoja de ruta personalizada y evitar errores costosos.
                            </p>
                        </div>
                        
                        <div className="mb-8 p-6 rounded-3xl bg-background border border-border/50">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg text-muted-foreground line-through font-medium">$149 USD</span>
                                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Mejor Valor</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-foreground">$109</span>
                                <span className="text-sm font-bold text-muted-foreground">USD</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-widest flex items-center gap-1.5">
                                <FileText className="w-3 h-3" /> Sesión + Plan de Acción PDF
                            </p>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">La Experiencia Personalizada:</p>
                            {[
                                "Todo lo incluido en el Kit PRO",
                                "Sesión 1-a-1 Directa (Zoom 40-60 min)",
                                "Diagnóstico Profundo de tu NOC específico",
                                "Estrategia de LinkedIn y Presencia Digital",
                                "Soporte VIP por WhatsApp (30 días)",
                                "Hoja de Ruta Personalizada para tu perfil"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="font-medium text-foreground/80">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            variant="outline"
                            className="w-full h-14 text-base font-bold rounded-2xl border-2 hover:bg-foreground hover:text-background transition-all group/btn"
                            onClick={() => {
                                trackEvent("CTA_CLICK", { plan: "Estrategia 1-a-1", price: 109 });
                                window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon', '_blank');
                            }}
                        >
                            Agendar Sesión
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 max-w-4xl mx-auto rounded-[32px] bg-primary/5 border border-primary/10 p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                    <h3 className="text-2xl font-black text-center mb-10">¿Cuál es el camino correcto para ti?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary">1</div>
                            <h4 className="font-bold text-foreground text-lg">Elige el Acelerador PRO si...</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Quieres la **tecnología de tu lado**. Si sabes que tu CV no está pasando los filtros ATS o no sabes cómo buscar en los portales correctos, este kit te dará la ventaja táctica competitiva instantánea.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary">2</div>
                            <h4 className="font-bold text-foreground text-lg">Elige la Estrategia si...</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Te sientes **estancado o perdido**. Si necesitas que un experto revise tu caso, te diga exactamente qué estás haciendo mal y te diseñe una hoja de ruta sin errores para no perder más tiempo.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal de decisión para el plan PRO */}
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

// Icon constant for target fix
const target = Target;
