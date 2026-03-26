"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function ThankYouContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAcceptUpsell = async () => {
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    priceOverride: 10900, 
                    successPath: "/cv-tool",
                    productNameOverride: "Asesoría 1:1 - Sistema Integral de Empleabilidad (Oferta Especial)" 
                }),
            })
            const data = await res.json()
            if (data.url) window.location.href = data.url
            else setError("Error conectando con el pago.")
        } catch {
            setError("Error de conexión. Inténtalo de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
                <div className="max-w-md text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h1 className="text-2xl font-bold">Sesión no encontrada</h1>
                    <p className="text-muted-foreground">Parece que faltan datos de tu compra. Si ya pagaste, revisa tu correo para el acceso.</p>
                    <Button asChild className="mt-4"><a href="/cv-tool">Ir a la herramienta</a></Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Success Banner */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-900">¡Pago Confirmado!</h1>
                    <p className="text-green-800 text-sm sm:text-base">Tu Herramienta CV Canadiense está lista para usarse.</p>
                </div>

                {/* Upsell Container */}
                <div className="bg-white border border-border shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-[#0f172a] text-white p-6 sm:p-8 text-center">
                        <span className="inline-block bg-amber-500 text-amber-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                            Oferta Única Limitada
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold mb-3">
                            Espera, antes de ir a tu herramienta...
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                            Tienes la herramienta para transformar tus CVs, pero el mercado canadiense requiere estrategia. 
                            Agrega una sesión 1:1 para definir tu mapa de acción exacto.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6 items-center">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-foreground">Asesoría Estratégica 1:1</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">Diagnóstico de tu perfil vs mercado canadiense</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">Definición de roles objetivo (puente vs target)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">Estrategia para roles regulados y no regulados</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">Plan de acción concreto para los próximos 60-90 días</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-6 text-center border border-border/50">
                                <p className="text-sm text-muted-foreground mb-2 line-through">Precio Regular: $150 USD</p>
                                <p className="text-4xl font-extrabold text-foreground mb-2">$109 <span className="text-lg text-muted-foreground font-normal">USD</span></p>
                                <p className="text-xs text-amber-600 font-bold bg-amber-50 py-1 px-2 rounded-lg inline-block">
                                    Ahorras $41 USD solo por hoy
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 pt-4">
                            <Button 
                                size="lg" 
                                className="w-full text-base sm:text-lg py-6 sm:py-8 h-auto shadow-lg bg-[#0f172a] hover:bg-slate-800 text-white flex flex-col items-center justify-center gap-1"
                                onClick={() => window.open("https://buy.stripe.com/8x2cN57a22wo463fXe", "_blank")}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            Sí, quiero la Asesoría 1:1 por $109 USD <ArrowRight className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-normal text-slate-300">Agendar directamente en Calendly</span>
                                    </>
                                )}
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                className="w-full text-muted-foreground hover:text-foreground text-sm"
                                asChild
                            >
                                <a href={`/cv-tool?session_id=${sessionId}`}>
                                    No, gracias. Llévame directo a mi Herramienta CV
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    )
}
