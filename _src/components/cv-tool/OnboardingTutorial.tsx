"use client"

import { useState } from "react"
import { ChevronRight, FileText, Search, Mail, MessageSquare, Phone, BarChart3, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
    onComplete: () => void
}

const steps = [
    {
        icon: BarChart3,
        title: "Paso 1 — Análisis de Empleabilidad",
        desc: "Sube tu CV y recibe un reporte completo: regulación por provincia, certificaciones, salarios, y rutas de empleabilidad.",
        tip: "📊 Se genera automáticamente cuando subes tu CV. Puedes descargarlo en PDF o Excel.",
        uses: "Se incluye con cada transformación de CV.",
    },
    {
        icon: FileText,
        title: "Paso 2 — Transformar tu CV",
        desc: "Tu CV en español se transforma al formato canadiense (inglés o francés): resumen profesional, logros con métricas, sección de skills, formato ATS.",
        tip: "🎯 Elige entre 3 diseños (Clásico, Moderno, Ejecutivo) y descarga en PDF + Word.",
        uses: "Tienes 10 transformaciones. Idealmente usas 1 por cada oferta diferente.",
    },
    {
        icon: Search,
        title: "Paso 3 — Personalizar para cada oferta",
        desc: "Pega la descripción del puesto y esta herramienta analiza las keywords, adapta tu CV, y verifica su compatibilidad ATS.",
        tip: "💡 Usa 'Analizar Oferta' primero para ver qué pide, luego 'Adaptar mi CV' para ajustarlo.",
        uses: "Cada acción (analizar, adaptar, verificar ATS) consume 1 de tus 40 acciones de estrategia.",
    },
    {
        icon: Mail,
        title: "Paso 4 — Cover Letter personalizada",
        desc: "Genera una cover letter al estilo canadiense para cada oferta. Profesional, concisa, y lista para enviar.",
        tip: "✉️ Agrega la info de la empresa para una personalización aún más potente.",
        uses: "Cada cover letter consume 1 acción de estrategia.",
    },
    {
        icon: MessageSquare,
        title: "Paso 5 — Preparar entrevistas",
        desc: "Predice las preguntas técnicas y de comportamiento más probables con guías de cómo responder usando la metodología STAR.",
        tip: "🎤 Lee las respuestas modelo y practícalas en voz alta antes de la entrevista real.",
        uses: "Cada preparación consume 1 acción de estrategia.",
    },
    {
        icon: Phone,
        title: "Paso 6 — Scripts de contacto",
        desc: "Plantillas de email (EN + FR) para contactar reclutadores, y scripts de llamada con guía de pronunciación en español.",
        tip: "📞 Los scripts no consumen acciones, son plantillas fijas que puedes copiar y personalizar.",
        uses: "¡Gratis! Los scripts no gastan acciones.",
    },
]

export default function OnboardingTutorial({ onComplete }: Props) {
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-3xl">🗺️</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Guía Rápida — Lo que incluye tu compra
                </h2>
                <p className="text-muted-foreground">
                    Antes de empezar, conoce todas tus herramientas para aprovecharlas al máximo.
                </p>
            </div>

            {/* Usage Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <div className="text-2xl font-bold text-primary">10</div>
                    <div className="text-xs text-muted-foreground mt-1">Transformaciones de CV</div>
                    <div className="text-[10px] text-muted-foreground">(1 por oferta diferente)</div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <div className="text-2xl font-bold text-primary">40</div>
                    <div className="text-xs text-muted-foreground mt-1">Acciones de Estrategia</div>
                    <div className="text-[10px] text-muted-foreground">(personalizar, cover letters, entrevistas)</div>
                </div>
            </div>

            {/* Step cards */}
            <div className="space-y-3 mb-8">
                {steps.map((step, i) => {
                    const Icon = step.icon
                    const isActive = currentStep === i
                    const isDone = currentStep > i
                    return (
                        <button
                            key={i}
                            onClick={() => setCurrentStep(i)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isActive
                                ? "border-primary bg-primary/5 shadow-sm"
                                : isDone
                                    ? "border-green-300 bg-green-50/50"
                                    : "border-border bg-background hover:border-primary/30"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-100" : isActive ? "bg-primary/10" : "bg-muted/50"
                                    }`}>
                                    {isDone ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                                    {isActive && (
                                        <div className="mt-3 space-y-2">
                                            <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                                                <p className="text-xs text-foreground">{step.tip}</p>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-semibold">{step.uses}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    Paso {currentStep + 1} de {steps.length}
                </div>
                {currentStep < steps.length - 1 ? (
                    <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="gap-2"
                    >
                        Siguiente <ChevronRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={onComplete}
                        className="gap-2"
                        size="lg"
                    >
                        <CheckCircle className="w-4 h-4" />
                        ¡Entendido, empezar!
                    </Button>
                )}
            </div>
        </div>
    )
}
