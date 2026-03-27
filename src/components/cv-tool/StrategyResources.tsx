"use client"

import { useState } from "react"
import { FileText, Mail, MessageSquare, Loader2, Copy, Check, Sparkles, Search, Target, ShieldCheck, ChevronDown, ChevronUp, Phone, Palette, Globe, Download, FileSpreadsheet, Rocket, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { consumeStrategyAction, hasStrategyActionsRemaining, getStrategyRemaining } from "@/lib/usage-tracker"
import { downloadCustomizedCVPDF, downloadFullReportPDF, downloadLMIAExcel } from "@/lib/report-utils"

const tabs = [
    { id: "customize", label: "Personalizar CV", icon: FileText },
    { id: "job-boards", label: "Canales de Empleo", icon: Search },
    { id: "cover-letter", label: "Cover Letter", icon: Mail },
    { id: "interview", label: "Entrevista", icon: MessageSquare },
    { id: "scripts", label: "Scripts", icon: Phone },
] as const

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(text)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "¡Copiado!" : "Copiar"}
        </button>
    )
}

// ============= CUSTOMIZE CV TAB =============
function CustomizeTab({ cvText, onCustomize }: { cvText: string; onCustomize?: (data: any) => void }) {
    const [jobDescription, setJobDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [loadingAction, setLoadingAction] = useState("")
    const [error, setError] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [analyzeResult, setAnalyzeResult] = useState<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [customizeResult, setCustomizeResult] = useState<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [atsResult, setAtsResult] = useState<any>(null)

    const callApi = async (action: string) => {
        if (!jobDescription.trim() || jobDescription.trim().length < 30) {
            setError("Pega el Job Description completo (mínimo 30 caracteres).")
            return
        }
        // Check strategy actions
        if (!hasStrategyActionsRemaining()) {
            setError(`Has agotado tus acciones de estrategia. Contacta soporte para más accesos.`)
            return
        }
        setIsLoading(true)
        setError("")
        setLoadingAction(action)
        try {
            const res = await fetch("/api/cv-customize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText, jobDescription, action }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error); return }

            // Consume strategy action on success
            consumeStrategyAction(`customize_${action}`)

            if (action === "analyze") setAnalyzeResult(data.result)
            if (action === "customize") setCustomizeResult(data.result)
            if (action === "ats-check") setAtsResult(data.result)
        } catch { setError("Error de conexión. Intenta de nuevo.") }
        finally { setIsLoading(false); setLoadingAction("") }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-bold text-foreground mb-1">🎯 Personaliza tu CV para cada oferta</h3>
                <p className="text-sm text-muted-foreground">
                    Pega la descripción completa del puesto aquí (link o texto) y esta herramienta adaptará tu CV para maximizar tus chances de pasar el filtro ATS.
                </p>
            </div>

            {/* Job Description Input */}
            <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                    📋 Pega la descripción completa del puesto aquí
                </label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => { setJobDescription(e.target.value); setError("") }}
                    rows={8}
                    placeholder="Pega la descripción completa del puesto aquí (puedes pegar el link o el texto de la oferta laboral)..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm leading-relaxed"
                />
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                    variant="outline"
                    className="gap-2 py-5"
                    onClick={() => callApi("analyze")}
                    disabled={isLoading}
                >
                    {isLoading && loadingAction === "analyze" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Analizar Oferta
                </Button>
                <Button
                    className="gap-2 py-5"
                    onClick={() => callApi("customize")}
                    disabled={isLoading}
                >
                    {isLoading && loadingAction === "customize" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                    Adaptar mi CV
                </Button>
                <Button
                    variant="outline"
                    className="gap-2 py-5"
                    onClick={() => callApi("ats-check")}
                    disabled={isLoading}
                >
                    {isLoading && loadingAction === "ats-check" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Verificar ATS
                </Button>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
                        <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">
                            {loadingAction === "analyze" && "Analizando Vacante..."}
                            {loadingAction === "customize" && "Inyectando Experiencia..."}
                            {loadingAction === "ats-check" && "Escaneando Algoritmo ATS..."}
                        </p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pierre está trabajando para ti</p>
                    </div>
                </div>
            )}

            {/* Analyze Results */}
            {analyzeResult && (
                <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Search className="w-4 h-4 text-primary" /> Análisis del Job Description
                    </h4>
                    <div>
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Palabras clave ATS</h5>
                        <div className="flex flex-wrap gap-1.5">
                            {analyzeResult.topKeywords?.map((kw: string, i: number) => (
                                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{kw}</span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Hard Skills</h5>
                            <ul className="space-y-1">
                                {analyzeResult.hardSkills?.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span className="text-primary">•</span>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Soft Skills</h5>
                            <ul className="space-y-1">
                                {analyzeResult.softSkills?.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span className="text-primary">•</span>{s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {analyzeResult.tips && (
                        <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tips para tu perfil</h5>
                            <ul className="space-y-1">
                                {analyzeResult.tips.map((t: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span className="text-primary">💡</span>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Customize Results */}
            {customizeResult && (
                <div className="rounded-[2.5rem] border-2 border-primary/30 bg-primary/5 p-8 sm:p-12 space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32 opacity-40 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">CV Adaptado por Pierre</h4>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button 
                                size="lg" 
                                className="flex-1 sm:flex-none h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20"
                                onClick={() => onCustomize ? onCustomize(customizeResult) : downloadCustomizedCVPDF(customizeResult)}
                            >
                                <Palette className="w-5 h-5" />
                                DESCARGAR CV PRO
                            </Button>
                            <CopyButton text={customizeResult.fullCvText || ""} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                        <div className="lg:col-span-4 space-y-6">
                            <div className="p-6 rounded-3xl bg-white border shadow-sm">
                                <div className="text-4xl font-black text-primary mb-1 tracking-tighter">{customizeResult.matchScore}%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match con la Oferta</div>
                                <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Pierre ha optimizado las palabras clave y logros para maximizar tu relevancia técnica.</p>
                            </div>

                            {customizeResult.addedKeywords?.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keywords Inyectados</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {customizeResult.addedKeywords.map((kw: string, i: number) => (
                                            <span key={i} className="text-[10px] px-3 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-tight border border-primary/20">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-8 space-y-8 bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 border border-white">
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Resumen de Alto Impacto</h5>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed italic border-l-4 border-primary/30 pl-6">{customizeResult.customizedSummary}</p>
                            </div>
                            
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experiencia Táctica Reescrita</h5>
                                {customizeResult.customizedExperience?.map((exp: { title: string; company: string; period: string; achievements: string[] }, i: number) => (
                                    <div key={i} className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex justify-between items-start gap-4">
                                            <h6 className="font-black text-slate-900 leading-none">{exp.title}</h6>
                                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{exp.period}</span>
                                        </div>
                                        <p className="text-xs font-bold text-primary italic uppercase tracking-widest">{exp.company}</p>
                                        <ul className="space-y-2">
                                            {exp.achievements?.map((a: string, j: number) => (
                                                <li key={j} className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5" />
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ATS Check Results */}
            {atsResult && (
                <div className={`rounded-xl border p-5 space-y-4 ${atsResult.verdict === "PASS" ? "border-green-500/30 bg-green-50/50" : "border-amber-500/30 bg-amber-50/50"
                    }`}>
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" /> Verificación ATS
                        </h4>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${atsResult.verdict === "PASS" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                            {atsResult.verdict === "PASS" ? "✅ APROBADO" : "⚠️ NECESITA AJUSTES"}
                        </span>
                    </div>
                    <div className="text-center">
                        <div className={`text-4xl font-bold ${atsResult.score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                            {atsResult.score}/100
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center max-w-xs mx-auto">
                            Score de compatibilidad. 
                            <span className="block mt-1 italic text-[10px]">
                                (Un 75 es excelente para humanos; optimizamos a 85-95 para filtros ATS sin perder la naturalidad profesional).
                            </span>
                        </p>
                    </div>
                    <p className="text-sm text-foreground">{atsResult.overallFeedback}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-xs font-semibold text-green-700 uppercase mb-2">✅ Keywords encontrados</h5>
                            <div className="flex flex-wrap gap-1">
                                {atsResult.matchedKeywords?.map((kw: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5 className="text-xs font-semibold text-amber-700 uppercase mb-2">❌ Keywords faltantes</h5>
                            <div className="flex flex-wrap gap-1">
                                {atsResult.missingKeywords?.map((kw: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {atsResult.suggestions?.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Sugerencias</h5>
                            <ul className="space-y-1">
                                {atsResult.suggestions.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span>💡</span>{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ============= COVER LETTER TAB =============
function CoverLetterTab({ cvText }: { cvText: string }) {
    const [jobDescription, setJobDescription] = useState("")
    const [companyInfo, setCompanyInfo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null)

    const handleGenerate = async () => {
        if (!jobDescription.trim() || jobDescription.trim().length < 30) {
            setError("Pega el Job Description completo (mínimo 30 caracteres).")
            return
        }
        if (!hasStrategyActionsRemaining()) {
            setError("Has agotado tus acciones de estrategia. Contacta soporte para más accesos.")
            return
        }
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText, jobDescription, companyInfo }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error); return }
            consumeStrategyAction("cover_letter")
            setResult(data.result)
        } catch { setError("Error de conexión. Intenta de nuevo.") }
        finally { setIsLoading(false) }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-bold text-foreground mb-1">📧 Cover Letter personalizada</h3>
                <p className="text-sm text-muted-foreground">
                    Genera una cover letter profesional al estilo canadiense, personalizada para cada oferta de empleo.
                </p>
            </div>

            <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">📋 Pega la descripción completa del puesto aquí *</label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => { setJobDescription(e.target.value); setError("") }}
                    rows={6}
                    placeholder="Pega la descripción completa del puesto aquí (link o texto de la oferta laboral)..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
                />
            </div>

            <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                    Información de la empresa <span className="font-normal text-muted-foreground">(opcional, mejora la personalización)</span>
                </label>
                <textarea
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                    rows={3}
                    placeholder="Ej: Empresa de tecnología enfocada en sostenibilidad, 500 empleados, oficina en Toronto..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
                />
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <Button size="lg" className="w-full gap-2 py-5" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isLoading ? "Generando tu Cover Letter..." : "Generar Cover Letter"}
            </Button>

            {isLoading && (
                <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">Esto toma unos 15-30 segundos...</p>
                </div>
            )}

            {result && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-foreground">Tu Cover Letter</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{result.wordCount} palabras</span>
                            <CopyButton text={result.coverLetter || ""} />
                        </div>
                    </div>
                    <div className="bg-background rounded-lg p-5 border border-border/50">
                        <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                            {result.coverLetter}
                        </pre>
                    </div>
                    {result.keyHighlights?.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Puntos clave usados</h5>
                            <ul className="space-y-1">
                                {result.keyHighlights.map((h: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span className="text-primary">✦</span>{h}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.tips?.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tips para personalizar más</h5>
                            <ul className="space-y-1">
                                {result.tips.map((t: string, i: number) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5"><span>💡</span>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ============= INTERVIEW TAB =============
function InterviewTab({ cvText }: { cvText: string }) {
    const [jobDescription, setJobDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null)
    const [expandedQ, setExpandedQ] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!jobDescription.trim() || jobDescription.trim().length < 30) {
            setError("Pega el Job Description completo (mínimo 30 caracteres).")
            return
        }
        if (!hasStrategyActionsRemaining()) {
            setError("Has agotado tus acciones de estrategia. Contacta soporte para más accesos.")
            return
        }
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/interview-prep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText, jobDescription }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error); return }
            consumeStrategyAction("interview_prep")
            setResult(data.result)
        } catch { setError("Error de conexión. Intenta de nuevo.") }
        finally { setIsLoading(false) }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-bold text-foreground mb-1">🎤 Preparación de Entrevista</h3>
                <p className="text-sm text-muted-foreground">
                    Esta herramienta predice las preguntas técnicas y de comportamiento más probables para esta oferta, con guías de cómo responder usando la metodología STAR.
                </p>
            </div>

            {/* STAR Method Explainer */}
            {/* Metodología STAR en español */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <p className="text-xs font-bold text-foreground mb-3">📖 Metodología STAR — Cómo estructurar tus respuestas:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { letter: "S", label: "Situación", labelEn: "Situation", desc: "Describe el contexto o escenario donde ocurrió la experiencia." },
                        { letter: "T", label: "Tarea", labelEn: "Task", desc: "Explica cuál era tu responsabilidad o el objetivo que debías lograr." },
                        { letter: "A", label: "Acción", labelEn: "Action", desc: "Detalla las acciones específicas que tomaste para resolver la situación." },
                        { letter: "R", label: "Resultado", labelEn: "Result", desc: "Comparte el resultado concreto e impacto de tus acciones." },
                    ].map((s) => (
                        <div key={s.letter} className="p-3 rounded-xl border border-border bg-background text-center">
                            <div className="text-xl font-bold text-primary">{s.letter}</div>
                            <div className="text-xs font-semibold text-foreground">{s.label}</div>
                            <div className="text-[10px] text-muted-foreground italic">({s.labelEn})</div>
                            <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">📋 Pega la descripción completa del puesto aquí</label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => { setJobDescription(e.target.value); setError("") }}
                    rows={6}
                    placeholder="Pega la descripción completa del puesto aquí (link o texto de la oferta laboral)..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
                />
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <Button size="lg" className="w-full gap-2 py-5" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                {isLoading ? "Generando preguntas..." : "Predecir Preguntas de Entrevista"}
            </Button>

            {isLoading && (
                <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">Analizando el rol y generando preguntas... 20-40 segundos.</p>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    {/* General Tips */}
                    {result.generalTips?.length > 0 && (
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                            <h4 className="font-bold text-foreground text-sm mb-2">💡 Tips generales para esta entrevista</h4>
                            <ul className="space-y-1">
                                {result.generalTips.map((t: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span className="text-primary">•</span>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Red Flags */}
                    {result.redFlags?.length > 0 && (
                        <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                            <h4 className="font-bold text-foreground text-sm mb-2">🚫 Evitar en la entrevista</h4>
                            <ul className="space-y-1">
                                {result.redFlags.map((f: string, i: number) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5"><span className="text-destructive">✗</span>{f}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Technical Questions */}
                    {result.technicalQuestions?.length > 0 && (
                        <div>
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">T</span>
                                Preguntas Técnicas ({result.technicalQuestions.length})
                            </h4>
                            <div className="space-y-2">
                                {result.technicalQuestions.map((q: { question: string; whyTheyAsk: string; howToAnswer: string; sampleAnswer: string }, i: number) => {
                                    const key = `tech-${i}`
                                    const isExpanded = expandedQ === key
                                    return (
                                        <div key={i} className="rounded-xl border border-border overflow-hidden">
                                            <button
                                                onClick={() => setExpandedQ(isExpanded ? null : key)}
                                                className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className="text-primary font-bold text-sm mt-0.5">{i + 1}.</span>
                                                    <span className="text-sm font-medium text-foreground">{q.question}</span>
                                                </div>
                                                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                                            </button>
                                            {isExpanded && (
                                                <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                                                    <div>
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase">¿Por qué preguntan esto?</span>
                                                        <p className="text-sm text-foreground mt-1">{q.whyTheyAsk}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase">Cómo responder</span>
                                                        <p className="text-sm text-foreground mt-1">{q.howToAnswer}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-muted-foreground uppercase">Respuesta modelo</span>
                                                        <p className="text-sm text-foreground mt-1 bg-muted/30 rounded-lg p-3">{q.sampleAnswer}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Behavioral Questions */}
                    {result.behavioralQuestions?.length > 0 && (
                        <div>
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">B</span>
                                Preguntas de Comportamiento ({result.behavioralQuestions.length})
                            </h4>
                            <div className="space-y-2">
                                {result.behavioralQuestions.map((q: { question: string; competency: string; starTemplate: { situation: string; task: string; action: string; result: string } }, i: number) => {
                                    const key = `beh-${i}`
                                    const isExpanded = expandedQ === key
                                    return (
                                        <div key={i} className="rounded-xl border border-border overflow-hidden">
                                            <button
                                                onClick={() => setExpandedQ(isExpanded ? null : key)}
                                                className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <span className="text-sm font-medium text-foreground">{q.question}</span>
                                                    <span className="block text-xs text-primary mt-1">Evalúa: {q.competency}</span>
                                                </div>
                                                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                                            </button>
                                            {isExpanded && q.starTemplate && (
                                                <div className="px-4 pb-4 border-t border-border/50 pt-3">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Plantilla STAR — llena con tu experiencia real:</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {Object.entries(q.starTemplate).map(([key, val]) => (
                                                            <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                                                                <span className="text-xs font-bold text-primary uppercase">{key}:</span>
                                                                <p className="text-sm text-foreground mt-1">{val}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ============= SCRIPTS TAB =============
function ScriptsTab() {
    const [expandedScript, setExpandedScript] = useState<string | null>(null)

    const emailScripts = [
        {
            id: "cold-email-en",
            lang: "🇬🇧 English",
            title: "Cold Email to Recruiter",
            subject: "Experienced [Your Role] — Open to Opportunities in [Province]",
            body: `Hi [Recruiter Name],

I came across [Company Name] while researching companies in [industry] and was impressed by your team's work in [specific area].

I'm a [Your Role] with [X] years of experience in [industry/specialization]. I recently relocated to Canada and I'm actively looking for opportunities where I can contribute my background in [2-3 key skills].

I'd love to learn more about any upcoming openings that might be a good fit. I've attached my resume for your reference.

Would you be open to a brief call this week?

Best regards,
[Your Name]
[Phone] | [LinkedIn URL]`,
            translation: `Hola [Nombre del Reclutador],

Encontré [Nombre de la Empresa] mientras investigaba empresas en [industria] y me impresionó el trabajo de su equipo en [área específica].

Soy [Tu Rol] con [X] años de experiencia en [industria/especialización]. Recientemente me mudé a Canadá y estoy buscando activamente oportunidades donde pueda contribuir con mi experiencia en [2-3 habilidades clave].

Me encantaría saber más sobre vacantes próximas que puedan ser un buen match. Adjunto mi CV para su referencia.

¿Estaría abierto/a a una breve llamada esta semana?

Saludos cordiales,
[Tu Nombre]
[Teléfono] | [URL de LinkedIn]`,
        },
        {
            id: "cold-email-fr",
            lang: "🇫🇷 Français",
            title: "Courriel à un recruteur",
            subject: "[Votre Rôle] expérimenté(e) — Ouvert(e) aux opportunités au [Province]",
            body: `Bonjour [Nom du Recruteur],

J'ai découvert [Nom de l'Entreprise] en faisant des recherches sur les entreprises dans le domaine de [industrie] et j'ai été impressionné(e) par le travail de votre équipe en [domaine spécifique].

Je suis [Votre Rôle] avec [X] ans d'expérience en [industrie/spécialisation]. Je me suis récemment installé(e) au Canada et je suis activement à la recherche d'opportunités où je pourrais contribuer avec mon expertise en [2-3 compétences clés].

J'aimerais en savoir plus sur les postes à venir qui pourraient correspondre à mon profil. Veuillez trouver mon CV ci-joint.

Seriez-vous disponible pour un bref appel cette semaine ?

Cordialement,
[Votre Nom]
[Téléphone] | [URL LinkedIn]`,
            translation: `Hola [Nombre del Reclutador],

Descubrí [Nombre de la Empresa] investigando empresas en [industria] y me impresionó el trabajo de su equipo en [área específica].

Soy [Tu Rol] con [X] años de experiencia en [industria/especialización]. Recientemente me instalé en Canadá y busco activamente oportunidades donde pueda contribuir con mi experiencia en [2-3 habilidades clave].

Me gustaría saber más sobre posiciones próximas que coincidan con mi perfil. Adjunto mi CV.

¿Estaría disponible para una breve llamada esta semana?

Cordialmente,
[Tu Nombre]
[Teléfono] | [URL de LinkedIn]`,
        },
        {
            id: "followup-en",
            lang: "🇬🇧 English",
            title: "Follow-up After Applying",
            subject: "Following Up — [Your Role] Application",
            body: `Hi [Recruiter/Hiring Manager Name],

I recently applied for the [Job Title] position at [Company Name] and wanted to follow up to express my continued interest.

With my background in [key area] and [X] years of experience, I believe I could make a strong contribution to your team, especially in [specific area relevant to the role].

I'd welcome the chance to discuss how my experience aligns with what you're looking for. Please let me know if there's a good time to connect.

Thank you for your time and consideration.

Best,
[Your Name]`,
            translation: `Hola [Nombre del Reclutador/Gerente],

Recientemente apliqué para la posición de [Título del Puesto] en [Nombre de la Empresa] y quería dar seguimiento para expresar mi interés continuo.

Con mi experiencia en [área clave] y [X] años de experiencia, creo que podría hacer una contribución sólida a su equipo, especialmente en [área específica relevante al rol].

Me encantaría la oportunidad de discutir cómo mi experiencia se alinea con lo que están buscando. Por favor déjeme saber si hay un buen momento para conectar.

Gracias por su tiempo y consideración.

Saludos,
[Tu Nombre]`,
        },
    ]

    const phoneScripts = [
        {
            id: "call-en",
            lang: "🇬🇧 English",
            title: "Calling About a Job Posting",
            lines: [
                {
                    en: "Hi, my name is [Your Name]. I'm calling about the [Job Title] position I saw posted on [where].",
                    phonetic: "Jai, mai neim is [Tu Nombre]. Aim coling abaut de [Yob Taitel] posishion ai so postid on [dónde].",
                    es: "Hola, mi nombre es [Tu Nombre]. Llamo sobre la posición de [Título] que vi publicada en [dónde].",
                },
                {
                    en: "I have [X] years of experience in [field] and I'd love to learn more about the role.",
                    phonetic: "Ai jav [X] yirs of experiens in [fild] and aid lov tu lern mor abaut de rol.",
                    es: "Tengo [X] años de experiencia en [campo] y me encantaría saber más sobre el rol.",
                },
                {
                    en: "Is there a good time I could speak with the hiring manager?",
                    phonetic: "Is der a gud taim ai cud spik wid de jairing manager?",
                    es: "¿Hay un buen momento en que pueda hablar con el gerente de contratación?",
                },
                {
                    en: "Could I send my resume to a specific email address?",
                    phonetic: "Cud ai send mai resiumei tu a specific imeil adres?",
                    es: "¿Podría enviar mi CV a una dirección de email específica?",
                },
                {
                    en: "Thank you so much for your time. I really appreciate it.",
                    phonetic: "Zenk yu so moch for yor taim. Ai rili aprishieit it.",
                    es: "Muchas gracias por su tiempo. Lo aprecio mucho.",
                },
            ],
        },
        {
            id: "call-fr",
            lang: "🇫🇷 Français",
            title: "Appeler pour un poste",
            lines: [
                {
                    en: "Bonjour, je m'appelle [Votre Nom]. J'appelle au sujet du poste de [Titre] que j'ai vu affiché sur [où].",
                    phonetic: "Bonyur, ye mapel [Tu Nombre]. Yapel o suyé du post de [Título] que yé vu afishé sur [dónde].",
                    es: "Hola, me llamo [Tu Nombre]. Llamo sobre el puesto de [Título] que vi publicado en [dónde].",
                },
                {
                    en: "J'ai [X] ans d'expérience dans le domaine de [champ] et j'aimerais en savoir plus sur le poste.",
                    phonetic: "Yé [X] an dexperiáns dan le domén de [campo] e yemerré an sabuár plu sur le post.",
                    es: "Tengo [X] años de experiencia en [campo] y me gustaría saber más sobre el puesto.",
                },
                {
                    en: "Serait-il possible de parler avec le responsable du recrutement ?",
                    phonetic: "Seré-til posibl de parlé avek le responsábl du recrutemán?",
                    es: "¿Sería posible hablar con el responsable de contratación?",
                },
                {
                    en: "Puis-je envoyer mon CV à une adresse courriel spécifique ?",
                    phonetic: "Pui-ye envuayé mon sevé a un adrés curiél específik?",
                    es: "¿Puedo enviar mi CV a una dirección de email específica?",
                },
                {
                    en: "Merci beaucoup pour votre temps. Je vous en suis très reconnaissant(e).",
                    phonetic: "Mersí bocú pur votr tan. Ye vus an sui tré reconesán(t).",
                    es: "Muchas gracias por su tiempo. Se lo agradezco mucho.",
                },
            ],
        },
    ]

    return (
        <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-bold text-foreground mb-1">📞 Scripts de Contacto</h3>
                <p className="text-sm text-muted-foreground">
                    Plantillas listas para contactar reclutadores y empresas por email o teléfono, en inglés y francés. Incluyen traducción al español y guía de pronunciación.
                </p>
            </div>

            {/* Email Scripts */}
            <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Scripts de Email
                </h4>
                <div className="space-y-3">
                    {emailScripts.map((script) => {
                        const isExpanded = expandedScript === script.id
                        return (
                            <div key={script.id} className="rounded-xl border border-border overflow-hidden">
                                <button
                                    onClick={() => setExpandedScript(isExpanded ? null : script.id)}
                                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm">{script.lang}</span>
                                        <span className="text-sm font-medium text-foreground">{script.title}</span>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                </button>
                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-muted-foreground uppercase">Subject / Asunto</span>
                                                <CopyButton text={script.subject} />
                                            </div>
                                            <p className="text-sm text-foreground bg-muted/30 rounded-lg p-2 font-medium">{script.subject}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-muted-foreground uppercase">Email</span>
                                                <CopyButton text={script.body} />
                                            </div>
                                            <pre className="text-sm text-foreground whitespace-pre-wrap bg-background rounded-lg p-3 border border-border/50 font-sans leading-relaxed">{script.body}</pre>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-primary uppercase">📖 Traducción al español</span>
                                            <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-primary/5 rounded-lg p-3 border border-primary/10 font-sans leading-relaxed mt-1
                                            ">{script.translation}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Phone Scripts */}
            <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Scripts de Llamada Telefónica
                </h4>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-3">
                    <p className="text-xs text-amber-800">
                        💡 <strong>Tip:</strong> Practica leyendo la guía fonética en voz alta varias veces antes de llamar. La guía fonética está escrita en español para que sepas cómo pronunciar cada palabra.
                    </p>
                </div>
                <div className="space-y-3">
                    {phoneScripts.map((script) => {
                        const isExpanded = expandedScript === script.id
                        return (
                            <div key={script.id} className="rounded-xl border border-border overflow-hidden">
                                <button
                                    onClick={() => setExpandedScript(isExpanded ? null : script.id)}
                                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm">{script.lang}</span>
                                        <span className="text-sm font-medium text-foreground">{script.title}</span>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                </button>
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-border/50 pt-3">
                                        <div className="space-y-4">
                                            {script.lines.map((line, i) => (
                                                <div key={i} className="rounded-lg border border-border/50 overflow-hidden">
                                                    <div className="p-3 bg-background">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Di esto:</span>
                                                                <p className="text-sm font-medium text-foreground mt-0.5">{line.en}</p>
                                                            </div>
                                                            <CopyButton text={line.en} />
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-amber-50/50 border-t border-border/30">
                                                        <span className="text-[10px] font-bold text-amber-700 uppercase">🔊 Pronunciación:</span>
                                                        <p className="text-sm text-amber-900 font-medium mt-0.5 italic">{line.phonetic}</p>
                                                    </div>
                                                    <div className="p-3 bg-primary/5 border-t border-border/30">
                                                        <span className="text-[10px] font-bold text-primary uppercase">📖 Significa:</span>
                                                        <p className="text-sm text-muted-foreground mt-0.5">{line.es}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
// ============= JOB BOARDS TAB =============
function JobBoardTab() {
    const jobBoards = [
        {
            category: "Federal (Todo Canadá)",
            boards: [
                { name: "Job Bank (Official)", description: "Portal oficial del Gobierno de Canadá. El más confiable.", url: "https://www.jobbank.gc.ca/", icon: Globe },
                { name: "Indeed Canada", description: "El buscador más grande del sector privado.", url: "https://ca.indeed.com/", icon: Search },
                { name: "LinkedIn Jobs", description: "Esencial para networking y roles especializados.", url: "https://www.linkedin.com/jobs/", icon: Target },
            ]
        },
        {
            category: "Portales de Gobierno (Provincias)",
            boards: [
                { name: "Ontario Public Service", description: "Carreras oficiales en el gobierno de Ontario.", url: "https://www.gojobs.gov.on.ca/", icon: Globe },
                { name: "Québec Emploi", description: "Portal oficial de empleo del gobierno de Québec.", url: "https://www.quebec.ca/emploi/chercher-un-emploi/quebec-emploi", icon: Globe },
                { name: "WorkBC (British Columbia)", description: "Bolsa de trabajo oficial de B.C.", url: "https://www.workbc.ca/", icon: Globe },
                { name: "Alberta Jobs (Alis)", description: "Portal oficial de empleos y carreras de Alberta.", url: "https://www.alberta.ca/alberta-jobs", icon: Globe },
                { name: "SaskJobs (Saskatchewan)", description: "Portal principal de empleo para SK.", url: "https://www.saskjobs.ca/", icon: Globe },
                { name: "Work in Manitoba", description: "Portal de empleo oficial de la provincia de Manitoba.", url: "https://www.workinmanitoba.ca/", icon: Globe },
                { name: "NBJobs (New Brunswick)", description: "Portal oficial de empleos de New Brunswick.", url: "https://www.nbjobs.ca/", icon: Globe },
                { name: "Nova Scotia Gov Careers", description: "Bolsa de trabajo oficial del gobierno de N.S.", url: "https://jobs.novascotia.ca/", icon: Globe },
                { name: "Jobs PEI (P.E.I.)", description: "Portal oficial de Prince Edward Island.", url: "https://www.jobspei.ca/", icon: Globe },
                { name: "Public Careers (NL)", description: "Oportunidades en Newfoundland and Labrador.", url: "https://www.gov.nl.ca/exec/ias/public-service-commission/public-career-opportunities/", icon: Globe },
            ]
        },
        {
            category: "Mercado Oculto (Directorio de Empresas)",
            boards: [
                { name: "Canada Business Registry", description: "Busca empresas por nombre e industria para contacto directo.", url: "https://www.beta.canadabusinessregistries.ca/search", icon: ShieldCheck },
                { name: "Glassdoor Canada", description: "Investiga salarios y opiniones antes de aplicar.", url: "https://www.glassdoor.ca/", icon: Search },
            ]
        }
    ]

    return (
        <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-bold text-foreground mb-1">🌐 Canales Tácticos de Empleo</h3>
                <p className="text-sm text-muted-foreground">
                    Pierre ha seleccionado los portales con mayor tasa de éxito. No pierdas tiempo en portales genéricos; enfócate en estos canales oficiales.
                </p>
            </div>

            <div className="space-y-8">
                {jobBoards.map((cat, idx) => (
                    <div key={idx}>
                        <h4 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">{cat.category}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cat.boards.map((board, bIdx) => {
                                const Icon = board.icon
                                return (
                                    <a
                                        key={bIdx}
                                        href={board.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col justify-between relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/20 transition-colors" />
                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all group-hover:scale-110 shadow-sm border border-slate-100">
                                                <Icon className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <h5 className="text-lg font-black text-slate-900 mb-2 group-hover:text-primary transition-colors tracking-tight">{board.name}</h5>
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">{board.description}</p>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Visitar Web</span>
                                            <Rocket className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-5 bg-muted/30 rounded-xl border border-dashed border-border mt-8">
                <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> El "Mercado Oculto" de Canadá
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    ¿Sabías que hasta el <strong>80% de las vacantes en Canadá nunca se publican</strong>? Usa los buscadores de empresas (como Business Registry) para identificar compañías en tu industria y provincia, e intenta contactarlas usando tus <strong>Scripts de Pierre</strong>. ¡Esa es la verdadera ventaja PRO!
                </p>
            </div>
        </div>
    )
}

// ============= MAIN COMPONENT =============
export default function StrategyResources({ cvText, onCustomize, resultData }: { cvText: string; onCustomize?: (data: any) => void; resultData?: any }) {
    const [activeTab, setActiveTab] = useState<string>("customize")

    const handleDownloadPDF = () => {
        if (resultData) downloadFullReportPDF(resultData);
    };

    const handleDownloadExcel = () => {
        if (resultData) downloadLMIAExcel(resultData);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 sm:p-16 text-white border border-white/10 shadow-3xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48 opacity-60" />
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="space-y-4 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                                <Rocket className="w-4 h-4" /> Arsenal Táctico Activado
                            </div>
                            <h3 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">
                                Centro de Estrategia <span className="text-primary italic">Pierre PRO</span>
                            </h3>
                            <p className="text-slate-400 text-sm sm:text-lg font-medium max-w-xl">
                                Tu arsenal completo para dominar el mercado canadiense. Personaliza, aplica y gana.
                            </p>
                        </div>
                        
                        {/* Global Downloads Toolbar */}
                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center sm:text-right mb-1">Tus Archivos Maestros</p>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 sm:flex-none h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 font-bold gap-2 text-xs"
                                    onClick={handleDownloadPDF}
                                >
                                    <Download className="w-4 h-4 text-primary" /> Reporte PDF
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="flex-1 sm:flex-none h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 font-bold gap-2 text-xs"
                                    onClick={handleDownloadExcel}
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Excel LMIA
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Tabs */}
            <div className="sticky top-20 z-40 flex overflow-x-auto gap-2 p-2 bg-slate-50/80 backdrop-blur-md border rounded-[2rem] shadow-sm no-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-6 rounded-2xl text-[11px] sm:text-sm font-black transition-all shrink-0 uppercase tracking-tight ${isActive
                                ? "bg-slate-900 text-white shadow-xl scale-105"
                                : "text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Tab Content with Animation */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-[3rem] border shadow-2xl shadow-slate-200/50 p-6 sm:p-12">
                    {activeTab === "customize" && <CustomizeTab cvText={cvText} onCustomize={onCustomize} />}
                    {activeTab === "job-boards" && <JobBoardTab />}
                    {activeTab === "cover-letter" && <CoverLetterTab cvText={cvText} />}
                    {activeTab === "interview" && <InterviewTab cvText={cvText} />}
                    {activeTab === "scripts" && <ScriptsTab />}
                </div>
            </div>

            {/* Premium Footer Note */}
            <div className="text-center opacity-40 py-8">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">CanadaConTrabajo Audit System © 2026</p>
            </div>
        </div>
    );
}
