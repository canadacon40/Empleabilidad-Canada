"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Search, FileText, Video, Rocket, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function PlanDetailsModal({ isOpen, onClose, onClaimOffer }: { isOpen: boolean, onClose: () => void, onClaimOffer: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    
    if (!isOpen) return null

    const includes = []

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] overflow-y-auto bg-background/80 backdrop-blur-sm">
                <div className="flex min-h-screen items-start justify-center p-4 pt-10 pb-10 sm:pt-16 sm:pb-16 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl transform text-left rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-8 transition-all sm:my-8"
                    >
                    <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Plan de Empleabilidad Personalizado</h2>
                        <p className="text-primary font-semibold text-lg mb-4">$109 USD <span className="text-muted-foreground text-sm font-normal ml-2">(Oferta especial por tiempo limitado)</span></p>
                        
                        <div className="bg-orange-100/50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-4 mb-4">
                            <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-1 text-sm">⚠️ ¿Vienes de un video en TikTok buscando asesoría?</h4>
                            <p className="text-orange-700 dark:text-orange-300 text-sm">
                                Te recomendamos encarecidamente utilizar nuestra herramienta de <strong>Reporte de Empleabilidad (GRATIS)</strong> primero para diagnosticar tu CV. Si después de hacerlo sigues queriendo el plan personalizado 1-a-1 de pago, puedes agendarlo abajo.
                            </p>
                        </div>

                        <p className="text-muted-foreground">
                            No es solo una sesión, es un ecosistema completo. Obtén las estrategias exactas, el material accionable y las herramientas IA para posicionarte con éxito.
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h3 className="font-semibold text-foreground mb-4">La Hoja de Ruta del Programa:</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0 mt-0.5 text-primary">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">1. Diagnóstico Profundo</h4>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Formulario detallado previo para levantar toda la información clave de tu perfil (NOCs, metas) junto a 3 horas de análisis previo sobre tu caso.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0 mt-0.5 text-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">2. Tu Plan de Acción Personalizado</h4>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Diseño (2 horas off-camera) de un plan único con: Mapa de NOCs, estrategia de búsqueda, scripts de networking y ruta a 90 días.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0 mt-0.5 text-primary">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">3. Sesión en Vivo (Zoom 40-60 min)</h4>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Explicación detallada del plan, resolución de dudas y definición de prioridades concretas para salir con un camino claro antes de ejecutar.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0 mt-0.5 text-primary">
                                    <Rocket className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">4. Entrega Final y Ejecución</h4>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Entrega del Plan de Empleabilidad Personalizado en PDF y checklist de tareas para acelerar tu búsqueda laboral, evitando errores del proceso.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                            size="lg" 
                            className="w-full text-base h-12" 
                            disabled={isLoading}
                            onClick={async () => { 
                                setIsLoading(true);
                                try {
                                    const res = await fetch("/api/create-checkout", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            priceOverride: 10900,
                                            successPath: "/checkout/success-session",
                                            productNameOverride: "Plan de Empleabilidad Personalizado + Sesión 1:1",
                                        }),
                                    });
                                    const data = await res.json();
                                    if (data.url) {
                                        window.location.href = data.url;
                                    } else {
                                        alert("Error al procesar el pago.");
                                        setIsLoading(false);
                                    }
                                } catch (e) {
                                    alert("Error de conexión.");
                                    setIsLoading(false);
                                }
                            }}
                        >
                             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Comprar Plan y Asegurar Cupo"}
                         </Button>
                         <Button size="lg" variant="outline" className="w-full text-base h-12" onClick={() => { window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon', '_blank'); }}>
                             Agendar Llamada Estratégica
                         </Button>
                    </div>

                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    )
}
