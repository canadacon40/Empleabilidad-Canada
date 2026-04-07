"use client"

import { useState } from "react"
import { Rocket, FileText, ArrowRight, Loader2, PlayCircle, Search, Target, CheckCircle2, AlertTriangle, ShieldAlert, AlertCircle, Copy, Check, Download, FileEdit, BookOpen, Layout, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadStyledCVPdf, downloadCustomizedCVWord } from "@/lib/report-utils"
import UserManual from "./UserManual"

export default function EmployabilityEnginePro({ cvText, onAction, onCreditLimit }: { cvText: string; onAction?: () => void; onCreditLimit?: () => void }) {
    const [step, setStep] = useState<"intro" | "redesign" | "match" | "customize">("intro")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    
    const [language, setLanguage] = useState<"English" | "French">("English")
    const [localCvText, setLocalCvText] = useState(cvText || "")
    const [redesignResult, setRedesignResult] = useState<any>(null)
    
    // Match State & Navigation
    const [activeTab, setActiveTab] = useState<"manual" | "base" | "radar" | "attack">("manual")
    const [cvStyle, setCvStyle] = useState<'Classic' | 'Elegant' | 'Modern'>('Elegant')
    const [jdText, setJdText] = useState("")
    const [matchResult, setMatchResult] = useState<any>(null)
    const [customizedCv, setCustomizedCv] = useState<any>(null)

    const handleRedesign = async () => {
        if (!localCvText) {
            setError("Por favor, pega el texto de tu currículum antes de continuar.")
            return
        }
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/cv-redesign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText: localCvText, language })
            })
            const data = await res.json()
            
            if (res.status === 403) {
                if (onCreditLimit) onCreditLimit();
                return;
            }

            if (!res.ok) throw new Error(data.error || "No se pudo rediseñar el CV")
            
            setRedesignResult(data.result)
            setStep("redesign")
            if (onAction) onAction();
        } catch (e: any) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleMatch = async () => {
        if (!jdText || jdText.length < 50) {
            setError("Por favor, pega el contenido completo de la oferta de trabajo (Job Description).")
            return
        }
        setIsLoading(true)
        setError("")
        setStep("match")
        try {
            const baseCvText = redesignResult?.redesignedCv ? 
                (typeof redesignResult.redesignedCv === 'string' ? redesignResult.redesignedCv : JSON.stringify(redesignResult.redesignedCv)) : 
                localCvText || cvText
                
            const res = await fetch("/api/jd-match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText: baseCvText, jdText })
            })
            const data = await res.json()

            if (res.status === 403) {
                if (onCreditLimit) onCreditLimit();
                return;
            }

            if (!res.ok) throw new Error(data.error || "No se pudo realizar el Match")
            
            setMatchResult(data.result)
            if (onAction) onAction();
        } catch (e: any) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCustomize = async () => {
        setIsLoading(true)
        setError("")
        setStep("match")
        try {
            const baseCvText = redesignResult?.redesignedCv ? 
                (typeof redesignResult.redesignedCv === 'string' ? redesignResult.redesignedCv : JSON.stringify(redesignResult.redesignedCv)) : 
                localCvText || cvText

            const res = await fetch("/api/cv-customize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText: baseCvText, jobDescription: jdText, action: "customize" })
            })
            const data = await res.json()

            if (res.status === 403) {
                if (onCreditLimit) onCreditLimit();
                return;
            }

            if (!res.ok) throw new Error(data.error || "No se pudo personalizar el CV")
            
            if (onAction) onAction();
            
            const customized = data.result;
            if (redesignResult?.redesignedCv && typeof redesignResult.redesignedCv !== 'string') {
                customized.personalInfo = redesignResult.redesignedCv.personalInfo;
                customized.languages = redesignResult.redesignedCv.languages;
            }

            setCustomizedCv(customized)
            setActiveTab("attack")
        } catch (e: any) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Redundant Master Header Removed to fit Dashboard Mode */}

            {/* TACTICAL WIZARD NAVIGATION - COMPACT DASHBOARD STYLE */}
            <div className="relative z-20">
                <div className="bg-slate-900 border-2 border-white/5 p-1 rounded-2xl sm:rounded-3xl shadow-xl grid grid-cols-2 sm:flex sm:flex-nowrap gap-1">
                    {[
                        { id: "manual", label: "ESTRATEGIA", icon: BookOpen },
                        { id: "base", label: "REDISEÑO", icon: Layout },
                        { id: "radar", label: "RADAR MATCH", icon: Search },
                        { id: "attack", label: "ATAQUE", icon: Target }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center justify-center gap-2 py-2.5 px-2 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 font-black text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] uppercase relative group 
                                ${activeTab === tab.id 
                                    ? "bg-white text-slate-950 shadow-lg z-10" 
                                    : "bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"}`}
                        >
                            <tab.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${activeTab === tab.id ? "text-amber-500" : "text-slate-300 group-hover:text-white transition-colors"}`} />
                            <span className="sm:inline">{tab.label}</span>
                            {(tab.id === "base" && redesignResult) || (tab.id === "radar" && matchResult) || (tab.id === "attack" && customizedCv) ? (
                                <div className={`absolute top-1.5 right-2 w-1 h-1 rounded-full ${activeTab === tab.id ? "bg-amber-500" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"}`} />
                            ) : null}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-in shake duration-500 max-w-4xl mx-auto">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 mt-2 max-w-7xl mx-auto">
                {/* TAB 1: MANUAL */}
                {activeTab === "manual" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <UserManual />
                        <div className="mt-16 flex justify-center pb-12">
                             <Button size="lg" onClick={() => setActiveTab("base")} className="rounded-[2.5rem] sm:h-24 h-16 sm:px-20 px-8 font-black sm:text-xl text-sm gap-4 sm:gap-6 shadow-2xl shadow-amber-500/30 bg-amber-500 text-slate-950 hover:scale-105 active:scale-95 transition-all group uppercase tracking-widest leading-none">
                                ENTENDIDO, INICIAR REDISEÑO QUIRÚRGICO
                                <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* TAB 2: BASE NOC */}
                {activeTab === "base" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50" />
                            
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 sm:mb-12 pb-6 sm:pb-8 border-b-2 border-slate-50 relative z-10 gap-4 sm:gap-6 text-center sm:text-left">
                                 <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-slate-950 flex items-center justify-center shadow-xl">
                                        <Layout className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
                                    </div>
                                     <div>
                                        <h3 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase italic">Fase 1: Rediseño Estructura Canadiense</h3>
                                        <p className="text-slate-500 text-[10px] sm:text-base font-bold uppercase tracking-widest opacity-60">Pierre reconstruye tu perfil bajo la técnica de Ingeniería Quirúrgica.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {!redesignResult && !isLoading ? (
                                <div className="space-y-6 sm:space-y-10 relative z-10">
                                    <div className="space-y-3 sm:space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">📋 Texto de tu CV Actual</label>
                                        <textarea 
                                            className="w-full h-60 sm:h-72 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 p-6 sm:p-10 text-sm sm:text-base font-medium focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all resize-none shadow-sm bg-slate-50/30"
                                            placeholder="Pega aquí el texto completo de tu currículum..."
                                            value={localCvText}
                                            onChange={(e) => setLocalCvText(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                        <button 
                                            onClick={() => setLanguage("English")}
                                            className={`h-16 sm:h-20 rounded-2xl sm:rounded-3xl border-2 font-black transition-all flex items-center justify-between px-4 sm:px-8 text-[10px] sm:text-xs uppercase tracking-widest ${language === "English" ? "bg-slate-950 border-slate-950 text-white shadow-2xl scale-[1.01]" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-4">
                                                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 ${language === "English" ? "animate-pulse" : "opacity-30"}`} />
                                                ENGLISH (ROC/FEDERAL)
                                            </div>
                                            {language === "English" && <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />}
                                        </button>
                                        <button 
                                            onClick={() => setLanguage("French")}
                                            className={`h-16 sm:h-20 rounded-2xl sm:rounded-3xl border-2 font-black transition-all flex items-center justify-between px-4 sm:px-8 text-[10px] sm:text-xs uppercase tracking-widest ${language === "French" ? "bg-slate-950 border-slate-950 text-white shadow-2xl scale-[1.01]" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-4">
                                                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 ${language === "French" ? "animate-pulse" : "opacity-30"}`} />
                                                FRANÇAIS (QUÉBEC/FRANCO)
                                            </div>
                                            {language === "French" && <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />}
                                        </button>
                                    </div>

                                     <Button size="lg" className="w-full sm:h-24 h-16 rounded-[1.5rem] sm:rounded-[3rem] font-black bg-amber-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-amber-500/30 text-xs sm:text-xl uppercase tracking-tighter" onClick={handleRedesign}>
                                        REDISEÑAR ESTRUCTURA CANADIENSE <Rocket className="w-4 h-4 sm:w-8 sm:h-8 ml-3 sm:ml-4 animate-bounce" />
                                    </Button>
                                </div>
                            ) : isLoading && step === "intro" ? (
                                <div className="py-32 text-center space-y-10 animate-in fade-in duration-1000">
                                    <div className="relative mx-auto w-32 h-32">
                                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                                        <div className="relative w-full h-full bg-white border-4 border-slate-100 rounded-full flex items-center justify-center shadow-xl">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="font-black text-4xl text-slate-950 tracking-tighter">Pierre está Analizando...</p>
                                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">Calculando equivalencias NOC y reestructurando logros basados en impacto.</p>
                                    </div>
                                </div>
                            ) : redesignResult ? (
                                <div className="space-y-12 animate-in zoom-in-95 duration-1000 relative z-10">
                                    {redesignResult.noc && (
                                        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 relative overflow-hidden shadow-xl shadow-slate-100 group border-l-[12px] border-l-primary">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                                <Target className="w-48 h-48" />
                                            </div>
                                            <div className="relative z-10">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">INTELIGENCIA NOC DETECTADA</span>
                                                <div className="flex flex-col sm:flex-row items-baseline gap-4 mb-6">
                                                    <div className="text-7xl font-black text-slate-950 tracking-tighter leading-none">{redesignResult.noc.codigo}</div>
                                                    <div className="text-2xl font-black text-slate-700 tracking-tight">{redesignResult.noc.titulo}</div>
                                                </div>
                                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 italic text-lg text-slate-600 font-medium leading-relaxed">
                                                    "{redesignResult.noc.explicacion}"
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                     <div className="space-y-4">
                                        <div className="flex items-center justify-between px-6">
                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bóveda de Contenido Técnico</h5>
                                            <button onClick={() => setRedesignResult(null)} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest border-b-2 border-primary/20 pb-0.5">Reiniciar Fase 1</button>
                                        </div>
                                        <div className="bg-slate-950 rounded-[3rem] p-8 sm:p-12 overflow-auto max-h-[600px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-2 border-white/5 relative group">
                                            <pre className="text-sm text-slate-300 font-mono font-medium whitespace-pre-wrap leading-loose">{typeof redesignResult.redesignedCv === 'string' ? redesignResult.redesignedCv : JSON.stringify(redesignResult.redesignedCv, null, 2)}</pre>
                                            <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md text-white border border-white/10 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                                                Versión {language.toUpperCase()}
                                            </div>
                                        </div>

                                        {/* 🎨 STYLE SELECTOR FOR BASE CV */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
                                            {(['Classic', 'Elegant', 'Modern'] as const).map((style) => (
                                                <button 
                                                    key={style} 
                                                    onClick={() => setCvStyle(style)} 
                                                    className={`p-4 sm:p-6 rounded-2xl border-2 transition-all text-left relative group ${cvStyle === style ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-100 bg-white text-slate-400 hover:border-slate-300"}`}
                                                >
                                                    <div className="font-black text-[10px] sm:text-xs uppercase tracking-tight mb-1">{style === 'Classic' ? 'Clásico' : style === 'Elegant' ? 'Elegante' : 'Moderno'}</div>
                                                    <div className={`text-[8px] sm:text-[10px] font-medium leading-tight ${cvStyle === style ? 'text-white/60' : 'text-slate-300'}`}>
                                                        {style === 'Classic' ? 'Soberano y Tradicional' : style === 'Elegant' ? 'Élite y Minimalista' : 'Limpio y Vanguardista'}
                                                    </div>
                                                    {cvStyle === style && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400" />}
                                                </button>
                                            ))}
                                        </div>

                                        {/* 📥 NEW DOWNLOAD ZONE FOR REDESIGN RESULTS */}
                                        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mt-6">
                                            <Button 
                                                onClick={() => downloadStyledCVPdf(redesignResult, cvStyle, language === "English" ? "En" : "Fr")} 
                                                className="min-h-[5rem] h-auto py-4 rounded-3xl bg-slate-100 text-slate-950 hover:bg-white hover:scale-[1.02] active:scale-[0.98] font-black gap-4 text-xs tracking-widest transition-all shadow-xl group/btn uppercase"
                                            >
                                                <Download className="w-5 h-5 text-amber-500 group-hover/btn:scale-125 transition-transform shrink-0" /> <span className="leading-tight">DESCARGAR PDF PREMIUM</span>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => downloadCustomizedCVWord(redesignResult.redesignedCv)} 
                                                className="min-h-[5rem] h-auto py-4 rounded-3xl border-2 border-slate-100 bg-white text-slate-950 hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] font-black gap-4 text-xs tracking-widest transition-all shadow-xl uppercase"
                                            >
                                                <FileText className="w-5 h-5 text-blue-500 shrink-0" /> <span className="leading-tight">DESCARGAR WORD (.DOCX)</span>
                                            </Button>
                                        </div>
                                    </div>
                                    
                                     <div className="flex justify-center pt-8">
                                        <Button size="lg" onClick={() => setActiveTab("radar")} className="sm:h-24 h-16 rounded-[3rem] sm:px-24 px-8 font-black gap-4 sm:gap-6 shadow-[0_30px_60px_-10px_rgba(15,23,42,0.3)] bg-slate-950 text-white hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] sm:text-xl text-xs group w-full sm:w-auto">
                                            BASE LISTA, IR AL RADAR <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform text-amber-400" />
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* TAB 3: RADAR MATCH (Solid High Contrast) */}
                {activeTab === "radar" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white border-2 border-slate-100 rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] relative">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 pb-8 border-b-2 border-slate-50 gap-6">
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/20 shrink-0">
                                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">Fase 2: Radar de Éxito (JD Match)</h3>
                                        <p className="text-slate-500 text-xs sm:text-base font-medium">Análisis de compatibilidad algorítmica contra la vacante real.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {!matchResult && !isLoading ? (
                                <div className="space-y-10">
                                    <div className="bg-amber-50 border-2 border-amber-100 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-start gap-4 sm:gap-6 relative overflow-hidden group">
                                        {/* ... */}
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-200 rounded-full flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-900" />
                                        </div>
                                        <p className="text-amber-900 text-sm sm:text-lg font-bold leading-relaxed max-w-2xl">
                                            Pega la descripción completa del puesto. Pierre buscará brechas de experiencia (Gaps) que debemos ocultar o fortalecer.
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">🎯 Job Description de la Vacante</label>
                                        <textarea 
                                            className="w-full h-64 sm:h-80 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 p-6 sm:p-10 font-medium focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500/40 transition-all resize-none shadow-sm bg-slate-50/30 text-base sm:text-lg"
                                            placeholder="Copia y pega la oferta de LinkedIn, Indeed o portal oficial..."
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                        />
                                    </div>

                                      <Button size="lg" className="w-full min-h-[5rem] sm:h-24 h-auto py-6 sm:py-0 rounded-[1.5rem] sm:rounded-[3rem] font-black bg-slate-950 text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl text-sm sm:text-xl uppercase tracking-widest gap-4 px-8" onClick={handleMatch}>
                                        <span className="leading-tight">EJECUTAR RADAR DE MATCH</span> <Search className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
                                    </Button>
                                </div>
                            ) : isLoading && step === "match" && !customizedCv ? (
                                <div className="py-32 text-center space-y-10 animate-pulse">
                                    <div className="relative mx-auto w-32 h-32">
                                        <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping" />
                                        <div className="relative w-full h-full bg-white border-4 border-slate-100 rounded-full flex items-center justify-center shadow-xl">
                                            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="font-black text-2xl sm:text-4xl text-slate-950 tracking-tighter">Prediciendo Score ATS...</p>
                                        <p className="text-slate-500 font-medium text-sm sm:text-lg max-w-md mx-auto px-4">Pierre está identificando palabras clave faltantes y analizando jerarquía técnica.</p>
                                    </div>
                                </div>
                            ) : matchResult ? (
                                <div className="space-y-12 animate-in zoom-in-95 duration-1000">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                                        <div className="lg:col-span-4 p-8 sm:p-12 bg-white border-2 border-slate-100 rounded-[2rem] sm:rounded-[3rem] text-center flex flex-col justify-center shadow-xl shadow-slate-100 relative group">
                                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-4 sm:mb-6 leading-tight">Puntaje Relativo de Match</span>
                                            <div className="relative inline-block mx-auto">
                                                <div className={`text-6xl sm:text-8xl font-black ${(matchResult.score || matchResult.matchScore?.total || 0) >= 80 ? "text-emerald-500" : "text-amber-500"} tracking-tighter mb-4 leading-none`}>
                                                    {matchResult.score || matchResult.matchScore?.total || 0}
                                                    <span className="text-2xl sm:text-4xl ml-1">%</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-950 text-white px-6 py-2.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] inline-block mx-auto mt-4 border border-white/10">Veredicto Filtro ATS</div>
                                        </div>
                                        
                                         <div className="lg:col-span-8 bg-slate-950 text-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                                            <div className="relative z-10 h-full flex flex-col">
                                                <h4 className="font-black text-[9px] sm:text-[11px] uppercase tracking-[0.4em] text-amber-400 mb-6 sm:mb-10 border-b border-white/10 pb-4">Análisis de Brechas Tácticas (GAP ANALYSIS)</h4>
                                                <div className="space-y-4 sm:space-y-5 flex-1">
                                                    {(matchResult.gapAnalysis || matchResult.gaps?.missingSkills || []).slice(0, 4).map((gap: any, i: number) => (
                                                        <div key={i} className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item">
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500 transition-colors">
                                                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 group-hover/item:text-slate-950" />
                                                            </div>
                                                            <span className="text-sm sm:text-lg font-bold text-slate-200 leading-tight">{typeof gap === 'string' ? gap : gap.descripcion}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-8">
                                        <Button variant="ghost" onClick={() => setMatchResult(null)} className="h-16 sm:h-20 rounded-2xl px-8 sm:px-12 font-black text-slate-400 hover:text-slate-950 hover:bg-slate-50 uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">← Probar otra Oferta</Button>
                                         <Button size="lg" onClick={handleCustomize} className="min-h-[5rem] sm:h-24 h-auto py-6 sm:py-0 rounded-[1.5rem] sm:rounded-[3.5rem] sm:px-24 px-8 font-black shadow-[0_30px_60px_-10px_rgba(255,255,255,0.1)] bg-amber-500 text-slate-950 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest sm:text-xl text-[10px] sm:text-xs group gap-4">
                                            <span className="leading-tight">ADAPTAR MI CV A ESTA VACANTE</span> <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform shrink-0" />
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* TAB 4: ATTACK (Solid Premium Export) */}
                {activeTab === "attack" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[4rem] p-6 sm:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)]">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 pb-6 sm:pb-8 border-b-2 border-slate-50 gap-6">
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0">
                                        <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">Fase 3: Ataque Maestro & Exportación</h3>
                                        <p className="text-slate-500 text-xs sm:text-base font-medium">Generación de archivos finales con inyección de logros específicos.</p>
                                    </div>
                                </div>
                            </div>

                            {!customizedCv && !isLoading ? (
                                <div className="text-center py-16 sm:py-32 space-y-8 sm:space-y-10">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                                        <Target className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200" />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-3 sm:space-y-4 px-4">
                                        <h4 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase">Acción Requerida</h4>
                                        <p className="text-slate-500 text-sm sm:text-lg font-medium leading-relaxed">Debes analizar una vacante en el paso anterior antes de que Pierre pueda adaptar tu CV.</p>
                                    </div>
                                    <Button onClick={() => setActiveTab("radar")} variant="outline" className="h-16 rounded-[1.5rem] px-8 sm:px-12 font-black border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-950 hover:text-slate-950 transition-all uppercase tracking-widest text-[10px] sm:text-[11px] scale-100 sm:scale-110">Ir al Radar de Match</Button>
                                </div>
                            ) : isLoading && step === "match" ? (
                                <div className="py-16 sm:py-32 text-center space-y-8 sm:space-y-10 animate-in fade-in duration-1000">
                                    <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
                                        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
                                        <div className="relative w-full h-full bg-white border-2 sm:border-4 border-slate-100 rounded-full flex items-center justify-center shadow-xl">
                                            <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-500 animate-spin" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 px-4">
                                        <p className="font-black text-2xl sm:text-4xl text-slate-950 tracking-tighter">Inyectando Inteligencia de Datos...</p>
                                        <p className="text-slate-500 font-medium text-sm sm:text-lg max-w-md mx-auto">Asegurando que cada logro esté alineado 100% con las necesidades tácticas de la empresa.</p>
                                    </div>
                                </div>
                            ) : customizedCv ? (
                                 <div className="space-y-8 sm:space-y-12 animate-in zoom-in-95 duration-1000">
                                     <div className="bg-slate-950 p-5 sm:p-20 rounded-[1.5rem] sm:rounded-[4rem] text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 group">
                                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-[1.6] transition-transform duration-1000">
                                            <CheckCircle2 className="w-96 h-96 text-primary" />
                                        </div>
                                        
                                        <div className="relative z-10 space-y-8 sm:space-y-12">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8 border-b border-white/10 pb-6 sm:pb-10">
                                                 <div>
                                                    <span className="text-[8px] sm:text-[10px] font-black text-amber-400 uppercase tracking-[0.5em] block mb-2 sm:mb-4">ESTADO: DOCUMENTO LISTO</span>
                                                    <h4 className="text-2xl sm:text-5xl font-black tracking-tighter leading-tight">Tu Expediente <span className="text-amber-400 italic">Maestro</span></h4>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 self-start sm:self-center">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20 shrink-0">
                                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                                                    </div>
                                                    <div className="pr-2 sm:pr-4">
                                                        <div className="text-amber-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Formato</div>
                                                        <div className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">Optimizado ATS</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                                {(['Classic', 'Elegant', 'Modern'] as const).map((style) => (
                                                    <button 
                                                        key={style} 
                                                        onClick={() => setCvStyle(style)} 
                                                      className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all text-left relative group ${cvStyle === style ? "border-amber-400 bg-amber-400/10 shadow-[0_20px_50px_-10px_rgba(251,191,36,0.3)] ring-4 ring-amber-400/5" : "border-white/5 bg-white/5 hover:border-white/20"}`}
                                                    >
                                                        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 inline-flex border border-white/10 ${cvStyle === style ? 'bg-amber-400 text-slate-950 shadow-lg' : 'bg-white/5 text-slate-500'}`}>
                                                            <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                        <div className="font-black text-sm sm:text-lg uppercase tracking-tight mb-0.5 sm:mb-1">{style === 'Classic' ? 'Clásico' : style === 'Elegant' ? 'Elegante' : 'Moderno'}</div>
                                                        <div className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">{style === 'Classic' ? 'Soberano y Tradicional' : style === 'Elegant' ? 'Élite y Minimalista' : 'Limpio y Vanguardista'}</div>
                                                        {cvStyle === style && <div className="absolute top-4 right-4 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,1)]" />}
                                                    </button>
                                                ))}
                                             </div>
                                             
                                             {/* 📥 NEW DOWNLOAD ZONE FOR REDESIGN RESULTS */}
                                             <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-10">
                                                 <Button 
                                                     onClick={() => downloadStyledCVPdf(customizedCv, cvStyle, language === "English" ? "En" : "Fr")} 
                                                     className="min-h-[5rem] sm:h-28 h-auto py-6 sm:py-0 rounded-[1.5rem] sm:rounded-[3rem] bg-white text-slate-950 hover:bg-white hover:scale-[1.03] active:scale-[0.98] font-black gap-4 sm:gap-6 text-sm sm:text-2xl transition-all shadow-2xl relative overflow-hidden group/btn px-4 sm:px-12"
                                                 >
                                                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                     <Download className="w-5 h-5 sm:w-8 sm:h-8 text-primary group-hover/btn:scale-125 transition-transform shrink-0" /> <span className="leading-tight">DESCARGAR PDF PREMIUM</span>
                                                 </Button>
                                                 <Button 
                                                     variant="outline" 
                                                     onClick={() => downloadCustomizedCVWord(customizedCv)} 
                                                     className="min-h-[5rem] sm:h-28 h-auto py-6 sm:py-0 rounded-[1.5rem] sm:rounded-[3rem] border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 hover:scale-[1.03] active:scale-[0.98] font-black gap-4 sm:gap-6 text-sm sm:text-2xl transition-all shadow-2xl px-4 sm:px-12"
                                                 >
                                                     <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-primary shrink-0" /> <span className="leading-tight">DESCARGAR WORD (.DOCX)</span>
                                                 </Button>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] relative">
                                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                             <div className="flex items-center gap-4">
                                                 <div className="w-2 h-10 bg-primary rounded-full shrink-0" />
                                                 <h5 className="font-black text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.4em]">Vista de Auditoría de Contenido</h5>
                                             </div>
                                             <div className="flex items-center self-start gap-2 px-6 py-2.5 rounded-full bg-emerald-50 border-2 border-emerald-100 text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">
                                                 <ShieldCheck className="w-4 h-4 mr-1 shrink-0" /> 100% Optimizado Pierre PRO
                                             </div>
                                         </div>
                                         <div className="bg-slate-50 border-2 border-slate-100 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] max-h-[600px] overflow-auto text-sm font-medium font-sans text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner italic">
                                             "{customizedCv.fullCvText || JSON.stringify(customizedCv, null, 2)}"
                                         </div>
                                     </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="max-w-4xl mx-auto pt-20 opacity-30 text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-950">Inteligencia Artificial de Pierre PRO • v2.5.0</p>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Todos los algoritmos de optimización NOC y ATS están protegidos bajo licencia exclusivo</p>
            </div>
        </div>
    )
}

function Palette({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.9.7-1.6 1.6-1.6H17c2.8 0 5-2.2 5-5 0-4.4-4.5-8-10-8Z"/>
        </svg>
    )
}
