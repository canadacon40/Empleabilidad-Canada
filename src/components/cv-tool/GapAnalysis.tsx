import { CheckCircle, XCircle, Target, ArrowRight, Lightbulb, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GapAnalysisProps {
  data: any;
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

export default function GapAnalysis({ data, onOptimize, isOptimizing }: GapAnalysisProps) {
  if (!data) return null;

  const getVerdictTheme = (v: string) => {
      switch(v) {
          case 'APPLY': return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle className="w-16 h-16 text-emerald-500 animate-pulse" />, title: "APPLY NOW", desc: "El candidato tiene gran alineación técnica." };
          case 'APPLY_WITH_IMPROVEMENTS': return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: <Target className="w-16 h-16 text-amber-500 animate-pulse" />, title: "COMPETITIVE MATCH", desc: "Ajusta las keywords faltantes antes de aplicar." };
          case 'PARTIAL': return { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: <AlertTriangle className="w-16 h-16 text-orange-500 animate-pulse" />, title: "PARTIAL MATCH", desc: "Precaución: experiencia débil o skills omitidas." };
          default: return { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: <XCircle className="w-16 h-16 text-red-500 animate-pulse" />, title: "DO NOT APPLY", desc: "No cumples lo mínimo, serás descartado por el ATS." };
      }
  }

  const theme = getVerdictTheme(data.verdict);

  const SubScore = ({ label, score }: {label: string, score: number}) => {
      let colorClass = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
      return (
          <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>{label}</span>
                  <span className={score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-600"}>{score}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 shadow-inner">
                  <div className={`h-full rounded-full ${colorClass}`} style={{width: `${score}%`}}></div>
              </div>
          </div>
      )
  }

  const renderGapList = (title: string, items: any[]) => {
      if (!items || items.length === 0) return null;
      return (
          <div className="space-y-3 mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500">{title}</p>
              <ul className="space-y-3 mt-2">
                  {items.map((i, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-700 font-bold p-4 bg-slate-50 rounded-2xl border border-rose-100 hover:border-rose-300 transition-colors shadow-sm">
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          {i}
                      </li>
                  ))}
              </ul>
          </div>
      )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`p-8 sm:p-12 rounded-[3rem] border-4 flex flex-col md:flex-row items-center gap-10 shadow-xl relative overflow-hidden ${theme.bg} ${theme.border}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px]" />
        
        <div className="flex-1 space-y-6 text-center md:text-left relative z-10 w-full">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 bg-white/50 inline-block px-4 py-1.5 rounded-full">{theme.title}</p>
          <h4 className={`text-6xl sm:text-7xl font-black tracking-tighter ${theme.color}`}>
            {data.matchScore?.total || data.matchScore}% <span className="text-3xl">Match</span>
          </h4>
          <p className="text-lg font-bold opacity-80 text-slate-700 max-w-xl">
            {theme.desc}
          </p>
          {data.matchScore?.total !== undefined && (
              <div className="grid grid-cols-3 gap-6 pt-6 mt-6 border-t border-black/10">
                  <SubScore label="Skills" score={data.matchScore.skills} />
                  <SubScore label="Experiencia" score={data.matchScore.experience} />
                  <SubScore label="Keywords" score={data.matchScore.keywords} />
              </div>
          )}
        </div>
        
        <div className="shrink-0 flex flex-col items-center gap-6 relative z-10 w-full md:w-auto mt-6 md:mt-0 p-6 md:p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-lg">
          {theme.icon}
          {onOptimize && (
              <Button size="lg" className="w-full bg-slate-900 text-white font-black hover:bg-slate-800 rounded-2xl h-14 whitespace-nowrap shadow-xl" onClick={onOptimize} disabled={isOptimizing}>
                  {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Sparkles className="w-5 h-5 mr-3" />}
                  {isOptimizing ? 'Optimizando...' : 'Optimizar CV a este JD'}
              </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6">
          <h5 className="font-black text-slate-900 flex items-center gap-3 text-lg"><CheckCircle className="w-6 h-6 text-emerald-500" /> Fortalezas Detectadas</h5>
          <ul className="space-y-4">
            {data.strengths?.map((s: string, i: number) => (
              <li key={i} className="flex gap-4 text-sm font-bold text-slate-700 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6">
          <h5 className="font-black text-slate-900 flex items-center gap-3 text-lg"><Lightbulb className="w-6 h-6 text-amber-500" /> Roadmap to 90%+</h5>
          <ul className="space-y-4">
            {data.roadmapTo90?.map((step: string, i: number) => (
              <li key={i} className="flex gap-4 text-sm font-bold text-slate-800 bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                 <span className="w-8 h-8 rounded-full bg-primary text-white text-[12px] font-black flex items-center justify-center shrink-0 shadow-md">{i+1}</span>
                 <span className="pt-1">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border-2 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 text-white font-black flex items-center gap-3 text-xl">
            <AlertTriangle className="w-6 h-6 text-red-400" /> Auditoría de Brechas Tácticas
        </div>
        <div className="p-8 md:p-10">
            {data.gaps ? (
               <div className="grid md:grid-cols-2 gap-8">
                  <div>
                      {renderGapList("Skills Faltantes", data.gaps.missingSkills)}
                      {renderGapList("Certificaciones", data.gaps.missingCertifications)}
                      {data.gaps.languageGap && renderGapList("Brecha de Idioma (CLB)", [data.gaps.languageGap])}
                  </div>
                  <div>
                      {renderGapList("Experiencia Faltante", data.gaps.missingExperience)}
                      {renderGapList("Brechas Regulatorias", data.gaps.regulatoryGaps)}
                  </div>
               </div>
            ) : (
                <p className="text-center text-slate-500 font-bold p-8">¡No se encontraron brechas críticas! Eres un candidato ideal.</p>
            )}
        </div>
      </div>
      
      {data.atsKeywordsToInject?.length > 0 && (
          <div className="p-10 rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-300 text-center shadow-inner">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-6"><Target className="w-5 h-5 inline-block mr-2 mb-1" /> Keywords ATS a inyectar</p>
              <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                  {data.atsKeywordsToInject.map((kw: string, i: number) => (
                      <span key={i} className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-black text-slate-800 shadow-sm hover:border-primary/50 transition-colors">{kw}</span>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
