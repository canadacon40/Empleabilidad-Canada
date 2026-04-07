"use client";

import { 
  Sparkles, 
  Target, 
  ShieldAlert, 
  Zap, 
  ListChecks, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  Circle,
  Trophy,
  Copy,
  Check,
  ChevronRight,
  Printer
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StrategicRoadmapProps {
  data: {
    context: string;
    diagnostic: string;
    strategy: string;
    steps: string[];
    examples: string;
    templates: string;
    prompts: string;
    commonErrors: string;
    quickWins: string;
    expectedResult: string;
  };
  currentModuleId: string;
  userEmail: string;
}

export default function StrategicRoadmap({ data, currentModuleId, userEmail }: StrategicRoadmapProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderSafe = (val: any) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) return JSON.stringify(val, null, 2);
    return String(val);
  };

  const modules = Array.from({ length: 12 }, (_, i) => `m${i}`);
  const moduleTitles: Record<string, string> = {
    m0: "Diagnóstico Real y Mapa de Brechas",
    m1: "Bases Estratégicas y Fundamentos",
    m2: "Análisis de Mercado Canadiense",
    m3: "Ejecución Táctica Operativa",
    m4: "Networking de Élite y LinkedIn Mastery",
    m5: "Optimización de Perfil y CV Pro",
    m6: "Dominio de Entrevistas y Negociación",
    // ... add more as needed
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-100">
      {/* Sidebar Navigation: The Tracker (0-11) */}
      <aside className="w-80 border-r border-slate-200 bg-white sticky top-0 h-screen overflow-y-auto p-8 hidden xl:flex flex-col">
          <div className="mb-10">
             <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Roadmap 2026</h2>
             </div>
             <p className="text-xl font-black text-slate-900 leading-none">Mi Guía Estratégica</p>
          </div>

          <div className="space-y-2 flex-1">
             {modules.map((mId, index) => {
                const isActive = mId === currentModuleId;
                const isCompleted = index < parseInt(currentModuleId.replace('m', ''));
                return (
                    <div 
                      key={mId}
                      className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                        isActive ? "bg-blue-50 border-blue-100 border text-blue-900" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isActive ? "bg-blue-600 text-white" : 
                        isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        {index}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                           BLOQUE {index}
                        </p>
                        <p className={`text-[11px] font-bold leading-tight ${isActive ? "text-blue-900" : "text-slate-500"}`}>
                           {moduleTitles[mId] || "Bloque de Estrategia"}
                        </p>
                      </div>
                    </div>
                );
             })}
          </div>

          <div className="mt-10 p-6 rounded-3xl bg-slate-100 border border-slate-200">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Estado Actual</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                <p className="text-xs font-bold text-slate-900">Bloque {currentModuleId.replace('m', '')} en proceso</p>
             </div>
          </div>
      </aside>

      {/* Main Content: The Document Flow */}
      <main className="flex-1 overflow-y-auto bg-white xl:bg-slate-50 p-6 sm:p-20 print:p-0 print:bg-white">
          <style jsx global>{`
            @media print {
              aside { display: none !important; }
              main { padding: 0 !important; background: white !important; }
              .rounded-[3rem] { border-radius: 0 !important; border: none !important; box-shadow: none !important; }
              header { padding-top: 0 !important; border-bottom: 2px solid #f1f5f9 !important; }
              .print-break-inside { break-inside: avoid; }
              .print-break-before { break-before: page; }
              button { display: none !important; }
              footer { break-before: page; }
            }
          `}</style>
          <div id="roadmap-document" className="max-w-4xl mx-auto bg-white xl:shadow-2xl xl:shadow-slate-200 border border-slate-200 rounded-[3rem] overflow-hidden min-h-screen print:border-none print:shadow-none">
             
             {/* Document Header */}
             <header className="p-12 sm:p-28 border-b-2 border-slate-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white relative">
                <div className="absolute top-10 right-10 flex gap-4 print:hidden">
                  <button 
                    onClick={() => window.print()} 
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Printer className="w-5 h-5" />
                    Descargar Guía (PDF)
                  </button>
                </div>

                <div className="space-y-12">
                   <div className="flex flex-col gap-6">
                      <div className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.4em] self-start inline-flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-white" /> DIGITAL PIERRE ENGINE v4.0 (HIGH-DEPTH)
                      </div>
                      <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                        BLOQUE {currentModuleId.replace('m', '')}: <br/>
                        <span className="text-blue-600 italic uppercase">{moduleTitles[currentModuleId]}</span>
                      </h1>
                   </div>

                   <div className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Estrategia preparada para</p>
                        <p className="text-lg font-black text-slate-900">{userEmail}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                         Documento de Alta Privacidad
                      </div>
                   </div>
                </div>
             </header>

             {/* Document Body */}
             <div className="p-12 sm:p-28 space-y-32">
                
                {/* 1. EL CONTEXTO (Reality Check) */}
                <section className="space-y-10 print-break-inside">
                   <div className="flex items-center gap-5">
                      <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">01. El Contexto Estratégico</h3>
                   </div>
                   <p className="text-2xl text-slate-600 leading-relaxed font-medium italic border-l-8 border-blue-100 pl-12">
                      "{renderSafe(data.context)}"
                   </p>
                </section>

                {/* 2. EL DIAGNÓSTICO PIERRE (The Truth) */}
                <section className="space-y-12 print-break-inside">
                   <div className="flex items-center gap-5">
                      <div className="w-2 h-10 bg-rose-500 rounded-full"></div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">02. El Diagnóstico Realista</h3>
                   </div>
                   <div className="p-12 sm:p-16 rounded-[4rem] bg-rose-50 border-2 border-rose-100 space-y-8 relative overflow-hidden">
                      <ShieldAlert className="absolute -bottom-10 -right-10 w-64 h-64 text-rose-500/5 -rotate-12" />
                      <div className="text-xl text-slate-800 leading-relaxed font-bold relative z-10 whitespace-pre-wrap">
                        {renderSafe(data.diagnostic)}
                      </div>
                   </div>
                </section>

                {/* 3. HOJA DE RUTA OPERATIVA (The Steps) - THE CORE FLOW */}
                <section className="space-y-12 print-break-before">
                   <div className="flex items-center gap-5">
                      <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">03. Hoja de Ruta de Ejecución Exacta</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-10">
                      {Array.isArray(data.steps) ? data.steps.map((step, i) => (
                        <div key={i} className="flex gap-10 p-10 rounded-[3rem] bg-white border-2 border-slate-100 print:border-slate-200">
                           <div className="w-16 h-16 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-lg shadow-blue-600/20">
                             {i + 1}
                           </div>
                           <div className="space-y-4">
                              <p className="text-xl text-slate-900 font-black leading-tight border-b-2 border-slate-50 pb-4">{moduleTitles[currentModuleId]} - Paso {i+1}</p>
                              <p className="text-lg text-slate-600 font-bold leading-relaxed">{renderSafe(step)}</p>
                              <div className="flex items-center gap-3 text-emerald-600 text-xs font-black uppercase tracking-[0.2em]">
                                 <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" /> Tarea obligatoria para avanzar
                              </div>
                           </div>
                        </div>
                      )) : null}
                   </div>
                </section>

                {/* 4. LA ESTRATEGIA MAESTRA (Pierre Perspective) */}
                <section className="space-y-10 print-break-inside">
                   <div className="flex items-center gap-5">
                      <div className="w-2 h-10 bg-slate-900 rounded-full"></div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">04. La Estrategia Digital Pierre</h3>
                   </div>
                   <div className="p-12 rounded-[4rem] bg-slate-900 text-white space-y-10 relative overflow-hidden shadow-2xl">
                      <Sparkles className="absolute -top-10 -right-10 w-64 h-64 text-blue-500/10" />
                      <div className="text-2xl leading-loose italic font-medium relative z-10 whitespace-pre-wrap opacity-90">
                        {renderSafe(data.strategy)}
                      </div>
                   </div>
                </section>

                <div className="grid grid-cols-1 gap-20 pt-12 print-break-before">
                   {/* 5. PLANTILLAS Y RECURSOS */}
                   <section className="space-y-10">
                      <div className="flex items-center gap-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h4 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">05. Plantillas y Mensajes de Élite</h4>
                      </div>
                      <div className="group relative">
                         <pre className="p-12 rounded-[3rem] bg-slate-900 text-blue-400 font-mono text-sm leading-loose whitespace-pre-wrap overflow-x-auto italic border-4 border-slate-800">
                           {renderSafe(data.templates)}
                         </pre>
                         <button 
                           onClick={() => handleCopy(renderSafe(data.templates), 'temp')}
                           className="absolute top-8 right-8 p-4 rounded-2xl bg-white/10 text-white hover:bg-blue-600 transition-all shadow-xl backdrop-blur-md"
                         >
                           {copied === 'temp' ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                         </button>
                      </div>
                   </section>

                   {/* 6. PROMPTS DE IA */}
                   <section className="space-y-10 print-break-inside">
                      <div className="flex items-center gap-4">
                        <Terminal className="w-6 h-6 text-blue-600" />
                        <h4 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">06. Librería de Prompts de IA Personalizados</h4>
                      </div>
                      <div className="group relative">
                        <pre className="p-12 rounded-[3rem] bg-slate-50 border-4 border-slate-100 text-slate-700 font-mono text-sm leading-loose whitespace-pre-wrap overflow-x-auto italic">
                          {renderSafe(data.prompts)}
                        </pre>
                        <button 
                          onClick={() => handleCopy(renderSafe(data.prompts), 'prom')}
                          className="absolute top-8 right-8 p-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-xl"
                        >
                          {copied === 'prom' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                   </section>
                </div>

                {/* 7. QUICK WINS (The 48h focus) */}
                <section className="pt-20 border-t-4 border-slate-50 print-break-inside">
                    <div className="flex items-center gap-10 p-12 sm:p-20 rounded-[4rem] bg-emerald-50 border-2 border-emerald-100 relative overflow-hidden">
                       <Zap className="absolute top-10 right-10 w-48 h-48 text-emerald-500/5" />
                       <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-500/40">
                          <Zap className="w-12 h-12 fill-white" />
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-3xl font-black uppercase tracking-tight text-emerald-900">Enfoque 48 Horas: Resultados Inmediatos</h4>
                          <p className="text-2xl text-emerald-700 font-bold leading-relaxed italic">
                             {renderSafe(data.quickWins)}
                          </p>
                       </div>
                    </div>
                </section>

                {/* 8. EL RESULTADO ESPERADO */}
                <section className="text-center py-32 space-y-12 print-break-inside">
                   <div className="w-28 h-28 rounded-[3rem] bg-slate-900 text-white flex items-center justify-center mx-auto shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                      <Trophy className="w-14 h-14" />
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-xl font-black uppercase tracking-[0.4em] text-slate-400">Meta Final del Bloque</h4>
                      <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto italic leading-tight">
                        "{renderSafe(data.expectedResult)}"
                      </p>
                   </div>
                </section>
             </div>

             {/* Footer Checklist */}
             <footer className="p-12 sm:p-28 bg-slate-950 text-white rounded-b-[3rem] space-y-16 relative overflow-hidden print-break-before">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-12 text-center sm:text-left">
                   <div className="space-y-4">
                      <p className="text-blue-500 text-sm font-black uppercase tracking-[0.5em]">Estrategia Pierre High-Depth v4.0</p>
                      <p className="text-3xl font-bold">Protocolo de ejecución completado.</p>
                      <p className="text-slate-500 italic max-w-md">Una vez hayas completado las tareas de este bloque, Pierre habilitará la siguiente fase de tu hoja de ruta.</p>
                   </div>
                   <button className="px-14 py-8 rounded-[2.5rem] bg-blue-600 hover:bg-blue-500 text-lg font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 group flex items-center gap-5">
                      Saltar al BLOQUE {parseInt(currentModuleId.replace('m', '')) + 1}
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
                <div className="pt-12 border-t border-white/5 flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                   <span>Digital Career Strategy Guide</span>
                   <span>Canadá con Trabajo © 2026</span>
                </div>
             </footer>
          </div>
      </main>
    </div>
  );
}
