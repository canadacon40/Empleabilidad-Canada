"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Award,
  Shuffle,
  MapPin,
  DollarSign,
  Building2,
  Loader2,
  ExternalLink,
  Info,
  Download,
  FileSpreadsheet,
  Lock,
  Languages,
  Sparkles,
  Check,
  Banknote,
  Rocket,
  ChevronRight,
  Clock,
  Calendar,
  Target,
  Briefcase,
  GraduationCap,
  Layout,
  ChevronUp,
  ChevronDown,
  Gift,
  Key,
  Quote,
  BarChart3,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GaugeChart from "./GaugeChart";
import JdMatcher from "./JdMatcher";
import UserManual from "./UserManual";
import OnboardingTutorial from "./OnboardingTutorial";
import EmployabilityEnginePro from "./EmployabilityEnginePro";
import { Button } from "@/components/ui/button";
import { sendGTMEvent } from "@next/third-parties/google";
import { downloadFullReportPDF, downloadLMIAExcel, downloadStyledCVPdf } from "@/lib/report-utils";

interface CvAnalysisProps {
  cvText: string;
  onAnalysisComplete: () => void;
  accessCode?: string;
  leadData?: any;
  leadId?: string;
  onUnlockPremium?: (code: string) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CvAnalysis({
  cvText,
  onAnalysisComplete,
  accessCode,
  leadData,
  leadId,
  onUnlockPremium,
}: CvAnalysisProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(leadData || null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [isRedesigning, setIsRedesigning] = useState(false);
  const [redesignedCv, setRedesignedCv] = useState<any>(null);
  const [targetLanguage, setTargetLanguage] = useState("En");
  const [cvVersions, setCvVersions] = useState<any[]>([]);
  const [showProFeatures, setShowProFeatures] = useState(false);

  useEffect(() => {
    // ≡ƒ¢í∩╕Å MODO TEST: Permitir al due├▒o probar las funciones PRO mediante URL o c├│digo directo
    const params = new URLSearchParams(window.location.search);
    const hasDebugParam = params.get('debug') === 'pro' || params.get('session_id') || params.get('code') === 'DEBUG_PRO' || params.get('code') === 'PIERRE-MASTER';
    
    if (hasDebugParam || accessCode === 'DEBUG_PRO' || accessCode === 'PIERRE-MASTER' || accessCode === 'PREMIUM') {
      setShowProFeatures(true);
    }
  }, [accessCode]);

  useEffect(() => {
     if (typeof window !== "undefined") {
         const stored = localStorage.getItem("pierreCvVersions");
         if (stored) {
             try { setCvVersions(JSON.parse(stored)); } catch(e) {}
         }
     }
  }, []);

  const handleRedesign = async (jdText?: string) => {
    setIsRedesigning(true);
    try {
      const res = await fetch("/api/cv-redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cvText, 
          targetLanguage,
          nocCode: result?.analisisNOC?.codigo,
          nocTitle: result?.analisisNOC?.titulo,
          jdContext: jdText 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const cvContent = data.result.redesignedCv || data.result;
        setRedesignedCv(cvContent);
        
        const newVersion = {
            id: Date.now().toString(),
            type: jdText ? "JD-Optimized" : "Base Canadian",
            language: targetLanguage,
            content: cvContent,
            primaryNoc: data.result.primaryNoc || cvContent.primaryNoc,
            roles: data.result.roleMappings || cvContent.roleMappings
        };
        
        setCvVersions(prev => {
            const updated = [...prev, newVersion];
            if (typeof window !== "undefined") {
                localStorage.setItem("pierreCvVersions", JSON.stringify(updated));
            }
            return updated;
        });
      }
    } catch {
      // ignore
    } finally {
      setIsRedesigning(false);
    }
  };
  
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Pierre est├í sobornando al algoritmo de LinkedIn...",
    "Traduciendo 'Echarle ganas' al est├índar de Toronto...",
    "Eliminando la foto del CV (aqu├¡ no la usamos, cr├⌐eme)...",
    "Buscando vacantes que a├║n no existen en Indeed...",
    "Convenciendo a los reclutadores de que tu nivel de ingl├⌐s es 'decente'...",
    "Inyectando palabras clave de alta demanda (v├¡a Pierre)...",
    "Identificando empresas con presupuesto para patrocinio...",
    "Pierre est├í aplicando el sello de aprobaci├│n GOLD...",
    "Calculando cu├íntos Tim Hortons hay cerca de tu pr├│ximo trabajo...",
    "Finalizando el veredicto maestro para tu futuro..."
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingStep(0);
    setHasGreeted(false);
    setError("");
    
    try {
      const res = await fetch("/api/cv-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cvText, 
          leadId,
          linkedinUrl: leadData?.linkedinUrl,
          networking: leadData?.networking,
          workPermitStatus: leadData?.workPermit
        }),
      });

