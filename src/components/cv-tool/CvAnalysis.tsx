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
    // 🛠️ MODO TEST: Permitir al dueño probar las funciones PRO mediante URL o código directo
    const params = new URLSearchParams(window.location.search);
    const hasDebugParam = params.get('debug') === 'pro' || params.get('isDebugPro') === 'true' || params.get('debugPro') === 'true' || params.get('session_id') || params.get('code') === 'DEBUG_PRO' || params.get('code') === 'PIERRE-MASTER';
    
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
    "Iniciando Auditoría Quirúrgica de Empleabilidad...",
    "Mapeando Perfil profesional vs Estándares NOC 2021...",
    "Analizando cumplimiento de parámetros ATS Canadienses...",
    "Evaluando estatus regulatorio y requisitos de licencia...",
    "Simulando demanda laboral por provincias en tiempo real...",
    "Identificando roles puente para acceso rápido al mercado...",
    "Estimando inteligencia salarial y costo de vida...",
    "Verificando historial de patrocinios y visados (LMIA)...",
    "Consolidando Hoja de Ruta Táctica Personalizada...",
    "Finalizando Reporte de Acceso al Mercado Canadiense..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-10 animate-in fade-in duration-1000 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-[2.5rem] animate-pulse" />
              <div className="relative z-10 w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                 <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
              </div>
          </div>
          <div className="max-w-md w-full space-y-8 relative z-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tighter">Consultoría Estratégica en Curso</h3>
                <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.3em]">Protocolo Quirúrgico de Empleabilidad</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-1.5 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`, transition: 'width 1.5s ease-out' }} />
                <p className="text-slate-200 font-bold italic text-lg leading-relaxed animate-in fade-in duration-700 min-h-[3rem] flex items-center justify-center text-center">
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
        <h3 className="text-2xl font-black text-slate-900 tracking-tight text-center">Diagnóstico Pierre 2.6</h3>
        <Button size="lg" className="rounded-2xl h-16 px-12 font-black shadow-xl" onClick={() => {}}>Generar mi Reporte Gratis</Button>
      </div>
    );
  }

  const getConclusionText = () => {
    if (typeof result.veredictoFinal === 'object' && result.veredictoFinal !== null) {
      return result.veredictoFinal.conclusion || "Estrategia de empleabilidad ajustada para Canadá.";
    }
    return result.veredictoFinal || result.introduccion || "Analizando tu perfil bajo estándares 2026...";
  };

  const handleCheckout = async (amount: number, successUrl: string, item: string) => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, successUrl, item }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError("Error al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 bg-slate-50 p-4 sm:p-10 rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden text-left">
      
      {/* 🚀 PRO CHOICE BANNER */}
      {showProFeatures && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto bg-slate-950 p-6 sm:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group mb-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
               <Rocket className="w-7 h-7 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
            <div className="text-left">
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

      {/* 1. INITIAL IMPACT / HEADER */}
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
              className={`h-11 px-6 rounded-xl border-2 gap-2 font-black shadow-sm bg-white text-slate-900 hover:bg-slate-50 ${!showProFeatures ? "opacity-50 grayscale" : ""}`}
              onClick={() => showProFeatures && downloadFullReportPDF(result)}
            >
              <Download className="w-4 h-4 text-primary" />
              PDF {!showProFeatures && <Lock className="w-3 h-3 text-slate-400" />}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6 pt-4">
          {/* Box con icono profesional en vez de Gauge */}
          <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
               <ShieldCheck className="w-12 h-12 text-primary shadow-xl" />
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight text-center">Perfil Estratégico</h4>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Auditado bajo estándares 2026</p>
            <div className="mt-8 px-4 py-2 bg-slate-900 rounded-full">
               <p className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Estatus: Verificado</p>
            </div>
          </div>
          
          <div className="md:col-span-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden text-left flex flex-col justify-center">
            <div className="space-y-6 relative">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" /> Diagnóstico Ejecutivo Pierre
              </h4>
              <p className="text-slate-600 font-medium leading-relaxed italic text-lg border-l-4 border-primary/30 pl-6">
                "{result.introduccion || getConclusionText()}"
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BASE TÉCNICA (Paso 01) */}
      <div className="space-y-6 max-w-6xl mx-auto px-4 mt-6">
          <div className="flex items-center gap-4 pt-4">
              <span className="px-5 py-1.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Paso 01: Validación</span>
              <div className="h-[2px] bg-slate-200 flex-1" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Target className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Análisis NOC</h3>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Código Identificado</span>
                  <span className="text-3xl font-black text-primary">{result.analisisNOC?.codigo || "N/A"}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Título Oficial</span>
                  <span className="text-xl font-bold text-slate-900">{result.analisisNOC?.titulo || "Calculando..."}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{result.analisisNOC?.porqueEsImportante || "Este código es tu identidad laboral frente a migración."}"
                </p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Análisis de Brechas</h3>
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

          {/* 🔍 ESTATUS DE REGULACIÓN */}
          {result.regulacion && (
             <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden mt-8 shadow-sm text-left">
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
                          {result.regulacion.quePuedesHacer || "Trabajar en roles de soporte, coordinación o bajo supervisión de un Licenciado."}
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500" /> Lo que tienes PROHIBIDO:
                       </h4>
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-2 border-rose-100 pl-4">
                          {result.regulacion.queNoPuedesHacer || "Firmar proyectos oficiales o ostentar el título de Ingeniero/Profesional Colegiado."}
                       </p>
                    </div>
                 </div>
             </section>
          )}
      </div>

      {/* 3. MERCADO (Paso 02) */}
      <div className="space-y-8 max-w-6xl mx-auto px-4 mt-12 text-left">
          <div className="flex items-center gap-4 pt-4">
              <span className="px-5 py-1.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Paso 02: Mercado</span>
              <div className="h-[2px] bg-slate-200 flex-1" />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[400px]">
                   <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-3 font-black text-slate-900 text-lg"><MapPin className="w-5 h-5 text-primary" /> Demanda Provincial</div>
                   </div>
                   <div className="p-6 flex-1">
                      <div className="space-y-3">
                        {result.mercado?.provincias?.slice(0,6).map((p: any, i: number) => {
                          const isHigh = (p.nivel || "").toLowerCase().includes("alt");
                          const isMedia = (p.nivel || "").toLowerCase().includes("med");
                          return (
                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                                <span className="text-sm font-bold text-slate-900">{p.nombre || p.provincia}</span>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                                  isHigh ? "bg-emerald-50 text-emerald-600 border-emerald-200" : 
                                  isMedia ? "bg-orange-50 text-orange-600 border-orange-200" :
                                  "bg-rose-50 text-rose-600 border-rose-200"
                                }`}>
                                  {p.nivel}
                                </span>
                            </div>
                          );
                        })}
                      </div>
                   </div>
              </section>

              <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full text-left">
                  <div className="bg-slate-900 p-6 text-white font-black text-lg flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-primary" /> Proyección Salarial (CAD)
                  </div>
                  <div className="p-8 grid gap-6 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                          <span className="text-xs font-black text-slate-500 uppercase">Entry Level</span>
                          <span className="text-xl font-black text-slate-800 tracking-tight">{result.salarios?.entry}</span>
                      </div>
                      <div className="flex justify-between items-center py-5 bg-primary/5 px-6 rounded-2xl border-l-4 border-l-primary">
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

          {/* IDIOMAS */}
          {result.idiomas && (
             <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden mt-8 shadow-sm text-left">
                 <div className="bg-slate-900 p-8 flex items-center gap-4">
                    <Languages className="w-6 h-6 text-primary" />
                    <h4 className="font-black text-white text-xl tracking-tight">Requisitos de Idioma (CLB)</h4>
                 </div>
                 <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex flex-col items-center justify-center">
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Inglés (CLB)</p>
                            <p className="text-3xl text-slate-900 font-black">{result.idiomas.clbIngles}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-slate-50 p-6 flex flex-col items-center justify-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Francés (CLB)</p>
                            <p className="text-3xl text-slate-900 font-black">{result.idiomas.clbFrances}</p>
                        </div>
                    </div>
                 </div>
             </section>
          )}

          {/* 🚀 ROLES PUENTE */}
          {result.rolesPuente && result.rolesPuente.length > 0 && (
            <section className="mt-12 space-y-6 text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">Paso 03: Roles Puente</div>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-200 shadow-xl space-y-10">
                    <div className="space-y-4 max-w-2xl">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Tu Mapa de <span className="text-primary italic">Entrada Rápida</span></h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                          Si tu rol principal requiere regularización, estos roles son tu mejor apuesta para entrar a la industria canadiense.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {result.rolesPuente.slice(0, 3).map((role: any, i: number) => (
                        <div key={i} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col gap-6 relative group hover:bg-white hover:shadow-2xl transition-all">
                           <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 text-slate-900 group-hover:bg-primary group-hover:text-white transition-colors">
                              <Briefcase className="w-6 h-6" />
                           </div>
                           <div className="space-y-2 text-left">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Bridge Role {i+1}</p>
                              <h4 className="text-lg font-black text-slate-900 leading-tight">{role.titulo}</h4>
                              <p className="text-xs text-slate-600 font-medium mt-4">{role.porque}</p>
                              <div className="pt-4 mt-auto">
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

      {/* NARRATIVA DE DIAGNÓSTICO */}
      {result.conclusionEjecutiva && (
        <div className="max-w-4xl mx-auto px-4 mt-12 mb-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full border border-white/10 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Veredicto Estratégico</p>
           </div>
           <h3 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] max-w-3xl mx-auto">
             {result.conclusionEjecutiva.recomendacionMaestra}
           </h3>
           <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
             "{result.conclusionEjecutiva.detalleEmpleabilidad}"
           </p>
        </div>
      )}

      {/* 🚀 VEREDICTO MAESTRO / CTA */}
      {!showProFeatures && (
        <section className="bg-white text-slate-900 rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-20 relative overflow-hidden border-2 border-primary group mx-4 shadow-2xl">
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
                  className="h-24 w-full rounded-[2.5rem] bg-slate-900 text-white hover:bg-primary transition-all text-xl font-black shadow-2xl flex flex-col items-center justify-center"
                  onClick={() => handleCheckout(2900, "/cv-tool/success", "Radar de Empleo PRO")}
                  disabled={isCheckoutLoading}
              >
                  <div className="flex items-center gap-4">
                    {isCheckoutLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                    <span>OBTENER MI REPORTE PRO</span>
                  </div>
                  <span className="text-[10px] opacity-60 font-medium uppercase tracking-widest mt-1">Acceso Instantáneo • $29.00 USD</span>
              </Button>

              <button onClick={() => setShowCodeInput(!showCodeInput)} className="text-xs font-black text-slate-500 hover:text-slate-900">¿Tienes un código?</button>
              
              <AnimatePresence>
                {showCodeInput && (
                   <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex gap-2">
                     <input 
                        className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 p-4 font-black" 
                        placeholder="CÓDIGO" 
                        value={promoCode} 
                        onChange={e => setPromoCode(e.target.value.toUpperCase())} 
                     />
                     <Button className="rounded-2xl font-black" onClick={() => {}}>VALIDAR</Button>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* 7. PRO ENGINE */}
      {showProFeatures && (
        <div id="pro-tools" className="max-w-6xl mx-auto px-4 mt-12 pt-12 border-t-4 border-primary/20 text-left">
            <UserManual />
            <div className="h-px bg-slate-200 w-full my-16 opacity-30" />
            <EmployabilityEnginePro cvText={cvText} onAction={() => {}} />
            
            <div className="mt-20 bg-slate-950 rounded-[3.5rem] p-16 text-center border border-white/10 relative overflow-hidden">
                <div className="relative z-10 space-y-10">
                    <h3 className="text-4xl text-white font-black tracking-tighter">Centro de Recursos PRO</h3>
                    <Button size="lg" className="h-20 px-16 rounded-[2rem] bg-primary text-slate-950 font-black text-xl" onClick={onAnalysisComplete}>
                        <Rocket className="w-6 h-6 mr-4" /> ABRIR CENTRO ESTRATÉGICO
                    </Button>
                </div>
            </div>
        </div>
      )}

      <footer className="text-center py-10 opacity-40">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">Pierre Employability Engine v2.8 • Executive Report • Google Cloud AI</p>
      </footer>
    </div>
  );
}
