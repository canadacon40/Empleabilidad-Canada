"use client"

import React, { useState, useEffect } from "react"
import { FileText, Mail, MessageSquare, Loader2, Copy, Check, Sparkles, Search, Target, ShieldCheck, ChevronDown, ChevronUp, Phone, Palette, Globe, Download, FileSpreadsheet, Rocket, Shield, LogOut, User, Share2, Zap, EyeOff, Map as MapIcon, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { consumeStrategyAction, hasStrategyActionsRemaining, getStrategyRemaining } from "@/lib/usage-tracker"
import { downloadFullReportPDF, downloadUserManualPDF, downloadLMIAExcel, downloadStyledCVPdf, downloadCustomizedCVWord, downloadInterviewPDF, downloadCoverLetterPDF } from "@/lib/report-utils"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import EmployabilityEnginePro from "./EmployabilityEnginePro"
import ProPurchaseModal from "@/components/ui/ProPurchaseModal"

interface UserProfile {
    email: string;
    isPro: boolean;
    isTrial: boolean;
    credits: number;
}

const tabs = [
    { id: "engine-pro", label: "Motor Pierre PRO", icon: Rocket },
    { id: "job-boards", label: "Canal de Empleo", icon: Search },
    { id: "cover-letter", label: "Cover Letter", icon: Mail },
    { id: "interview", label: "Entrevista", icon: MessageSquare },
    { id: "scripts", label: "Scripts PRO", icon: Phone },
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all border border-slate-200"
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
    const [analyzeResult, setAnalyzeResult] = useState<any>(null)
    const [customizeResult, setCustomizeResult] = useState<any>(null)
    const [atsResult, setAtsResult] = useState<any>(null)

    const callApi = async (action: string) => {
        if (!jobDescription.trim() || jobDescription.trim().length < 30) {
            setError("Pega el Job Description completo (mínimo 30 caracteres).")
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
            
            if (res.status === 403) {
                // Insufficient credits, let the parent handle the modal
                if (onCustomize) onCustomize({ type: "insufficient_credits" });
                return;
            }

            if (!res.ok) { setError(data.error); return }
            
            if (action === "analyze") setAnalyzeResult(data.result)
            if (action === "customize") setCustomizeResult(data.result)
            if (action === "ats-check") setAtsResult(data.result)
            
            // Refresh parent credits
            if (onCustomize) onCustomize({ type: "refresh_credits" });
        } catch { setError("Error de conexión. Intenta de nuevo.") }
        finally { setIsLoading(false); setLoadingAction("") }
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="p-6 sm:p-8 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 flex items-center gap-3 leading-tight">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shrink-0">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        </div>
                        Personalización para Vacante Real
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                        Pega la descripción del puesto aquí. Pierre adaptará tu CV para maximizar tu relevancia técnica y asegurar que superas los filtros ATS más estrictos.
                    </p>
                </div>
            </div>

            <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">📋 Descripción de la Oferta Laboral</label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => { setJobDescription(e.target.value); setError("") }}
                    rows={8}
                    placeholder="Pega aquí el texto completo de la oferta de trabajo..."
                    className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all resize-none text-base leading-relaxed"
                />
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100">
                    <p className="text-sm font-bold text-red-600">{error}</p>
                </div>
            )}

            <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="min-h-[4rem] h-auto py-3 rounded-2xl border-2 border-slate-100 bg-white hover:border-amber-400 font-black gap-3 text-xs uppercase" onClick={() => callApi("analyze")} disabled={isLoading}>
                    {isLoading && loadingAction === "analyze" ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> : <Search className="w-4 h-4 text-amber-500" />}
                    Analizar Oferta
                </Button>
                <Button className="min-h-[4rem] h-auto py-3 rounded-2xl bg-slate-950 text-white font-black gap-3 text-xs uppercase shadow-xl shadow-black/20 hover:bg-slate-900 transition-all" onClick={() => callApi("customize")} disabled={isLoading}>
                    {isLoading && loadingAction === "customize" ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Target className="w-4 h-4 text-amber-400" />}
                    Adaptar mi CV
                </Button>
                <Button variant="outline" className="min-h-[4rem] h-auto py-3 rounded-2xl border-2 border-slate-100 bg-white hover:border-amber-400 font-black gap-3 text-xs uppercase" onClick={() => callApi("ats-check")} disabled={isLoading}>
                    {isLoading && loadingAction === "ats-check" ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> : <ShieldCheck className="w-4 h-4 text-amber-500" />}
                    Verificar ATS
                </Button>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500">
                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                     </div>
                     <p className="text-lg font-black text-slate-900">Pierre está ejecutando la acción...</p>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Este proceso toma unos segundos</p>
                </div>
            )}

            {/* Results sections would follow here with same solid white bg + border-2 slate-100 standard */}
            {analyzeResult && (
                <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 space-y-6 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900">Análisis Técnico Táctico</h4>
                    {/* ... (Implementation details consistent with design) */}
                </div>
            )}
        </div>
    )
}

