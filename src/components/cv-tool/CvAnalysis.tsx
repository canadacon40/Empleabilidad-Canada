"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import GaugeChart from "./GaugeChart";
import { Button } from "@/components/ui/button";
import { sendGTMEvent } from "@next/third-parties/google";
import { downloadFullReportPDF, downloadLMIAExcel } from "@/lib/report-utils";

interface CvAnalysisProps {
  cvText: string;
  onAnalysisComplete: () => void;
  accessCode?: string;
  leadData?: any;
  leadId?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CvAnalysis({
  cvText,
  onAnalysisComplete,
  accessCode,
  leadData,
  leadId,
}: CvAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(leadData || null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentJoke, setCurrentJoke] = useState(0);

  const jokes = [
    "¿Sabes por qué los programadores canadienses siempre tienen frío? ¡Porque se olvidaron de cerrar las ventanas (Windows)!... Pierre lo cerrarían por ti.",
    "Pierre está analizando tu perfil... ¡Espero que tengas más suerte en Canadá que el alce que intentó cruzar la frontera sin pasaporte!",
    "El 90% de los CVs son ignorados por los filtros ATS. El otro 10% son los que Pierre audita personalmente... ya casi terminamos.",
    "Canadá es el país más acogedor del mundo, pero Pierre es el más exigente auditando tu CV. Falta muy poco para tu veredicto.",
    "Pierre está verificando si tu CV tiene 'Maple Syrup' suficiente para endulzar a los reclutadores... ¡Analizando!",
    "Dato curioso: Montreal es la segunda ciudad de habla francesa más grande después de París. Pierre está revisando si tu francés está a la altura.",
  ];

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 96) return prev + 0.1;
          return prev + Math.random() * 4;
        });
      }, 700);

      const jokeInterval = setInterval(() => {
        setCurrentJoke((prev) => (prev + 1) % jokes.length);
      }, 6000);

      return () => {
        clearInterval(interval);
        clearInterval(jokeInterval);
      };
    }
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cv-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, leadId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setResult(data.result);
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isResultValid = result?.veredictoFinal || result?.diagnostico?.length > 0;
    if (!isResultValid && cvText && !isLoading && !error) {
      handleAnalyze();
    }
  }, [cvText]);

  const downloadFullReport = () => {
    if (!result) return;
    downloadFullReportPDF(result);
  };

  const downloadExcel = () => {
    if (!result) return;
    downloadLMIAExcel(result);
  };

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
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceOverride: amount,
          successPath: successUrl,
          productNameOverride: productName,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Ocurrió un error al crear la sesión de pago.");
        setIsCheckoutLoading(false);
      }
    } catch (e) {
      alert("Error de conexión.");
      setIsCheckoutLoading(false);
    }
  };

  const RealityCheck = ({ data, title = "Reality Check" }: any) => {
    if (!data) return null;
    const colors = {
      Crítico: "bg-red-50 border-red-200 text-red-800",
      Desafiante: "bg-amber-50 border-amber-200 text-amber-800",
      Estable: "bg-blue-50 border-blue-200 text-blue-800",
      Ventaja: "bg-emerald-50 border-emerald-200 text-emerald-800",
    } as any;
    const config = colors[data.estatus] || colors["Estable"];

    return (
      <div className={`mt-4 rounded-2xl border p-4 ${config} animate-in fade-in duration-500`}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3 h-3 opacity-60" />
          <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
          <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full border border-current">{data.estatus}</span>
        </div>
        <p className="text-xs font-medium italic">"{data.mensaje || data.evaluacion}"</p>
      </div>
    );
  };

  const PierreSeal = () => (
    <div className="py-12 flex flex-col items-center justify-center space-y-4 border-t mt-12 opacity-60">
      <div className="w-20 h-20 rounded-full bg-slate-900 flex flex-col items-center justify-center border border-white/10 shadow-xl">
        <Shield className="w-6 h-6 text-primary mb-1" />
        <span className="text-[8px] font-black text-primary uppercase">Pierre Verified</span>
      </div>
      <p className="text-[10px] text-muted-foreground uppercase font-black">CanadaConTrabajo Audit System © 2026</p>
    </div>
  );

  if (!result) {
    if (isLoading) {
      return (
        <div className="max-w-xl mx-auto space-y-10 py-12 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <h3 className="text-xl font-black uppercase tracking-widest text-slate-800">Analizando...</h3>
            </div>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between items-end"><span className="text-[10px] font-black uppercase">Progreso</span><span className="text-sm font-black">{Math.floor(progress)}%</span></div>
             <div className="h-4 w-full bg-slate-100 rounded-full p-1 border shadow-inner"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden italic text-sm">
            "{jokes[currentJoke]}"
          </div>
        </div>
      );
    }
    return (
      <div className="text-center py-20 space-y-8">
        <Shield className="w-16 h-16 text-primary mx-auto animate-pulse" />
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Diagnóstico Pierre 2.5</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">Analizaremos tu perfil para el mercado canadiense: certificaciones, salarios y demanda real.</p>
        <Button size="lg" className="rounded-2xl h-16 px-12 font-black shadow-xl" onClick={handleAnalyze}>Generar mi Reporte Gratis</Button>
      </div>
    );
  }

  const isPremium = accessCode === "PREMIUM";

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
          Diagnostic Engine v2.5
        </div>
        <h3 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
          Reporte de Empleabilidad <span className="text-primary italic">Canadá</span>
        </h3>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mt-2">by Pierre</p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            size="lg"
            variant="outline"
            className={`h-14 px-8 rounded-2xl border-2 gap-3 font-black shadow-sm ${!isPremium ? "opacity-50 grayscale hover:bg-slate-50" : ""}`}
            onClick={() => isPremium && downloadFullReport()}
          >
            <Download className="w-5 h-5 text-primary" />
            Descargar Informe PDF {!isPremium && <Lock className="w-3 h-3 ml-1" />}
          </Button>
          {result.empresasLMIA?.lista?.length > 0 && (
            <Button
              size="lg"
              variant="outline"
              className={`h-14 px-8 rounded-2xl border-2 gap-3 font-black shadow-sm ${!isPremium ? "opacity-50 grayscale hover:bg-slate-50" : ""}`}
              onClick={() => isPremium && downloadExcel()}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              Empresas LMIA {!isPremium && <Lock className="w-3 h-3 ml-1" />}
            </Button>
          )}
        </div>
        {!isPremium && <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-4">🔥 Desbloquea tus archivos PRO con la oferta final abajo</p>}
      </div>

      <RealityCheck data={{estatus: "Estable", evaluacion: "Análisis táctico finalizado por Pierre. Tu perfil está mapeado."}} title="Status del Reporte" />

      {/* 1. AUDITORÍA (5 ERRORES) */}
      {result.diagnostico?.length > 0 && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-slate-900 p-8 flex items-center justify-between">
            <h4 className="font-black text-white flex items-center gap-3 text-xl tracking-tight">
              <AlertTriangle className="w-6 h-6 text-primary" /> Auditoría: 5 Errores Críticos
            </h4>
          </div>
          <div className="p-8 space-y-6">
            {result.diagnostico.slice(0, 5).map((d: any, i: number) => (
              <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border hover:bg-white transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">{i + 1}</div>
                <div className="space-y-2 flex-1">
                    <p className="font-black text-slate-900 leading-tight">{d.problema}</p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{d.porque}</p>
                    <div className="pt-4 border-t border-slate-200 mt-4 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-800 font-black italic">Pierre: {d.cambio}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. NOC */}
      {result.analisisNOC && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-primary/20">
            <h4 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight">
                <Target className="w-6 h-6 text-primary" /> Identidad: NOC {result.analisisNOC.codigo}
            </h4>
          </div>
          <div className="p-8 flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-6">
                <h5 className="text-3xl font-black text-slate-900 tracking-tighter">{result.analisisNOC.titulo}</h5>
                <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                   "{result.analisisNOC.descripcionQueEsNOC}"
                </p>
            </div>
            <div className="w-full lg:w-96 p-8 rounded-[2.5rem] bg-primary/5 border-2 border-primary/20">
                <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-6">Brechas Detectadas</p>
                <ul className="space-y-4">
                  {result.analisisNOC.requisitosNoCumplidos?.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-black text-slate-800">
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> {req}
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </section>
      )}

      {/* 3. IDIOMAS */}
      {result.idiomas && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-white font-black flex items-center gap-3"><Languages className="w-6 h-6 text-primary" /> Diagnóstico de Idioma</div>
          <div className="p-8 grid lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2rem] bg-slate-50 border-2">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Nivel Actual: {result.idiomas.nivelActualEstimado}</p>
                <p className="text-xl font-black text-slate-900 leading-tight mb-6">{result.idiomas.evaluacion}</p>
                <div className={`px-5 py-2 rounded-full inline-flex items-center gap-2 text-xs font-black ${result.idiomas.cumpleRequerimientoNOC ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                   {result.idiomas.cumpleRequerimientoNOC ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                   {result.idiomas.cumpleRequerimientoNOC ? "CUMPLE REQUISITO NOC" : "NO CUMPLE REQUISITO NOC"}
                </div>
            </div>
            <div className="p-8 rounded-[2rem] bg-primary/5 border-2 border-primary/20 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4 text-primary font-black uppercase text-[11px]">
                   <Clock className="w-4 h-4" /> Timeline de Mejora
                </div>
                <h6 className="text-2xl font-black mb-2 tracking-tight">{result.idiomas.cronogramaMejora?.horizonteTiempo}</h6>
                <p className="text-sm font-bold italic leading-relaxed text-slate-600">"{result.idiomas.cronogramaMejora?.estrategia}"</p>
            </div>
          </div>
        </section>
      )}

      {/* 4. CERTIFICACIONES */}
      {result.certificaciones && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-white font-black text-xl flex items-center gap-3"><Award className="w-6 h-6 text-primary" /> Tickets de Éxito</div>
          <div className="p-8 space-y-10">
            {["mandatory", "highlyRecommended", "niceToHave"].map((type) => {
              const list = (result.certificaciones as any)[type];
              if (!list || list.length === 0) return null;
              
              const typeLabels: any = {
                mandatory: "Mandatorias (Licencias de ley)",
                highlyRecommended: "Altamente Recomendadas (Impacto PRO)",
                niceToHave: "Nice to Have (Diferenciación)"
              };

              const typeColors: any = {
                mandatory: "bg-red-500",
                highlyRecommended: "bg-primary font-black",
                niceToHave: "bg-blue-500"
              };

              return (
                <div key={type} className="space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${typeColors[type] || "bg-slate-500"}`} />
                    {typeLabels[type]}
                  </h5>
                  <div className="grid gap-6">
                    {list.map((c: any, i: number) => (
                      <div key={i} className="p-6 rounded-[2rem] bg-white border-2 hover:border-primary/50 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h6 className="text-lg font-black text-slate-900">{c.nombre}</h6>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[11px] font-black text-slate-500">
                                <span className="flex items-center gap-1 font-black text-slate-900">🌐 {c.sitioWeb || c.donde}</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-500" /> {c.precio || c.costo}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {c.duracion}</span>
                            </div>
                        </div>
                        {(c.url || c.enlace) && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl font-black border-2 hover:bg-slate-50"
                            onClick={() => window.open(c.url || c.enlace, "_blank")}
                          >
                            Inscribirse <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. REGULACION */}
      {result.regulacion && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-primary/20"><h4 className="font-black text-slate-900 text-xl flex items-center gap-3"><Shield className="w-6 h-6 text-primary" /> Auditoría Legal Canadiense</h4></div>
          <div className="p-8 grid lg:grid-cols-2 gap-10">
            <div className={`p-10 rounded-[3rem] border-4 ${result.regulacion.esRegulada ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                <div className="flex justify-center mb-8">
                    <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase text-white shadow-xl ${result.regulacion.esRegulada ? "bg-amber-600" : "bg-emerald-600"}`}>
                        {result.regulacion.esRegulada ? "⚠️ PROFESIÓN REGULADA" : "✅ NO REGULADA"}
                    </span>
                </div>
                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Lo que PUEDES hacer:</p>
                        <p className="text-sm font-black italic bg-white p-6 rounded-3xl border shadow-inner">"{result.regulacion.quePuedesHacer}"</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-red-300 uppercase mb-2 tracking-widest">Restricciones:</p>
                        <p className="text-sm font-bold opacity-60 italic leading-relaxed">"{result.regulacion.queNoPuedesHacer}"</p>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="p-8 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                    <h6 className="text-[11px] font-black text-primary uppercase mb-6 tracking-widest">Ruta de Regularización</h6>
                    <p className="text-sm font-medium mb-8 leading-relaxed opacity-90">{result.regulacion.comoRegularizarse}</p>
                    <div className="space-y-3">
                        {result.regulacion.entidades?.slice(0, 3).map((ent: any, i: number) => (
                            <a key={i} href={ent.url} target="_blank" className="block p-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-xs font-black transition-all">
                                {ent.nombre} ({ent.provincia})
                            </a>
                        ))}
                    </div>
                </div>
                <RealityCheck data={result.regulacion.resumenImpacto} />
            </div>
          </div>
        </section>
      )}

      {/* 6. ROLES PUENTE */}
      {result.rolesPuente && result.rolesPuente.length > 0 && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-white font-black text-xl flex items-center gap-3"><Shuffle className="w-6 h-6 text-primary" /> Roles de Entrada Táctica</div>
          <div className="p-8 grid lg:grid-cols-3 gap-8">
            {result.rolesPuente.slice(0, 3).map((r: any, i: number) => (
              <div key={i} className="p-8 rounded-[3rem] bg-slate-50 border-2 hover:bg-white hover:shadow-2xl transition-all flex flex-col group">
                <h5 className="font-black text-lg text-slate-900 mb-6 h-14 flex items-center leading-tight group-hover:text-primary">{r.titulo}</h5>
                <div className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 text-[11px] font-black rounded-full mb-8 shadow-inner border border-emerald-200">
                    $ {r.salarioAnual} / Año
                </div>
                <ul className="space-y-4 flex-1 mb-8">
                   {r.funciones?.slice(0, 3).map((f: string, j: number) => (
                     <li key={j} className="text-xs font-bold text-slate-600 flex gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> {f}</li>
                   ))}
                </ul>
                <div className="pt-6 border-t font-black text-[10px] text-slate-400 uppercase">Relacionado con NOC: {r.descripcionNOC}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. GEOGRAFIA */}
      {result.demandaLaboral && (
        <section className="bg-white rounded-[2.5rem] border-2 bg-primary/5 shadow-xl transition-all overflow-hidden">
           <div className="p-8 font-black text-slate-900 border-b flex items-center gap-3 text-xl"><MapPin className="w-6 h-6 text-primary" /> Demanda Real por Provincia</div>
           <div className="p-8 grid grid-cols-2 lg:grid-cols-5 gap-6">
             {result.demandaLaboral.slice(0, 5).map((p: any, i: number) => (
               <div key={i} className="p-6 rounded-[2.5rem] bg-white border-2 text-center group hover:border-primary/50 transition-all shadow-sm">
                  <p className="text-[11px] font-black text-slate-400 uppercase mb-4 group-hover:text-primary">{p.provincia}</p>
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full inline-block ${p.nivel === "Muy Alta" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700 shadow-xl shadow-emerald-100/50 border border-emerald-200"}`}>
                      {p.nivel}
                  </span>
               </div>
             ))}
           </div>
        </section>
      )}

      {/* 8. SALARIOS */}
      {result.salarios && (
        <section className="bg-white rounded-[2.5rem] border-2 shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-8 text-white font-black text-xl flex items-center gap-3"><Banknote className="w-6 h-6 text-primary" /> Proyección Salarial (CAD)</div>
            <div className="p-12 sm:p-20 grid grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                <div className="p-8 rounded-[3rem] bg-slate-50 border-2 text-center shadow-inner">
                    <p className="text-[11px] font-black text-slate-400 uppercase mb-4">Entry Level</p>
                    <p className="text-3xl font-black text-slate-800">{result.salarios.entry}</p>
                </div>
                <div className="p-12 rounded-[4rem] bg-primary/5 border-4 border-primary/30 text-center scale-110 shadow-2xl ring-12 ring-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary animate-pulse" />
                    <p className="text-[13px] font-black text-primary uppercase mb-6 tracking-[0.2em]">Target Median</p>
                    <p className="text-5xl font-black text-primary tracking-tighter drop-shadow-sm">{result.salarios.mid}</p>
                </div>
                <div className="p-8 rounded-[3rem] bg-slate-50 border-2 text-center shadow-inner">
                    <p className="text-[11px] font-black text-slate-400 uppercase mb-4">Top Senior</p>
                    <p className="text-3xl font-black text-slate-800">{result.salarios.senior}</p>
                </div>
            </div>
        </section>
      )}

      {/* 9. VEREDICTO */}
      {result.conclusionEjecutiva && (
        <section className="bg-slate-900 text-white rounded-[5rem] p-12 sm:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 group">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 blur-[200px] rounded-full -mr-1/2 -mt-1/2 opacity-60" />
          <div className="relative z-10 text-center space-y-12">
            <div className="flex justify-center"><div className="px-10 py-3 rounded-full bg-slate-800 text-primary text-xs font-black uppercase tracking-[0.5em] border border-white/10 shadow-3xl">Veredicto Maestro Pierre</div></div>
            <h4 className="text-3xl sm:text-6xl font-black leading-tight max-w-5xl mx-auto tracking-tighter">
                {result.conclusionEjecutiva.recomendacionMaestra}
            </h4>
            <div className="grid lg:grid-cols-2 gap-10 text-left max-w-6xl mx-auto pt-10">
              <div className="p-12 rounded-[3.5rem] bg-white/5 border-l-8 border-l-primary/50 backdrop-blur-xl space-y-8">
                 <h5 className="text-xs font-black uppercase text-primary tracking-widest">Diagnóstico de Competencia</h5>
                 <p className="text-xl font-bold leading-relaxed">{result.conclusionEjecutiva.detalleEmpleabilidad}</p>
                 <div className="flex items-center gap-6 bg-black/40 p-8 rounded-[2rem] border border-white/5">
                    {result.conclusionEjecutiva.esEmpleableAhora ? <CheckCircle className="text-emerald-400 w-10 h-10" /> : <XCircle className="text-red-400 w-10 h-10" />}
                    <div>
                        <span className="text-xs font-black text-slate-500 uppercase block mb-1">Status Final</span>
                        <span className={`text-2xl font-black ${result.conclusionEjecutiva.esEmpleableAhora ? "text-emerald-400" : "text-red-400"}`}>
                            {result.conclusionEjecutiva.esEmpleableAhora ? "READY TO COMPETE" : "CRITICAL FIX REQUIRED"}
                        </span>
                    </div>
                 </div>
              </div>
              <div className="p-12 rounded-[3.5rem] bg-white/5 border-l-8 border-l-blue-500/50 backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10"><Languages className="w-24 h-24" /></div>
                 <h5 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-8">Demanda Offshore</h5>
                 <p className="text-xl font-black italic relative z-10">"{result.conclusionEjecutiva.demandaDesdeFuera}"</p>
              </div>
            </div>
            <div className="pt-16 border-t border-white/10 max-w-4xl mx-auto">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">El Impacto de la Estrategia Pierre</p>
                <div className="bg-primary/10 p-10 rounded-[3rem] border-2 border-primary/20 shadow-3xl">
                    <p className="text-2xl sm:text-3xl italic font-black text-slate-100">"{result.conclusionEjecutiva.impactoCorrecciones}"</p>
                </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. BONUS CV */}
      {result.bonus && (
        <section className="bg-white rounded-[4rem] border-2 shadow-2xl overflow-hidden">
          <div className="bg-emerald-600 p-10 flex items-center justify-between text-white font-black text-xl">
            <span className="tracking-tight">Bonus: La Estructura Ganadora (Standards 2026)</span>
            <Layout className="w-8 h-8 opacity-50" />
          </div>
          <div className="p-10 sm:p-16 flex flex-col xl:flex-row gap-16">
            <div className="xl:w-96 shrink-0 bg-slate-50 p-10 rounded-[4rem] border-4 shadow-inner relative group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Briefcase className="w-32 h-32" /></div>
                <p className="text-[12px] font-black text-slate-400 uppercase mb-10 border-b-2 pb-6 tracking-widest block">Arquitectura Táctica</p>
                <ol className="space-y-8 relative z-10">
                    {result.bonus.estructuraCVRecomendada?.orden.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-6 text-sm font-black text-slate-800 group-hover:translate-x-3 transition-transform">
                            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xl shadow-emerald-200 ring-4 ring-white">{i + 1}</span>
                            {item}
                        </li>
                    ))}
                </ol>
            </div>
            <div className="flex-1 space-y-16">
                <div>
                    <h5 className="text-xs font-black uppercase text-slate-300 tracking-[0.3em] mb-12">Principios de Reclutamiento Canadiense</h5>
                    <div className="grid sm:grid-cols-2 gap-8">
                        {result.bonus.estructuraCVRecomendada?.tipsVisuales.map((tip: string, i: number) => (
                            <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border-2 hover:bg-white hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 flex gap-6 group shadow-sm">
                                <CheckCircle className="text-emerald-500 w-6 h-6 shrink-0 group-hover:scale-125 transition-transform" />
                                <p className="text-sm font-black text-slate-600 leading-relaxed pt-1">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-12 rounded-[3.5rem] border-4 border-dashed border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row items-center gap-10 shadow-inner">
                    <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-2xl animate-pulse ring-12 ring-emerald-100"><Shield className="w-12 h-12 text-white" /></div>
                    <div>
                        <p className="text-2xl font-black text-emerald-900 mb-2">Veredicto Final</p>
                        <p className="text-lg font-bold italic text-emerald-800 opacity-80 border-l-4 border-emerald-300 pl-8 p-1">"Nada de fotos, nada de edad, nada de estado civil. En Canadá, solo tus Logros Cuantificables abren puertas."</p>
                    </div>
                </div>
            </div>
          </div>
        </section>
      )}

      {/* 💰 EL GRAN CIERRE ($29) */}
      <div className="text-center pt-24 pb-20 px-4">
        {!isPremium ? (
          <div className="bg-slate-900 text-white rounded-[5rem] p-12 sm:p-28 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] border border-white/10 ring-12 ring-slate-900/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 max-w-5xl mx-auto space-y-16">
              <div className="inline-flex gap-4 px-10 py-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.5em] backdrop-blur-md animate-pulse">
                <Sparkles className="w-5 h-5" /> Oferta Versión PRO
              </div>
              <h4 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[1] drop-shadow-2xl">
                Sesión Estratégica 1:1 + <span className="text-primary italic">Plan de Empleabilidad</span>
              </h4>
              
              {result.veredictoFinal?.ofertaEstrategica && (
                <div className="bg-primary/10 -skew-x-12 p-6 rounded-[2.5rem] inline-block shadow-2xl">
                    <p className="text-slate-300 text-xl font-bold italic drop-shadow-sm tracking-tight text-balance">
                      "{result.veredictoFinal.ofertaEstrategica}"
                    </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-12 text-left bg-white/5 p-12 sm:p-20 rounded-[4rem] border border-white/10 shadow-inner scale-105 backdrop-blur-xl">
                 <div className="flex gap-6 group/item">
                    <div className="bg-primary p-6 rounded-3xl text-white shadow-3xl transition-transform group-hover/item:scale-125 group-hover/item:-rotate-12"><Calendar className="w-10 h-10" /></div>
                    <div className="space-y-2">
                        <p className="text-2xl font-black tracking-tight">Sesión 1-a-1 Especializada</p>
                        <p className="text-sm text-slate-400 font-medium">Validación de perfil 1-a-1 para corregir errores que Pierre no puede ver.</p>
                    </div>
                 </div>
                 <div className="flex gap-6 group/item">
                    <div className="bg-primary p-6 rounded-3xl text-white shadow-3xl transition-transform group-hover/item:scale-125 group-hover/item:-rotate-12"><Target className="w-10 h-10" /></div>
                    <div className="space-y-2">
                        <p className="text-2xl font-black tracking-tight">Plan de Empleabilidad</p>
                        <p className="text-sm text-slate-400 font-medium">Hoja de ruta personalizada para los próximos 90 días en Canadá.</p>
                    </div>
                 </div>
                 <div className="flex gap-6 group/item">
                    <div className="bg-primary p-6 rounded-3xl text-white shadow-3xl transition-transform group-hover/item:scale-125 group-hover/item:-rotate-12"><Shield className="w-10 h-10" /></div>
                    <div className="space-y-2">
                        <p className="text-2xl font-black tracking-tight">Estrategia IMP (Sin LMIA)</p>
                        <p className="text-sm text-slate-400 font-medium">Búsqueda selectiva de exenciones de LMIA según tu perfil y nacionalidad.</p>
                    </div>
                 </div>
                 <div className="flex gap-6 group/item">
                    <div className="bg-primary p-6 rounded-3xl text-white shadow-3xl transition-transform group-hover/item:scale-125 group-hover/item:-rotate-12"><Download className="w-10 h-10" /></div>
                    <div className="space-y-2">
                        <p className="text-2xl font-black tracking-tight">Reporte Maestro PDF + Excel</p>
                        <p className="text-sm text-slate-400 font-medium">Todo tu diagnóstico Pierre descargado y listo para ejecutar.</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-16 pt-8">
                <div className="flex items-end gap-12 relative">
                    <div className="flex flex-col opacity-30 select-none pb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest mb-4">Precio Original</span>
                        <span className="text-5xl font-black line-through">$51.00</span>
                    </div>
                    <div className="flex flex-col scale-150 origin-bottom relative">
                        <div className="absolute -top-12 -right-24 bg-emerald-500 text-white text-[10px] font-black px-6 py-2 rounded-full rotate-12 shadow-3xl animate-bounce border-b-4 border-emerald-700">SOLO HOY: -43%</div>
                        <span className="text-[12px] font-black text-primary uppercase tracking-[0.5em] mb-4 text-center">Acelerador Pierre</span>
                        <span className="text-9xl font-black text-white drop-shadow-[0_20px_50px_rgba(var(--primary),0.5)] leading-none">$29</span>
                    </div>
                </div>

                <div className="w-full max-w-xl">
                    <Button
                        size="lg"
                        className="w-full h-28 text-3xl font-black bg-primary hover:bg-primary/90 text-white shadow-[0_40px_80px_-20px_rgba(var(--primary),0.6)] hover:scale-105 active:scale-95 transition-all rounded-[3rem] group border-b-[12px] border-primary-foreground/20 active:border-b-0"
                        onClick={() => handleCheckout(2900, "/checkout/success-session", "Sesión 1:1 + Plan de Empleabilidad (Oferta Pierre)")}
                        disabled={isCheckoutLoading}
                    >
                        {isCheckoutLoading ? (
                            <Loader2 className="w-12 h-12 animate-spin mr-6" />
                        ) : (
                            <Rocket className="w-12 h-12 mr-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
                        )}
                        Comprar Sesión + Plan por $29
                    </Button>
                    <div className="flex justify-center gap-12 pt-12 opacity-40">
                        <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest"><Shield className="w-5 h-5" /> Seguro</div>
                        <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest"><CheckCircle className="w-5 h-5" /> Instantáneo</div>
                        <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest"><Lock className="w-5 h-5" /> Cifrado</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary/5 border-8 border-primary/20 rounded-[6rem] p-20 sm:p-40 text-center space-y-16 shadow-2xl group transition-all duration-1000 hover:bg-primary/10">
            <div className="relative">
                <div className="w-40 h-40 bg-primary/20 rounded-[4rem] shadow-3xl flex items-center justify-center mx-auto mb-16 ring-[24px] ring-primary/5 animate-pulse group-hover:rotate-12 transition-transform duration-700">
                    <Rocket className="w-20 h-20 text-primary drop-shadow-2xl" />
                </div>
                <h4 className="text-6xl sm:text-9xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                    ¡A por ello! 🚀
                </h4>
                <p className="text-slate-600 text-2xl font-black opacity-80 uppercase tracking-tight max-w-3xl mx-auto">
                    Pierre ha desbloqueado tu arsenal táctico completo. Es momento de ejecutar la estrategia.
                </p>
                <div className="pt-20">
                    <Button
                        size="lg"
                        className="h-28 px-24 text-3xl font-black bg-slate-900 text-white shadow-3xl hover:scale-105 active:scale-95 transition-all rounded-[3rem] border-b-[12px] border-slate-700 active:border-b-0"
                        onClick={onAnalysisComplete}
                    >
                        Entrar al Centro Táctico <ChevronRight className="w-10 h-10 ml-4" />
                    </Button>
                </div>
            </div>
          </div>
        )}
      </div>

      <PierreSeal />
    </div>
  );
}
