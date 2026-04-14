"use client"

import { useState } from "react"
import {
    AlertTriangle, CheckCircle, XCircle, Shield, Award, Shuffle, MapPin, DollarSign, Building2, Loader2, ExternalLink, Info, Download, FileSpreadsheet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import CanadaMap from "./CanadaMap"

interface CvAnalysisProps {
    cvText: string
    onAnalysisComplete: () => void
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CvAnalysis({ cvText, onAnalysisComplete }: CvAnalysisProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = async () => {
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/cv-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error); return }
            setResult(data.result)
        } catch { setError("Error de conexiÃ³n. Intenta de nuevo.") }
        finally { setIsLoading(false) }
    }

    const downloadLMIAExcel = () => {
        if (!result?.empresasLMIA?.length) return
        import("xlsx").then((XLSX) => {
            const data = result.empresasLMIA.map((e: any, i: number) => ({
                "#": i + 1,
                "Empresa": e.nombre,
                "Provincia": e.provincia,
                "Industria": e.industria,
                "Sitio Web": e.website,
            }))
            const ws = XLSX.utils.json_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Empresas LMIA")
            // Set column widths
            ws["!cols"] = [{ wch: 4 }, { wch: 35 }, { wch: 15 }, { wch: 25 }, { wch: 40 }]
            XLSX.writeFile(wb, "Empresas_LMIA_Canada.xlsx")
        })
    }

    const downloadFullReportPDF = () => {
        // Generate a printable HTML and trigger print/save as PDF
        try {
            const printContent = generateReportHTML(result)
            const printWindow = window.open("", "_blank")
            if (printWindow) {
                printWindow.document.write(printContent)
                printWindow.document.close()
                // Wait for content to load before printing
                setTimeout(() => {
                    printWindow.print()
                }, 500)
            } else {
                alert("La ventana emergente fue bloqueada por tu navegador. Por favor permite las ventanas emergentes para descargar el reporte.")
            }
        } catch (e) {
            console.error("PDF download error:", e)
            alert("No se pudo generar el PDF. Por favor intenta de nuevo.")
        }
    }

    if (!result) {
        return (
            <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">AnÃ¡lisis de Empleabilidad Canadiense</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Antes de transformar tu CV, analizaremos tu perfil para el mercado canadiense: regulaciÃ³n profesional,
                        certificaciones, salarios, empresas que contratan y mÃ¡s.
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <Button size="lg" className="gap-2 py-5 px-8" onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analizando tu perfil... (30-60 seg)
                        </>
                    ) : (
                        <>
                            <Shield className="w-5 h-5" />
                            Analizar mi perfil
                        </>
                    )}
                </Button>

                <button onClick={onAnalysisComplete} className="text-sm text-muted-foreground hover:text-foreground underline block mx-auto">
                    Saltar anÃ¡lisis e ir directo a transformar
                </button>
            </div>
        )
    }

    // RESULTS VIEW
    return (
        <div className="space-y-8">
            {/* Header + Download buttons */}
            <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-foreground mb-1">ðŸ“Š Reporte de Empleabilidad Canadiense</h3>
                <p className="text-sm text-muted-foreground">AnÃ¡lisis completo de tu perfil para el mercado laboral canadiense</p>
                <div className="flex justify-center gap-3 mt-2">
                    <Button size="sm" variant="outline" className="gap-2" onClick={downloadFullReportPDF}>
                        <Download className="w-4 h-4" />
                        Descargar Reporte PDF
                    </Button>
                    {result.empresasLMIA?.length > 0 && (
                        <Button size="sm" variant="outline" className="gap-2" onClick={downloadLMIAExcel}>
                            <FileSpreadsheet className="w-4 h-4" />
                            Descargar Empresas Excel
                        </Button>
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                    <strong>Nota:</strong> Esta informaciÃ³n es referencial, basada en datos histÃ³ricos y conocimiento del mercado canadiense.
                    Los precios de certificaciones pueden variar, algunas pueden no estar disponibles, y los rangos salariales
                    son estimaciones generales. Verifica siempre en los sitios web oficiales antes de tomar decisiones.
                </p>
            </div>

            {/* 1. DIAGNÃ“STICO */}
            {result.diagnostico?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-destructive" />
                        DiagnÃ³stico de tu CV actual
                    </h4>
                    <div className="space-y-3">
                        {result.diagnostico.map((d: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border p-4 space-y-2">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-semibold text-foreground">{d.problema}</p>
                                </div>
                                <p className="text-sm text-muted-foreground pl-6">
                                    <strong>Â¿Por quÃ©?</strong> {d.porque}
                                </p>
                                <div className="flex items-start gap-2 pl-6">
                                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-primary font-medium">{d.cambio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 2. REGULACIÃ“N POR PROVINCIA */}
            {result.regulacion && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        RegulaciÃ³n Profesional por Provincia
                    </h4>
                    <div className={`rounded-xl border p-5 ${result.regulacion.esRegulada ? "border-amber-300 bg-amber-50/50" : "border-green-300 bg-green-50/50"
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${result.regulacion.esRegulada ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                }`}>
                                {result.regulacion.esRegulada ? "âš ï¸ ProfesiÃ³n Regulada" : "âœ… ProfesiÃ³n No Regulada"}
                            </span>
                            <span className="text-sm text-muted-foreground">â€” {result.regulacion.profesion}</span>
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
                            <p className="text-sm text-muted-foreground mt-2">
                                <strong>Proceso:</strong> {result.regulacion.procesoGeneral || result.regulacion.procesoParaEjercer}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* 3. CERTIFICACIONES (max 5) */}
            {result.certificaciones?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-primary" />
                        Certificaciones Recomendadas
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">MÃ¡ximo 5 certificaciones: relevantes al puesto + cultura y seguridad laboral canadiense</p>
                    <div className="space-y-3">
                        {result.certificaciones.slice(0, 5).map((c: any, i: number) => (
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
                                    <div><strong>DuraciÃ³n:</strong> {c.duracion}</div>
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
                </section>
            )}

            {/* 4. ROLES PUENTE */}
            {result.rolesPuente?.length > 0 && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Shuffle className="w-5 h-5 text-primary" />
                        Roles Puente (Bridge Roles)
                    </h4>
                    <div className="grid gap-3">
                        {result.rolesPuente.map((r: any, i: number) => (
                            <div key={i} className="rounded-xl border border-border p-4 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h5 className="font-semibold text-foreground text-sm">{r.titulo}</h5>
                                    <p className="text-xs text-muted-foreground">{r.tituloEspanol}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{r.porque}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-primary">{r.salarioPromedio}</p>
                                    <p className="text-[10px] text-muted-foreground">CAD/aÃ±o</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 5. DEMANDA POR PROVINCIA (MAPA INTERACTIVO) */}
            {result.demandaProvincia?.length > 0 && (
                <section className="mb-8">
                    <CanadaMap demandaProvincia={result.demandaProvincia} />
                </section>
            )}

            {/* 6. SALARIOS */}
            {result.salarios && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Rangos Salariales en CanadÃ¡
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Entry Level</p>
                            <p className="text-sm font-bold text-foreground">{result.salarios.entry}</p>
                        </div>
                        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                            <p className="text-xs text-primary mb-1">Mid Level</p>
                            <p className="text-sm font-bold text-primary">{result.salarios.mid}</p>
                        </div>
                        <div className="rounded-xl border border-border p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Senior</p>
                            <p className="text-sm font-bold text-foreground">{result.salarios.senior}</p>
                        </div>
                    </div>
                    {result.salarios.promedioCanada && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Promedio general canadiense: {result.salarios.promedioCanada}
                        </p>
                    )}
                </section>
            )}

            {/* 7. REQUISITOS DE IDIOMA Y RECURSOS */}
            {result.idiomas && (
                <section>
                    <h4 className="font-bold text-foreground flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-primary" />
                        Requisitos de Idioma (CLB) y Recursos Gratuitos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                            <p className="text-xs font-bold text-blue-800 mb-1">InglÃ©s (CLB)</p>
                            <p className="text-sm text-foreground font-medium">{result.idiomas.clbIngles}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/20 p-4">
                            <p className="text-xs font-bold text-muted-foreground mb-1">FrancÃ©s (CLB)</p>
                            <p className="text-sm text-foreground font-medium">{result.idiomas.clbFrances}</p>
                        </div>
                    </div>
                    
                    {result.idiomas.recursos?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-muted-foreground mb-3">Recursos Gratuitos Recomendados:</p>
                            <div className="grid gap-3">
                                {result.idiomas.recursos.map((r: any, i: number) => (
                                    <div key={i} className="rounded-xl border border-border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{r.nombre}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{r.descripcion}</p>
                                        </div>
                                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                            <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 flex w-full sm:w-auto">
                                                Visitar <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* 8. EMPRESAS LMIA */}
            {result.empresasLMIA?.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            Empresas con historial de contrataciÃ³n internacional â€” {result.empresasLMIA.length} empresas
                        </h4>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={downloadLMIAExcel}>
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Excel
                        </Button>
                    </div>

                    {/* LMIA Disclaimer */}
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2 mb-4">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                            <strong>Importante:</strong> Estas empresas <strong>han gestionado LMIA (Labour Market Impact Assessment) para contratar trabajadores extranjeros</strong> en aÃ±os recientes.
                            Esto <strong>no garantiza</strong> que estÃ©n contratando en este momento, pero son tus principales objetivos
                            cuando busques oportunidades con patrocinio. Visita sus sitios web para revisar vacantes actuales.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 sticky top-0">
                                    <tr>
                                        <th className="text-left p-3 font-semibold text-foreground text-xs">#</th>
                                        <th className="text-left p-3 font-semibold text-foreground text-xs">Empresa</th>
                                        <th className="text-left p-3 font-semibold text-foreground text-xs">Provincia</th>
                                        <th className="text-left p-3 font-semibold text-foreground text-xs">Industria</th>
                                        <th className="text-left p-3 font-semibold text-foreground text-xs">Web</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.empresasLMIA.map((e: any, i: number) => (
                                        <tr key={i} className="border-t border-border/50 hover:bg-muted/20">
                                            <td className="p-3 text-xs text-muted-foreground">{i + 1}</td>
                                            <td className="p-3 font-medium text-foreground text-xs">{e.nombre}</td>
                                            <td className="p-3 text-xs text-muted-foreground">{e.provincia}</td>
                                            <td className="p-3 text-xs text-muted-foreground">{e.industria}</td>
                                            <td className="p-3">
                                                <a href={e.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1">
                                                    Visitar <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA to transform */}
            <div className="text-center pt-4 border-t border-border/50">
                <Button size="lg" className="gap-2 py-5 px-8" onClick={onAnalysisComplete}>
                    Continuar â†’ Transformar mi CV ðŸš€
                </Button>
            </div>
        </div>
    )
}

// Helper: Generate printable HTML for PDF export
function generateReportHTML(result: any): string {
    if (!result) return '<p>No hay datos disponibles para el reporte</p>';
    if (!result) return 'Error: No hay datos para el reporte';
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

    html += `<h1>ðŸ“Š Reporte de Empleabilidad Canadiense</h1>`
    html += `<p style="color:#666;font-size:11px;">Generado el ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</p>`
    html += `<div class="disclaimer"><strong>Nota:</strong> Esta informaciÃ³n es referencial. Los precios, disponibilidad y rangos salariales pueden variar. Verifica siempre en los sitios web oficiales.</div>`

    // DiagnÃ³stico
    if (result.diagnostico?.length) {
        html += `<h2>âŒ DiagnÃ³stico del CV Actual</h2><table><tr><th>Problema</th><th>Â¿Por quÃ©?</th><th>Cambio</th></tr>`
        result.diagnostico.forEach((d: any) => { html += `<tr><td>${d.problema}</td><td>${d.porque}</td><td>${d.cambio}</td></tr>` })
        html += `</table>`
    }

    // RegulaciÃ³n
    if (result.regulacion) {
        html += `<h2>ðŸ›¡ï¸ RegulaciÃ³n Profesional â€” ${result.regulacion.profesion}</h2>`
        html += `<p><strong>${result.regulacion.esRegulada ? "âš ï¸ ProfesiÃ³n Regulada" : "âœ… ProfesiÃ³n No Regulada"}</strong></p>`
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

    // Certificaciones
    if (result.certificaciones?.length) {
        html += `<h2>ðŸ† Certificaciones Recomendadas</h2><table><tr><th>CertificaciÃ³n</th><th>Organismo</th><th>Costo</th><th>DuraciÃ³n</th><th>Tipo</th></tr>`
        result.certificaciones.slice(0, 5).forEach((c: any) => {
            html += `<tr><td><a href="${c.url}">${c.nombre}</a></td><td>${c.organismo}</td><td>${c.costoCAD}</td><td>${c.duracion}</td><td>${c.tipo}</td></tr>`
        })
        html += `</table>`
    }

    // Roles puente
    if (result.rolesPuente?.length) {
        html += `<h2>ðŸ”€ Roles Puente</h2><table><tr><th>Rol (EN)</th><th>Rol (ES)</th><th>Salario</th><th>Â¿Por quÃ©?</th></tr>`
        result.rolesPuente.forEach((r: any) => { html += `<tr><td>${r.titulo}</td><td>${r.tituloEspanol}</td><td>${r.salarioPromedio}</td><td>${r.porque}</td></tr>` })
        html += `</table>`
    }

    // Demanda
    if (result.demandaProvincia?.length) {
        html += `<h2>ðŸ“ Demanda por Provincia</h2><table><tr><th>Provincia</th><th>Demanda</th><th>Nota</th></tr>`
        result.demandaProvincia.forEach((p: any) => {
            const cls = p.demanda === "Alta" ? "alta" : p.demanda === "Media" ? "media" : "baja"
            html += `<tr><td>${p.provincia}</td><td><span class="badge ${cls}">${p.demanda}</span></td><td>${p.nota}</td></tr>`
        })
        html += `</table>`
    }

    // Salarios
    if (result.salarios) {
        html += `<h2>ðŸ’° Rangos Salariales</h2><table><tr><th>Entry Level</th><th>Mid Level</th><th>Senior</th></tr>`
        html += `<tr><td>${result.salarios.entry}</td><td>${result.salarios.mid}</td><td>${result.salarios.senior}</td></tr></table>`
        if (result.salarios.promedioCanada) html += `<p style="font-size:11px;color:#666;">Promedio canadiense: ${result.salarios.promedioCanada}</p>`
    }

    // Idiomas
    if (result.idiomas) {
        html += `<h2>ðŸ—£ï¸ Requisitos de Idioma (CLB)</h2>`
        html += `<table><tr><th>InglÃ©s (CLB)</th><th>FrancÃ©s (CLB)</th></tr>`
        html += `<tr><td>${result.idiomas.clbIngles}</td><td>${result.idiomas.clbFrances}</td></tr></table>`
        if (result.idiomas.recursos?.length) {
            html += `<h3>Recursos Gratuitos Recomendados</h3><ul>`
            result.idiomas.recursos.forEach((r: any) => {
                html += `<li><strong><a href="${r.url}">${r.nombre}</a>:</strong> ${r.descripcion}</li>`
            })
            html += `</ul>`
        }
    }

    // LMIA
    if (result.empresasLMIA?.length) {
        html += `<h2>ðŸ¢ Empresas con Historial de ContrataciÃ³n Internacional (LMIA)</h2>`
        html += `<div class="lmia-disclaimer"><strong>Importante:</strong> Estas empresas <strong>han gestionado LMIA (Labour Market Impact Assessment) para contratar trabajadores extranjeros</strong> en aÃ±os recientes. Esto no garantiza que estÃ©n contratando en este momento, pero son tus principales objetivos cuando busques oportunidades con patrocinio.</div>`
        html += `<table><tr><th>#</th><th>Empresa</th><th>Provincia</th><th>Industria</th><th>Web</th></tr>`
        result.empresasLMIA.forEach((e: any, i: number) => {
            html += `<tr><td>${i + 1}</td><td>${e.nombre}</td><td>${e.provincia}</td><td>${e.industria}</td><td><a href="${e.website}">${e.website}</a></td></tr>`
        })
        html += `</table>`
    }

    html += `<hr><p style="font-size:10px;color:#999;margin-top:20px;">Â© ${new Date().getFullYear()} Empleabilidad CanadÃ¡. Reporte generado automÃ¡ticamente. Para soporte: canadacon40@gmail.com</p>`
    html += `</body></html>`
    return html
}