// ============= COVER LETTER TAB =============
function CoverLetterTab({ cvText }: { cvText: string }) {
    const [editableCvText, setEditableCvText] = useState(cvText)
    const [userName, setUserName] = useState("")
    const [contactName, setContactName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [targetRole, setTargetRole] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<any>(null)
    const [tone, setTone] = useState("formal")

    // Update editable text if main CV changes
    useEffect(() => {
        if (cvText && !editableCvText) {
            setEditableCvText(cvText)
        }
    }, [cvText])

    const handleGenerate = async () => {
        if (!editableCvText.trim() || editableCvText.trim().length < 50) {
            setError("Tu perfil/CV parece estar vacío o ser demasiado corto.")
            return
        }
        if (!jobDescription.trim() || jobDescription.trim().length < 30) {
            setError("Pega el Job Description completo.")
            return
        }
        if (!hasStrategyActionsRemaining()) {
            setError("Reserva de aplicaciones agotada. Sube de nivel o espera al siguiente ciclo."); 
            return
        }
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    cvText: editableCvText, 
                    jobDescription, 
                    tone,
                    contactName,
                    companyName,
                    targetRole
                }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error); return }
            consumeStrategyAction("cover_letter")
            setResult(data.result)
        } catch { setError("Error de conexión con el motor estratégico.") }
        finally { setIsLoading(false) }
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="p-6 sm:p-8 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 flex items-center gap-3 leading-tight">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shrink-0">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        </div>
                        Generador de Cover Letter
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                        Cada aplicación debe ser única. Genera una carta de presentación profesional alineada con los valores de la empresa y los estándares canadienses.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">👤 Tu Nombre Legal (Firma)</label>
                    <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 transition-all font-bold"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">🏢 Empresa (Opcional)</label>
                    <input 
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ej. Google, Shopify..."
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 transition-all font-bold"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">🤝 Nombre de Contacto (Opcional)</label>
                    <input 
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ej. John Smith, HR Manager..."
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 transition-all font-bold"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">🎯 Rol / Posición (Opcional)</label>
                    <input 
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Ej. Project Manager..."
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 transition-all font-bold"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">📋 Job Description *</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={3}
                        placeholder="Pega aquí la oferta de trabajo..."
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 transition-all resize-none text-sm"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">📄 CV / Perfil Base (Puedes editarlo para esta carta)</label>
                <textarea
                    value={editableCvText}
                    onChange={(e) => setEditableCvText(e.target.value)}
                    rows={5}
                    placeholder="Aquí aparecerá tu CV actual, pero puedes modificarlo..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-600 placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:bg-white transition-all resize-none text-xs leading-relaxed"
                />
            </div>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-1">🎭 Selecciona el Tono de la Carta</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { id: "formal", label: "Formal", icon: ShieldCheck, desc: "Corporativo y Serio" },
                        { id: "cercano", label: "Cercano", icon: User, desc: "Moderno y Directo" },
                        { id: "espontaneo", label: "Bold", icon: Zap, desc: "Creativo / Startups" },
                        { id: "amigable", label: "Friendly", icon: Heart, desc: "Humano / Soft Skills" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTone(t.id)}
                            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group ${tone === t.id 
                                ? "bg-slate-950 border-slate-950 text-white shadow-xl translate-y-[-2px]" 
                                : "bg-white border-slate-100 text-slate-500 hover:border-primary/30"}`}
                        >
                            <t.icon className={`w-5 h-5 ${tone === t.id ? "text-amber-400" : "text-slate-400 group-hover:text-primary"}`} />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-wider leading-none mb-1">{t.label}</div>
                                <div className={`text-[8px] font-bold ${tone === t.id ? "text-white/60" : "text-slate-300"}`}>{t.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm">{error}</div>}

            <Button size="lg" className="h-16 w-full rounded-2xl bg-slate-950 text-white font-black gap-3 text-xs uppercase shadow-xl hover:bg-slate-900 transition-all border-none" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                {isLoading ? "PROYECTANDO CARTA..." : "GENERAR COVER LETTER PRO"}
            </Button>

            {result && (
                <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 space-y-6 shadow-sm overflow-hidden relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <h4 className="text-lg font-black text-slate-900">Tu Carta de Presentación</h4>
                            <div className="px-2 py-1 rounded bg-slate-100 text-[8px] font-black text-slate-500 uppercase">Tono: {tone}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CopyButton text={result.coverLetter} />
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-xl border-2 border-primary text-primary font-black text-[10px] uppercase px-4 h-10 hover:bg-primary hover:text-white transition-all"
                                onClick={() => downloadCoverLetterPDF({ ...result, userName })}
                            >
                                <Download className="w-3 h-3 mr-2" />
                                Descargar PDF
                            </Button>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-6">
                        <pre className="text-lg text-slate-800 whitespace-pre-wrap font-sans leading-relaxed italic">"{result.coverLetter}"</pre>
                    </div>
                </div>
            )}
        </div>
    )
}

// ============= INTERVIEW TAB =============
function InterviewTab({ cvText, onAction, onCreditLimit }: { cvText: string; onAction?: () => void; onCreditLimit?: () => void }) {
    const [editableCvText, setEditableCvText] = useState(cvText)
    const [jobDescription, setJobDescription] = useState("")
    const [category, setCategory] = useState("mixed")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<any>(null)
    const [expandedQ, setExpandedQ] = useState<string | null>(null)
    const [visibleTech, setVisibleTech] = useState(3)
    const [visibleBeh, setVisibleBeh] = useState(3)

    // Sync if prop changes
    useEffect(() => {
        if (cvText && !editableCvText) {
            setEditableCvText(cvText)
        }
    }, [cvText])

    const handleGenerate = async (isMore = false) => {
        if (!jobDescription.trim() || jobDescription.trim().length < 30) {
            setError("Pega el Job Description completo.")
            return
        }
        
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/interview-prep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    cvText: editableCvText, 
                    jobDescription,
                    category: isMore ? category : (category === 'mixed' ? 'mixed' : category)
                }),
            })
            const data = await res.json()

            if (res.status === 403) {
                if (onCreditLimit) onCreditLimit();
                return;
            }

            if (!res.ok) { setError(data.error); return }
            
            if (onAction) onAction();

            if (isMore && result) {
                // APPEND logic
                setResult({
                    ...data.result,
                    technicalQuestions: [
                        ...(result.technicalQuestions || []),
                        ...(data.result.technicalQuestions || [])
                    ],
                    behavioralQuestions: [
                        ...(result.behavioralQuestions || []),
                        ...(data.result.behavioralQuestions || [])
                    ]
                })
            } else {
                // Initial generation
                setResult(data.result)
            }
        } catch { setError("Error de conexión.") }
        finally { setIsLoading(false) }
    }

    return (
        <div className="space-y-8 text-slate-900">
             <div className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
                            <MessageSquare className="w-5 h-5 text-amber-400" />
                        </div>
                        Preparación Táctica de Entrevista
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                        Anticiparse es ganar. Pierre proyectará las preguntas técnicas y conductuales más probables, dándote la estrategia ganadora para cada una.
                    </p>
                </div>
            </div>

            {/* STAR Method Explainer */}
            <div className="p-8 rounded-[2.5rem] border-2 border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                     <div className="w-2 h-8 bg-amber-500 rounded-full" />
                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Metodología de Éxito STAR</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { letter: "S", label: "Situación", desc: "Contexto del evento" },
                        { letter: "T", label: "Tarea", desc: "Tu responsabilidad" },
                        { letter: "A", label: "Acción", desc: "Lo que hiciste tú" },
                        { letter: "R", label: "Resultado", desc: "Impacto medible" },
                    ].map((s) => (
                        <div key={s.letter} className="p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50 hover:bg-white hover:border-amber-400/20 transition-all text-center">
                            <div className="text-4xl font-black text-amber-500 mb-2 leading-none">{s.letter}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">{s.label}</div>
                            <div className="text-[9px] font-medium text-slate-400 leading-tight">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 px-1">📋 Job Description *</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={6}
                        placeholder="Pega aquí la descripción completa del puesto..."
                        className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all resize-none text-base"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 px-1">📄 Perfil / CV (Datos para tus respuestas)</label>
                    <textarea
                        value={editableCvText}
                        onChange={(e) => setEditableCvText(e.target.value)}
                        rows={6}
                        placeholder="Edita tu perfil para personalizar las respuestas..."
                        className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-100 bg-slate-50 text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-white transition-all resize-none text-sm leading-relaxed"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 px-1">🎯 Tipo de Entrenamiento</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'mixed', label: 'Mix (Sugerido)' },
                        { id: 'technical', label: 'Solo Técnicas' },
                        { id: 'behavioral', label: 'Solo Conductuales' }
                    ].map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setCategory(c.id)}
                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all tracking-wider ${
                                category === c.id 
                                ? 'bg-slate-950 text-white shadow-lg' 
                                : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/40'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm">{error}</div>}

            <Button size="lg" className="h-16 w-full rounded-2xl bg-slate-950 text-white font-black gap-3 text-xs uppercase shadow-xl shadow-black/20 hover:bg-slate-900 transition-all border-none" onClick={() => handleGenerate(false)} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> : <Rocket className="w-5 h-5 text-amber-400" />}
                {isLoading ? "MAPEANDO ESCENARIOS..." : "PREDECIR PREGUNTAS DE ENTREVISTA"}
            </Button>

            {result && (
                <div className="space-y-10 mt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl gap-8">
                        <div className="text-center sm:text-left">
                            <h4 className="text-white text-2xl font-black tracking-tight mb-1">Arsenal de Preparación PRO</h4>
                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Protocolo Pierre Activado</p>
                        </div>
                        <Button className="h-14 px-8 rounded-2xl font-black bg-white text-slate-950 hover:bg-slate-200 gap-3 border-none flex-shrink-0" onClick={() => downloadInterviewPDF(result)}>
                            <Download className="w-4 h-4" /> DESCARGAR GUÍA PDF
                        </Button>
                    </div>

                    {result.technicalQuestions && result.technicalQuestions.length > 0 && (
                        <div className="space-y-6">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-[0.1em] mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-primary rounded-full" />
                                Preguntas Técnicas ({result.technicalQuestions.length})
                            </h4>
                            <div className="space-y-4">
                                {result.technicalQuestions.map((q: any, i: number) => {
                                    const key = `tech-${i}`;
                                    const isExpanded = expandedQ === key;
                                    return (
                                        <div key={i} className="rounded-[2.5rem] border-2 border-slate-100 bg-white hover:border-primary/20 transition-all shadow-sm overflow-hidden">
                                            <button onClick={() => setExpandedQ(isExpanded ? null : key)} className="w-full text-left p-6 flex items-center justify-between gap-6 group">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all shadow-sm ${isExpanded ? 'bg-primary text-white translate-x-1' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-lg font-black text-slate-800 leading-tight">{q.question}</span>
                                                </div>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isExpanded ? 'bg-primary/10 text-primary rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                                                    <ChevronDown className="w-5 h-5" />
                                                </div>
                                            </button>
                                            {isExpanded && (
                                                <div className="px-8 pb-8 space-y-8 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-top-4 bg-white">
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Estrategia Ganadora (STAR):</span>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                            {q.starTemplate && Object.entries(q.starTemplate).map(([k, v]: [string, any]) => (
                                                                <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                                    <span className="text-[8px] font-black uppercase text-amber-500 block mb-1">{k}</span>
                                                                    <p className="text-[10px] text-slate-600 leading-tight font-medium">{v}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 relative shadow-2xl overflow-hidden group/box">
                                                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-4">Respuesta Maestra (Experiencia CV):</span>
                                                        <p className="text-lg text-white leading-relaxed italic font-medium">"{q.sampleAnswer}"</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {result.behavioralQuestions && result.behavioralQuestions.length > 0 && (
                        <div className="space-y-6">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-[0.1em] mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-amber-500 rounded-full" />
                                Preguntas de Comportamiento ({result.behavioralQuestions.length})
                            </h4>
                            <div className="space-y-4">
                                {result.behavioralQuestions.map((q: any, i: number) => {
                                    const key = `beh-${i}`;
                                    const isExpanded = expandedQ === key;
                                    return (
                                        <div key={i} className="rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 bg-white hover:border-amber-400/20 transition-all shadow-sm overflow-hidden">
                                            <button onClick={() => setExpandedQ(isExpanded ? null : key)} className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-4 sm:gap-6 group">
                                                <div className="flex items-center gap-3 sm:gap-5">
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-xs sm:text-sm transition-all shadow-sm shrink-0 ${isExpanded ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-sm sm:text-lg font-black text-slate-800 leading-tight">{q.question}</span>
                                                </div>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isExpanded ? 'bg-amber-500/10 text-amber-500 rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                                                    <ChevronDown className="w-5 h-5" />
                                                </div>
                                            </button>
                                            {isExpanded && (
                                                <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-6 sm:space-y-8 border-t border-slate-100 pt-6 sm:pt-8 animate-in fade-in slide-in-from-top-4 bg-white">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {Object.entries(q.starTemplate || {}).map(([step, val]: [string, any]) => (
                                                            <div key={step} className="p-4 rounded-2xl bg-amber-50/30 border border-amber-100">
                                                                <span className="text-[8px] font-black uppercase text-amber-600 block mb-1">{step}</span>
                                                                <p className="text-[10px] sm:text-[11px] text-slate-700 font-medium leading-relaxed">{val}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-6 sm:p-8 bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 relative shadow-2xl overflow-hidden group/box">
                                                        <span className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest block mb-4">Estrategia Ganadora:</span>
                                                        <p className="text-base sm:text-lg text-white leading-relaxed italic font-medium">"{q.sampleAnswer}"</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">¿Quieres más profundidad?</p>
                        <Button 
                            variant="outline" 
                            className="min-h-[4rem] h-auto py-3 px-8 sm:px-12 rounded-2xl border-2 border-slate-900 text-slate-900 font-black hover:bg-slate-900 hover:text-white transition-all gap-3 text-[10px] sm:text-xs uppercase w-full sm:w-auto"
                            onClick={() => handleGenerate(true)}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500 shrink-0" />}
                            <span className="leading-tight">Generar 3 Escenarios más (1 Crédito)</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
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
            subject: "[Votre Rôle] experimentado(e) — Ouvert(e) aux opportunités au [Province]",
            body: `Bonjour [Nom du Recruteur],

