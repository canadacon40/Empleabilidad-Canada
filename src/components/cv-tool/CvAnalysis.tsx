"use client"

import { useState, useEffect } from "react"
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
    const [result, setResult] = useState<any>(leadData || null)
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

    const handleAnalyze = async () => {
        if (isLoading) return
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
    useEffect(() => {
        const isResultValid = result?.veredictoFinal || result?.diagnostico?.length > 0;
        if (!isResultValid && cvText && !isLoading && !error) {
            handleAnalyze();
        }
    }, [cvText]);

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
                leadId,
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
                        <p className="text-sm font-medium leading-relaxed italic">"{data.mensaje || data.queEsperar}"</p>
                    </div>
                    <div className="space-y-1 sm:border-l sm:pl-4 border-current/10">
                        <p className="text-[11px] font-bold uppercase tracking-tight opacity-60 text-primary">Próximo paso concreto</p>
                        <p className="text-sm font-bold leading-relaxed">Sigue las recomendaciones del plan de acción arriba.</p>
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
                                    src="https://www.youtube.com/embed/S7_qO8Ufcl8?autoplay=1&mute=0"
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

    // Defensive check: if result is empty or missing key parts, show try again
    const isResultValid = result.veredictoFinal || result.diagnostico?.length > 0;
    if (!isResultValid && !isLoading) {
        return (
            <div className="text-center p-12 bg-amber-50 rounded-3xl border border-amber-200">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-900">Análisis Incompleto</h3>
                <p className="text-amber-700 text-sm mb-6">Pierre no pudo completar el análisis detallado. Esto ocurre a veces si el CV es ilegible o muy corto.</p>
                <Button onClick={handleAnalyze} variant="outline" className="border-amber-400 text-amber-800 hover:bg-amber-100">
                    <Shuffle className="w-4 h-4 mr-2" /> Re-intentar Análisis Detallado
                </Button>
            </div>
        )
    }

    const isPremium = accessCode === "PREMIUM";

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
                            className={`gap-2 ${!isPremium ? "opacity-70 cursor-not-allowed group relative" : ""}`} 
                            onClick={() => isPremium ? downloadFullReport() : null}
                        >
                            <Download className="w-4 h-4" />
                            Descargar Reporte PDF 
                            {!isPremium && <span className="ml-1 text-[8px] bg-primary/10 text-primary px-1 rounded font-bold">PRO</span>}
                        </Button>
                        {result.empresasLMIA?.lista?.length > 0 && (
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className={`gap-2 ${!isPremium ? "opacity-70 cursor-not-allowed group relative" : ""}`} 
                                onClick={() => isPremium ? downloadExcel() : null}
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Descargar Empresas Excel
                                {!isPremium && <span className="ml-1 text-[8px] bg-primary/10 text-primary px-1 rounded font-bold">PRO</span>}
                            </Button>
                        )}
                    </div>
                    {!isPremium && (
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
                            Tu Plan de Acción: Pasos Pendientes
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {result.diagnostico.length} Pasos
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
                        Regulación Profesional: {result.regulacion.profesion}
                        {result.regulacion.nocHabitual && (
                            <span className="ml-2 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-black tracking-widest">
                                NOC {result.regulacion.nocHabitual}
                            </span>
                        )}
                    </h4>
                    <div className={`rounded-2xl border-2 p-5 sm:p-8 ${result.regulacion.esRegulada ? "border-amber-200 bg-amber-50/30" : "border-emerald-200 bg-emerald-50/30"
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${result.regulacion.esRegulada ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                }`}>
                                {result.regulacion.esRegulada ? "⚠️ Profesión Regulada" : "✅ Profesión No Regulada"}
                            </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mb-4">{result.regulacion.detalle}</p>

                        {result.regulacion.reguladoresPorProvincia?.length > 0 && (
                            <div className="rounded-lg border border-border overflow-hidden mb-4">
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
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {result.regulacion.procesoGeneral && (
                            <p className="text-sm text-muted-foreground mt-2 border-t border-border/50 pt-2 italic">
                                <strong>Proceso:</strong> {result.regulacion.procesoGeneral}
                            </p>
                        )}

                        <RealityCheck data={result.regulacion.resumenImpacto} />
                    </div>
                </section>
            )}

            {/* 3. IDIOMAS */}
            {result.idiomas && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Languages className="w-5 h-5 text-primary" />
                        Dominio de Idiomas
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-border p-4 bg-white/50 flex flex-col h-full shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-sm">Inglés</h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary`}>
                                    {result.idiomas.nivelInglesTexto?.toUpperCase() || "ANALIZANDO"}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                {result.idiomas.mensajeIngles}
                            </p>
                            <div className="mt-auto pt-3 border-t border-border/50">
                                <p className="text-[10px] font-bold text-foreground/60 uppercase mb-2">Realidad del Mercado:</p>
                                <span className="text-xs font-bold text-foreground">{result.idiomas.diagnosticoRealidadIngles}</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border p-4 bg-white/50 flex flex-col h-full shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-sm">Francés</h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.idiomas.aplicaMovilidadFrancofona ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                                    {result.idiomas.nivelFrancesTexto?.toUpperCase() || "BÁSICO/NULO"}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {result.idiomas.aplicaMovilidadFrancofona 
                                    ? "¡Excelente! Aplicas a Movilidad Francófona (Exención de LMIA en muchas provincias)." 
                                    : "No parece ser un factor determinante en tu perfil actual."}
                            </p>
                            {result.idiomas.aplicaMovilidadFrancofona && (
                                <div className="mt-auto pt-3 border-t border-border/50">
                                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">🚀 VENTAJA MIGRATORIA ALTA</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* 4. CERTIFICACIONES */}
            {result.certificaciones?.lista?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-primary" />
                        Certificaciones Estratégicas
                    </h4>
                    <div className="space-y-3">
                        {result.certificaciones.lista.slice(0, 3).map((c: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border p-4 hover:shadow-sm transition-shadow bg-white/40">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h5 className="font-bold text-foreground text-sm">{c.nombre}</h5>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{c.tipo}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-2 text-[11px] text-muted-foreground">
                                    <div><strong>Entidad:</strong> {c.organismo}</div>
                                    <div><strong>Inversión:</strong> {c.costoCAD}</div>
                                </div>
                                {c.url && (
                                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-3 text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold">
                                        Ver Certificación <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                    <RealityCheck data={result.certificaciones.resumenImpacto} />
                </section>
            )}

            {/* 4.5. ROLES PUENTE (BRIDGE ROLES) */}
            {result.rolesPuente?.lista?.length > 0 && (
                <section className="mt-8">
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Shuffle className="w-5 h-5 text-primary" />
                        Roles Puente: Alternativas de Entrada Rápida
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {result.rolesPuente.lista.map((r: any, i: number) => (
                            <div key={i} className="rounded-2xl border border-primary/20 p-5 bg-primary/5 flex flex-col hover:border-primary/40 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h5 className="font-black text-sm text-primary">{r.titulo}</h5>
                                    <div className="bg-white px-2 py-1 rounded-lg shadow-sm border border-primary/10">
                                        <p className="text-[9px] font-bold text-primary uppercase">Salario Est.</p>
                                        <p className="text-xs font-black text-slate-900">{r.salarioPromedio}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
                                    "{r.porque}"
                                </p>
                                <div className="mt-auto pt-3 border-t border-primary/10 flex items-center gap-2">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <p className="text-[10px] font-bold text-emerald-700">Oportunidad de contratación inmediata</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4.7. EMPRESAS CON HISTORIAL LMIA */}
            {result.empresasLMIA?.lista?.length > 0 && (
                <section className="mt-8 bg-slate-50 rounded-3xl p-6 border border-slate-200">
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-primary" />
                        Directorio de Empresas con Historial de Patrocinio (LMIA)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">
                        Estas empresas han contratado talento internacional en roles similares en los últimos 24 meses. Contáctalas directamente como parte de tu estrategia.
                    </p>
                    <div className="grid gap-2">
                        {result.empresasLMIA.lista.map((e: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-primary/30 group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Building2 className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{e.nombre}</p>
                                        <p className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                                            <MapPin className="w-2 h-2" /> {e.provincia} • {e.industria}
                                        </p>
                                    </div>
                                </div>
                                <a href={e.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-primary/10 text-slate-400 hover:text-primary transition-all">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                    <RealityCheck data={result.empresasLMIA.resumenImpacto} />
                </section>
            )}

            {/* 5. SALARIOS */}
            {result.salarios && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Banknote className="w-5 h-5 text-primary" />
                        Expectativa Salarial Anual (CAD)
                    </h4>
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Entry</p>
                            <p className="text-sm font-bold text-slate-700">{result.salarios.entry}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 ring-1 ring-primary/20">
                            <p className="text-[9px] font-bold text-primary uppercase">Promedio</p>
                            <p className="text-sm font-black text-primary">{result.salarios.mid}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Senior</p>
                            <p className="text-sm font-bold text-slate-700">{result.salarios.senior}</p>
                        </div>
                    </div>
                    <RealityCheck data={result.salarios.resumenImpacto} />
                </section>
            )}

            {/* 6. VEREDICTO FINAL */}
            {result.veredictoFinal && (
                <section className="mt-12 bg-slate-900 text-white rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                    
                    <div className="relative z-10 text-center space-y-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-[10px] font-black uppercase tracking-widest border border-primary/30">
                            Veredicto Estratégico Final
                        </span>
                        
                        <h4 className="text-2xl sm:text-3xl font-black tracking-tight">{result.veredictoFinal.conclusion}</h4>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <h5 className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                                    <CheckCircle className="w-4 h-4" /> Puntos Fuertes
                                </h5>
                                <ul className="space-y-2">
                                    {result.veredictoFinal.puntosFuertes?.map((p: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-300 leading-snug flex items-start gap-2">
                                            <span className="text-emerald-500">•</span> {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <h5 className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                                    <AlertTriangle className="w-4 h-4" /> A mejorar
                                </h5>
                                <ul className="space-y-2">
                                    {result.veredictoFinal.oportunidadesMejora?.map((o: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-300 leading-snug flex items-start gap-2">
                                            <span className="text-amber-500">•</span> {o}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 max-w-lg mx-auto">
                            <p className="text-sm font-bold text-primary mb-2">Recomendación Maestra:</p>
                            <p className="text-sm text-slate-300 leading-relaxed italic">"{result.veredictoFinal.recomendacionPrincipal}"</p>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA SECTIONS */}
            <div className="text-center pt-8">
                {!isPremium ? (
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                         <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h4 className="text-2xl sm:text-3xl font-black">¿Listo para transformar tu CV a estándares canadienses?</h4>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                El reporte gratuito es solo el diagnóstico. El <strong>Paquete Acelerador PRO</strong> es el tratamiento: optimizamos tu CV para ATS, generamos tu Cover Letter, buscamos empresas con LMIA y te preparamos para la entrevista.
                            </p>
                            
                            <Button 
                                size="lg" 
                                className="w-full sm:w-auto py-7 px-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl hover:scale-105 transition-all"
                                onClick={() => handleCheckout(2900, "/cv-tool")}
                                disabled={isCheckoutLoading}
                            >
                                {isCheckoutLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Rocket className="w-5 h-5 mr-2" />}
                                Desbloquear Todo por $29 USD
                            </Button>
                            
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Pago único • Acceso inmediato • 100% Seguro</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-8 sm:p-12 text-center space-y-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Rocket className="w-8 h-8 text-primary animate-bounce shadow-sm shadow-primary/20" />
                        </div>
                        <h4 className="text-2xl font-black text-foreground">¡Acceso Premium Activado! 🚀</h4>
                        <p className="text-muted-foreground text-base max-w-lg mx-auto">
                            Ahora puedes proceder a optimizar tu CV para vacantes reales, generar tu carta de presentación y acceder a los guiones de entrevista.
                        </p>
                        <Button size="lg" className="py-7 px-16 text-xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto" onClick={onAnalysisComplete}>
                            Ir al Editor ATS <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
