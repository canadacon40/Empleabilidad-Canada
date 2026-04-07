"use client";

import { 
  Sparkles, 
  Target, 
  ShieldAlert, 
  Zap, 
  FileText, 
  Printer,
  ChevronRight,
  BookOpen,
  Quote,
  CheckCircle2,
  Trophy,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface EbookRoadmapProps {
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
  userName?: string;
}

export default function EbookRoadmap({ data, currentModuleId, userEmail, userName }: EbookRoadmapProps) {
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

  const moduleTitles: Record<string, string> = {
    m0: "Diagnóstico Real y Mapa de Brechas",
    m1: "Bases Estratégicas y Fundamentos",
    m2: "Análisis de Mercado Canadiense",
    m3: "Ejecución Táctica Operativa",
    m4: "Networking de Élite y LinkedIn Mastery",
    m5: "Optimización de Perfil y CV Pro",
    m6: "Dominio de Entrevistas y Negociación",
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800 selection:bg-slate-100 print:p-0">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;600;800&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        @media print {
          .no-print { display: none !important; }
          .page-break { break-before: page; }
          body { background: white !important; }
          .shadow-2xl { box-shadow: none !important; }
          .rounded-[3rem] { border-radius: 0 !important; }
        }
      `}</style>

      {/* Floating Download Button (Web view only) */}
      <div className="fixed bottom-10 right-10 z-50 no-print">
         <button 
           onClick={() => window.print()}
           className="flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95"
         >
           <Printer className="w-5 h-5" />
           Descargar E-Book (PDF)
         </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-20 py-12 sm:py-32 space-y-32">
        
        {/* PAGE 1: THE COVER */}
        <section className="min-h-[85vh] flex flex-col justify-between border-b-8 border-slate-900 pb-20">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px]">
                 <BookOpen className="w-3 h-3" /> Digital Pierre Strategy Guide v4.0
              </div>
              <div className="w-20 h-1 bg-slate-900"></div>
           </div>

           <div className="space-y-8">
              <h1 className="text-6xl sm:text-8xl font-serif font-black text-slate-900 leading-[0.9] tracking-tighter">
                LA RUTA <br/> 
                <span className="italic text-slate-800">ESTRATÉGICA</span> <br/>
                DE PIERRE
              </h1>
              <div className="space-y-2">
                 <p className="text-xl sm:text-2xl font-serif italic text-slate-500">Un plan de acción exclusivo diseñado para</p>
                 <p className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase underline decoration-slate-200 underline-offset-8">
                    {userName || "LEONARDO SANCHEZ"}
                 </p>
              </div>
           </div>

           <div className="flex items-end justify-between border-t border-slate-100 pt-12">
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bloque de Enfoque</p>
                 <p className="text-lg font-bold text-slate-900">{moduleTitles[currentModuleId]}</p>
              </div>
              <div className="text-right space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confidencial</p>
                 <p className="text-xs font-bold text-slate-900">Canadá con Trabajo © 2026</p>
              </div>
           </div>
        </section>

        {/* PAGE 2: INTRODUCTION & CONTEXT */}
        <section className="page-break space-y-16 py-20">
           <div className="max-w-2xl">
              <h2 className="text-4xl font-serif font-black text-slate-900 mb-8">01. Carta del Mentor</h2>
              <Quote className="text-slate-100 w-24 h-24 absolute -z-10 -ml-12 -mt-10" />
              <div className="relative z-10 text-xl text-slate-700 leading-relaxed font-medium italic">
                 "{renderSafe(data.context)}"
              </div>
              <div className="mt-12 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-serif italic text-xl">P</div>
                 <div className="text-sm">
                    <p className="font-black text-slate-900">Pierre</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Estratega Senior de Empleabilidad</p>
                 </div>
              </div>
           </div>
        </section>

        {/* PAGE 3-4: THE REALITY CHECK (DIAGNOSTIC) */}
        <section className="page-break space-y-16 py-20">
           <div>
              <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">The Reality Check</p>
              <h2 className="text-5xl sm:text-6xl font-serif font-bold text-slate-900">02. El Diagnóstico Realista</h2>
           </div>
           
           <div className="p-12 sm:p-20 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden">
              <ShieldAlert className="absolute -top-10 -right-10 w-64 h-64 text-slate-100 -rotate-12" />
              <div className="relative z-10 prose prose-slate max-w-none prose-xl font-medium leading-relaxed text-slate-800 whitespace-pre-wrap first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:me-3 first-letter:float-start">
                 {renderSafe(data.diagnostic)}
              </div>
           </div>
        </section>

        {/* PAGE 5: THE STRATEGY MASTERPLAN */}
        <section className="page-break space-y-16 py-20">
           <div className="text-center space-y-6 max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-slate-900 mx-auto" />
              <h2 className="text-5xl font-serif font-black text-slate-900 italic">03. La Jugada Maestra</h2>
              <div className="w-24 h-1.5 bg-slate-900 mx-auto"></div>
           </div>

           <div className="p-12 sm:p-20 bg-slate-900 text-slate-50 rounded-[4rem] shadow-2xl relative overflow-hidden">
              <p className="text-2xl sm:text-3xl font-serif leading-relaxed italic opacity-90 text-center max-w-3xl mx-auto">
                 {renderSafe(data.strategy)}
              </p>
           </div>
        </section>

        {/* PAGE 6-7: THE ROADMAP (STEPS) */}
        <section className="page-break space-y-16 py-20">
           <div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Ejecución Táctica</p>
              <h2 className="text-5xl font-serif font-bold text-slate-900">04. Tu Hoja de Ruta Exacta</h2>
           </div>

           <div className="grid grid-cols-1 gap-12">
              {Array.isArray(data.steps) ? data.steps.map((step, i) => (
                <div key={i} className="flex gap-10 items-start group">
                   <div className="text-6xl font-serif font-black text-slate-100 group-hover:text-slate-200 transition-colors shrink-0 pt-2">
                     {String(i + 1).padStart(2, '0')}
                   </div>
                   <div className="space-y-4 pt-6 border-t border-slate-100 flex-1">
                      <p className="text-xl text-slate-900 font-black leading-tight group-hover:translate-x-2 transition-transform duration-500">{moduleTitles[currentModuleId]} - Fase {i+1}</p>
                      <p className="text-lg text-slate-600 leading-relaxed font-serif italic">{renderSafe(step)}</p>
                      <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         <CheckCircle2 className="w-3 h-3" /> Acción Prioritaria
                      </div>
                   </div>
                </div>
              )) : null}
           </div>
        </section>

        {/* PAGE 8: TEMPLATES & RESOURCES */}
        <section className="page-break space-y-16 py-20">
           <div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Caja de Herramientas</p>
              <h2 className="text-5xl font-serif font-bold text-slate-900">05. Recursos y Plantillas</h2>
           </div>

           <div className="space-y-20">
              {/* Plantillas */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-slate-900" />
                    <h4 className="text-sm font-black uppercase tracking-widest">Plantillas de Élite</h4>
                 </div>
                 <div className="group relative">
                    <pre className="p-12 rounded-[3rem] bg-slate-50 border-2 border-slate-100 text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto italic">
                       {renderSafe(data.templates)}
                    </pre>
                    <button 
                      onClick={() => handleCopy(renderSafe(data.templates), 'temp')}
                      className="absolute top-8 right-8 p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all no-print"
                    >
                      {copied === 'temp' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                 </div>
              </div>

              {/* Prompts */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <Zap className="w-6 h-6 text-slate-900" />
                    <h4 className="text-sm font-black uppercase tracking-widest">Librería de Prompts IA</h4>
                 </div>
                 <div className="group relative">
                    <pre className="p-12 rounded-[3rem] bg-slate-50 border-2 border-slate-100 text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto italic">
                       {renderSafe(data.prompts)}
                    </pre>
                    <button 
                      onClick={() => handleCopy(renderSafe(data.prompts), 'prom')}
                      className="absolute top-8 right-8 p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all no-print"
                    >
                      {copied === 'prom' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                 </div>
              </div>
           </div>
        </section>

        {/* PAGE 9: QUICK WINS & CONCLUSION */}
        <section className="page-break space-y-24 py-20 text-center">
           <div className="space-y-12">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                 <Zap className="w-10 h-10 fill-emerald-600" />
              </div>
              <div className="space-y-6">
                 <h4 className="text-2xl font-serif font-black italic">Resultados 48 Horas</h4>
                 <p className="text-2xl font-bold text-slate-800 max-w-2xl mx-auto leading-relaxed">
                    {renderSafe(data.quickWins)}
                 </p>
              </div>
           </div>

           <div className="pt-32 border-t border-slate-100 space-y-12">
              <Trophy className="w-16 h-16 text-slate-900 mx-auto" />
              <div className="space-y-6">
                 <h2 className="text-5xl font-serif font-bold text-slate-900">El Resultado del Bloque</h2>
                 <p className="text-4xl font-serif italic text-slate-500 underline decoration-slate-100 underline-offset-[12px]">
                   "{renderSafe(data.expectedResult)}"
                 </p>
              </div>
           </div>
        </section>

        {/* PAGE 10: CONTINUATION */}
        <footer className="page-break pt-40 pb-20 text-center space-y-12">
           <div className="space-y-4">
              <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px]">Pierre Strategy Engine</p>
              <h3 className="text-3xl font-black text-slate-900">Fin del Bloque {currentModuleId.replace('m', '')}.</h3>
              <p className="text-slate-500 font-serif italic">Tu siguiente fase estará disponible una vez ejecutes estas acciones.</p>
           </div>
           
           <div className="flex flex-col items-center gap-8 no-print">
              <button className="px-16 py-8 rounded-full bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-4 group">
                 Continuar al BLOQUE {parseInt(currentModuleId.replace('m', '')) + 1}
                 <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
           </div>

           <div className="pt-24 flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
              <span>Canadá con Trabajo</span>
              <span>Propiedad Intelectual Protegida 2026</span>
              <span>{userEmail}</span>
           </div>
        </footer>

      </div>
    </div>
  );
}