      let data;
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textError = await res.text();
        console.error("Γ¥î Error de respuesta no-JSON:", textError.substring(0, 300));
        throw new Error(`Respuesta inv├ílida del servidor (${res.status}). Revisa la consola.`);
      }

      if (!res.ok) {
        console.error("Γ¥î Error de API (Status " + res.status + "):", data);
        setError(data.error || `Error del servidor (${res.status}). Revisa tu configuraci├│n.`);
        return;
      }

      setResult(data.result);
      
      // Save result for Pierre chatbot context
      try {
        localStorage.setItem("last_report_result", JSON.stringify(data.result));
      } catch (e) {
        console.warn("Could not save report result to localStorage:", e);
      }

      // --- PHASE 1.5: Generate Personalized Module Plan (Background) ---
      if (leadId) {
        fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId })
        }).catch(err => console.error("Plan generation error:", err));
      }

      // --- PHASE 2: Pierre AI Agent Proactive Greeting ---
      setTimeout(() => {
        const score = data.result.puntaje?.final || data.result.puntaje?.base || 0;
        const noc = data.result.analisisNOC?.titulo || data.result.analisisNOC?.t├¡tulo || "tu perfil";
        const name = localStorage.getItem("lead_name")?.split(' ')[0] || "amigo";
        
        const event = new CustomEvent("pierreChatGreeting", {
            detail: {
                message: `┬í${name}! He analizado tu perfil como ${noc}. Tu score es de ${score}/100. Tienes un potencial enorme, pero veo brechas cr├¡ticas que te frenar├ín en Canad├í. ┬┐Quieres que te diga c├│mo cerrarlas hoy mismo?`
            }
        });
        window.dispatchEvent(event);
      }, 2000);
      
    } catch (err: any) {
      console.error("≡ƒÜ¿ Error cr├¡tico en handleAnalyze:", err);
      // Solo mostrar "Error de conexi├│n" si el fetch fall├│ f├¡sicamente (network error)
      if (err.message && err.message.includes("fetch")) {
        setError("Error de red. Aseg├║rate de que el servidor est├⌐ corriendo.");
      } else {
        setError(err.message || "Error inesperado en el motor de an├ílisis.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isResultValid = result?.veredictoFinal || (result?.diagnostico && result.diagnostico.length > 0);
    if (!isResultValid && cvText && !isLoading && !error) {
      handleAnalyze();
    }
  }, [cvText]);

  useEffect(() => {
    if (result && !isLoading && !hasGreeted) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('pierreChatGreeting', { 
            detail: { 
                message: `┬íHola! He analizado tu perfil. Tu score final es ${result.puntaje?.final || 0}/100. ≡ƒÜÇ He identificado fortalezas cr├¡ticas y el camino exacto para optimizar tu CV para empresas canadienses. ┬┐Quieres que te explique por d├│nde empezar?` 
            } 
        }));
        setHasGreeted(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result, isLoading, hasGreeted]);

  const handleCheckout = async (amount: number, successUrl: string, productName?: string) => {
    sendGTMEvent({
      event: "checkout_started",
      value: { amount: amount / 100, currency: "USD" },
    });
    setIsCheckoutLoading(true);

    if (result) {
      localStorage.setItem(
        "pendingReportData",
        JSON.stringify({
          result,
          cvText,
          leadId,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    try {
      const leadEmail = localStorage.getItem("lead_email") || "";
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceOverride: amount,
          successPath: successUrl,
          productNameOverride: productName,
          customerEmail: leadEmail,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        const errorMsg = data.details || data.error || "Ocurri├│ un error al crear la sesi├│n de pago.";
        alert(`Error en el Radar de Empleo: ${errorMsg}`);
        setIsCheckoutLoading(false);
      }
    } catch (e) {
      alert("Error de conexi├│n con el sistema de pagos.");
      setIsCheckoutLoading(false);
    }
  };

  const downloadFullReport = () => {
    if (!result) return;
    downloadFullReportPDF(result);
  };

  const ExecutiveDiagnostic = ({ data }: { data: any }) => {
    if (!data) return null;

    const scoreLabels: Record<string, string> = {
      experiencia: "Experiencia",
      educacion: "Educaci├│n",
      certificaciones: "Certificaciones",
      cv: "CV",
      idioma: "Ingl├⌐s / Franc├⌐s",
      networking: "Networking",
      estrategia: "Estrategia",
    };

    return (
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 animate-in fade-in duration-700"
      >
        <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-400">
            <Shield className="w-40 h-40" />
          </div>
          <div className="p-8 sm:p-12 border-b border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">2. NIVEL DE EMPLEABILIDAD (REAL)</h4>
               </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Resumen Estrat├⌐gico</p>
                <p className="text-slate-600 text-lg font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                  "{data.resumenEjecutivo?.descripcion}"
                </p>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
                  <p className="text-sm font-black text-slate-900 flex gap-2">
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    CONCLUSI├ôN CLAVE: {data.resumenEjecutivo?.conclusionClave}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Scoring Tipo Mercado</p>
                <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 bg-slate-50/50 p-4 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="col-span-8">├ürea de Evaluaci├│n</div>
                    <div className="col-span-4 text-right">Score Competitivo</div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {Object.entries(data.scoreMultidimensional || {}).map(([key, val]: [string, any]) => {
                      if (key === 'interpretacionEstrategica') return null;
                      const scoreValue = typeof val === 'number' ? val : parseInt(val) || 0;
                      // Ensure everything is on a 0-100 basis for consistency in display
                      const displayScore = scoreValue > 10 ? scoreValue : scoreValue * 10;
                      const label = scoreLabels[key] || key;

                      return (
                        <div key={key} className="grid grid-cols-12 items-center p-4 hover:bg-slate-50/30 transition-colors">
                          <div className="col-span-8">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{label}</span>
                          </div>
                          <div className="col-span-4 flex items-center justify-end gap-3 text-right">
                            <span className={`text-sm font-black ${displayScore >= 80 ? 'text-emerald-500' : displayScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                              {displayScore}%
                            </span>
                            {displayScore < 60 && (
                              <XCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                            )}
                            {displayScore >= 80 && (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 bg-rose-50/50 border-r border-slate-100">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-black text-rose-600 uppercase tracking-tight italic">Los 3 Errores de impacto Cr├¡tico</h4>
               </div>
               <div className="grid gap-4">
                 {data.principalesBloqueadores?.slice(0, 3).map((b: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Error {i+1}</div>
                      <p className="text-sm font-black text-slate-900 mb-2 uppercase">{b.titulo}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">{b.descripcion}</p>
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Impacto: {b.impacto || "Cr├¡tico"}</span>
                        <p className="text-[9px] font-bold text-slate-400 italic">"{b.insight}"</p>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
            <div className="p-8 sm:p-12 bg-emerald-50/50">
              <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-black text-emerald-600 uppercase tracking-tight italic">Factores de Apalancamiento</h4>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {data.factoresApalancamiento?.slice(0, 3).map((f: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-black text-emerald-600 mb-1 uppercase ">{f.titulo}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{f.descripcion}"</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  };

  const isUserPro = (session?.user as any)?.isPro;
  const isMasterEmail = session?.user?.email?.toLowerCase().trim() === "pierre-master@canadacontrabajo.com";
  
  // ≡ƒöÆ HARD GATE: Strictly allow based on active session status or confirmed access code
  const isPremium = accessCode === "PREMIUM" || isUserPro || isMasterEmail;

  if (error) {
    return (
      <div className="p-8 text-center space-y-4 bg-white rounded-[3rem] border-2">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-xl font-bold">Vaya, algo sali├│ mal</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={handleAnalyze}>Intentar de nuevo</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex flex-col items-center justify-center p-8 text-center space-y-10 animate-in fade-in duration-1000 rounded-[4rem]">
          <div className="relative w-48 h-48">
              <div className="absolute inset-4 border-[6px] border-dashed border-primary rounded-full animate-spin duration-[6000ms]" />
              <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/images/pierre-avatar.png" alt="Analizando" className="w-28 h-28 rounded-full shadow-2xl" />
              </div>
          </div>
          <div className="max-w-md w-full space-y-8">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Pierre est├í analizando cada detalle...</h3>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-1 bg-primary animate-progress-fast" style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`, transition: 'width 0.5s ease-out' }} />
                <p className="text-slate-600 font-bold italic text-lg leading-relaxed animate-in fade-in duration-700 min-h-[3rem] flex items-center justify-center text-center">
                    "{loadingMessages[loadingStep]}"
                </p>
              </div>
          </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20 space-y-8 bg-white border border-slate-200 rounded-[4rem] shadow-sm">
        <Shield className="w-16 h-16 text-primary mx-auto animate-pulse" />
        <h3 className="text-2xl font-black text-slate-900 tracking-tight text-center">Diagn├│stico Pierre 2.6</h3>
        <Button size="lg" className="rounded-2xl h-16 px-12 font-black shadow-xl" onClick={handleAnalyze}>Generar mi Reporte Gratis</Button>
      </div>
    );
  }

  const getConclusionText = () => {
    if (typeof result.veredictoFinal === 'object' && result.veredictoFinal !== null) {
      return result.veredictoFinal.conclusion || "Estrategia de empleabilidad ajustada para Canad├í.";
    }
    return result.veredictoFinal || result.introduccion || "Analizando tu perfil bajo est├índares 2026...";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 bg-slate-50 p-4 sm:p-10 rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
      
      {/* ≡ƒÜÇ PRO CHOICE BANNER */}
      {isPremium && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto bg-slate-950 p-6 sm:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
               <Rocket className="w-7 h-7 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white text-lg sm:text-xl font-black tracking-tight leading-tight">Acceso Estrat├⌐gico PRO Activo</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Ya puedes acceder a todas las herramientas de redise├▒o y preparaci├│n.</p>
            </div>
          </div>
          <Button 
            onClick={onAnalysisComplete}
            className="h-14 px-8 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-black gap-3 text-xs uppercase shadow-xl transition-all relative z-10 border-none shrink-0"
          >
            Ir al Centro T├íctico Directo <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* 1. INITIAL IMPACT / SCORE */}
      <header className="space-y-6 max-w-6xl mx-auto px-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border border-slate-200 shadow-sm">
              Canada Strategy Engine v2.6 Maestro
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Reporte de <span className="text-primary italic">Empleabilidad</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              className={`h-11 px-6 rounded-xl border-2 gap-2 font-black shadow-sm bg-white text-slate-900 hover:bg-slate-50 ${!isPremium ? "opacity-50 grayscale" : ""}`}
              onClick={() => isPremium && downloadFullReport()}
            >
              <Download className="w-4 h-4 text-primary" />
              PDF {!isPremium && <Lock className="w-3 h-3 text-slate-400" />}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6 pt-4">
          <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Puntaje de Radar</p>
            <GaugeChart 
              score={result.puntaje?.final || 0} 
              label={
                (result.puntaje?.final || 0) <= 40 ? "CR├ìTICA" :
                (result.puntaje?.final || 0) <= 65 ? "BAJA" :
                (result.puntaje?.final || 0) <= 85 ? "MEDIA" : "ALTA"
              } 
            />
            <div className="grid grid-cols-2 gap-2 mt-6 w-full px-4 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[8px] font-black text-slate-500 uppercase">0-40 Cr├¡tica</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[8px] font-black text-slate-500 uppercase">41-65 Baja</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[8px] font-black text-slate-500 uppercase">66-85 Media</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[8px] font-black text-slate-500 uppercase">86-100 Alta</span></div>
            </div>
          </div>
          
          <div className="md:col-span-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden text-left flex flex-col justify-center">
            <div className="space-y-6 relative">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" /> An├ílisis Cr├¡tico Pierre
              </h4>
              <p className="text-slate-600 font-medium leading-relaxed italic text-lg border-l-4 border-primary/30 pl-6">
                "{result.introduccion || getConclusionText()}"
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BASE T├ëCNICA (Paso 01) */}
      <div className="space-y-6 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 pt-4">
              <span className="px-5 py-1.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Paso 01: Validaci├│n</span>
              <div className="h-[2px] bg-slate-200 flex-1" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Target className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 text-center">An├ílisis NOC</h3>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">C├│digo Identificado</span>
                  <span className="text-3xl font-black text-primary">{result.analisisNOC?.codigo || "N/A"}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">T├¡tulo Oficial</span>
                  <span className="text-xl font-bold text-slate-900">{result.analisisNOC?.titulo || "Calculando..."}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic text-center">
                  "{result.analisisNOC?.porqueEsImportante || result.analisisNOC?.queEsElNOC || "Este c├│digo es tu identidad laboral frente a migraci├│n."}"
                </p>
                {result.analisisNOC?.linkOficialNOC && (
                  <a 
                    href={result.analisisNOC.linkOficialNOC} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 mt-2"
                  >
                    Ver descripci├│n oficial en Job Bank <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 text-center">An├ílisis de Brechas</h3>
              </div>
              <div className="space-y-3">
                {(result.analisisBrechas?.puntosCriticos || result.analisisNOC?.requisitosNoCumplidos || []).map((gap: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-rose-500 font-black shrink-0">0{i+1}.</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{gap}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ≡ƒöì ESTATUS DE REGULACI├ôN (NEW) */}
          {result.regulacion && (
             <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden mt-8 shadow-sm">
                 <div className={`p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${result.regulacion.esRegulada ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${result.regulacion.esRegulada ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                          {result.regulacion.esRegulada ? <Lock className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                       </div>
                       <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${result.regulacion.esRegulada ? 'text-orange-600' : 'text-emerald-600'}`}>
                            Estatus de Profesi├│n en Canad├í
                          </p>
                          <h3 className="text-2xl font-black text-slate-900 leading-tight">
                            {result.regulacion.esRegulada ? 'Sujeta a Regulaci├│n' : 'No Regulada (Acceso Libre)'}
                          </h3>
                       </div>
                    </div>
                    {result.regulacion.esRegulada && (
                       <div className="px-5 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-black uppercase tracking-widest">
                          Requiere Licencia para Firmar
                       </div>
                    )}
                 </div>
                 <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lo que PUEDES hacer ahora:
                       </h4>
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-2 border-emerald-100 pl-4">
                          {result.regulacion.quePuedesHacer || "Trabajar en roles de soporte, coordinaci├│n o bajo supervisi├│n de un Licenciado."}
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500" /> Lo que tienes PROHIBIDO:
                       </h4>
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-2 border-rose-100 pl-4">
                          {result.regulacion.queNoPuedesHacer || "Firmar proyectos oficiales o ostentar el t├¡tulo de Ingeniero/Profesional Colegiado."}
                       </p>
                    </div>
                    {result.regulacion.comoRegularizarse && (
                       <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-2">Camino a la Colegiatura:</p>
                          <p className="text-sm text-slate-600 font-medium">{result.regulacion.comoRegularizarse}</p>
                       </div>
                    )}
                 </div>
             </section>
          )}

          {result.diagnostico?.length > 0 && (
            <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mt-8">
                <div className="bg-slate-900 p-8">
                  <h4 className="font-black text-white flex items-center gap-3 text-xl tracking-tight">
                    <AlertTriangle className="w-6 h-6 text-primary" /> Auditor├¡a de Formato
                  </h4>
                </div>
                <div className="p-8 space-y-4">
                  {result.diagnostico.slice(0, 5).map((d: any, i: number) => (
                    <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black shrink-0">{i + 1}</div>
                      <div className="space-y-1 flex-1">
                          <p className="font-black text-slate-900 leading-tight">{d.problema}</p>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">{d.porque}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </section>
          )}
      </div>

      {/* 3. MERCADO (Paso 02) */}
      <div className="space-y-8 max-w-6xl mx-auto px-4 mt-12">
          <div className="grid lg:grid-cols-2 gap-8">
              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[400px]">
                   <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-3 font-black text-slate-900 text-lg"><MapPin className="w-5 h-5 text-primary" /> Demanda Provincial</div>
                   </div>
                   <div className="p-6 flex-1">
                      <div className="space-y-3">
                        {result.mercado?.provincias?.slice(0,6).map((p: any, i: number) => {
                          const nivelLower = (p.nivel || "").toLowerCase();
                          const isHigh = nivelLower.includes("alt");
                          const isMedia = nivelLower.includes("med");
                          return (
                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                                <span className="text-sm font-bold text-slate-900">{p.nombre || p.provincia}</span>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                                  isHigh ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : 
                                  isMedia ? "bg-orange-50 text-orange-600 border-orange-200 shadow-sm" :
                                  "bg-rose-50 text-rose-600 border-rose-200 shadow-sm"
                                }`}>
                                  {p.nivel}
                                </span>
                            </div>
                          );
                        })}
                      </div>
                   </div>
              </section>

              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
                  <div className="bg-slate-900 p-6 text-white font-black text-lg flex items-center gap-3 shadow-md">
                    <Banknote className="w-5 h-5 text-primary" /> Proyecci├│n Salarial (CAD)
                  </div>
                  <div className="p-8 grid gap-6 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                          <span className="text-xs font-black text-slate-500 uppercase">Entry Level</span>
                          <span className="text-xl font-black text-slate-800 tracking-tight">{result.salarios?.entry}</span>
                      </div>
                      <div className="flex justify-between items-center py-5 bg-primary/5 px-6 rounded-2xl border-l-4 border-l-primary shadow-sm">
                          <span className="text-xs font-black text-primary uppercase">Mid Level</span>
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">{result.salarios?.mid}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <span className="text-xs font-black text-slate-500 uppercase">Top Senior</span>
                          <span className="text-xl font-black text-slate-800 tracking-tight">{result.salarios?.senior}</span>
                      </div>
                  </div>
                  <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"><Info className="w-3 h-3" /> Basado en medianas de Statistics Canada</p>
                  </div>
              </section>
          </div>
      </div>

          {/* ≡ƒîë PLAN DE ROLES PUENTE (NEW) */}
          {result.rolesPuente && result.rolesPuente.length > 0 && (
            <section className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">Paso 03: Roles Puente</div>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-200 shadow-xl space-y-10">
                    <div className="space-y-4 max-w-2xl">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Tu Mapa de <span className="text-primary italic">Entrada R├ípida</span></h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                          Si tu rol principal requiere regularizaci├│n o el mercado est├í saturado, estos 3 roles son tu mejor apuesta para entrar a la industria canadiense aprovechando tu experiencia actual.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {result.rolesPuente.slice(0, 3).map((role: any, i: number) => (
                        <div key={i} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col gap-6 relative group hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                           <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                              <Briefcase className="w-6 h-6" />
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Bridge Role {i+1}</p>
                              <h4 className="text-lg font-black text-slate-900 leading-tight">{role.titulo}</h4>
                           </div>
                           <div className="space-y-4 flex-1">
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                <span className="text-slate-900 font-black uppercase text-[9px] block mb-1">┬┐Por qu├⌐ este rol?</span>
                                {role.porque}
                              </p>
                              <div className="pt-4 border-t border-slate-200/50">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Salario Estimado</p>
                                 <p className="text-xl font-black text-slate-900 tracking-tighter">{role.salarioAnual}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                </div>
          )}
      </div>

      {/* ≡ƒÜÇ HOJA DE RUTA AL ├ëXITO (NEW) */}
      {!isPremium && result.puntaje?.potencialCrecimiento && (
        <section className="max-w-6xl mx-auto px-4 mt-20">
            <div className="bg-slate-900 rounded-[4rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -mr-40 -mt-40" />
                
                <div className="relative z-10 text-center space-y-4 mb-16">
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">Tu Hoja de Ruta al <span className="text-primary italic">├ëxito en Canad├í</span></h3>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                        Identificamos los 3 pasos cr├¡ticos que debes ejecutar para pasar de "Invisible" a "Contratable".
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden md:block -translate-y-1/2" />
                    
                    {result.puntaje.potencialCrecimiento.slice(0, 3).map((step: any, i: number) => (
                      <div key={i} className="relative space-y-6 flex flex-col items-center text-center group">
                          <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-xl font-black text-primary shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                             {i + 1}
                          </div>
                          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/5 space-y-4 flex-1 hover:bg-white/10 transition-colors">
                              <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tight">{step.accion}</h4>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                 Este paso es vital para corregir tus bloqueadores actuales e incrementar tu visibilidad.
                              </p>
                              <div className="pt-4 border-t border-white/5">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">El "C├ôMO" t├íctico:</p>
                                  <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                    Disponible paso a paso en <span className="text-white">Pierre PRO</span>
                                  </p>
                              </div>
                          </div>
                      </div>
                    ))}
                </div>

                <div className="mt-16 flex flex-col items-center gap-4 relative z-10">
                    <div className="px-6 py-2 bg-primary/20 rounded-full border border-primary/30">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Optimizaci├│n 2026</p>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* 4. AHA MOMENT: Score Leap Simulator */}
      {!isPremium && (
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-1000 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-black rounded-full shadow-lg">TRANSFORMACI├ôN PRO</div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-12 text-center">Tu Salto de Valor Estrat├⌐gico</p>
          <div className="flex flex-col md:flex-row items-center justify-around gap-12 sm:gap-20">
            <div className="flex flex-col items-center gap-6 group">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Curr├¡culum Actual</p>
              <div className="opacity-40 grayscale group-hover:opacity-100 transition-opacity">
                <GaugeChart score={result.puntaje?.final || 0} size={160} hideLabel />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-primary/10 p-5 rounded-full border border-primary/20 shadow-inner"
              >
                <Zap className="w-10 h-10 text-primary fill-primary" />
              </motion.div>
              <p className="text-[11px] font-black text-slate-900 mt-4 uppercase tracking-tighter">Optimizaci├│n Pierre</p>
            </div>
            <div className="flex flex-col items-center gap-6 group">
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest shadow-emerald-500/10">Perfil de ├ëlite (PRO)</p>
              <div className="scale-110 drop-shadow-[0_15px_30px_rgba(234,179,8,0.2)]">
                <GaugeChart score={Math.min(95, (result.puntaje?.final || 0) + 40)} size={190} hideLabel />
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-sm sm:text-lg font-bold italic mt-16 max-w-2xl mx-auto leading-relaxed text-center">
            "Tu perfil tiene el talento, pero tu CV actual lo mantiene invisible para el algoritmo. <span className="text-primary font-black border-b-2 border-primary/30">Pierre PRO lo transforma hoy mismo.</span>"
          </p>
        </div>
      )}

      {/* 5. DIAGN├ôSTICO EJECUTIVO (Si existe) */}
      {result.diagnosticoEjecutivo && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <ExecutiveDiagnostic data={result.diagnosticoEjecutivo} />
        </div>
      )}

      {/* 6. PRO ENGINE (Solo si es Premium o Debug) */}
      {(isPremium) && (
        <div id="pro-tools" className="max-w-6xl mx-auto px-4 mt-12 pt-12 border-t-4 border-primary/20">
            <div className="bg-primary/10 p-4 rounded-2xl mb-8 text-center border border-primary/20">
                <p className="text-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-primary" /> MODO PREMIUM ACTIVADO {isDebugPro && "(ADMIN DEBUG)"}
                </p>
            </div>

            {/* ERROR PREVENCI├ôN: Mapa de ├ëxito / Instrucciones PRO (FIJA) */}
            <div className="mb-16 space-y-10">
              {/* VIP BRIDGE: Only for PRO users seeing the report */}
              {showProFeatures && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-8 sm:p-10 text-center mb-12 shadow-inner"
                >
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-left">
                         <h3 className="text-2xl font-black text-slate-900 leading-tight">Acceso Pierre PRO Activado</h3>
                         <p className="text-slate-500 font-medium max-w-md">Ya tienes tu score. Ahora utiliza el arsenal t├íctico para transformar este CV en una oferta real.</p>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={onAnalysisComplete}
                        className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-3 shrink-0"
                      >
                         <Rocket className="w-5 h-5 animate-pulse" />
                         Entrar al Centro T├íctico
                      </Button>
                   </div>
                </motion.div>
              )}

              <div className="bg-slate-950 rounded-[3.5rem] p-10 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/30 shadow-lg shadow-primary/5">
                      <ShieldCheck className="w-4 h-4" /> Protocolo de Ejecuci├│n PRO
                    </div>
                    <div>
                      <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none mb-4">
                        Optimizaci├│n <span className="text-primary italic">Maestra</span>
                      </h2>
                      <p className="text-slate-200 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl italic">
                        "Para que tu perfil sea imparable, debes seguir el orden t├íctico. La adaptaci├│n ciega es el error #1 de los candidatos."
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-5 relative">
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 space-y-6 shadow-2xl relative z-10">
                      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-slate-950 font-black text-sm shadow-xl shadow-primary/20">
                          100%
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-0.5">Control de Calidad</p>
                          <p className="text-xs font-bold text-primary tracking-tight">Valor Estrat├⌐gico Garantizado</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">
                        Sigue las instrucciones del manual a continuaci├│n para asegurar que tu CV no solo pase el filtro ATS, sino que enamore al reclutador humano.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Manual PRO Integrated directly */}
              <UserManual />
            </div>

            <div className="h-px bg-slate-200 w-full mb-16 opacity-30" />

            <EmployabilityEnginePro 
              cvText={cvText} 
              onAction={() => {/* Optional: refresh local state if needed */}} 
              onCreditLimit={() => {/* Optional: handle limit in free view */}}
            />

            {/* CTA: Abrir Centro T├íctico Completo - HIGH POLISH REDESIGN */}
            <div className="mt-20 bg-slate-950 rounded-[3.5rem] p-10 sm:p-16 text-center relative overflow-hidden border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.15),transparent_50%)]" />
                <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-primary border border-white/10 shadow-xl">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Arsenal Estrat├⌐gico Completo
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                          Centro de <span className="text-primary italic">Recursos PRO</span>
                      </h3>
                      <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                          Accede a la suite completa de herramientas dise├▒adas para dominar el Mercado Oculto canadiense.
                      </p>
                    </div>

                    {/* Features Grid for the CTA */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                        {[
                          { icon: Mail, label: "Cover Letters" },
                          { icon: MessageSquare, label: "Entrevistas" },
                          { icon: Search, label: "Portales Pro" },
                          { icon: Phone, label: "Scripts" }
                        ].map((f, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                             <f.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{f.label}</span>
                          </div>
                        ))}
                    </div>

                    <div className="pt-6">
                      <Button 
                          size="lg"
                          className="h-20 px-16 rounded-[2rem] bg-primary text-slate-950 font-black text-xl shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-all hover:bg-primary-foreground uppercase group"
                          onClick={onAnalysisComplete}
                      >
                          <Rocket className="w-6 h-6 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          ABRIR CENTRO ESTRAT├ëGICO
                      </Button>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-8 opacity-60">Tu ├⌐xito profesional comienza aqu├¡.</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 7. VEREDICTO MAESTRO / CTA */}
      {!isPremium && (
        <section className="bg-white text-slate-900 rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-20 relative overflow-hidden border-2 border-primary group mx-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <div className="space-y-4">
              <h3 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-tight">Estrategia Ganadora</h3>
              <p className="text-slate-600 text-lg max-w-2xl font-medium leading-relaxed italic mx-auto">
                "{getConclusionText()}"
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full max-w-lg">
              <Button 
                  size="lg"
                  className="h-20 sm:h-24 w-full rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 text-white hover:bg-primary transition-all text-sm sm:text-xl font-black shadow-2xl group flex flex-col items-center justify-center px-4"
                  onClick={() => handleCheckout(2900, "/cv-tool/success", "Radar de Empleo PRO")}
                  disabled={isCheckoutLoading}
              >
                  <div className="flex items-center gap-2 sm:gap-4 mb-0.5 sm:mb-1">
                    {isCheckoutLoading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />}
                    <span className="whitespace-nowrap">OBTENER MI REPORTE PRO</span>
                  </div>
                  <span className="text-[8px] sm:text-[10px] opacity-60 font-medium uppercase tracking-widest">Acceso Instant├íneo ΓÇó $29.00 USD</span>
              </Button>

              <button 
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
              >
                  ┬┐Tienes un c├│digo de beca o convenio?
              </button>

              <AnimatePresence>
                  {showCodeInput && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2"
                    >
                      <input 
                          type="text" 
                          placeholder="C├ôDIGO AQU├ì" 
                          className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all shadow-inner"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      />
                      <Button 
                          onClick={async () => {
                            setIsVerifyingCode(true);
                            setCodeError("");
                            try {
                              const res = await fetch("/api/auth/register", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                   email: localStorage.getItem("lead_email"),
                                   promoCode: promoCode,
                                   isChecking: true // New flag to just check validity
                                })
                              });
                              const data = await res.json();
                              if (res.ok && data.valid) {
                                onUnlockPremium?.(promoCode);
                              } else {
                                setCodeError(data.error || "C├│digo inv├ílido o expirado.");
                              }
                            } catch (e) {
                              setCodeError("C├│digo inv├ílido o expirado.");
                            } finally {
                              setIsVerifyingCode(false);
                            }
                          }}
                          disabled={isVerifyingCode || !promoCode}
                          className="rounded-2xl h-14 px-8 font-black bg-slate-900 text-white hover:bg-primary"
                      >
                          {isVerifyingCode ? <Loader2 className="w-5 h-5 animate-spin" /> : "VALIDAR"}
                      </Button>
                    </motion.div>
                  )}
              </AnimatePresence>
              {codeError && <p className="text-rose-600 text-[10px] font-black uppercase text-center mt-2">{codeError}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full border-t border-slate-100 pt-12">
              <div className="space-y-2">
                  <Layout className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Optimizaci├│n ATS</p>
              </div>
              <div className="space-y-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Directorio LMIA</p>
              </div>
              <div className="space-y-2">
                  <GraduationCap className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Masterclass CV</p>
              </div>
              <div className="space-y-2">
                  <Key className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Calculadora CLB</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="text-center py-10 opacity-40">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">Pierre Employability Engine v2.8 ΓÇó Executive Report ΓÇó Google Cloud AI</p>
      </footer>
    </div>
  );
}
