"use client"

import { useState } from "react"
import { Rocket, FileText, ArrowRight, Loader2, PlayCircle, Search, Target, CheckCircle2, AlertTriangle, ShieldAlert, AlertCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmployabilityEnginePro({ cvText }: { cvText: string }) {
    const [step, setStep] = useState<"intro" | "redesign" | "match">("intro")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    
    const [language, setLanguage] = useState<"English" | "French">("English")
    const [localCvText, setLocalCvText] = useState(cvText || "")
    const [redesignResult, setRedesignResult] = useState<any>(null)
    
    // Match State
    const [jdText, setJdText] = useState("")
    const [matchResult, setMatchResult] = useState<any>(null)

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
            if (!res.ok) throw new Error(data.error || "No se pudo rediseñar el CV")
            setRedesignResult(data.result)
            setStep("redesign")
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
        try {
            // Utiliza el CV rediseñado si existe, de lo contrario usa el original o el local
            const baseCvText = redesignResult?.redesignedCv || localCvText || cvText
            const res = await fetch("/api/jd-match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText: baseCvText, jdText })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "No se pudo realizar el Match")
            setMatchResult(data.result)
            setStep("match")
        } catch (e: any) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const [copied, setCopied] = useState(false)
    const copyToClipboard = () => {
        if (!redesignResult?.redesignedCv) return
        const cv = redesignResult.redesignedCv
        if (typeof cv === 'string') {
            navigator.clipboard.writeText(cv)
        } else {
            const text = `
${cv.personalInfo?.fullName || ""}
${(cv.personalInfo?.contactDetails || []).join(" | ")}

SUMMARY
${cv.professionalSummary || ""}

CORE COMPETENCIES
${(cv.coreCompetencies || []).join(" • ")}

EXPERIENCE
${(cv.workExperience || []).map((e: any) => `${e.jobTitle}\n${e.companyAndLocation} | ${e.dates}\n${(e.achievements || []).map((a: string) => `- ${a}`).join("\n")}`).join("\n\n")}

EDUCATION
${(cv.education || []).map((e: any) => `${e.degree} | ${e.institutionAndLocation} | ${e.year}`).join("\n")}

CERTIFICATIONS
${(cv.certifications || []).join("\n")}

LANGUAGES
${(cv.languages || []).join("\n")}
            `.trim()
            navigator.clipboard.writeText(text)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadCVPdf = () => {
        if (!redesignResult?.redesignedCv) return;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            const cv = redesignResult.redesignedCv;
            
            // Si es un string (versión antigua), usar texto plano
            if (typeof cv === 'string') {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>CV Optimizado - Formato Canadiense</title>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
                                h1, h2, h3 { color: #111; }
                                pre { white-space: pre-wrap; font-family: inherit; margin: 0; }
                                .header { margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                                .noc-badge { background: #f0f9ff; color: #0284c7; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block; margin-bottom: 10px; }
                                @media print { body { padding: 0; max-width: 100%; } }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                ${redesignResult.noc ? `<div class="noc-badge">NOC: ${redesignResult.noc.codigo} - ${redesignResult.noc.titulo}</div>` : ''}
                            </div>
                            <pre>${cv}</pre>
                            <script>
                                setTimeout(() => { window.print(); window.close(); }, 500);
                            </script>
                        </body>
                    </html>
                `);
            } else {
                // Nuevo formato JSON estructurado
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>CV Optimizado - Formato Canadiense</title>
                            <style>
                                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 850px; margin: 0 auto; padding: 40px; }
                                .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
                                h1 { font-size: 26px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: 900; }
                                .contact-details { font-size: 12px; color: #334155; }
                                .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; border-bottom: 1px solid #cbd5e1; margin-top: 25px; margin-bottom: 15px; padding-bottom: 5px; color: #1e293b; }
                                .summary { font-size: 12px; text-align: justify; margin-bottom: 20px; }
                                .competencies { font-size: 12px; margin-bottom: 20px; color: #334155; }
                                .job-entry { margin-bottom: 20px; }
                                .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
                                .job-title { font-weight: bold; font-size: 13px; color: #0f172a; }
                                .job-company { font-style: italic; font-size: 12px; color: #475569; }
                                .job-dates { font-size: 12px; color: #0f172a; font-weight: 700; }
                                .job-achievements { margin: 0; padding-left: 20px; font-size: 12px; color: #334155; }
                                .job-achievements li { margin-bottom: 4px; }
                                .ed-entry { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
                                .list-simple { font-size: 12px; margin: 0; padding-left: 20px; color: #334155; }
                                .noc-badge { background: #f0f9ff; color: #0284c7; padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 10px; display: inline-block; margin-bottom: 20px; }
                                @media print { body { padding: 0; max-width: 100%; } }
                            </style>
                        </head>
                        <body>
                            ${redesignResult.noc ? `<div class="noc-badge">NOC: ${redesignResult.noc.codigo} - ${redesignResult.noc.titulo}</div>` : ''}
                            
                            <div class="header">
                                <h1>${cv.personalInfo?.fullName || "Borrador de CV"}</h1>
                                <div class="contact-details">
                                    ${(cv.personalInfo?.contactDetails || []).join(" &nbsp;|&nbsp; ")}
                                </div>
                            </div>
    
                            ${cv.professionalSummary ? `
                                <div class="section-title">Professional Summary</div>
                                <div class="summary">${cv.professionalSummary}</div>
                            ` : ''}
    
                            ${cv.coreCompetencies?.length > 0 ? `
                                <div class="section-title">Core Competencies</div>
                                <div class="competencies">
                                    ${cv.coreCompetencies.join(" &nbsp;&bull;&nbsp; ")}
                                </div>
                            ` : ''}
    
                            ${cv.workExperience?.length > 0 ? `
                                <div class="section-title">Professional Experience</div>
                                ${cv.workExperience.map((exp: any) => `
                                    <div class="job-entry">
                                        <div class="job-header">
                                            <div><span class="job-title">${exp.jobTitle}</span> <span class="job-company">| ${exp.companyAndLocation}</span></div>
                                            <div class="job-dates">${exp.dates}</div>
                                        </div>
                                        <ul class="job-achievements">
                                            ${(exp.achievements || []).map((a: string) => `<li>${a}</li>`).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            ` : ''}
    
                            ${cv.education?.length > 0 ? `
                                <div class="section-title">Education</div>
                                ${cv.education.map((ed: any) => `
                                    <div class="ed-entry">
                                        <div><strong>${ed.degree}</strong> | ${ed.institutionAndLocation}</div>
                                        <div>${ed.year}</div>
                                    </div>
                                `).join('')}
                            ` : ''}
    
                            ${cv.certifications?.length > 0 ? `
                                 <div class="section-title">Certifications</div>
                                 <ul class="list-simple">
                                    ${cv.certifications.map((c: string) => `<li>${c}</li>`).join('')}
                                 </ul>
                            ` : ''}
    
                            ${cv.languages?.length > 0 ? `
                                 <div class="section-title">Languages</div>
                                 <ul class="list-simple">
                                    ${cv.languages.map((l: string) => `<li>${l}</li>`).join('')}
                                 </ul>
                            ` : ''}
    
                            <script>
                                setTimeout(() => { window.print(); window.close(); }, 500);
                            </script>
                        </body>
                    </html>
                `);
            }
            printWindow.document.close();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Cabecera del Motor */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Rocket className="w-48 h-48 rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary/30">Motor Premium</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Empleabilidad PRO <Rocket className="w-6 h-6 text-primary" />
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium max-w-xl">
                            Transforma tu perfil al formato Canadiense, descubre tu código NOC oficial, y valida científicamente tus probabilidades antes de aplicar.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive font-medium flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* FLOW STEPS */}
            <div className="grid grid-cols-1 gap-8">
                
                {/* PASO 1: REDISEÑO CV */}
                <div className="bg-white border rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">1</span> 
                        Arquitectura Canadiense & Detección de NOC
                    </h3>
                    
                    {!redesignResult && !isLoading && step === "intro" && (
                        <div className="space-y-6">
                            {!localCvText && (
                                <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                                    <div className="flex items-center gap-2 text-amber-800 font-bold">
                                        <AlertTriangle className="w-5 h-5" />
                                        ¡Necesitamos tu CV!
                                    </div>
                                    <p className="text-sm text-amber-700">Parece que accediste mediante código o enlace directo. Por favor, pega el texto de tu currículum original aquí para poder rediseñarlo.</p>
                                    <textarea 
                                        className="w-full h-32 rounded-xl border p-4 text-sm"
                                        placeholder="Pega el texto de tu CV aquí..."
                                        value={localCvText}
                                        onChange={(e) => setLocalCvText(e.target.value)}
                                    />
                                </div>
                            )}

                            <p className="text-muted-foreground">¿Quieres transformar tu CV a formato canadiense optimizado (ATS)? Selecciona el idioma objetivo:</p>
                            <div className="flex flex-wrap gap-4">
                                <Button 
                                    size="lg" 
                                    variant={language === "English" ? "default" : "outline"}
                                    onClick={() => setLanguage("English")}
                                    className="rounded-xl h-14 px-8"
                                >
                                    Inglés Profesional
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant={language === "French" ? "default" : "outline"}
                                    onClick={() => setLanguage("French")}
                                    className="rounded-xl h-14 px-8"
                                >
                                    Francés (Quebec)
                                </Button>
                            </div>
                            <Button size="lg" className="w-full sm:w-auto h-16 rounded-2xl px-10 text-lg font-black mt-4" onClick={handleRedesign}>
                                EJECUTAR REDISEÑO AHORA
                                <Rocket className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}

                    {isLoading && step === "intro" && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="font-bold text-lg text-slate-800">Reescribiendo estructura y buscando tu NOC oficial...</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Esto puede tomar hasta 30 segundos.</p>
                        </div>
                    )}

                    {redesignResult && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* NOC Info */}
                            {redesignResult.noc && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 border rounded-2xl p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-5 h-5 text-primary" />
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">CÓDIGO NOC DETECTADO</h4>
                                        </div>
                                        <div className="text-3xl font-black text-slate-900 mt-2">{redesignResult.noc.codigo}</div>
                                        <div className="font-bold text-primary mb-2">{redesignResult.noc.titulo}</div>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium mt-4 border-t pt-4">
                                            {redesignResult.noc.explicacion}
                                        </p>
                                        <div className="mt-4 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border text-xs font-bold text-slate-700">
                                            Compatibilidad: <span className="text-primary">{redesignResult.noc.compatibilidad}</span>
                                        </div>
                                    </div>

                                    {redesignResult.rolesCompatibles && (
                                        <div className="bg-slate-50 border rounded-2xl p-6">
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Roles de Alta Probabilidad</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {redesignResult.rolesCompatibles.map((r: string, i: number) => (
                                                    <span key={i} className="bg-white border text-slate-700 text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm">{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Redesigned CV */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-800">Borrador de CV Optimizado (ATS Ready)</h4>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={downloadCVPdf}>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Descargar PDF
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                            Copiar Texto
                                        </Button>
                                    </div>
                                </div>

                                {typeof redesignResult.redesignedCv === 'string' ? (
                                    <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl max-h-96 overflow-y-auto font-mono text-sm leading-relaxed border border-slate-800">
                                        <pre className="whitespace-pre-wrap">{redesignResult.redesignedCv}</pre>
                                    </div>
                                ) : (
                                    <div className="bg-white text-slate-900 w-full rounded-xl shadow-xl border border-slate-200 p-8 max-h-[600px] overflow-y-auto mb-8 font-sans">
                                        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                                            <h1 className="text-2xl font-black uppercase tracking-tight mb-2 text-slate-900">
                                                {redesignResult.redesignedCv.personalInfo?.fullName || "Borrador de CV"}
                                            </h1>
                                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                                                {(redesignResult.redesignedCv.personalInfo?.contactDetails || []).map((detail: string, idx: number) => (
                                                    <span key={idx}>{detail} {idx < (redesignResult.redesignedCv.personalInfo?.contactDetails.length || 0) - 1 && "|"}</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {redesignResult.redesignedCv.professionalSummary && (
                                            <div className="mb-6">
                                                <h3 className="text-xs uppercase tracking-widest font-black border-b border-slate-200 pb-1 mb-2">Professional Summary</h3>
                                                <p className="text-sm text-slate-700 text-justify leading-relaxed">{redesignResult.redesignedCv.professionalSummary}</p>
                                            </div>
                                        )}

                                        {redesignResult.redesignedCv.coreCompetencies?.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-xs uppercase tracking-widest font-black border-b border-slate-200 pb-1 mb-2">Core Competencies</h3>
                                                <div className="text-sm text-slate-700 font-medium flex flex-wrap gap-2">
                                                    {redesignResult.redesignedCv.coreCompetencies.map((c: string, idx: number) => (
                                                        <span key={idx} className="bg-slate-100 px-2 py-1 rounded text-slate-800">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {redesignResult.redesignedCv.workExperience?.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-xs uppercase tracking-widest font-black border-b border-slate-200 pb-1 mb-3">Professional Experience</h3>
                                                <div className="space-y-4">
                                                    {redesignResult.redesignedCv.workExperience.map((exp: any, idx: number) => (
                                                        <div key={idx}>
                                                            <div className="flex justify-between items-baseline mb-1">
                                                                <div>
                                                                    <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                                                                    <span className="text-slate-500 text-sm italic ml-1">| {exp.companyAndLocation}</span>
                                                                </div>
                                                                <div className="text-xs font-bold text-slate-800">{exp.dates}</div>
                                                            </div>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                {(exp.achievements || []).map((ach: string, aIdx: number) => (
                                                                    <li key={aIdx} className="text-sm text-slate-700 leading-relaxed">{ach}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {redesignResult.redesignedCv.education?.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-xs uppercase tracking-widest font-black border-b border-slate-200 pb-1 mb-3">Education</h3>
                                                <div className="space-y-2">
                                                    {redesignResult.redesignedCv.education.map((ed: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between text-sm">
                                                            <div><span className="font-bold text-slate-900">{ed.degree}</span> | <span className="text-slate-700">{ed.institutionAndLocation}</span></div>
                                                            <div className="text-slate-600 font-medium">{ed.year}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {redesignResult.redesignedCv.certifications?.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs uppercase tracking-widest font-black border-b border-slate-200 pb-1 mb-2">Certifications</h3>
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        {redesignResult.redesignedCv.certifications.map((cert: string, idx: number) => (
                                                            <li key={idx} className="text-sm text-slate-700">{cert}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {redesignResult.redesignedCv.languages?.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs uppercase tracking-widest font-black border-b border-slate-200 pb-1 mb-2">Languages</h3>
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        {redesignResult.redesignedCv.languages.map((lang: string, idx: number) => (
                                                            <li key={idx} className="text-sm text-slate-700">{lang}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* PASO 2: JD MATCH & GAP ANALYSIS */}
                {(step === "redesign" || step === "match") && (
                    <div className="bg-white border rounded-[2rem] p-8 shadow-sm">
                        <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">2</span> 
                            Radar de Fuego: Análisis de Brecha (JD Match)
                        </h3>

                        {!matchResult && !isLoading && step === "redesign" && (
                            <div className="space-y-6">
                                <p className="text-muted-foreground">Pega la descripción completa de una oferta (Job Description). Te diré exactamente si debes aplicar, y si no, qué te falta exactamente.</p>
                                <textarea 
                                    className="w-full h-48 rounded-2xl border-2 border-slate-100 p-4 focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium"
                                    placeholder="Job Description Completo..."
                                    value={jdText}
                                    onChange={e => setJdText(e.target.value)}
                                />
                                <Button size="lg" className="w-full sm:w-auto h-16 rounded-2xl px-10 text-lg font-black" onClick={handleMatch}>
                                    EJECUTAR GAP ANALYSIS
                                    <Search className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        )}

                        {isLoading && step === "redesign" && (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <p className="font-bold text-lg text-slate-800">Analizando requerimientos ocultos y calculando Score Real...</p>
                            </div>
                        )}

                        {matchResult && (
                            <div className="space-y-10 animate-in fade-in duration-500">
                                {/* Score & Verdict */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col items-center justify-center min-w-[200px] p-6 rounded-2xl bg-slate-50 border">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Score de Match</span>
                                        <div className={`text-6xl font-black ${
                                            matchResult.score >= 90 ? "text-emerald-500" :
                                            matchResult.score >= 80 ? "text-blue-500" :
                                            matchResult.score >= 75 ? "text-amber-500" : "text-red-500"
                                        }`}>
                                            {matchResult.score}
                                            <span className="text-2xl text-slate-400 font-bold ml-1">%</span>
                                        </div>
                                        <div className="text-sm font-bold text-slate-600 uppercase tracking-tight mt-2">{matchResult.interpretacion}</div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5 text-primary" />
                                            <h4 className="font-black text-white/50 uppercase tracking-widest text-xs">Veredicto Oficial</h4>
                                        </div>
                                        <p className="text-lg font-medium leading-relaxed">"{matchResult.verdict}"</p>
                                        <div className="inline-flex mt-2 bg-black/30 border border-white/10 px-4 py-2 rounded-lg font-bold text-primary">
                                            DECISIÓN FINAL: {matchResult.decision}
                                        </div>
                                    </div>
                                </div>

                                {/* Gap Analysis */}
                                {matchResult.gaps && matchResult.gaps.length > 0 && (
                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-[0.1em] mb-4 flex items-center gap-3">
                                            <div className="w-2 h-6 bg-red-400 rounded-full" />
                                            Análisis de Brecha (Qué te falta para llegar al 90%)
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {matchResult.gaps.map((g: any, i: number) => (
                                                <div key={i} className={`p-5 rounded-2xl border ${
                                                    g.impacto === 'Crítico' ? 'bg-red-50 border-red-100' :
                                                    g.impacto === 'Alto' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
                                                }`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-black text-slate-800 uppercase text-xs">{g.tipo}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                                            g.impacto === 'Crítico' ? 'bg-red-200 text-red-800' :
                                                            g.impacto === 'Alto' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600'
                                                        }`}>
                                                            Impacto {g.impacto}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed"><strong className="text-slate-900">Ausente:</strong> {g.falta_exactamente}</p>
                                                    <div className="mt-4 p-3 bg-white/60 rounded-xl">
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estrategia Puente</p>
                                                        <p className="text-sm font-medium text-slate-800">{g.como_solucionarlo}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Keywords */}
                                {matchResult.keywordsFaltantes && matchResult.keywordsFaltantes.length > 0 && (
                                    <div className="border-t pt-6">
                                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.1em] mb-3">KEYWORDS TÉCNICOS AUSENTES EN TU CV</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {matchResult.keywordsFaltantes.map((kw: string, i: number) => (
                                                <span key={i} className="bg-red-50 text-red-600 border border-red-100 text-xs px-2.5 py-1 rounded-md font-semibold font-mono">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4 border-t">
                                     <Button variant="outline" onClick={() => setStep("redesign")}>PROBAR OTRA OFERTA</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
