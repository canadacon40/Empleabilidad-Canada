"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, AlertCircle, Loader2, ArrowRight, Rocket, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

function ThankYouContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingSession, setIsFetchingSession] = useState(!!sessionId)
    const [customerEmail, setCustomerEmail] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (sessionId) {
            const fetchSession = async () => {
                try {
                    const res = await fetch(`/api/get-session?session_id=${sessionId}`)
                    const data = await res.json()
                    if (data.email) setCustomerEmail(data.email)
                } catch (err) {
                    console.error("Error fetching session:", err)
                } finally {
                    setIsFetchingSession(false)
                }
            }
            fetchSession()
        }
    }, [sessionId])

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
                    productNameOverride: "Asesoría 1:1 - Sistema Integral de Empleabilidad (Oferta Especial)",
                    customerEmail: customerEmail
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

    if (!sessionId || (sessionId !== "DEBUG_PAYMENT" && error === "Invalid Session")) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
                    <AlertCircle className="w-10 h-10 text-amber-400" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white tracking-tighter">Página no encontrada</h1>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Sesión de Compra Inválida</p>
                </div>
                <Button asChild className="h-14 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-all">
                    <a href="/login">Ir al Portal de Acceso</a>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Success Banner */}
                <div className="bg-emerald-500 border-4 border-emerald-600 rounded-[2.5rem] p-8 text-center space-y-3 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                    <CheckCircle className="w-16 h-16 text-white mx-auto drop-shadow-lg" />
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm">¡Pago Confirmado!</h1>
                    <p className="text-emerald-50 text-base sm:text-lg font-bold">Tu Transformación Pierre PRO ha comenzado.</p>
                </div>

                {/* Account Activation CTA - THE CORE OF ACCESS FLOW */}
                <div className="bg-slate-950 border border-white/10 rounded-[3rem] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05),transparent_70%)] pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
                            <Rocket className="w-3 h-3 animate-bounce" /> Paso 1: Activación Obligatoria
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter leading-tight max-w-sm mx-auto">
                            Crea tu <span className="text-amber-400 italic font-black">Acceso</span> Permanente
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base font-medium max-w-sm mx-auto leading-relaxed italic">
                            Define tu contraseña ahora para asegurar tu historial y herramientas.
                        </p>
                        
                        <div className="pt-4 flex flex-col items-center">
                            <Button 
                                asChild
                                className="w-full max-w-xs h-18 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] group py-6"
                            >
                                <a href={`/register?email=${encodeURIComponent(customerEmail)}`}>
                                    {isFetchingSession ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <span className="flex items-center gap-2">Crear mi Contraseña <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                                    )}
                                </a>
                            </Button>
                            <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sin contraseña no podrás reingresar al portal</p>
                        </div>
                    </div>
                </div>

                {/* Upsell Container */}
                <div className="bg-white border-2 border-slate-200 rounded-[3rem] overflow-hidden shadow-xl">
                    <div className="bg-slate-900 text-white p-6 sm:p-10 text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 blur-[80px] rounded-full" />
                        <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 shadow-lg shadow-amber-400/20">
                            Oferta Única Limitada
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black mb-4 tracking-tighter">
                            ¿Quieres el mapa exacto?
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed italic">
                            "La herramienta te da los documentos, la sesión te da el contrato." Agrega una asesoría 1:1 estratégica.
                        </p>
                    </div>

                    <div className="p-8 sm:p-10 space-y-10">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-5">
                                <h3 className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-amber-500" /> Plan de Acción 1:1
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Diagnóstico de tu perfil vs mercado local",
                                        "Definición de roles objetivo (puente vs target)",
                                        "Estrategia para roles regulados en Canadá",
                                        "Plan de ejecución para los próximos 90 días"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600 leading-tight">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-50 rounded-[2.5rem] p-8 text-center border-2 border-slate-100 shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-slate-200 rounded-b-xl text-[8px] font-black text-slate-500 uppercase tracking-widest">Asesoría Estratégica</div>
                                <p className="text-xs font-black text-slate-400 mb-2 line-through uppercase">Precio Regular: $150 USD</p>
                                <p className="text-5xl font-black text-slate-950 mb-3 tracking-tighter">$109 <span className="text-xl text-slate-400 font-bold uppercase tracking-widest">USD</span></p>
                                <p className="text-[10px] text-amber-700 font-black bg-amber-400/10 py-1.5 px-4 rounded-full inline-block border border-amber-200/50">
                                    Ahorras $41 USD solo por hoy
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 text-center">
                            <Button 
                                size="lg" 
                                className="w-full max-w-lg h-18 py-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-2xl transition-all group mx-auto flex items-center justify-center gap-4"
                                onClick={() => window.open("https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon", "_blank")}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <div className="text-left">
                                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                                            Sí, quiero la Asesoría 1:1 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium">Agendar directamente en Calendly</div>
                                    </div>
                                )}
                            </Button>
                            
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Esta oferta termina al cerrar la página • Acceso PRO garantizado</p>
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    )
}