J'ai découvert [Nom de l'Entreprise] en faisant des recherches sur les entreprises dans le domaine de [industrie] et j'ai été impressionné(e) par le travail de votre equipo en [domaine spécifique].

Je suis [Votre Rôle] avec [X] ans d'expérience en [industrie/spécialisation]. Je me suis récemment installé(e) au Canada et je suis activement à la recherche d'opportunités où je pourrais contribuer avec mon expertise en [2-3 compétences clés].

J'aimerais en saber plus sur les postes à venir qui pourraient correspondre à mon profil. Veuillez encontrar mi CV ci-joint.

Seriez-vous disponible para un bref appel esta semana?

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
                { en: "Thank you so much for your time. I really appreciate it.", phonetic: "Zenk yu so moch for yor taim. Ai rili aprishieit it.", es: "Muchas gracias por su tiempo. Lo aprecio mucho." }
            ]
        }
    ]

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="p-6 sm:p-8 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 flex items-center gap-3 leading-tight">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shrink-0">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        </div>
                        Scripts de Contacto Maestro
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                        Plantillas tácticas para contactar reclutadores y empresas por email o teléfono, optimizadas para el mercado canadiense.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {emailScripts.map((script) => {
                    const isExpanded = expandedScript === script.id;
                    return (
                        <div key={script.id} className="rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 bg-white overflow-hidden shadow-sm hover:border-primary/20 transition-all duration-300">
                            <button onClick={() => setExpandedScript(isExpanded ? null : script.id)} className="w-full text-left p-5 sm:p-6 flex items-center justify-between group gap-4">
                                <div className="flex items-center gap-3 sm:gap-5">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-[8px] sm:text-[10px] text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all uppercase shrink-0">{script.lang.split(' ')[0]}</div>
                                    <h5 className="text-sm sm:text-lg font-black text-slate-900 leading-tight">{script.title}</h5>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-amber-400/10 text-amber-500 rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-6 border-t border-slate-100 pt-6 sm:pt-8 animate-in fade-in slide-in-from-top-4">
                                     <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Script (English/French)</span>
                                            <div className="self-end sm:self-center">
                                                <CopyButton text={script.body} />
                                            </div>
                                        </div>
                                        <pre className="text-sm sm:text-lg text-slate-800 whitespace-pre-wrap font-sans leading-relaxed italic border-l-4 border-primary/20 pl-4 sm:pl-6">"{script.body}"</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

// ============= JOB BOARDS TAB =============
interface JobBoard {
    name: string;
    category: "Federal" | "Tech" | "Salud" | "General" | "Ferias" | "Networking" | "Asentamiento" | "Nicho" | "Remoto" | "Salarios" | "Voluntariado";
    type: "Portal" | "Feria" | "Evento" | "Agencia" | "Herramienta";
    province: string;
    description: string;
    url: string;
    icon: React.ElementType;
    color: string;
    tip?: string;
}

function JobBoardTab({ initialProvince }: { initialProvince?: string }) {
    const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince || "National");
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { id: "Todos", icon: Globe },
        { id: "Federal", icon: ShieldCheck },
        { id: "Tech", icon: Zap },
        { id: "Ferias", icon: Target },
        { id: "Networking", icon: MessageSquare },
        { id: "Asentamiento", icon: User },
        { id: "Nicho", icon: Rocket },
        { id: "Remoto", icon: Globe },
        { id: "Salarios", icon: Download },
        { id: "Voluntariado", icon: Heart },
        { id: "General", icon: Search },
    ];
    
    const provinces = [
        "National", "Ontario", "British Columbia", "Quebec", 
        "Alberta", "Saskatchewan", "Manitoba", "New Brunswick", 
        "Nova Scotia", "PEI", "Newfoundland", "Yukon", "NWT", "Nunavut"
    ];

    const allBoards: JobBoard[] = [
        // FEDERAL & NATIONAL
        { name: "Job Bank Canada", category: "Federal", type: "Portal", province: "National", description: "Portal oficial federal. Imprescindible para ver vacantes con historial LMIA.", url: "https://www.jobbank.gc.ca/", icon: Globe, color: "bg-red-500", tip: "Busca por 'LMIA' en el buscador para ver empresas abiertas a extranjeros." },
        { name: "Indeed Canada", category: "General", type: "Portal", province: "National", description: "El mayor buscador privado. Ideal para alertas diarias masivas.", url: "https://ca.indeed.com/", icon: Search, color: "bg-blue-600" },
        { name: "LinkedIn Canada", category: "Networking", type: "Portal", province: "National", description: "Esencial para el mercado oculto y networking directo.", url: "https://www.linkedin.com/jobs/", icon: Share2, color: "bg-blue-700", tip: "No pidas trabajo, pide 'informational interviews' a gente en tu mismo NOC." },
        
        // SETTLEMENT AGENCIES (ASENTAMIENTO)
        { name: "ACCES Employment", category: "Asentamiento", type: "Agencia", province: "Ontario", description: "Agencia clave pro-inmigrante con programas sectoriales (Finance, IT, Supply Chain).", url: "https://accesemployment.ca/", icon: User, color: "bg-emerald-500", tip: "Tienen programas 'Bridge' que te conectan directamente con empleadores." },
        { name: "S.U.C.C.E.S.S. BC", category: "Asentamiento", type: "Agencia", province: "British Columbia", description: "La agencia más grande de BC para apoyo laboral y social a recién llegados.", url: "https://www.successbc.ca/", icon: User, color: "bg-blue-500", tip: "Sus ferias de empleo internas son menos masivas y más efectivas." },
        { name: "Settlement.org Jobs", category: "Asentamiento", type: "Portal", province: "Ontario", description: "Bolsa de empleo especializada para inmigrantes en Ontario.", url: "https://settlement.org/ontario/employment/", icon: User, color: "bg-sky-500" },

        // JOB FAIRS (FERIAS)
        { name: "Career Fair Canada", category: "Ferias", type: "Feria", province: "National", description: "La mayor organizadora de ferias presenciales en Toronto, Vancouver y Calgary.", url: "https://careerfaircanada.ca/", icon: Target, color: "bg-orange-500", tip: "Lleva tu CV perfectamente impreso. ¡Espera colas!" },
        { name: "FIFO Jobs Canada", category: "General", type: "Portal", province: "National", description: "Especializado en trabajos de rotación (Fly-In Fly-Out) en Minería, Petróleo y Construcción.", url: "https://fifojobs.ca/", icon: Target, color: "bg-amber-600", tip: "Ideal si buscas altos salarios y no te importa trabajar en zonas remotas." },
        { name: "Techfest", category: "Ferias", type: "Feria", province: "National", description: "Ferias de reclutamiento exclusivas para perfiles Tech (Devs, Data, UI).", url: "https://techfest.eco/", icon: Zap, color: "bg-indigo-600", tip: "Ideal para networking con startups que no publican en LinkedIn." },

        // NICHE (NICHO)
        { name: "Health Match BC", category: "Nicho", type: "Portal", province: "British Columbia", description: "Portal oficial para profesionales de Salud (Médicos, Enfermería, Tech Salud).", url: "https://www.healthmatchbc.org/", icon: Rocket, color: "bg-red-600", tip: "Si eres del sector Salud, ignora el resto y enfócate aquí." },
        { name: "BuildForce Canada", category: "Nicho", type: "Portal", province: "National", description: "Pronósticos y empleos en el sector Construcción y Oficios en todo el país.", url: "https://www.buildforce.ca/", icon: Zap, color: "bg-slate-700", tip: "El sector construcción es de los más abiertos a contratar talento internacional." },
        { name: "Education Canada", category: "Nicho", type: "Portal", province: "National", description: "La red de empleo más grande para el sector Educación y Academia.", url: "https://educationcanada.com/", icon: Target, color: "bg-emerald-700" },

        // REMOTE (REMOTO)
        { name: "Remotive (CA Filter)", category: "Remoto", type: "Portal", province: "National", description: "Ofertas 100% remotas filtradas específicamente para residentes en Canadá.", url: "https://remotive.com/remote-jobs/canada", icon: Globe, color: "bg-indigo-500", tip: "Busca empresas con 'Async culture' para evitar choques de horario." },
        { name: "WeWorkRemotely CA", category: "Remoto", type: "Portal", province: "National", description: "La mayor bolsa de trabajo remoto en el mundo, sección canadiense.", url: "https://weworkremotely.com/categories/remote-jobs-in-canada", icon: Globe, color: "bg-rose-600" },

        // SALARY (SALARIOS)
        { name: "Glassdoor Salaries", category: "Salarios", type: "Herramienta", province: "National", description: "Compara tu salario ofrecido contra la media real de la ciudad.", url: "https://www.glassdoor.ca/Salaries/index.htm", icon: Download, color: "bg-emerald-900", tip: "Úsalo *antes* de la entrevista para tener un rango de negociación sólido." },
        { name: "Talent.com (Salary)", category: "Salarios", type: "Herramienta", province: "National", description: "Calculadora de impuestos Netos vs Brutos por cada provincia de Canadá.", url: "https://ca.talent.com/salary", icon: Download, color: "bg-indigo-900", tip: "Recuerda que en Canadá el salario se discute ANTES de impuestos." },

        // VOLUNTEERING (VOLUNTARIADO)
        { name: "Volunteer Canada", category: "Voluntariado", type: "Agencia", province: "National", description: "La vía más rápida para obtener la 'Canadian Experience' en tu profesión.", url: "https://volunteer.ca/", icon: Heart, color: "bg-rose-400", tip: "Busca voluntariado 'Skill-based' (ej. Contabilidad para ONGs)." },

        // NETWORKING
        { name: "Eventbrite CA", category: "Networking", type: "Evento", province: "National", description: "Encuentra Mixers y Networking profesional gratuitos en tu ciudad.", url: "https://www.eventbrite.ca/d/canada--toronto/networking/", icon: Target, color: "bg-rose-500" },
        { name: "Meetup Tech CA", category: "Networking", type: "Evento", province: "National", description: "Comunidades técnicas para networking real y cara a cara.", url: "https://www.meetup.com/find/tech-networking/", icon: MessageSquare, color: "bg-red-600" },

        // PROVINCIAL SPECIFIC
        { name: "WorkBC", category: "General", type: "Portal", province: "British Columbia", description: "Recurso oficial número 1 para BC. Incluye perfiles de industria y salarios locales.", url: "https://www.workbc.ca/", icon: MapIcon, color: "bg-emerald-600" },
        { name: "Emploi-Québec", category: "General", type: "Portal", province: "Quebec", description: "Guichet Emploi para el mercado francófono. Crucial para QC.", url: "https://www.guichetemploi.gc.ca/", icon: Globe, color: "bg-blue-800" },
        { name: "Ontario Job Bank", category: "General", type: "Portal", province: "Ontario", description: "Filtros específicos para el mercado de Ontario y GTA.", url: "https://www.jobbank.gc.ca/jobsearch/jobsearch?locationstring=ON", icon: Target, color: "bg-red-700" },
        { name: "Alis Alberta", category: "General", type: "Portal", province: "Alberta", description: "Especialmente fuerte en Energía, Construcción y Salud.", url: "https://alis.alberta.ca/", icon: Target, color: "bg-indigo-600" },
        { name: "SaskJobs", category: "General", type: "Portal", province: "Saskatchewan", description: "El portal clave para las Praderas y procesos migratorios rurales.", url: "https://www.saskjobs.ca/", icon: MapIcon, color: "bg-yellow-600" },
        { name: "Manitoba Jobs", category: "General", type: "Portal", province: "Manitoba", description: "Portal oficial del gobierno de Manitoba. Vital para el MPNP.", url: "https://www.gov.mb.ca/govjobs/", icon: Target, color: "bg-red-400" },
        { name: "NBJobs.ca", category: "General", type: "Portal", province: "New Brunswick", description: "Portal central de empleo para New Brunswick (Atlántico).", url: "https://www.nbjobs.ca/", icon: Target, color: "bg-blue-500" },
        { name: "NS Job Bank", category: "General", type: "Portal", province: "Nova Scotia", description: "Oportunidades en Halifax y todo el sector costero de NS.", url: "https://jobs.novascotia.ca/", icon: Target, color: "bg-sky-600" },
        { name: "WorkPEI.ca", category: "General", type: "Portal", province: "PEI", description: "La base de datos de empleo más grande para Prince Edward Island.", url: "https://workpei.ca/", icon: Target, color: "bg-emerald-500" },
        { name: "NL Job Bank", category: "General", type: "Portal", province: "Newfoundland", description: "Conexiones de empleo oficial en Newfoundland and Labrador.", url: "https://www.jobbank.gc.ca/jobsearch/jobsearch?locationstring=NL", icon: Target, color: "bg-blue-900" },
        { name: "Yukon Employment", category: "General", type: "Portal", province: "Yukon", description: "Oportunidades únicas en el Norte. Sueldos altos y baja competencia.", url: "https://yukon.ca/en/employment/find-job", icon: Target, color: "bg-amber-700" },
        { name: "NWT Careers", category: "General", type: "Portal", province: "NWT", description: "Portal oficial para Northwest Territories. Sector público y privado.", url: "https://www.gov.nt.ca/careers/", icon: Target, color: "bg-indigo-800" },
        { name: "Nunavut Jobs", category: "General", type: "Portal", province: "Nunavut", description: "Public Service and private sector jobs within Nunavut Territory.", url: "https://www.gov.nu.ca/public-jobs", icon: Target, color: "bg-yellow-400" },
    ];

    const filteredBoards = allBoards.filter(board => {
        const matchesProv = selectedProvince === "National" || board.province === "National" || board.province === selectedProvince;
        const matchesCat = selectedCategory === "Todos" || board.category === selectedCategory;
        const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             board.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesProv && matchesCat && matchesSearch;
    });

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-6 sm:p-8 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2 flex items-center gap-3 leading-tight">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shrink-0">
                                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                                </div>
                                Súper Canal de Oportunidades PRO
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 px-1">
                                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                                    Acceso nacional total: desde ferias masivas hasta el mercado oculto y herramientas salariales.
                                </p>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[7px] sm:text-[8px] font-black text-emerald-600 uppercase tracking-widest animate-pulse shadow-sm">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                    Exploración Ilimitada
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-slate-950 text-white text-[9px] font-black uppercase tracking-tighter shadow-xl self-end sm:self-center shrink-0">
                            {filteredBoards.length} Canales Activos
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Search Bar Row */}
                <div className="w-full">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar portal por nombre o palabra clave..."
                            className="w-full pl-11 pr-5 py-4 rounded-3xl bg-white border-2 border-slate-100 focus:border-primary/40 focus:outline-none transition-all text-sm font-black text-slate-900 shadow-sm placeholder:text-slate-300"
                        />
                    </div>
                </div>

                {/* Province Filter */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">🗺️ Provincia / Territorio:</span>
                        <span className="text-[9px] font-bold text-slate-300 sm:hidden italic">Desliza para ver más →</span>
                    </div>
                    <div className="flex sm:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 px-1 -mx-1">
                        {provinces.map(prov => (
                            <button
                                key={prov}
                                onClick={() => setSelectedProvince(prov)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border-2 whitespace-nowrap
                                    ${selectedProvince === prov 
                                        ? "bg-slate-950 border-slate-950 text-white shadow-lg" 
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                            >
                                {prov}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categories Tab Group */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">⚡ Categoría Táctica:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => {
                            const CatIcon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2
                                        ${selectedCategory === cat.id 
                                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                            : "bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200"}`}
                                >
                                    <CatIcon className="w-3 h-3" />
                                    {cat.id}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredBoards.map((board, i) => (
                    <a 
                        key={i} 
                        href={board.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`group p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.2rem] border-2 bg-white hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm h-full
                            ${board.type === 'Feria' ? 'border-orange-100 hover:border-orange-400' : 
                              board.type === 'Evento' ? 'border-rose-100 hover:border-rose-400' : 
                              board.type === 'Agencia' ? 'border-emerald-100 hover:border-emerald-400' : 'border-slate-100 hover:border-primary/50'}`}
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl ${board.color} flex items-center justify-center group-hover:scale-110 transition-all shadow-lg`}>
                                    <board.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter
                                    ${board.type === 'Feria' ? 'bg-orange-100 text-orange-600' : 
                                      board.type === 'Evento' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {board.type}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <h5 className="text-xl font-black text-slate-900 leading-tight">{board.name}</h5>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{board.description}</p>
                            
                            {board.tip && (
                                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-4 animate-in fade-in duration-1000">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Estrategia Pierre</span>
                                    </div>
                                    <p className="text-[11px] font-medium text-amber-900/80 leading-relaxed italic">
                                        "{board.tip}"
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                             <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                Abrir Oportunidad <Target className="w-3 h-3" />
                             </span>
                        </div>

                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                            <span className="text-[40px] font-black text-slate-950 select-none">
                                {board.province === "National" ? "CA" : board.province.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            {filteredBoards.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <EyeOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No hay resultados específicos para esta búsqueda.</p>
                    <button onClick={() => {setSelectedProvince("National"); setSelectedCategory("Todos");}} className="mt-4 text-primary font-black text-[10px] uppercase underline">Ver todos los portales Federales</button>
                </div>
            )}
        </div>
    )
}

function UsageBanner({ credits, isTrial, onUpgrade }: { credits: number, isTrial: boolean, onUpgrade: () => void }) {
    if (!isTrial) return null;

    const isOutOfCredits = credits <= 0;

    return (
        <div className="max-w-7xl mx-auto mb-12">
            <div className={`p-8 rounded-[2.5rem] border-2 flex flex-col sm:flex-row items-center gap-6 shadow-sm transition-all ${isOutOfCredits ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isOutOfCredits ? 'bg-red-500 shadow-red-500/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
                    <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h4 className={`font-black uppercase text-xs tracking-widest mb-1 ${isOutOfCredits ? 'text-red-950' : 'text-orange-950'}`}>
                        {isOutOfCredits ? '¡Beca Agotada!' : '¡Acciones Limitadas de Beca!'}
                    </h4>
                    <p className={`text-base font-bold leading-tight ${isOutOfCredits ? 'text-red-900/80' : 'text-orange-900/80'}`}>
                        {isOutOfCredits 
                            ? 'Has alcanzado el límite de Pierre (10 acciones). Para continuar con el soporte premium de IA, mejora tu cuenta.'
                            : `Te quedan ${credits} aplicaciones estratégicas. Selecciona tus vacantes con sabiduría técnica.`}
                    </p>
                </div>
                <Button 
                    className={`h-12 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${isOutOfCredits ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'}`}
                    onClick={onUpgrade}
                >
                    Mejorar a PRO <Sparkles className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

// ============= MAIN COMPONENT =============
export default function StrategyResources({ cvText, onCustomize, resultData }: { cvText: string; onCustomize?: (data: any) => void; resultData?: any }) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<string>("engine-pro");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isProModalOpen, setIsProModalOpen] = useState(false);

    // Fetch live credits/profile
    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (data.user) setProfile(data.user);
        } catch (e) {
            console.error("Error fetching profile credits:", e);
        }
    };

    // Signal dashboard entry for root layout on mount
    useEffect(() => {
        const event = new CustomEvent("pierre-dashboard-enter");
        window.dispatchEvent(event);
        fetchProfile();
    }, []);

    // Refresh credits when tab changes or major actions occur
    useEffect(() => {
        fetchProfile();
    }, [activeTab]);

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="h-screen sm:h-[100dvh] flex flex-col bg-slate-50 overflow-hidden animate-in fade-in duration-1000 relative">
            {/* Slim Dash Header - FIXED TOP */}
            <header className="bg-slate-950 border-b border-white/10 px-4 sm:px-8 py-3 sm:py-4 shrink-0 z-[60] flex items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_70%)] pointer-events-none" />
                
                <div className="flex items-center gap-4 sm:gap-8 relative z-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <h1 className="text-base sm:text-2xl font-black text-white tracking-tighter leading-none shrink-0">
                                Centro <span className="text-amber-400 italic font-black">Estrategia</span>
                            </h1>
                            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-[7px] sm:text-[8px] font-black text-white uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                                <span className="hidden xs:inline">Pierre</span> PRO Mode
                            </div>
                        </div>
                        {session?.user?.email && (
                            <p className="text-[9px] font-black text-amber-400/60 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1">
                                <User className="w-2.5 h-2.5" />
                                {session.user.email}
                            </p>
                        )}
                        <p className="hidden sm:block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-0.5">Arsenal Táctico • v2.5.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 relative z-10">
                    <div className="hidden lg:flex items-center gap-6 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 mr-4">
                         <div className="text-right">
                             <div className="text-primary text-[8px] font-black uppercase tracking-widest">
                                {profile?.isTrial ? "Créditos de Beca" : "Acceso Estratégico"}
                             </div>
                             <div className="text-white text-xs font-bold font-mono tracking-widest">
                                {profile?.isTrial ? `${profile.credits} / 10` : "ILIMITADO"}
                             </div>
                         </div>
                         <div className="w-px h-6 bg-white/10" />
                         <Button variant="ghost" className="h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-white gap-2 font-black text-[10px] uppercase group" onClick={() => downloadUserManualPDF()}>
                             <FileText className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" /> Manual
                         </Button>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                         <Button variant="outline" className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border-2 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:border-slate-500 font-black gap-2 text-[9px] sm:text-[10px] uppercase shadow-lg shadow-black/50" onClick={() => resultData && downloadFullReportPDF(resultData)}>
                            <Download className="w-3.5 h-3.5 text-white stroke-[3px]" /> <span className="hidden sm:inline">Reporte</span>
                        </Button>
                        <Button variant="outline" className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl border-2 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:border-slate-500 font-black shadow-lg shadow-black/50 flex items-center justify-center" onClick={() => resultData && downloadLMIAExcel(resultData)}>
                            <FileSpreadsheet className="w-4 h-4 text-emerald-300 stroke-[3px]" />
                        </Button>
                        <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />
                        <Button 
                            variant="ghost" 
                            className="h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all shadow-xl" 
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                        >
                             <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Secondary Navigation - TOP ON DESKTOP, BOTTOM ON MOBILE */}
                <div className="hidden sm:block bg-slate-50 border-b border-slate-200/60 px-8 py-3 z-50 shrink-0 shadow-sm">
                    <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-[10px] font-black transition-all shrink-0 uppercase tracking-[0.2em] border-2 ${isActive
                                        ? "bg-slate-950 text-white border-slate-950 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] scale-[1.02]"
                                        : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                     <Icon className={`w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* MOBILE BOTTOM NAVIGATION - REACHABLE BY THUMB */}
                <div className="sm:hidden fixed bottom-0 left-0 w-full bg-slate-950 border-t border-white/10 px-4 py-3 z-[100] shadow-[0_-20px_40px_rgba(0,0,0,0.4)] safe-area-bottom">
                    <div className="flex justify-around items-center">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center gap-1.5 transition-all outline-none ${isActive ? "text-amber-400 scale-110" : "text-white/60 hover:text-white"}`}
                                >
                                     <div className={`p-2.5 rounded-xl border-2 transition-all ${isActive ? "bg-amber-400/20 border-amber-400" : "bg-white/5 border-white/10"}`}>
                                        <Icon className={`w-5 h-5 text-amber-400 stroke-[2px] ${isActive ? "scale-110" : "opacity-80"}`} />
                                    </div>
                                    <span className={`text-[7px] font-black uppercase tracking-[0.1em] ${isActive ? "text-amber-400" : "text-slate-300"}`}>{isActive ? tab.label.split(' ')[0] : ''}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Dashboard Content - SCROLLABLE INTERNAL ONLY */}
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative overscroll-contain">
                    <div className="max-w-[1400px] mx-auto p-4 sm:p-10 pb-32 sm:pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <UsageBanner 
                            credits={profile?.credits ?? 0} 
                            isTrial={profile?.isTrial ?? false} 
                            onUpgrade={() => setIsProModalOpen(true)}
                        />
                        
                        <div className="bg-white rounded-[1.5rem] sm:rounded-[3.5rem] border-2 border-slate-100 shadow-[0_40px_100px_-30px_rgba(var(--primary-rgb),0.05)] p-4 sm:p-14 relative overflow-hidden min-h-[500px]">
                            <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-primary/20" />
                            {activeTab === "engine-pro" && <EmployabilityEnginePro cvText={cvText} onAction={() => fetchProfile()} onCreditLimit={() => setIsProModalOpen(true)} />}
                            {activeTab === "customize" && <CustomizeTab cvText={cvText} onCustomize={(data) => {
                                if (data?.type === "refresh_credits") fetchProfile();
                                if (data?.type === "insufficient_credits") setIsProModalOpen(true);
                                if (onCustomize) onCustomize(data);
                            }} />}
                            {activeTab === "job-boards" && <JobBoardTab initialProvince={resultData?.province} />}
                            {activeTab === "cover-letter" && <CoverLetterTab cvText={cvText} onAction={() => fetchProfile()} onCreditLimit={() => setIsProModalOpen(true)} />}
                            {activeTab === "interview" && <InterviewTab cvText={cvText} onAction={() => fetchProfile()} onCreditLimit={() => setIsProModalOpen(true)} />}
                            {activeTab === "scripts" && <ScriptsTab />}
                        </div>

                        <footer className="text-center opacity-40 pt-16 sm:pt-20 border-t border-slate-200 mt-16 sm:mt-20 px-4">
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-slate-900">Pierre Strategy Master Suite • © 2026</p>
                            <p className="text-[7px] sm:text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">Tecnología de Optimización Algorítmica Protegida bajo licencia PRO</p>
                        </footer>
                    </div>
                </main>
            </div>

            <ProPurchaseModal 
                isOpen={isProModalOpen}
                onClose={() => setIsProModalOpen(false)}
                onContinueToCheckout={() => window.open("/upsell", "_blank")}
                onGoToFreeReport={() => setActiveTab("job-boards")}
            />
        </div>
    );
}
