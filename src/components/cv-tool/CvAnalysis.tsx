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
// import null from "./null";
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
        <Button size="lg" className="rounded-2xl h-16 px-12 font-black shadow-xl" onClick={handleAnalyze}>Generar mi Reporte Gratis</Button>
      </div>
    );
  }

  const getConclusionText = () => {
    if (typeof result.veredictoFinal === 'object' && result.veredictoFinal !== null) {
      return result.veredictoFinal.conclusion || "Estrategia de empleabilidad ajustada para Canadá.";
    }
    return result.veredictoFinal || result.introduccion || "Analizando tu perfil bajo estándares 2026...";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 bg-slate-50 p-4 sm:p-10 rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden">
      
      {/* 🚀 PRO CHOICE BANNER */}
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
            <null 
              score={result.puntaje?.final || 0} 
              label={
                (result.puntaje?.final || 0) <= 40 ? "CRÍTICA" :
                (result.puntaje?.final || 0) <= 65 ? "BAJA" :
                (result.puntaje?.final || 0) <= 85 ? "MEDIA" : "ALTA"
              } 
            />
            <div className="grid grid-cols-2 gap-2 mt-6 w-full px-4 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[8px] font-black text-slate-500 uppercase">0-40 Crítica</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[8px] font-black text-slate-500 uppercase">41-65 Baja</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[8px] font-black text-slate-500 uppercase">66-85 Media</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[8px] font-black text-slate-500 uppercase">86-100 Alta</span></div>
            </div>
          </div>
          
          <div className="md:col-span-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden text-left flex flex-col justify-center">
            <div className="space-y-6 relative">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" /> Análisis Crítico Pierre
              </h4>
              <p className="text-slate-600 font-medium leading-relaxed italic text-lg border-l-4 border-primary/30 pl-6">
                "{result.introduccion || getConclusionText()}"
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BASE TÉCNICA (Paso 01) */}
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
                <h3 className="text-2xl font-black text-slate-900 text-center">Análisis NOC</h3>
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
                <p className="text-sm text-slate-600 leading-relaxed italic text-center">
                  "{result.analisisNOC?.porqueEsImportante || result.analisisNOC?.queEsElNOC || "Este código es tu identidad laboral frente a migración."}"
                </p>
                {result.analisisNOC?.linkOficialNOC && (
                  <a 
                    href={result.analisisNOC.linkOficialNOC} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 mt-2"
                  >
                    Ver descripción oficial en Job Bank <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 text-center">Análisis de Brechas</h3>
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

          {/* 🔍 ESTATUS DE REGULACIÓN (NEW) */}
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
                    <AlertTriangle className="w-6 h-6 text-primary" /> Auditoría de Formato
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
                  <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"><Info className="w-3 h-3" /> Basado en medianas de Statistics Canada</p>
                  </div>
              </section>
          </div>
      

          
          {/* REQUISITOS DE IDIOMA Y RECURSOS (INJECTED) */}
          {result.idiomas && (
             <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden mt-8 shadow-sm">
                 <div className="bg-slate-900 p-8 flex items-center gap-4">
                    <Languages className="w-6 h-6 text-primary" />
                    <h4 className="font-black text-white text-xl tracking-tight">Requisitos de Idioma (CLB)</h4>
                 </div>
                 <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 flex flex-col items-center justify-center">
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Inglés (CLB)</p>
                            <p className="text-3xl text-slate-900 font-black">{result.idiomas.clbIngles}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-slate-50 p-6 flex flex-col items-center justify-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Francés (CLB)</p>
                            <p className="text-3xl text-slate-900 font-black">{result.idiomas.clbFrances}</p>
                        </div>
                    </div>
                    
                    {result.idiomas.recursos?.length > 0 && (
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recursos Gratuitos Recomendados:</p>
                            <div className="grid gap-3">
                                {result.idiomas.recursos.map((r, i) => (
                                    <div key={i} className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{r.nombre}</p>
                                            <p className="text-xs text-slate-600 font-medium mt-1">{r.descripcion}</p>
                                        </div>
                                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 hover:border-slate-300">
                                                Visitar <ExternalLink className="w-3 h-3" />
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
             </section>
          )}

          {/* EMPRESAS LMIA (INJECTED) */}
          {result.empresasLMIA?.length > 0 && (
             <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 overflow-hidden mt-8 shadow-sm">
                 <div className="bg-slate-900 p-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Building2 className="w-6 h-6 text-primary" />
                        <h4 className="font-black text-white text-xl tracking-tight">Empresas con historial internacional</h4>
                    </div>
                     <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-2 cursor-pointer" onClick={() => {}}>
                        <FileSpreadsheet className="w-4 h-4" /> Excel
                    </div>
                 </div>
                 <div className="p-8">
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="text-left p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">#</th>
                                        <th className="text-left p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Empresa</th>
                                        <th className="text-left p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Provincia</th>
                                        <th className="text-left p-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Industria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.empresasLMIA.map((e, i) => (
                                        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                                            <td className="p-4 text-xs font-bold text-slate-400">{i + 1}</td>
                                            <td className="p-4 font-bold text-slate-900 text-xs">{e.nombre}</td>
                                            <td className="p-4 text-xs font-medium text-slate-600">{e.provincia}</td>
                                            <td className="p-4 text-xs font-medium text-slate-600">{e.industria}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
             </section>
          )}

          {/* 🚀 PLAN DE ROLES PUENTE (NEW) */}
          {result.rolesPuente && result.rolesPuente.length > 0 && (
            <section className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">Paso 03: Roles Puente</div>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-200 shadow-xl space-y-10">
                    <div className="space-y-4 max-w-2xl">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Tu Mapa de <span className="text-primary italic">Entrada Rápida</span></h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                          Si tu rol principal requiere regularización o el mercado está saturado, estos 3 roles son tu mejor apuesta para entrar a la industria canadiense aprovechando tu experiencia actual.
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
                                <span className="text-slate-900 font-black uppercase text-[9px] block mb-1">¿Por qué este rol?</span>
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

      {/* 🚀 HOJA DE RUTA AL ÉXITO (NEW) */}
      {!isPremium && result.puntaje?.potencialCrecimiento && (
        <section className="max-w-6xl mx-auto px-4 mt-20">
            <div className="bg-slate-900 rounded-[4rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -mr-40 -mt-40" />
                
                <div className="relative z-10 text-center space-y-4 mb-16">
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">Tu Hoja de Ruta al <span className="text-primary italic">Éxito en Canadá</span></h3>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                        Identificamos los 3 pasos críticos que debes ejecutar para pasar de "Invisible" a "Contratable".
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
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">El "CÓMO" táctico:</p>
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
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Optimización 2026</p>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* NARRATIVA DE DIAGNÓSTICO (Veredicto) */}
      {result.conclusionEjecutiva && (
        <div className="max-w-4xl mx-auto px-4 mt-12 mb-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full border border-white/10 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Veredicto Estratégico General</p>
           </div>
           <h3 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] max-w-3xl mx-auto">
             {result.conclusionEjecutiva.recomendacionMaestra}
           </h3>
           <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
             "{result.conclusionEjecutiva.detalleEmpleabilidad}"
           </p>
        </div>
      )}

      {/* 6. PRO ENGINE (Solo si es Premium o Debug) */}
      {(isPremium) && (
        <div id="pro-tools" className="max-w-6xl mx-auto px-4 mt-12 pt-12 border-t-4 border-primary/20">
            <div className="bg-primary/10 p-4 rounded-2xl mb-8 text-center border border-primary/20">
                <p className="text-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-primary" /> MODO PREMIUM ACTIVADO {showProFeatures && "(ADMIN DEBUG)"}
                </p>
            </div>

            {/* ERROR PREVENCIÓN: Mapa de Éxito / Instrucciones PRO (FIJA) */}
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
                         <p className="text-slate-500 font-medium max-w-md">Ya tienes tu score. Ahora utiliza el arsenal táctico para transformar este CV en una oferta real.</p>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={onAnalysisComplete}
                        className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-3 shrink-0"
                      >
                         <Rocket className="w-5 h-5 animate-pulse" />
                         Entrar al Centro Táctico
                      </Button>
                   </div>
                </motion.div>
              )}

              <div className="bg-slate-950 rounded-[3.5rem] p-10 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/30 shadow-lg shadow-primary/5">
                      <ShieldCheck className="w-4 h-4" /> Protocolo de Ejecución PRO
                    </div>
                    <div>
                      <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none mb-4">
                        Optimización <span className="text-primary italic">Maestra</span>
                      </h2>
                      <p className="text-slate-200 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl italic">
                        "Para que tu perfil sea imparable, debes seguir el orden táctico. La adaptación ciega es el error #1 de los candidatos."
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
                          <p className="text-xs font-bold text-primary tracking-tight">Valor Estratégico Garantizado</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">
                        Sigue las instrucciones del manual a continuación para asegurar que tu CV no solo pase el filtro ATS, sino que enamore al reclutador humano.
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

            {/* CTA: Abrir Centro Táctico Completo - HIGH POLISH REDESIGN */}
            <div className="mt-20 bg-slate-950 rounded-[3.5rem] p-10 sm:p-16 text-center relative overflow-hidden border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.15),transparent_50%)]" />
                <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-primary border border-white/10 shadow-xl">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Arsenal Estratégico Completo
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                          Centro de <span className="text-primary italic">Recursos PRO</span>
                      </h3>
                      <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                          Accede a la suite completa de herramientas diseñadas para dominar el Mercado Oculto canadiense.
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
                          ABRIR CENTRO ESTRATÉGICO
                      </Button>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-8 opacity-60">Tu éxito profesional comienza aquí.</p>
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
                  <span className="text-[8px] sm:text-[10px] opacity-60 font-medium uppercase tracking-widest">Acceso Instantáneo • $29.00 USD</span>
              </Button>

              <button 
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
              >
                  ¿Tienes un código de beca o convenio?
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
                          placeholder="CÓDIGO AQUÍ" 
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
                                setCodeError(data.error || "Código inválido o expirado.");
                              }
                            } catch (e) {
                              setCodeError("Código inválido o expirado.");
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
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Optimización ATS</p>
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
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">Pierre Employability Engine v2.8 • Executive Report • Google Cloud AI</p>
      </footer>
    </div>
  );
}
