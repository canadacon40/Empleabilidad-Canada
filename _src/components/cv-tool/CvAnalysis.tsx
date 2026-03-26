"use client"

import { useState } from "react"
import {
    AlertTriangle, CheckCircle, XCircle, Shield, Award, Shuffle, MapPin, DollarSign, Building2, Loader2, ExternalLink, Info, Download, FileSpreadsheet, Lock, Languages, Sparkles, Check, Banknote, Rocket, ChevronRight
} from "lucide-react"
import GaugeChart from "./GaugeChart"
import { Button } from "@/components/ui/button"
import { sendGTMEvent } from "@next/third-parties/google"
import { downloadFullReportPDF, downloadLMIAExcel } from "@/lib/report-utils"

interface CvAnalysisProps {
    cvText: string
    onAnalysisComplete: () => void
    accessCode?: string
    leadData?: any
    leadId?: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CvAnalysis({ cvText, onAnalysisComplete, accessCode, leadData, leadId }: CvAnalysisProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<any>(null)
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

    const handleAnalyze = async () => {
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/cv-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText, leadId }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error); return }
            setResult(data.result)
        } catch { setError("Error de conexión. Intenta de nuevo.") }
        finally { setIsLoading(false) }
    }

    const downloadFullReport = () => {
        if (!result) return
        downloadFullReportPDF(result)
    }

    const downloadExcel = () => {
        if (!result) return
        downloadLMIAExcel(result)
    }

    const handleCheckout = async (amount: number, successUrl: string) => {
        sendGTMEvent({ event: "checkout_started", value: { amount: amount / 100, currency: "USD" } });
        setIsCheckoutLoading(true);
        
        // Save current report state to localStorage so we can recover it after Stripe redirect
        if (result) {
            localStorage.setItem("pendingReportData", JSON.stringify({
                result,
                cvText,
                timestamp: new Date().toISOString()
            }));
        }

        try {
            const res = await fetch("/api/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceOverride: amount, successPath: successUrl }),
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Ocurrió un error al crear la sesión de pago: " + (data.error || "Intenta de nuevo."));
                setIsCheckoutLoading(false);
            }
        } catch (e) { 
            console.error(e);
            alert("Error de conexión. Por favor verifica tu internet.");
            setIsCheckoutLoading(false);
        }
    }

    // Reality Check Component
    const RealityCheck = ({ data }: { data: any }) => {
        if (!data) return null;
        const colors = {
            "Crítico": "bg-red-50 border-red-200 text-red-800 icon-red-500",
            "Desafiante": "bg-amber-50 border-amber-200 text-amber-800 icon-amber-500",
            "Estable": "bg-blue-50 border-blue-200 text-blue-800 icon-blue-500",
            "Ventaja": "bg-emerald-50 border-emerald-200 text-emerald-800 icon-emerald-500",
            "Oportunidad": "bg-purple-50 border-purple-200 text-purple-800 icon-purple-500"
        } as any;
        
        const config = colors[data.estatus] || colors["Estable"];

        return (
            <div className={`mt-6 rounded-2xl border-2 p-4 sm:p-6 ${config.split(' icon-')[0]} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/80 p-1.5 rounded-lg shadow-sm">
                        <Sparkles className={`w-4 h-4 ${config.split('icon-')[1].replace('icon-', 'text-')}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Reality Check | Análisis de Impacto</span>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border border-current opacity-80`}>
                        {data.estatus}
                    </span>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-tight opacity-60">¿Qué puedes esperar hoy?</p>
                        <p className="text-sm font-medium leading-relaxed italic">"{data.queEsperar}"</p>
                    </div>
                    <div className="space-y-1 sm:border-l sm:pl-4 border-current/10">
                        <p className="text-[11px] font-bold uppercase tracking-tight opacity-60 text-primary">Próximo paso concreto</p>
                        <p className="text-sm font-bold leading-relaxed">{data.queHacer}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center space-y-6">
                {!isLoading ? (
                    <>
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Análisis de Empleabilidad Canadiense</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                Antes de transformar tu CV, analizaremos tu perfil para el mercado canadiense: regulación profesional,
                                certificaciones, salarios, empresas que contratan y más.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        <Button size="lg" className="gap-2 py-5 px-8" onClick={handleAnalyze}>
                            <Shield className="w-5 h-5" />
                            Generar mi Reporte Gratis
                        </Button>
                    </>
                ) : (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <h3 className="text-xl font-bold text-foreground">Generando tu reporte...</h3>
                        </div>
                        
                        <div className="rounded-2xl overflow-hidden border border-border shadow-xl bg-muted/30">
                            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src="https://www.youtube.com/embed/VIDEO_ID_AQUI?autoplay=1&mute=0"
                                    title="Explicación del Sistema"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="p-4 bg-primary/5 text-center">
                                <p className="text-sm font-semibold text-primary">
                                    💡 Por favor mira este video mientras analizamos tu perfil (Toma ~60 segundos)
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header + Download buttons */}
            <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-foreground mb-1">📊 Reporte de Empleabilidad Canadiense</h3>
                <p className="text-sm text-muted-foreground">Análisis completo de tu perfil para el mercado laboral canadiense</p>
                <div className="flex flex-col items-center gap-3 mt-2">
                    <div className="flex justify-center gap-3">
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className={`gap-2 ${(!accessCode || accessCode === "LEAD_MAGNET") ? "opacity-70 cursor-not-allowed group relative" : ""}`} 
                            onClick={() => (accessCode && accessCode !== "LEAD_MAGNET") ? downloadFullReport() : null}
                        >
                            <Download className="w-4 h-4" />
                            Descargar Reporte PDF 
                            {(!accessCode || accessCode === "LEAD_MAGNET") && <span className="ml-1 text-[8px] bg-primary/10 text-primary px-1 rounded font-bold">PRO</span>}
                        </Button>
                        {result.empresasLMIA?.length > 0 && (
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className={`gap-2 ${(!accessCode || accessCode === "LEAD_MAGNET") ? "opacity-70 cursor-not-allowed group relative" : ""}`} 
                                onClick={() => (accessCode && accessCode !== "LEAD_MAGNET") ? downloadExcel() : null}
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Descargar Empresas Excel
                                {(!accessCode || accessCode === "LEAD_MAGNET") && <span className="ml-1 text-[8px] bg-primary/10 text-primary px-1 rounded font-bold">PRO</span>}
                            </Button>
                        )}
                    </div>
                    {(!accessCode || accessCode === "LEAD_MAGNET") && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Las descargas están disponibles en el <span className="text-primary font-semibold">Paquete Acelerador PRO</span> abajo.
                        </p>
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                    <strong>Nota:</strong> Esta información es referencial, basada en datos históricos y conocimiento del mercado canadiense.
                    Los precios de certificaciones pueden variar, algunas pueden no estar disponibles, y los rangos salariales
                    son estimaciones generales. Verifica siempre en los sitios web oficiales antes de tomar decisiones.
                </p>
            </div>

            {/* 1. PLAN DE ACCIÓN (CHECKLIST) */}
            {result.diagnostico?.length > 0 && (
                <section className="bg-muted/20 rounded-2xl border border-border p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-foreground flex items-center gap-2 text-lg">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            Tu Plan de Acción: Lo que te falta completar
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {result.diagnostico.length} Pasos Pendientes
                        </span>
                    </div>
                    <div className="grid gap-4">
                        {result.diagnostico.map((d: any, i: number) => (
                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-background border border-border group hover:border-primary/40 hover:shadow-md transition-all duration-300">
                                <div className="mt-1 flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                        <div className="w-3 h-3 rounded-full bg-primary/20 group-hover:bg-primary transition-all scale-75 group-hover:scale-100" />
                                    </div>
                                </div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{d.problema}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {d.porque}
                                    </p>
                                    <div className="pt-3 flex items-start gap-2 border-t border-border/50 mt-2">
                                        <div className="bg-primary/5 p-1 rounded-md">
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Recomendación Estratégica</p>
                                            <p className="text-sm text-foreground font-bold">{d.cambio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 2. REGULACIÓN POR PROVINCIA */}
            {result.regulacion && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        Regulación Profesional por Provincia
                    </h4>
                    <div className={`rounded-xl border p-5 ${result.regulacion.esRegulada ? "border-amber-300 bg-amber-50/50" : "border-green-300 bg-green-50/50"
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${result.regulacion.esRegulada ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                }`}>
                                {result.regulacion.esRegulada ? "⚠️ Profesión Regulada" : "✅ Profesión No Regulada"}
                            </span>
                            <span className="text-sm text-muted-foreground">— {result.regulacion.profesion}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{result.regulacion.detalle}</p>

                        {/* Reguladores por provincia */}
                        {result.regulacion.reguladoresPorProvincia?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-bold text-foreground mb-2">Entes reguladores por provincia:</p>
                                <div className="rounded-lg border border-border overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="text-left p-2 font-semibold text-foreground text-xs">Provincia</th>
                                                <th className="text-left p-2 font-semibold text-foreground text-xs">Ente Regulador</th>
                                                <th className="text-left p-2 font-semibold text-foreground text-xs">Web</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.regulacion.reguladoresPorProvincia.map((r: any, i: number) => (
                                                <tr key={i} className="border-t border-border/50">
                                                    <td className="p-2 text-xs font-medium text-foreground">{r.provincia}</td>
                                                    <td className="p-2 text-xs text-muted-foreground">{r.entidad}</td>
                                                    <td className="p-2">
                                                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1">
                                                            Visitar <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Fallback for old format */}
                        {!result.regulacion.reguladoresPorProvincia && result.regulacion.colegioRegulador && (
                            <p className="text-sm text-muted-foreground mt-2">
                                <strong>Regulador:</strong> {result.regulacion.colegioRegulador}
                                {result.regulacion.urlRegulador && (
                                    <a href={result.regulacion.urlRegulador} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline inline-flex items-center gap-1">
                                        Visitar sitio <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </p>
                        )}

                        {(result.regulacion.procesoGeneral || result.regulacion.procesoParaEjercer) && (
                            <p className="text-sm text-muted-foreground mt-2 border-t border-border/50 pt-2">
                                <strong>Proceso:</strong> {result.regulacion.procesoGeneral || result.regulacion.procesoParaEjercer}
                            </p>
                        )}

                        <RealityCheck data={result.regulacion.resumenImpacto} />
                    </div>
                </section>
            )}

            {/* 3.5. IDIOMAS Y ESTRATEGIA */}
            {result.idiomas && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Languages className="w-5 h-5 text-primary" />
                        Idiomas y Realidad del Mercado
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-border p-4 bg-white/50 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-sm">Inglés</h5>
                                {result.idiomas.diagnosticoRealidadIngles && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        result.idiomas.diagnosticoRealidadIngles === "Crítico" ? "bg-red-100 text-red-700 border border-red-200" :
                                        result.idiomas.diagnosticoRealidadIngles === "Desafiante" ? "bg-orange-100 text-orange-800 border border-orange-200" :
                                        result.idiomas.diagnosticoRealidadIngles === "Suficiente" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                        "bg-green-100 text-green-700 border border-green-200"
                                    }`}>
                                        {result.idiomas.diagnosticoRealidadIngles.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-[13px] text-foreground font-medium mb-3 leading-snug">
                                {result.idiomas.mensajeIngles || `Estimamos un nivel ${result.idiomas.nivelInglesTexto} según tu CV.`}
                            </p>

                            <div className="mt-auto pt-3 border-t border-border/50">
                                {result.idiomas.diagnosticoRealidadIngles === "Crítico" || result.idiomas.diagnosticoRealidadIngles === "Desafiante" || result.idiomas.necesitaMejorarIngles ? (
                                    <>
                                        <p className="text-[11px] font-bold mb-2 text-foreground">Recursos gratuitos para iniciar hoy:</p>
                                        <div className="flex flex-col gap-1.5">
                                            <a href="https://www.youtube.com/@engvidJames" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> engVid (YouTube - Nativo)</a>
                                            <a href="https://es.duolingo.com/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Duolingo</a>
                                            <a href="https://www.bbc.co.uk/learningenglish/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> BBC Learning English</a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-[11px] p-2 rounded-lg bg-green-50 text-green-700 font-medium">
                                        ✅ Tienes el nivel necesario para competir laboralmente. Si logras certificarlo con el examen IELTS o CELPIP, sumarás puntos vitales de inmigración.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border p-4 bg-white/50 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-sm">Francés</h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.idiomas.aplicaMovilidadFrancofona ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                                    {result.idiomas.nivelFrancesTexto || "Nulo / Básico"}
                                </span>
                            </div>

                            {result.idiomas.aplicaMovilidadFrancofona ? (
                                <>
                                    <p className="text-[13px] text-foreground font-medium mb-3 leading-snug">
                                        ¡Excelente! Con tu dominio del Francés desbloqueas la "Movilidad Francófona".
                                    </p>
                                    <div className="mt-auto pt-3 border-t border-border/50 space-y-2">
                                        <div className="text-[11px] p-2 rounded-lg bg-blue-50 text-blue-800 font-medium border border-blue-200">
                                            🚀 Cualquier empresa fuera de Quebec te puede contratar directamente <strong>SIN necesidad de tramitar un LMIA.</strong>
                                        </div>
                                        <p className="text-[11px] font-bold mb-1">Organismos de apoyo oficial:</p>
                                        <div className="flex flex-col gap-1">
                                            <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/francophone-mobility.html" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Portal Gobierno de Canadá (IRCC)</a>
                                            <a href="https://rdee.ca/fr/programmes/entree-express/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> RDÉE Canada (Red Nacional)</a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[13px] text-foreground mb-3 leading-snug">
                                        No dominas francés aún. Por ahora tu estrategia debe enfocarse 100% en provincias anglófonas.
                                    </p>
                                    <div className="mt-auto pt-3 border-t border-border/50">
                                        <div className="text-[11px] p-2 rounded-lg bg-slate-50 text-slate-700 font-medium mb-2 border border-slate-200">
                                            💡 Hablar algo de francés es el atajo migratorio más potente de la década.
                                        </div>
                                        <p className="text-[11px] font-bold mb-2">Aprende Francés Gratis:</p>
                                        <div className="flex flex-col gap-1.5">
                                            <a href="https://www.youtube.com/@learnfrenchwithalexa" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Learn French with Alexa (YouTube)</a>
                                            <a href="https://savoirs.rfi.fr/es/apprendre-enseigner" target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3"/> RFI Savoirs</a>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* 3. CERTIFICACIONES (max 5) */}
            {result.certificaciones?.lista?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-primary" />
                        Certificaciones Recomendadas
                    </h4>
                    <p className="text-[11px] text-muted-foreground mb-4">
                        <strong>¿Por qué en Canadá las certificaciones (Tickets) son importantes?</strong> En este país los "tickets" o certificaciones demuestran que conoces los estándares locales de seguridad o práctica. Hacerlos reduce drásticamente el riesgo para un empleador al considerar a alguien nuevo en el país, elevando tu perfil ante la competencia.
                    </p>
                    <div className="space-y-3">
                        {result.certificaciones.lista.slice(0, 5).map((c: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-semibold text-foreground text-sm">{c.nombre}</h5>
                                        {c.categoria && (
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${c.categoria === "Cultura y Seguridad Laboral"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-purple-100 text-purple-700"
                                                }`}>{c.categoria}</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${c.tipo === "Mandatoria" ? "bg-red-100 text-red-700"
                                        : c.tipo === "Altamente Recomendada" ? "bg-amber-100 text-amber-700"
                                            : "bg-blue-100 text-blue-700"
                                        }`}>{c.tipo}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                                    <div><strong>Organismo:</strong> {c.organismo}</div>
                                    <div><strong>Costo:</strong> {c.costoCAD}</div>
                                    <div><strong>Duración:</strong> {c.duracion}</div>
                                    <div>
                                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                            Ver sitio <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                                {c.nota && <p className="text-xs text-muted-foreground mt-2 italic">{c.nota}</p>}
                            </div>
                        ))}
                    </div>
                    <RealityCheck data={result.certificaciones.resumenImpacto} />
                </section>
            )}

            {/* 4. ROLES PUENTE */}
            {result.rolesPuente?.lista?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                        <Shuffle className="w-5 h-5 text-primary" />
                        Roles Puente (Bridge Roles)
                    </h4>
                    <p className="text-[11px] text-muted-foreground mb-4">
                        Estos son trabajos de entrada o de menor nivel directamente relacionados con tu industria. 
                        <strong> Son posiciones de menor riesgo para un empleador canadiense al momento de contratar talento foráneo. </strong> 
                        Aplicar a estos roles puente facilita conseguir patrocinios, obtener "experiencia canadiense" indispensable, y es el primer paso ideal para luego ascender a tu rol principal.
                    </p>
                    <div className="grid gap-3">
                        {result.rolesPuente.lista.map((r: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border p-4 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h5 className="font-semibold text-foreground text-sm">{r.titulo}</h5>
                                    <p className="text-xs text-muted-foreground">{r.tituloEspanol}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{r.porque}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-primary">{r.salarioPromedio}</p>
                                    <p className="text-[10px] text-muted-foreground">CAD/año</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <RealityCheck data={result.rolesPuente.resumenImpacto} />
                </section>
            )}

            {/* 5. DEMANDA POR PROVINCIA */}
            {result.demandaProvincia?.lista?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Demanda Geográfica
                    </h4>
                    <p className="text-[11px] text-muted-foreground mb-4">
                        Canadá es un país de regiones. La demanda de tu profesión varía significativamente entre provincias debido a sus industrias locales y programas de inmigración provinciales (PNP). 
                        <strong> Enfocarte en provincias con demanda "Muy Buena" o "Buena" </strong> aumenta tus posibilidades de recibir una oferta con soporte migratorio.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {result.demandaProvincia.lista.map((d: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm">{d.codigo}</span>
                                    <span className={`w-2 h-2 rounded-full ${d.demanda === "Muy Buena" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                        : d.demanda === "Buena" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                            : d.demanda === "Media" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                                : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                        }`} />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground truncate">{d.provincia}</p>
                                <p className="text-xs font-bold mt-1">{d.demanda}</p>
                            </div>
                        ))}
                    </div>
                    <RealityCheck data={result.demandaProvincia.resumenImpacto} />
                </section>
            )}

            {/* 6. SALARIOS */}
            {result.salarios && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                        <Banknote className="w-5 h-5 text-primary" />
                        Expectativa Salarial (CAD Anual)
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 rounded-xl bg-muted/30">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Entry Level</p>
                            <p className="text-sm font-bold">${result.salarios.entry}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <p className="text-[10px] font-bold text-primary uppercase">Mid Level</p>
                            <p className="text-sm font-bold">${result.salarios.mid}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-muted/30">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Senior</p>
                            <p className="text-sm font-bold">${result.salarios.senior}</p>
                        </div>
                    </div>
                    <p className="text-[11px] text-center text-muted-foreground">
                        El salario promedio nacional para esta posición es de <strong className="text-foreground">${result.salarios.promedioCanada} CAD</strong>.
                    </p>
                    <RealityCheck data={result.salarios.resumenImpacto} />
                </section>
            )}

            {/* 7. EMPRESAS LMIA */}
            {result.empresasLMIA?.lista?.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            Empresas con Historial de Patrocinio (LMIA)
                        </h4>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={downloadLMIAExcel}>
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Descargar Excel
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-4">
                        Estas empresas han tramitado procesos de patrocinio (LMIA) para perfiles similares al tuyo en el pasado. <strong> No garantizan una oferta hoy, </strong> pero son el mejor punto de partida para tu búsqueda activa.
                    </p>
                    <div className="grid gap-2">
                        {result.empresasLMIA.lista.slice(0, 10).map((e: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border group hover:border-primary/50 transition-colors">
                                <div>
                                    <h5 className="font-semibold text-sm">{e.nombre}</h5>
                                    <p className="text-[10px] text-muted-foreground">{e.industria} • {e.provincia}</p>
                                </div>
                                <a href={e.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                    <RealityCheck data={result.empresasLMIA.resumenImpacto} />
                </section>
            )}

            {/* 7. VEREDICTO FINAL (PERSUASIVO) */}
            {result.veredictoFinal && (
                <section className="mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative rounded-3xl overflow-hidden border-2 border-primary/20 bg-primary/5 p-8 md:p-12 text-center">
                        {/* Background visual element */}
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-24 h-24 text-primary" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                Veredicto del Estratega
                            </span>
                            
                            <h4 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                                Tu Proyección en el Mercado Real
                            </h4>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 max-w-2xl mx-auto">
                                <GaugeChart 
                                    score={
                                        result.veredictoFinal.demandaMercado === 'Alta' ? 95 : 
                                        result.veredictoFinal.demandaMercado === 'Media' ? 65 : 35
                                    } 
                                    label="Demanda del Mercado" 
                                />
                                
                                <GaugeChart 
                                    score={
                                        result.veredictoFinal.calificacionPerfil === 'Alta' ? 90 : 
                                        result.veredictoFinal.calificacionPerfil === 'Media' ? 60 : 30
                                    } 
                                    label="Calificación de Perfil"
                                />
                            </div>

                            {/* New Visual Summary: Strengths vs Improvements */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                                {result.veredictoFinal.puntosFuertes?.length > 0 && (
                                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-left">
                                        <h5 className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
                                            <CheckCircle className="w-4 h-4" />
                                            Puntos Fuertes
                                        </h5>
                                        <ul className="space-y-2">
                                            {result.veredictoFinal.puntosFuertes.map((p: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-emerald-800 leading-tight">
                                                    <span className="mt-1 text-emerald-500">•</span>
                                                    {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.veredictoFinal.oportunidadesMejora?.length > 0 && (
                                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 text-left">
                                        <h5 className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-3">
                                            <AlertTriangle className="w-4 h-4" />
                                            Oportunidades de Mejora
                                        </h5>
                                        <ul className="space-y-2">
                                            {result.veredictoFinal.oportunidadesMejora.map((o: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-amber-800 leading-tight">
                                                    <span className="mt-1 text-amber-500">•</span>
                                                    {o}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <p className="text-slate-600 text-center text-sm italic leading-relaxed mt-4 max-w-lg mx-auto">
                                "{result.veredictoFinal.conclusion}"
                            </p>

                            <div className="bg-white/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
                                <p className="text-sm md:text-base text-slate-800 font-bold mb-4">
                                    Este reporte es la hoja de ruta estratégica para tu futuro profesional en Canadá.
                                    <span className="text-primary block mt-1 underline decoration-primary/30 decoration-2 underline-offset-4 font-black">
                                        ¿Cómo resolvemos estos bloqueos?
                                    </span>
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                    {result.veredictoFinal.recomendacionPrincipal}
                                </p>
                                
                                {leadData?.budget === "50+" && result.veredictoFinal.nivelRiesgo !== "Crítico" && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-left animate-in zoom-in duration-300">
                                        <p className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" /> RECOMENDACIÓN PREMIUM:
                                        </p>
                                        <p className="text-[11px] text-amber-900 leading-snug">
                                            Dado que tienes un buen perfil base, te recomendamos nuestro <strong>Plan de Empleabilidad Personalizado</strong> para maximizar tu velocidad de colocación.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA to transform or Upsell */}
            <div className="text-center pt-8 border-t border-border/50">
                {(!accessCode || accessCode === "LEAD_MAGNET") ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#0f172a] text-white rounded-3xl p-1 overflow-hidden shadow-2xl relative">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                            
                            <div className="relative border border-white/10 rounded-[22px] p-6 sm:p-8 bg-[#0f172a]/80 backdrop-blur-xl">
                                <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
                                    Si este reporte inicial te ayudó...
                                </span>
                                <h4 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">¿Te imaginas lo que hará la herramienta completa?</h4>
                                <p className="text-slate-300 text-sm sm:text-base mb-6">
                                    Pasa de aplicar a ciegas y frustrarte, a aplicar con total seguridad. Nuestra herramienta corrige tus errores, adapta tu perfil a Canadá y te da todo para destacar y que te llamen.
                                </p>
                                
                                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 text-left">
                                    <p className="font-bold text-white mb-3 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-emerald-400" /> Lo que consigues y cómo te ayuda:
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">Vence al robot de RRHH (ATS) y traducciones</p>
                                                <p className="text-xs text-slate-300">Garantiza que tu CV sea leído convirtiéndolo al <strong>formato estándar ATS canadiense</strong>, traducido al inglés o francés perfecto.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">Aplica a ciegas nunca más (Match %)</p>
                                                <p className="text-xs text-slate-300">Sube una vacante real y te diremos exactamente tu <strong>% de compatibilidad</strong> y qué palabras clave te faltan antes de enviar.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">Elimina el estrés de las entrevistas</p>
                                                <p className="text-xs text-slate-300">Te damos un <strong>pronóstico de las preguntas</strong> técnicas y conductuales que te harán para esa vacante. Ve seguro y preparado de antemano.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">Comunícate como local sin miedo al inglés</p>
                                                <p className="text-xs text-slate-300">Obtén <strong>plantillas y guiones para llamar o enviar emails</strong>, con guía de fonética (cómo se pronuncia) para sonar impecable.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">Saber a quién pedir trabajo (+LMIA)</p>
                                                <p className="text-xs text-slate-300">Descarga tu <strong>lista en Excel de empresas</strong> que ya tienen historial validando LMIAs (si aplica a tu rol). No pierdas tiempo con quien no patrocina.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5">Destaca tu propuesta de valor al instante</p>
                                                <p className="text-xs text-slate-300">Creamos tu <strong>Cover Letter a medida</strong>, algo obligatorio en Canadá para causar una gran primera impresión.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                
                                <Button 
                                    size="lg" 
                                    disabled={isCheckoutLoading}
                                    className="w-full relative group overflow-hidden py-7 text-base sm:text-lg font-bold shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 transition-all duration-300 hover:scale-[1.02]" 
                                    onClick={() => {
                                        // If budget is high, we might want to offer the Elite plan or show the store
                                        if (leadData?.budget === "50+") {
                                            // Trigger store action or specific link
                                            window.open("https://buy.stripe.com/8x2cN57a22wo463fXe3gk06", "_blank")
                                        } else {
                                            window.open("https://buy.stripe.com/8x2cN57a22wo463fXe3gk06", "_blank")
                                        }
                                    }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                                    
                                    {isCheckoutLoading ? (
                                        <Loader2 className="w-5 h-5 mr-2 sm:mr-3 animate-spin" />
                                    ) : (
                                        <Lock className="w-5 h-5 mr-2 sm:mr-3" />
                                    )}
                                    <span className="flex items-center gap-1.5 sm:gap-2">
                                        {isCheckoutLoading ? "Cargando Pago..." : "Desbloquear Herramienta CV"}
                                        <span className="bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-md flex items-center text-xs sm:text-sm ml-1 sm:ml-2">
                                            <s className="text-white/60 font-normal mr-1.5 sm:mr-2">$51</s> $29 USD
                                        </span>
                                    </span>
                                </Button>
                                <p className="text-center text-xs text-slate-400 mt-4">Pagas hoy y tienes acceso ilimitado. Pago 100% seguro por Stripe.</p>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-8 text-left space-y-4">
                            <h5 className="text-foreground font-bold text-center text-xl mb-4">Preguntas Frecuentes</h5>
                            
                            <details className="group border border-border rounded-xl bg-white shadow-sm hover:border-primary/50 transition-colors">
                                <summary className="cursor-pointer font-semibold p-4 text-sm marker:content-none flex justify-between items-center text-foreground">
                                    ¿Por qué mi CV actual es rechazado automáticamente en Canadá? (Filtro ATS)
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                    En Canadá, el 90% de las empresas medianas y grandes usan "ATS" (Applicant Tracking Systems), robots que filtran tu CV antes de que un humano lo vea. Si tu CV tiene columnas, fotos, gráficos o no incluye las palabras clave exactas de la vacante, <strong>el robot asume que no estás calificado y te descarta instantáneamente.</strong> Nuestra herramienta transforma tu CV al formato de texto plano y cronológico inverso que estos robots aprueban de inmediato.
                                </div>
                            </details>

                            <details className="group border border-border rounded-xl bg-white shadow-sm hover:border-primary/50 transition-colors">
                                <summary className="cursor-pointer font-semibold p-4 text-sm marker:content-none flex justify-between items-center text-foreground">
                                    ¿Cómo funciona el "Match" de Vacantes y la Predicción de Entrevistas?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                    Una vez desbloqueas la herramienta, podrás pegar una vacante real que te interese. Nuestro motor de IA comparará la vacante contra tu perfil, te dará un porcentaje de compatibilidad y te indicará <strong>qué palabras clave exactas te faltan</strong>. Además, usando los requisitos del puesto, te entregará una lista de las preguntas técnicas y situacionales (estilo STAR canadiense) que más probablemente te harán en la entrevista, para que vayas con cero estrés.
                                </div>
                            </details>

                            <details className="group border border-border rounded-xl bg-white shadow-sm hover:border-primary/50 transition-colors">
                                <summary className="cursor-pointer font-semibold p-4 text-sm marker:content-none flex justify-between items-center text-foreground">
                                    Mi nivel de inglés/francés no es perfecto, ¿los guiones realmente ayudan?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                    Totalmente. Sabemos que enviar un email o llamar impresiona cuando no dominas el idioma. Por eso, te entregamos plantillas creadas con el tono formal y educado ("polite") que esperan en Canadá. Y para las llamadas, te escribimos guiones con su <strong>pronunciación "fonética"</strong>. Solo tienes que leerlo tal como está escrito para sonar seguro y profesional al teléfono.
                                </div>
                            </details>

                            <details className="group border border-border rounded-xl bg-white shadow-sm hover:border-primary/50 transition-colors">
                                <summary className="cursor-pointer font-semibold p-4 text-sm marker:content-none flex justify-between items-center text-foreground">
                                    ¿Esto garantiza que conseguiré una oferta de trabajo o sponsor LMIA?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                    Ninguna herramienta seria puede garantizarte un trabajo. Lo que sí garantizamos es <strong>elevar drásticamente tus oportunidades</strong> presentándote como un profesional local. Para maximizar tus opciones de patrocinio, el reporte incluye una base de datos (Excel) actualizada con aquellas empresas que ya han sido aprobadas por el gobierno canadiense para contratar extranjeros en tu rol, para que enfoques tu energía solo donde hay posibilidades reales.
                                </div>
                            </details>

                            <details className="group border border-border rounded-xl bg-white shadow-sm hover:border-primary/50 transition-colors">
                                <summary className="cursor-pointer font-semibold p-4 text-sm marker:content-none flex justify-between items-center text-foreground">
                                    ¿Tengo un solo uso o puedo adaptar mi perfil para diferentes puestos?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                    No es un solo uso. Tu pago único incluye créditos suficientes para crear <strong>hasta 10 perfiles de CV distintos y realizar 40 acciones</strong> impulsadas por IA (como generar <em>Cover Letters</em>, medir el Match o preparar entrevistas). Y lo mejor: una vez creados tus documentos, <strong>se quedan guardados en tu cuenta para siempre.</strong> Si se te acaban los créditos, igual podrás seguir descargando y re-editando manualmente todo lo que ya generaste.
                                </div>
                            </details>
                        </div>

                        <button onClick={onAnalysisComplete} className="mt-8 text-xs text-muted-foreground hover:text-foreground underline transition-colors block w-full text-center">
                            Ya tengo un código de acceso o quiero saltar este paso
                        </button>
                    </div>
                ) : (
                    <Button size="lg" className="gap-2 py-6 px-10 text-lg font-bold shadow-lg" onClick={onAnalysisComplete}>
                        Continuar → Editor ATS 🚀
                    </Button>
                )}
            </div>
        </div>
    )
}

// Helper: Generate printable HTML for PDF export
function generateReportHTML(result: any): string {
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte de Empleabilidad Canadiense</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; font-size: 13px; }
        h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; }
        h2 { color: #1e40af; margin-top: 24px; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 12px; }
        th, td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; }
        .alta { background: #dcfce7; color: #166534; } .media { background: #fef3c7; color: #92400e; } .baja { background: #fee2e2; color: #991b1b; }
        .disclaimer { background: #fffbeb; border: 1px solid #fcd34d; padding: 10px; border-radius: 8px; margin: 12px 0; font-size: 12px; }
        .lmia-disclaimer { background: #eff6ff; border: 1px solid #93c5fd; padding: 10px; border-radius: 8px; margin: 12px 0; font-size: 12px; }
        @media print { body { font-size: 11px; } h1 { font-size: 18px; } h2 { font-size: 14px; } }
    </style></head><body>`

    html += `<h1>📊 Reporte de Empleabilidad Canadiense</h1>`
    html += `<p style="color:#666;font-size:11px;">Generado el ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</p>`
    html += `<div class="disclaimer"><strong>Nota:</strong> Esta información es referencial. Los precios, disponibilidad y rangos salariales pueden variar. Verifica siempre en los sitios web oficiales.</div>`
    
    // Veredicto Final at the beginning of PDF for impact
    if (result.veredictoFinal) {
        html += `<div style="background:#f8fafc; border: 2px solid #3b82f6; padding: 15px; border-radius: 12px; margin: 20px 0;">`
        html += `<h2 style="margin-top:0; color:#1e40af;">🛡️ Veredicto del Estratega: Proyección de Mercado</h2>`
        html += `<p style="font-size:14px;"><strong>Riesgo Detectado: <span style="color:${result.veredictoFinal.nivelRiesgo === 'Crítico' || result.veredictoFinal.nivelRiesgo === 'Alto' ? '#ef4444' : '#f59e0b'}">${result.veredictoFinal.nivelRiesgo}</span></strong></p>`
        html += `<p><em>"${result.veredictoFinal.conclusion}"</em></p>`
        html += `<p style="background:#fff; padding:10px; border-radius:8px; border-left:4px solid #3b82f6;"><strong>Recomendación:</strong> ${result.veredictoFinal.recomendacionPrincipal}</p>`
        html += `</div>`
    }

    // Diagnóstico
    if (result.diagnostico?.length) {
        html += `<h2>❌ Diagnóstico del CV Actual</h2><table><tr><th>Problema</th><th>¿Por qué?</th><th>Cambio</th></tr>`
        result.diagnostico.forEach((d: any) => { html += `<tr><td>${d.problema}</td><td>${d.porque}</td><td>${d.cambio}</td></tr>` })
        html += `</table>`
    }

    // Regulación
    if (result.regulacion) {
        html += `<h2>🛡️ Regulación Profesional — ${result.regulacion.profesion}</h2>`
        html += `<p><strong>${result.regulacion.esRegulada ? "⚠️ Profesión Regulada" : "✅ Profesión No Regulada"}</strong></p>`
        html += `<p>${result.regulacion.detalle}</p>`
        if (result.regulacion.reguladoresPorProvincia?.length) {
            html += `<table><tr><th>Provincia</th><th>Ente Regulador</th><th>Sitio Web</th></tr>`
            result.regulacion.reguladoresPorProvincia.forEach((r: any) => {
                html += `<tr><td>${r.provincia}</td><td>${r.entidad}</td><td><a href="${r.url}">${r.url}</a></td></tr>`
            })
            html += `</table>`
        }
        if (result.regulacion.procesoGeneral) html += `<p><strong>Proceso:</strong> ${result.regulacion.procesoGeneral}</p>`
    }
    
    // Idiomas
    if (result.idiomas?.lista) {
        html += `<h2>🗣️ Requisitos de Idioma</h2><table><tr><th>Idioma</th><th>Nivel Requerido</th><th>Nota</th></tr>`
        result.idiomas.lista.forEach((l: any) => {
            html += `<tr><td>${l.idioma}</td><td>${l.nivel}</td><td>${l.nota}</td></tr>`
        })
        html += `</table>`
    }

    // Certificaciones
    if (result.certificaciones?.lista) {
        html += `<h2>🏆 Certificaciones Recomendadas</h2><table><tr><th>Certificación</th><th>Organismo</th><th>Costo</th><th>Duración</th><th>Tipo</th></tr>`
        result.certificaciones.lista.slice(0, 5).forEach((c: any) => {
            html += `<tr><td><a href="${c.url}">${c.nombre}</a></td><td>${c.organismo}</td><td>${c.costoCAD}</td><td>${c.duracion}</td><td>${c.tipo}</td></tr>`
        })
        html += `</table>`
    }

    // Roles puente
    if (result.rolesPuente?.lista) {
        html += `<h2>🔀 Roles Puente</h2><table><tr><th>Rol (EN)</th><th>Rol (ES)</th><th>Salario</th><th>¿Por qué?</th></tr>`
        result.rolesPuente.lista.forEach((r: any) => { html += `<tr><td>${r.titulo}</td><td>${r.tituloEspanol}</td><td>${r.salarioPromedio}</td><td>${r.porque}</td></tr>` })
        html += `</table>`
    }

    // Demanda
    if (result.demandaProvincia?.lista) {
        html += `<h2>📍 Demanda Geográfica</h2><table><tr><th>Provincia</th><th>Demanda</th><th>Nota</th></tr>`
        result.demandaProvincia.lista.forEach((p: any) => {
            const cls = p.demanda === "Muy Buena" || p.demanda === "Buena" ? "alta" : p.demanda === "Media" ? "media" : "baja"
            html += `<tr><td>${p.provincia}</td><td><span class="badge ${cls}">${p.demanda}</span></td><td>${p.nota}</td></tr>`
        })
        html += `</table>`
    }

    // Salarios
    if (result.salarios) {
        html += `<h2>💰 Expectativa Salarial (CAD Anual)</h2><table><tr><th>Entry Level</th><th>Mid Level</th><th>Senior</th></tr>`
        html += `<tr><td>${result.salarios.entry}</td><td>${result.salarios.mid}</td><td>${result.salarios.senior}</td></tr></table>`
        if (result.salarios.promedioCanada) html += `<p style="font-size:11px;color:#666;">Promedio canadiense: ${result.salarios.promedioCanada}</p>`
    }

    // LMIA
    if (result.empresasLMIA?.lista) {
        html += `<h2>🏢 Empresas con Historial de Patrocinio (LMIA)</h2>`
        html += `<div class="lmia-disclaimer"><strong>Importante:</strong> Estas empresas han gestionado LMIA para contratar trabajadores extranjeros en años recientes.</div>`
        
        if (result.empresasLMIA.lista.length > 0) {
            html += `<table><tr><th>#</th><th>Empresa</th><th>Provincia</th><th>Industria</th><th>Web</th></tr>`
            result.empresasLMIA.lista.forEach((e: any, i: number) => {
                html += `<tr><td>${i + 1}</td><td>${e.nombre}</td><td>${e.provincia}</td><td>${e.industria}</td><td><a href="${e.website}">${e.website}</a></td></tr>`
            })
            html += `</table>`
        }
    }

    html += `<hr><p style="font-size:10px;color:#999;margin-top:20px;">© ${new Date().getFullYear()} Empleabilidad Canadá. Reporte generado automáticamente. Para soporte: canadacon40@gmail.com</p>`
    html += `</body></html>`
    return html
}
