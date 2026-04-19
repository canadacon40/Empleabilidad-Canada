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

const ExecutiveDiagnostic = ({ data }: { data: any }) => {
  if (!data) return null;

  const scoreLabels: Record<string, string> = {
    experiencia: "Experiencia",
    educacion: "Educación",
    certificaciones: "Certificaciones",
    cv: "CV",
    idioma: "Inglés / Francés",
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
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Resumen Estratégico</p>
              <p className="text-slate-600 text-lg font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                "{data.resumenEjecutivo?.descripcion || data.resumenEjecutivo?.descripción || data.resumenEjecutivo?.resumen || ''}"
              </p>
              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
                <p className="text-sm font-black text-slate-900 flex gap-2">
                  <Sparkles className="w-5 h-5 text-primary shrink-0" />
                  CONCLUSIÓN CLAVE: {data.resumenEjecutivo?.conclusionClave || data.resumenEjecutivo?.conclusiónClave || data.resumenEjecutivo?.conclusion || data.resumenEjecutivo?.conclusión || 'Analizando...'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Scoring Tipo Mercado</p>
              <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 bg-slate-50/50 p-4 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="col-span-8">Área de Evaluación</div>
                  <div className="col-span-4 text-right">Score Competitivo</div>
                </div>
                <div className="divide-y divide-slate-50">
                  {Object.entries(data.scoreMultidimensional || {}).map(([key, val]: [string, any]) => {
                    if (key === 'interpretacionEstrategica') return null;
                    const scoreValue = typeof val === 'number' ? val : parseInt(val) || 0;
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
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-12 bg-rose-50/50 border-r border-slate-100">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <XCircle className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-rose-600 uppercase tracking-tight italic">Los 3 Errores de impacto Crítico</h4>
             </div>
             <div className="grid gap-4">
               {data.principalesBloqueadores?.slice(0, 3).map((b: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Error {i+1}</div>
                    <p className="text-sm font-black text-slate-900 mb-2 uppercase">{b.titulo || b.título}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">{b.descripcion || b.descripción}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Impacto: {b.impacto || "Crítico"}</span>
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
                    <p className="text-sm font-black text-emerald-600 mb-1 uppercase ">{f.titulo || f.título}</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{f.descripcion || f.descripción}"</p>
                  </div>
                ))}
             </div>
          </div>
      </div>
    </motion.section>
  );
};

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

  // 🛡️ SYNC STATE: If leadData prop changes or is provided after mount, sync it to results
  useEffect(() => {
    if (leadData && !result) {
      console.log("[CvAnalysis] Syncing result state from leadData prop...");
      setResult(leadData);
    }
  }, [leadData, result]);

  const resObj = result || leadData;
  const isResultComplete = resObj?.veredictoFinal || resObj?.analisisNOC?.codigo || resObj?.introduccion;

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [cvVersions, setCvVersions] = useState<any[]>([]);
  const [showProFeatures, setShowProFeatures] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasDebugParam = params.get('debug') === 'pro' || params.get('session_id') || params.get('code') === 'DEBUG_PRO' || params.get('code') === 'PIERRE-MASTER' || params.get('code') === 'BECA100';
    
    if (hasDebugParam || accessCode === 'DEBUG_PRO' || accessCode === 'PIERRE-MASTER' || accessCode === 'BECA100' || accessCode === 'PREMIUM') {
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

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Pierre está sobornando al algoritmo de LinkedIn...",
    "Traduciendo 'Echarle ganas' al estándar de Toronto...",
    "Eliminando la foto del CV (aquí no la usamos, créeme)...",
    "Buscando vacantes que aún no existen en Indeed...",
    "Convenciendo a los reclutadores de que tu nivel de inglés es 'decente'...",
    "Inyectando palabras clave de alta demanda (vía Pierre)...",
    "Identificando empresas con presupuesto para patrocinio...",
    "Pierre está aplicando el sello de aprobación GOLD...",
    "Calculando cuántos Tim Hortons hay cerca de tu próximo trabajo...",
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
        console.error("❌ Error de respuesta no-JSON:", textError.substring(0, 300));
        throw new Error(`Respuesta inválida del servidor (${res.status}). Revisa la consola.`);
      }

      if (!res.ok) {
        setError(data.error || `Error del servidor (${res.status}).`);
        return;
      }

      setResult(data.result);
      
      try {
        localStorage.setItem("last_report_result", JSON.stringify(data.result));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      if (leadId) {
        fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId })
        }).catch(() => {});
      }

      setTimeout(() => {
        const score = data.result.puntaje?.final || data.result.puntaje?.base || 0;
        const noc = data.result.analisisNOC?.titulo || data.result.analisisNOC?.título || "tu perfil";
        const name = localStorage.getItem("lead_name")?.split(' ')[0] || "amigo";
        
        const event = new CustomEvent("pierreChatGreeting", {
            detail: {
                message: `¡${name}! He analizado tu perfil como ${noc}. Tu score es de ${score}/100. Tienes un potencial enorme, pero veo brechas críticas que te frenarán en Canadá. ¿Quieres que te diga cómo cerrarlas hoy mismo?`
            }
        });
        window.dispatchEvent(event);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Error inesperado en el motor de análisis.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isResultComplete = result?.veredictoFinal || result?.analisisNOC?.codigo;
    if (!isResultComplete && cvText && cvText.length > 50 && !isLoading && !error) {
      handleAnalyze();
    }
  }, [cvText, result]);

  useEffect(() => {
    if (result && !isLoading && !hasGreeted) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('pierreChatGreeting', { 
            detail: { 
                message: `¡Hola! He analizado tu perfil. Tu score final es ${result.puntaje?.final || 0}/100. 🚀 He identificado fortalezas críticas y el camino exacto para optimizar tu CV para empresas canadienses. ¿Quieres que te explique por dónde empezar?` 
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
      console.log("[handleCheckout] Response received:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        const errorMsg = data.error || data.details || "Error desconocido al generar el link de pago.";
        console.error("❌ Checkout failure:", errorMsg);
        alert(`Error en el Radar de Empleo: ${errorMsg}`);
        setIsCheckoutLoading(false);
      }
    } catch (e) {
      alert("Error de conexión con el sistema de pagos.");
      setIsCheckoutLoading(false);
    }
  };

  const downloadFullReport = () => {
    if (!result) return;
    downloadFullReportPDF(result);
  };

  const isUserPro = (session?.user as any)?.isPro;
  const isMasterEmail = session?.user?.email?.toLowerCase().trim() === "pierre-master@canadacontrabajo.com";
  const isPremium = accessCode === "PREMIUM" || isUserPro || isMasterEmail;
  const isDebugPro = accessCode === 'DEBUG_PRO' || accessCode === 'PIERRE-MASTER';

  if (error) {
    return (
      <div className="p-8 text-center space-y-4 bg-white rounded-[3rem] border-2">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-xl font-bold">Vaya, algo salió mal</h3>
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
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Pierre está analizando cada detalle...</h3>
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

  if (!isResultComplete) {
    return (
      <div className="text-center py-20 space-y-8 bg-white border border-slate-200 rounded-[4rem] shadow-sm animate-in fade-in zoom-in duration-700">
        <Shield className="w-16 h-16 text-primary mx-auto animate-pulse" />
        <h3 className="text-2xl font-black text-slate-900 tracking-tight text-center">Diagnóstico Pierre 2.7 Maestro</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Hemos recibido tu información, ahora deja que Pierre realice la auditoría técnica de empleabilidad.</p>
        <div className="flex flex-col items-center gap-4">
           <Button 
            size="lg" 
            className="rounded-[2rem] h-20 px-12 font-black shadow-2xl shadow-primary/20 bg-slate-950 text-white hover:bg-slate-900 active:scale-[0.98] transition-all text-lg uppercase italic tracking-widest" 
            onClick={handleAnalyze}
           >
             <Sparkles className="mr-2 h-6 w-6 text-primary" />
             Iniciar Auditoría Pierre <ChevronRight className="ml-2 h-5 w-5" />
           </Button>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Análisis de Nivel de Empleabilidad 2026</p>
        </div>
      </div>
    );
  }


  const conclusionTextResult = typeof resObj?.veredictoFinal === "object" 
    ? (resObj.veredictoFinal.conclusion || resObj.veredictoFinal.conclusión) 
    : (resObj?.veredictoFinal || resObj?.introduccion || "Analizando tu perfil bajo estándares 2026...");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 bg-slate-50 p-4 sm:p-10 rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
      
      {isPremium && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto bg-slate-950 p-6 sm:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:row items-center justify-between gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
               <Rocket className="w-7 h-7 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white text-lg sm:text-xl font-black tracking-tight leading-tight">Acceso Estratégico PRO Activo</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Ya puedes acceder a todas las herramientas de rediseño y preparación.</p>
            </div>
          </div>
          <Button 
            onClick={onAnalysisComplete}
            className="h-14 px-8 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-black gap-3 text-xs uppercase shadow-xl transition-all relative z-10 border-none shrink-0"
          >
            Ir al Centro Táctico Directo <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

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
              score={resObj?.puntaje?.final || resObj?.puntaje?.base || 0} 
              label={
                (resObj?.puntaje?.final || 0) <= 40 ? "CRÍTICA" :
                (resObj?.puntaje?.final || 0) <= 65 ? "BAJA" :
                (resObj?.puntaje?.final || 0) <= 85 ? "MEDIA" : "ALTA"
              } 
            />
          </div>
          
          <div className="md:col-span-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden text-left flex flex-col justify-center">
            <div className="space-y-6 relative">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" /> Análisis Crítico Pierre
              </h4>
              <p className="text-slate-600 font-medium leading-relaxed italic text-lg border-l-4 border-primary/30 pl-6">
                "{conclusionTextResult}"
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 pt-4">
              <span className="px-5 py-1.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Paso 01: Validación</span>
              <div className="h-[2px] bg-slate-200 flex-1" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Target className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Análisis NOC</h3>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Código Identificado</span>
                  <span className="text-3xl font-black text-primary">{(result?.analisisNOC?.codigo || leadData?.analisisNOC?.codigo) || "N/A"}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Título Oficial</span>
                  <span className="text-xl font-bold text-slate-900">{(result?.analisisNOC?.titulo || leadData?.analisisNOC?.titulo) || "Calculando..."}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Análisis de Brechas</h3>
              </div>
              <div className="space-y-3">
                {(result.analisisBrechas?.puntosCriticos || result.analisisBrechas?.puntosCríticos || result.analisisNOC?.requisitosNoCumplidos || []).map((gap: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-rose-500 font-black shrink-0">0{i+1}.</span>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{typeof gap === 'string' ? gap : (gap.descripcion || gap.descripción || gap.titulo || gap.título)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {result.regulacion && (
             <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden mt-8 shadow-sm">
                 <div className={`p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 ${result.regulacion.esRegulada ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${result.regulacion.esRegulada ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                          {result.regulacion.esRegulada ? <Lock className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                       </div>
                       <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${result.regulacion.esRegulada ? 'text-orange-600' : 'text-emerald-600'}`}>
                            Estatus de Profesión en Canadá
                          </p>
                          <h3 className="text-2xl font-black text-slate-900 leading-tight">
                            {result.regulacion.esRegulada ? 'Sujeta a Regulación' : 'No Regulada (Acceso Libre)'}
                          </h3>
                       </div>
                    </div>
                 </div>
                 <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lo que PUEDES hacer ahora:
                       </h4>
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-2 border-emerald-100 pl-4">
                          {result.regulacion.quePuedesHacer || "Trabajar en roles de soporte."}
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500" /> Lo que tienes PROHIBIDO:
                       </h4>
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-2 border-rose-100 pl-4">
                          {result.regulacion.queNoPuedesHacer || "Firmar proyectos oficiales."}
                       </p>
                    </div>
                 </div>
             </section>
          )}

          {result.diagnostico?.length > 0 && (
            <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mt-8">
                <div className="bg-slate-900 p-8">
                  <h4 className="font-black text-white flex items-center gap-3 text-xl tracking-tight">
                    <AlertTriangle className="w-6 h-6 text-primary" /> Auditoría de Formato
                  </h4>
                </div>
                <div className="p-8 space-y-4">
                  {result.diagnostico.slice(0, 5).map((d: any, i: number) => (
                    <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black shrink-0">{i + 1}</div>
                      <div className="space-y-1 flex-1">
                          <p className="font-black text-slate-900 leading-tight">{d.problema}</p>
                          <p className="text-sm text-slate-500">{d.porque}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </section>
          )}
      </div>

      <div className="space-y-8 max-w-6xl mx-auto px-4 mt-12">
          <div className="grid lg:grid-cols-2 gap-8">
              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[400px]">
                   <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-3 font-black text-slate-900 text-lg"><MapPin className="w-5 h-5 text-primary" /> Demanda Provincial</div>
                   </div>
                   <div className="p-6 flex-1">
                      <div className="space-y-3">
                        {result.mercado?.provincias?.slice(0,6).map((p: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                                <span className="text-sm font-bold text-slate-900">{p.nombre || p.provincia}</span>
                                <span className="text-[10px] font-black px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                                  {p.nivel}
                                </span>
                            </div>
                        ))}
                      </div>
                   </div>
              </section>

              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
                  <div className="bg-slate-900 p-6 text-white font-black text-lg flex items-center gap-3 shadow-md">
                    <Banknote className="w-5 h-5 text-primary" /> Proyección Salarial (CAD)
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
              </section>
          </div>

          {result.rolesPuente && result.rolesPuente.length > 0 && (
            <section className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">Paso 03: Roles Puente</div>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-200 shadow-xl">
                    <div className="grid md:grid-cols-3 gap-6">
                      {result.rolesPuente.slice(0, 3).map((role: any, i: number) => (
                        <div key={i} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col gap-6 relative group hover:bg-white hover:shadow-2xl transition-all">
                           <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                              <Briefcase className="w-6 h-6" />
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Bridge Role {i+1}</p>
                              <h4 className="text-lg font-black text-slate-900 leading-tight">{role.titulo}</h4>
                           </div>
                           <div className="space-y-4 flex-1">
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
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
            </section>
          )}
      </div>

      {!isPremium && result.puntaje?.potencialCrecimiento && (
        <section className="max-w-6xl mx-auto px-4 mt-20">
            <div className="bg-slate-900 rounded-[4rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -mr-40 -mt-40" />
                <div className="relative z-10 text-center space-y-4 mb-16">
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">Tu Hoja de Ruta al <span className="text-primary italic">Éxito en Canadá</span></h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {result.puntaje.potencialCrecimiento.slice(0, 3).map((step: any, i: number) => (
                      <div key={i} className="relative space-y-6 flex flex-col items-center text-center group">
                          <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-xl font-black text-primary relative z-10">
                             {i + 1}
                          </div>
                          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/5 space-y-4 flex-1">
                              <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tight">{step.accion}</h4>
                              <p className="text-xs text-slate-400">Este paso es vital para corregir tus bloqueadores.</p>
                          </div>
                      </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {result.diagnosticoEjecutivo && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          {resObj?.diagnosticoEjecutivo && <ExecutiveDiagnostic data={resObj.diagnosticoEjecutivo} />}
        </div>
      )}

      {isPremium && (
        <div id="pro-tools" className="max-w-6xl mx-auto px-4 mt-12 pt-12 border-t-4 border-primary/20">
            <div className="bg-primary/10 p-4 rounded-2xl mb-8 text-center border border-primary/20">
                <p className="text-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-primary" /> MODO PREMIUM ACTIVADO {isDebugPro && "(ADMIN DEBUG)"}
                </p>
            </div>
            
            {showProFeatures && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-8 sm:p-10 text-center mb-12 shadow-inner"
              >
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                       <h3 className="text-2xl font-black text-slate-900 leading-tight">Acceso Pierre PRO Activado</h3>
                       <p className="text-slate-500 font-medium max-w-md">Utiliza el arsenal táctico para transformar este CV.</p>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={onAnalysisComplete}
                      className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30"
                    >
                       Entrar al Centro Táctico
                    </Button>
                 </div>
              </motion.div>
            )}

            <UserManual />
            <div className="h-px bg-slate-200 w-full mb-16 opacity-30 px-4" />
            <EmployabilityEnginePro cvText={cvText} onAction={() => {}} onCreditLimit={() => {}} />

            <div className="mt-20 bg-slate-950 rounded-[3.5rem] p-10 sm:p-16 text-center relative overflow-hidden border border-white/10 shadow-2xl">
                <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
                    <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                        Centro de <span className="text-primary italic">Recursos PRO</span>
                    </h3>
                    <Button 
                        size="lg"
                        className="h-20 px-16 rounded-[2rem] bg-primary text-slate-950 font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase"
                        onClick={onAnalysisComplete}
                    >
                        ABRIR CENTRO ESTRATÉGICO
                    </Button>
                </div>
            </div>
        </div>
      )}

      {!isPremium && (
        <section className="bg-slate-900 text-white rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 relative overflow-hidden border-4 border-amber-400/20 group mx-4 shadow-2xl">
          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Column: Value Proposition */}
            <div className="flex-1 space-y-8 text-left">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-4">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Siguiente Paso Recomendado</span>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight mb-4">
                      Desbloquea el <br/><span className="text-amber-400 italic">Centro Táctico</span>
                  </h3>
                  <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
                    "{conclusionTextResult}"
                  </p>
              </div>

              <div className="space-y-4 bg-white/5 rounded-3xl p-6 border border-white/10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Tu suite de empleabilidad incluye:</h4>
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-bold text-slate-200">Reestructuración de CV al estándar canadiense</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-bold text-slate-200">Generación de Cover Letters adaptativas</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-bold text-slate-200">Optimización y Match garantizado con sistemas ATS</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-bold text-slate-200">Directorio VIP de Bolsas de Empleo Ocultas</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-bold text-slate-200">Simulador táctico para preparación de Entrevistas</span>
                      </li>
                  </ul>
              </div>
            </div>

            {/* Right Column: Checkout & Promo */}
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
                  <div className="mb-6 space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acceso Inmediato</p>
                      <div className="flex items-center justify-center gap-2">
                          <span className="text-5xl font-black text-slate-900 tracking-tighter">$29</span>
                          <span className="text-sm font-bold text-slate-500 mt-3 uppercase">USD</span>
                      </div>
                  </div>

                  <Button 
                      size="lg"
                      className="h-20 w-full rounded-[1.5rem] bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all text-sm font-black shadow-xl shadow-amber-400/20 group flex flex-col items-center justify-center"
                      onClick={() => handleCheckout(2900, "/cv-tool/success", "Centro Táctico PRO")}
                      disabled={isCheckoutLoading}
                  >
                      <div className="flex items-center gap-3">
                        {isCheckoutLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                        <span className="uppercase tracking-widest">ENTRAR AL SISTEMA</span>
                      </div>
                  </Button>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100">
                      <button 
                          onClick={() => setShowCodeInput(!showCodeInput)}
                          className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                      >
                          ¿Tienes un código de beca?
                      </button>

                      <AnimatePresence>
                          {showCodeInput && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex gap-2 mt-4"
                            >
                              <input 
                                  type="text" 
                                  placeholder="CÓDIGO" 
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all uppercase"
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
                                           isChecking: true
                                        })
                                      });
                                      const data = await res.json();
                                      if (res.ok && data.valid) {
                                        onUnlockPremium?.(promoCode);
                                      } else {
                                        setCodeError(data.error || "Código inválido.");
                                      }
                                    } catch (e) {
                                      setCodeError("Error de validación.");
                                    } finally {
                                      setIsVerifyingCode(false);
                                    }
                                  }}
                                  disabled={isVerifyingCode || !promoCode}
                                  className="rounded-xl h-12 px-6 text-[10px] font-black bg-slate-900 text-white hover:bg-slate-800"
                              >
                                  {isVerifyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : "VALIDAR"}
                              </Button>
                            </motion.div>
                          )}
                      </AnimatePresence>
                      {codeError && <p className="text-rose-500 text-[10px] font-black uppercase text-center mt-3">{codeError}</p>}
                  </div>
              </div>
            </div>

          </div>
        </section>
      )}

      <footer className="text-center py-10 opacity-40">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">Pierre Employability Engine v2.8 • Executive Report</p>
      </footer>
    </div>
  );
}
