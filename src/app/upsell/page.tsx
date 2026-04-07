"use client"
import { useState, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Search, FileText, Video, Rocket, Loader2, Sparkles, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendGTMEvent } from "@next/third-parties/google"
import { downloadFullReportPDF, downloadLMIAExcel } from "@/lib/report-utils"

function UpsellContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")
    
    const [selectedLang, setSelectedLang] = useState<"en" | "es" | null>(null)
    const [showLanguageModal, setShowLanguageModal] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [downloaded, setDownloaded] = useState(false)
    const [pendingData, setPendingData] = useState<any>(null)

    useEffect(() => {
        // Look for pending report data to auto-download
        const data = localStorage.getItem("pendingReportData")
        if (data) {
            try {
                const parsed = JSON.parse(data)
                setPendingData(parsed)
                setShowLanguageModal(true)
            } catch (e) {
                console.error("Failed to parse pending data", e)
            }
        }
    }, [])

    const handleLanguageSelect = (lang: "en" | "es") => {
        setSelectedLang(lang)
        setShowLanguageModal(false)
        setDownloading(true)
        sendGTMEvent({ event: "cv_language_selected", value: { language: lang } })
        
        // Trigger auto-downloads
        if (pendingData?.result) {
            setTimeout(() => {
                downloadFullReportPDF(pendingData.result)
                if (pendingData.result.empresasLMIA?.length > 0) {
                    downloadLMIAExcel(pendingData.result)
                }
                setDownloading(false)
                setDownloaded(true)
                // Clear the pending data so it doesn't fire again on refresh
                localStorage.removeItem("pendingReportData")
            }, 1000)
        }
    }

    const toolHref = sessionId 
        ? `/cv-tool?session_id=${sessionId}&lang=${selectedLang || 'en'}&onboarding=true` 
        : `/cv-tool?lang=${selectedLang || 'en'}&onboarding=true`

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center font-sans text-slate-900 relative">
            
            {/* Download Success Toast */}
            {downloaded && (
                <div className="fixed top-8 right-8 z-[200] animate-in slide-in-from-right-8 fade-in duration-500">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white">¡Reporte Descargado!</p>
                            <p className="text-xs text-white/90">Revisa tu carpeta de descargas.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Modal */}
            {showLanguageModal && (
                <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-lg w-full space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto ring-8 ring-primary/5">
                                <Download className="w-10 h-10 text-primary animate-bounce" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">¡Paso Final!</h2>
                                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                                    Estamos listos para descargar tu reporte pro. <br/>
                                    <strong>¿En qué idioma quieres tu transformación inicial?</strong>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleLanguageSelect("en")}
                                className="group p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xl hover:scale-[1.02] flex flex-col items-center gap-3"
                            >
                                <span className="text-4xl group-hover:scale-110 transition-transform">🇬🇧</span>
                                <span className="font-bold text-slate-900">Inglés</span>
                                <span className="text-[10px] text-slate-500">ATS / Global</span>
                            </button>
                            <button
                                onClick={() => handleLanguageSelect("es")}
                                className="group p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xl hover:scale-[1.02] flex flex-col items-center gap-3"
                            >
                                <span className="text-4xl group-hover:scale-110 transition-transform">🇪🇸</span>
                                <span className="font-bold text-slate-900">Español</span>
                                <span className="text-[10px] text-slate-500">Estándar</span>
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 italic">
                                * Tras la descarga serás llevado directamente al transformador de CV.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Confirmation Message */}
            <div className="w-full max-w-4xl bg-green-50/80 border border-green-200 rounded-2xl p-6 text-center mb-8 shadow-sm">
                <div className="flex justify-center mb-3">
                    <div className="rounded-full line-through text-transparent border-2 border-green-500 w-12 h-12 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">¡Pago Confirmado!</h1>
                <p className="text-sm text-slate-600">Tu Herramienta CV y Reporte PRO están listos.</p>
            </div>

            {/* Main Upsell Card */}
            <div className={`w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ${showLanguageModal ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Dark Blue Header Area */}
                <div className="bg-[#0f172a] px-6 py-10 sm:px-12 text-center text-white flex flex-col items-center">
                    <span className="bg-orange-500 text-white text-[11px] font-extrabold uppercase tracking-wide py-1.5 px-4 rounded-full mb-6 inline-block">
                        Oferta Única Limitada
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        Espera, antes de ir a tu herramienta...
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Un gran CV sin saber a dónde enviarlo, cómo sortear el mercado oculto canadiense o sin entender las reglas migratorias específicas de tu perfil, es como tener un <strong className="text-white">Ferrari sin gasolina</strong>. Agrega una sesión 1:1 para definir tu mapa de acción exacto.
                    </p>
                </div>

                {/* White Content Area */}
                <div className="p-6 sm:p-12">
                    <div className="flex flex-col md:flex-row gap-8 mb-10">
                        {/* Features List */}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-5 text-slate-900">Tu Plan Estratégico Incluye:</h3>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-4">
                                    <div className="bg-slate-100 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                                        <Search className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-800 block mb-1">1. Diagnóstico Profundo</span>
                                        <span className="text-sm text-slate-600 leading-relaxed">Formulario detallado previo para levantar toda la información clave de tu perfil (experiencia, NOCs, inglés) y 3 horas de análisis de tu caso.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-slate-100 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                                        <FileText className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-800 block mb-1">2. Desarrollo del Plan (2 Horas Off-camera)</span>
                                        <span className="text-sm text-slate-600 leading-relaxed">Elaboración de un plan único con: Mapa de NOCs, estrategia de búsqueda, scripts de networking, ruta a 90 días, checklist de CV, y mapa de provincias.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-slate-100 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                                        <Video className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-800 block mb-1">3. Plan de Empleabilidad Personalizado (Zoom 40-60 min)</span>
                                        <span className="text-sm text-slate-600 leading-relaxed">Explicación paso a paso del plan, resolución de dudas específicas y definición de prioridades claras para ejecutar la estrategia sin dispersión.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-slate-100 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                                        <Rocket className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-800 block mb-1">4. Entrega Final y Herramientas</span>
                                        <span className="text-sm text-slate-600 leading-relaxed">Entrega del Plan Estratégico completo en PDF, resumen de la sesión de Zoom y tareas claras listas para empezar a aplicar por 30 días.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Pricing Box */}
                        <div className="md:w-72 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center self-start md:self-stretch">
                            <span className="line-through text-slate-400 text-xs font-medium mb-1 relative">
                                Precio Regular: $150 USD
                            </span>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-extrabold text-slate-900">$109</span>
                                <span className="text-sm font-bold text-slate-500">USD</span>
                            </div>
                            <span className="text-xs font-bold text-orange-500">
                                Ahorras $41 USD solo por hoy
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center mb-6">
                        <Button 
                            className="w-full sm:w-[90%] bg-[#0f172a] hover:bg-[#1e293b] text-white h-auto py-5 flex flex-col items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                            asChild
                        >
                            <a href="https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon" target="_blank" rel="noopener noreferrer">
                                <span className="flex items-center text-lg sm:text-xl font-bold mb-1" onClick={() => sendGTMEvent({ event: "upsell_conversion_started", value: { amount: 109 } })}>
                                    Sí, quiero la Asesoría 1:1 por $109 USD <ArrowRight className="ml-2 w-5 h-5" />
                                </span>
                                <span className="text-[11px] font-normal text-slate-300">
                                    Añadir a mi compra via Calendly seguro
                                </span>
                            </a>
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link 
                            href={toolHref} 
                            className="text-xs sm:text-sm text-primary font-bold hover:underline transition-colors flex items-center justify-center gap-2"
                            onClick={() => sendGTMEvent({ event: "upsell_declined" })}
                        >
                            {downloading ? (
                                <>Generando descarga... <Loader2 className="w-3 h-3 animate-spin" /></>
                            ) : (
                                <>Continuar a mi Herramienta CV <ArrowRight className="w-4 h-4" /></>
                            )}
                        </Link>
                    </div>

                </div>
            </div>
            
        </div>
    )
}

export default function UpsellPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <UpsellContent />
        </Suspense>
    )
}
