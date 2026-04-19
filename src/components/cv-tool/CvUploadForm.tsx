"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { FileText, User, Mail, Phone, Clock, MapPin, DollarSign, CreditCard, Sparkles, CheckCircle2, ShoppingCart, ArrowRight, Key, Users2, ShieldAlert, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendGTMEvent } from "@next/third-parties/google"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { useEffect } from "react"

interface CvUploadFormProps {
    onResult: (data: any, originalText: string, language: string, accessCode: string, leadId?: string) => void
}

export default function LeadCaptureForm({ onResult }: CvUploadFormProps) {
    const { trackEvent } = useLeadTracking()
    const searchParams = useSearchParams()
    const [cvText, setCvText] = useState("")
    const [fileName, setFileName] = useState("")
    const [alreadyUsedEmail, setAlreadyUsedEmail] = useState<string | null>(null)
    const language = "en" // Hardcoded for free report to reduce friction
    const [error, setError] = useState("")
    
    // New Lead Capture Fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [countryCode, setCountryCode] = useState("+1")
    const [phone, setPhone] = useState("")
    const [status, setStatus] = useState("")
    const [linkedinUrl, setLinkedinUrl] = useState("")
    const [subscribeToEmails, setSubscribeToEmails] = useState(false)
    
    const [showWelcome, setShowWelcome] = useState(false)
    const [showCvWarning, setShowCvWarning] = useState(false)
    const [highlightFields, setHighlightFields] = useState<string[]>([])
    const [hasStartedForm, setHasStartedForm] = useState(false)
    const [showPromoInput, setShowPromoInput] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [isPromoSuccess, setIsPromoSuccess] = useState(false)

    const { data: session } = useSession()
    const isPremium = (session?.user as any)?.isPro || (session?.user as any)?.isTrial;

    // Track when user starts typing
    useEffect(() => {
        if (!hasStartedForm && (name || email || cvText)) {
            setHasStartedForm(true)
            trackEvent("FORM_START")
        }
    }, [name, email, cvText, hasStartedForm, trackEvent])

    // 🛡️ VIP PROTECTION: Do not show welcome modal or free-tier warnings to PRO/Trial users
    useEffect(() => {
        // Only show welcome for authenticated users who are NOT premium
        if (session?.user && !isPremium) {
            setShowWelcome(true)
        } else if (isPremium) {
            setShowWelcome(false)
        }
    }, [isPremium, session])

    const accessCode = "LEAD_MAGNET" // Default bypass code

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }


    const handleSubmit = async () => {
        const missing = []
        if (!name.trim()) missing.push("name")
        if (!email.trim()) missing.push("email")
        if (!phone.trim()) missing.push("phone")
        if (!status) missing.push("status")

        if (missing.length > 0) {
            setHighlightFields(missing)
            trackEvent("FORM_ERROR", { missing })
            setError("Por favor completa los campos marcados en rojo.")
            setTimeout(() => {
                setHighlightFields([])
            }, 3000)
            return
        }


        if (!cvText.trim() || cvText.trim().length < 50) {
            setShowCvWarning(true)
            return
        }
        
        proceedWithSubmission()
    }

    const proceedWithSubmission = async () => {
        setShowCvWarning(false)
        setError("")
        
        const storedEmail = localStorage.getItem(`cvReportGenerated_${email.toLowerCase().trim()}`);
        if (storedEmail) {
             setAlreadyUsedEmail(email.toLowerCase().trim());
             return;
        }
        
        // Save the email and name to local storage to prevent reuse and for personalization
        localStorage.setItem(`cvReportGenerated_${email.toLowerCase().trim()}`, "true")
        localStorage.setItem("lead_email", email.toLowerCase().trim())
        localStorage.setItem("lead_name", name.trim())

        const fullPhone = `${countryCode} ${phone.trim()}`;
        const leadData = { 
            name: name.trim(), 
            email: email.trim(), 
            phone: fullPhone,
            status, 
            language,
            linkedinUrl: linkedinUrl.trim(),
            subscribeToEmails,
            cvText: cvText.trim(),
            date: new Date().toISOString(),
            source: "Free CV Tool"
        };


        // Fire GTM event for lead capture
        sendGTMEvent({ 
            event: "generate_report_lead", 
            value: { 
                email: email.trim(), 
                status: status,
                subscribeToEmails
            } 
        });

        let lead = null;
        try {
            const response = await fetch("/api/save-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(leadData)
            });
            if (response.ok) {
                lead = await response.json();
            } else {
                console.error("Failed to save lead:", response.status, response.statusText);
            }
        } catch (e) {
            console.error("Failed to save lead:", e);
        }

        // Form is complete, continue to analysis
        onResult(leadData, cvText.trim(), language, accessCode, lead?.id)
    }

    if (isPremium && !showWelcome) {
        return (
            <div className="max-w-xl mx-auto py-12 px-8 bg-white border border-slate-200 rounded-[3.5rem] shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto border-2 border-amber-200 shadow-xl shadow-amber-500/10">
                    <Sparkles className="w-10 h-10 text-amber-600 animate-pulse" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">¡Bienvenido de nuevo!</h3>
                    <p className="text-slate-500 font-medium">
                        Tu suite de empleabilidad avanzada está lista. Hemos guardado tu último reporte de diagnóstico.
                    </p>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col sm:flex-row items-center gap-4 text-left justify-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-amber-200 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Estado del Sistema</p>
                        <p className="text-sm font-bold text-slate-900">Centro Táctico de Empleabilidad • ACTIVO</p>
                    </div>
                </div>

                <Button 
                    size="lg"
                    onClick={() => onResult(null, "", "es", "PREMIUM")}
                    className="w-full h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-3"
                >
                    Entrar al Centro Táctico <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <button 
                    onClick={() => {
                        localStorage.clear();
                        signOut({ callbackUrl: "/cv-tool?force_form=true" });
                    }}
                    className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                    <LogOut className="w-3 h-3" />
                    Cerrar Sesión para usar otra cuenta
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto relative">
            {/* Welcome Modal */}
            {showWelcome && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border-2 border-primary/20 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">¡Aviso Importante!</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Tienes acceso a solo <span className="text-primary font-bold">1 reporte de empleabilidad gratuito</span> por correo. 
                            Asegúrate de completar todos los datos correctamente.
                        </p>
                        <Button onClick={() => setShowWelcome(false)} className="w-full py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                            Entendido, ¡vamos!
                        </Button>
                    </div>
                </div>
            )}

            {/* Empty CV Warning Modal */}
            {showCvWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border-2 border-destructive/20 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive border-2 border-destructive/20">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-destructive">¡Cuidado!</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Solo tienes <span className="text-primary font-bold italic underline">una oportunidad</span> para generar tu reporte gratis. 
                            <br/><br/>
                            Estás dejando el recuadro de CV vacío o demasiado corto. ¿Deseas continuar así o prefieres pegar tu experiencia primero?
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button variant="outline" onClick={() => setShowCvWarning(false)} className="w-full py-6 rounded-2xl border-2">
                                Regresar y pegar mi CV
                            </Button>
                            <Button onClick={proceedWithSubmission} variant="destructive" className="w-full py-6 rounded-2xl font-bold opacity-80 hover:opacity-100">
                                Generar de todas formas
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Tu Diagnóstico de Empleabilidad Gratis</h2>
                <p className="text-muted-foreground">Responde estas breves preguntas para personalizar tu análisis y sube tu CV.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className={`space-y-2 transition-all ${highlightFields.includes('name') ? 'animate-shake' : ''}`}>
                    <label className={`text-sm font-semibold flex items-center gap-2 ${highlightFields.includes('name') ? 'text-destructive' : ''}`}>
                        <User className="w-4 h-4 text-primary" /> Nombre y Apellido {highlightFields.includes('name') && <span className="text-destructive font-bold">*</span>}
                    </label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => {setName(e.target.value); setError("")}} 
                        placeholder="Ej: Maria Gonzalez" 
                        className={`w-full px-4 py-3 rounded-xl border bg-background transition-all ${highlightFields.includes('name') ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'}`} 
                    />
                </div>
                {/* Email */}
                <div className={`space-y-2 transition-all duration-300`}>
                    <label className={`text-sm font-semibold flex items-center gap-2`}>
                        <Mail className="w-4 h-4 text-primary" /> Correo electrónico 
                        <span className="text-destructive font-bold">*</span>
                    </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase().trim();
                            setEmail(val); 
                            setError("");
                            // If it's a test email, clear any previous "already used" lock
                            if (val.includes("test")) {
                                setAlreadyUsedEmail(null);
                            }
                        }} 
                        placeholder="tucorreo@ejemplo.com" 
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background transition-all" 
                    />
                    {error && (
                        <p className="text-[11px] text-destructive font-bold animate-in fade-in slide-in-from-top-1">
                            ⚠️ {error}
                        </p>
                    )}
                </div>
                {/* Phone */}
                <div className={`space-y-2 transition-all ${highlightFields.includes('phone') ? 'animate-shake' : ''}`}>
                    <label className={`text-sm font-semibold flex items-center gap-2 ${highlightFields.includes('phone') ? 'text-destructive' : ''}`}>
                        <Phone className="w-4 h-4 text-primary" /> Teléfono de contacto {highlightFields.includes('phone') && <span className="text-destructive font-bold">*</span>}
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-1/3 px-4 py-3 rounded-xl border border-border bg-background transition-all appearance-none cursor-pointer text-sm"
                        >
                            <option value="+1">🇨🇦/🇺🇸 +1</option>
                            <option value="+52">🇲🇽 +52</option>
                            <option value="+57">🇨🇴 +57</option>
                            <option value="+54">🇦🇷 +54</option>
                            <option value="+56">🇨🇱 +56</option>
                            <option value="+51">🇵🇪 +51</option>
                            <option value="+58">🇻🇪 +58</option>
                            <option value="+593">🇪🇨 +593</option>
                            <option value="+34">🇪🇸 +34</option>
                            <option value="+502">🇬🇹 +502</option>
                            <option value="+503">🇸🇻 +503</option>
                            <option value="+504">🇭🇳 +504</option>
                            <option value="+505">🇳🇮 +505</option>
                            <option value="+506">🇨🇷 +506</option>
                            <option value="+507">🇵🇦 +507</option>
                            <option value="+53">🇨🇺 +53</option>
                            <option value="+1809">🇩🇴 +1</option>
                            <option value="+598">🇺🇾 +598</option>
                            <option value="+595">🇵🇾 +595</option>
                            <option value="+591">🇧🇴 +591</option>
                            <option value="+55">🇧🇷 +55</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+39">🇮🇹 +39</option>
                            <option value="+61">🇦🇺 +61</option>
                            <option value="+64">🇳🇿 +64</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+86">🇨🇳 +86</option>
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+00">🌍 Otro</option>
                        </select>
                        <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => {setPhone(e.target.value); setError("")}} 
                            placeholder="(123) 456-7890" 
                            className={`w-2/3 px-4 py-3 rounded-xl border bg-background transition-all ${highlightFields.includes('phone') ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'}`} 
                        />
                    </div>
                </div>
            </div>


            <div className="space-y-4">
                {/* Status */}
                <div className={`space-y-2 transition-all ${highlightFields.includes('status') ? 'animate-shake' : ''}`}>
                    <label className={`text-sm font-semibold flex items-center gap-2 ${highlightFields.includes('status') ? 'text-destructive' : ''}`}>
                        <MapPin className="w-4 h-4 text-primary" /> ¿Dónde te encuentras ahora? {highlightFields.includes('status') && <span className="text-destructive font-bold">*</span>}
                    </label>
                    <select 
                        value={status} 
                        onChange={(e) => {setStatus(e.target.value); setError("")}} 
                        className={`w-full px-4 py-3 rounded-xl border bg-background transition-all ${highlightFields.includes('status') ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'}`}
                    >
                        <option value="">Selecciona tu situación...</option>
                        <option value="outside">Estoy fuera de Canadá</option>
                        <option value="inside">Estoy dentro de Canadá</option>
                    </select>
                </div>

                {/* LinkedIn (Opcional) */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary" /> URL de LinkedIn (Opcional)
                    </label>
                    <input 
                        type="url" 
                        value={linkedinUrl} 
                        onChange={(e) => setLinkedinUrl(e.target.value)} 
                        placeholder="https://linkedin.com/in/tuperfil" 
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background transition-all" 
                    />
                </div>
            </div>

            {/* Manual Text Input ONLY */}
            <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Pega el contenido de tu CV (Texto)
                </label>
                <div className="p-3 mb-2 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-xs text-blue-800 font-medium">
                        💡 Para mayor precisión y seguridad, copia el texto de tu CV (desde Word o seleccionando el texto de tu PDF) y pégalo directamente en la caja de abajo.
                    </p>
                </div>
                <textarea
                    value={cvText}
                    onChange={(e) => { setCvText(e.target.value); setError("") }}
                    rows={12}
                    placeholder="Pega aquí todo el contenido de texto de tu CV en español o el idioma original..."
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm leading-relaxed"
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                    {cvText.length > 0 ? `${cvText.length} caracteres` : "0 caracteres"}
                </p>
            </div>

            {alreadyUsedEmail && (
                <div className="p-1 rounded-3xl bg-primary/5 border border-primary/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-primary/5">
                    <div className="bg-background rounded-[22px] p-6 sm:p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Ya generaste tu reporte gratuito</h3>
                            <p className="text-sm text-center max-w-sm mx-auto">
                                <span className="font-semibold text-primary">¿Listo para el siguiente nivel?</span> Accede hoy mismo a la transformación profesional completa con descuento.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Option 1: Tool */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col group hover:border-primary/50 transition-all cursor-pointer"
                                onClick={async () => {
                                    const res = await fetch("/api/create-checkout", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            priceOverride: 2900,
                                            successPath: "/cv-tool",
                                            productNameOverride: "Radar de Empleo PRO",
                                        }),
                                    });
                                    const data = await res.json();
                                    if (data.url) window.location.href = data.url;
                                    else alert("Error al conectar con Stripe.");
                                }}
                            >
                                <div className="space-y-1 mb-3">
                                    <h4 className="text-sm font-bold">Acelerador de Entrevistas</h4>
                                    <p className="text-[10px] text-muted-foreground leading-tight">Tu base para el mercado laboral global. Para todo nivel de idioma.</p>
                                </div>
                                <div className="flex items-baseline gap-1 mt-auto">
                                    <span className="text-xl font-bold">$29</span>
                                    <span className="text-[10px] text-muted-foreground">USD</span>
                                    <s className="text-[10px] text-muted-foreground/50 font-normal">$51</s>
                                </div>
                                <Button size="sm" className="w-full mt-4 h-8 text-[11px] font-bold group-hover:bg-primary/90">Desbloquear Kit</Button>
                            </div>

                                        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-5 flex flex-col group hover:scale-[1.03] transition-all cursor-pointer relative"
                                onClick={() => window.open("https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon", "_blank")}
                            >
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-primary text-white text-[8px] font-bold rounded uppercase">Premium</div>
                                <div className="space-y-1 mb-3">
                                    <h4 className="text-sm font-bold">Plan de Empleabilidad Personalizado</h4>
                                    <p className="text-[10px] text-primary/80 leading-tight">Mentoría experta y plan de acción integral.</p>
                                </div>
                                <div className="flex items-baseline gap-1 mt-auto">
                                    <span className="text-xl font-bold text-primary font-mono">$109</span>
                                    <span className="text-[10px] text-primary/60">USD</span>
                                    <s className="text-[10px] text-muted-foreground/50 font-normal ml-0.5">$149</s>
                                </div>
                                <Button size="sm" className="w-full mt-4 h-8 text-[11px] font-bold bg-[#0f172a] hover:bg-slate-800">Acelerador + 1-a-1</Button>
                            </div>
                        </div>

                        {/* Recovery Option */}
                        {localStorage.getItem("last_report_result") && (
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">¿Ya eras usuario PRO o quieres ver tus resultados anteriores?</p>
                                <Button 
                                    variant="link" 
                                    className="text-primary font-black text-xs uppercase p-0 h-auto"
                                    onClick={() => window.location.reload()}
                                >
                                    Refrescar para ver mis resultados guardados
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                             {!showPromoInput ? (
                                <button 
                                    onClick={() => setShowPromoInput(true)}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                    ¿Tienes un código de acceso PRO?
                                </button>
                             ) : (
                                <div className="w-full space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            placeholder="Introduce tu código..."
                                            className="flex-1 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-xs font-bold uppercase"
                                        />
                                        <Button 
                                            size="sm" 
                                            className="h-9 px-4 text-[10px] font-black uppercase"
                                            onClick={() => {
                                                const validatePromo = async () => {
                                                    try {
                                                        const res = await fetch("/api/validate-promo", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ code: promoCode }),
                                                        });
                                                        const data = await res.json();
                                                        
                                                        if (res.ok && data.success) {
                                                            setIsPromoSuccess(true);
                                                            setTimeout(() => {
                                                                setAlreadyUsedEmail(null);
                                                                localStorage.setItem("pierre_promo_unlocked", "true");
                                                                window.location.href = "/register?code=" + promoCode;
                                                            }, 1500);
                                                        } else {
                                                            setError(data.error || "Código inválido o agotado.");
                                                        }
                                                    } catch (err) {
                                                        setError("Error de validación.");
                                                    }
                                                };
                                                validatePromo();
                                            }}
                                        >
                                            Validar
                                        </Button>
                                    </div>
                                    {isPromoSuccess && (
                                        <p className="text-[10px] text-emerald-600 font-bold text-center animate-pulse">
                                            ¡Código aceptado! Desbloqueando acceso...
                                        </p>
                                    )}
                                </div>
                             )}
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
                                <button 
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline flex items-center gap-1.5"
                                >
                                    <LogOut className="w-3 h-3" />
                                    Cerrar Sesión Actual
                                </button>

                                <div className="hidden sm:block w-px h-3 bg-slate-200" />

                                <button 
                                    onClick={() => setAlreadyUsedEmail(null)}
                                    className="text-[10px] text-muted-foreground hover:text-foreground underline"
                                >
                                    Intentar con otro correo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-destructive font-bold text-center flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        {error}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <input 
                        type="checkbox" 
                        id="marketing-optin"
                        checked={subscribeToEmails}
                        onChange={(e) => setSubscribeToEmails(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="marketing-optin" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                        Deseo recibir información, estrategias de búsqueda de empleo en Canadá y novedades por correo de parte de Pierre y su equipo.
                    </label>
                </div>

                <Button 
                    size="lg" 
                    className={`w-full text-xl py-9 rounded-2xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-all ${(!!alreadyUsedEmail && !email.toLowerCase().includes("test")) ? 'opacity-50 grayscale pointer-events-none' : ''}`} 
                    onClick={handleSubmit} 
                    disabled={!cvText.trim() || !name || !email || !status || (!!alreadyUsedEmail && !email.toLowerCase().includes("test"))}
                >
                    <Sparkles className="mr-3 h-6 w-6 fill-current" />
                    GENERAR MI REPORTE AHORA 🚀
                </Button>

                {!alreadyUsedEmail && (
                    <div className="text-center">
                        {!showPromoInput ? (
                            <button 
                                onClick={() => setShowPromoInput(true)}
                                className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-colors"
                            >
                                ¿Tienes un código de beca o acceso PRO?
                            </button>
                        ) : (
                            <div className="max-w-xs mx-auto space-y-2 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="CÓDIGO DE ACCESO..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-[10px] font-bold uppercase"
                                    />
                                    <Button 
                                        size="sm" 
                                        className="h-9 px-4 text-[10px] font-black uppercase"
                                        onClick={() => {
                                            const validatePromo = async () => {
                                                try {
                                                    const res = await fetch("/api/validate-promo", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ code: promoCode }),
                                                    });
                                                    const data = await res.json();
                                                    
                                                    if (res.ok && data.success) {
                                                        setIsPromoSuccess(true);
                                                        setTimeout(() => {
                                                            localStorage.setItem("pierre_promo_unlocked", "true");
                                                            window.location.href = "/register?code=" + promoCode;
                                                        }, 1000);
                                                    } else {
                                                        setError(data.error || "Código inválido.");
                                                    }
                                                } catch (err) {
                                                    setError("Error de validación.");
                                                }
                                            };
                                            validatePromo();
                                        }}
                                    >
                                        Validar
                                    </Button>
                                </div>
                                {isPromoSuccess && (
                                    <p className="text-[9px] text-emerald-600 font-bold animate-pulse uppercase">¡Acceso concedido! Redirigiendo...</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
