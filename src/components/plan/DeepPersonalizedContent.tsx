"use client";

import { 
  Sparkles, 
  Target, 
  ShieldAlert, 
  Zap, 
  ListChecks, 
  FileText, 
  Terminal, 
  AlertCircle, 
  Trophy,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeepPersonalizedContentProps {
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
  moduleTitle: string;
}

export default function DeepPersonalizedContent({ data, moduleTitle }: DeepPersonalizedContentProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const Section = ({ 
    icon: Icon, 
    title, 
    content, 
    type = "text", 
    variant = "default" 
  }: { 
    icon: any, 
    title: string, 
    content: string | string[], 
    type?: "text" | "list" | "code",
    variant?: "default" | "warning" | "success" | "accent"
  }) => {
    const isCopyable = type === "code" || title.toLowerCase().includes("plantilla") || title.toLowerCase().includes("mensajes");
    const sectionId = title.replace(/\s+/g, '-').toLowerCase();

    const renderSafe = (val: any) => {
      if (typeof val === 'string') return val;
      if (typeof val === 'object' && val !== null) return JSON.stringify(val, null, 2);
      return String(val);
    };

    const variants = {
      default: "bg-white/5 border-white/10",
      warning: "bg-rose-500/10 border-rose-500/20 text-rose-200",
      success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
      accent: "bg-primary/10 border-primary/20"
    };

    return (
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-8 sm:p-12 rounded-[3.5rem] border ${variants[variant]} relative overflow-hidden group`}
      >
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                variant === 'warning' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' :
                variant === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                'bg-primary/20 border-primary/30 text-primary'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white">{title}</h3>
            </div>
            
            {isCopyable && (
              <button 
                onClick={() => handleCopy(Array.isArray(content) ? content.join('\n') : renderSafe(content), sectionId)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400 hover:text-white"
              >
                {copied === sectionId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied === sectionId ? "Copiado" : "Copiar"}
              </button>
            )}
          </div>

          <div className="space-y-6">
            {type === "text" && (
              <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                "{renderSafe(content)}"
              </p>
            )}

            {type === "list" && Array.isArray(content) && (
              <div className="grid grid-cols-1 gap-4">
                {content.map((item, i) => (
                  <div key={i} className="flex gap-5 p-6 rounded-3xl bg-black/20 border border-white/5 hover:border-primary/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-slate-200 font-medium leading-relaxed">{renderSafe(item)}</p>
                  </div>
                ))}
              </div>
            )}

            {type === "code" && (
              <div className="relative group/code">
                <pre className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/10 overflow-x-auto text-primary font-mono text-sm leading-relaxed whitespace-pre-wrap italic">
                  {renderSafe(content)}
                </pre>
                <div className="absolute top-4 right-4 opacity-0 group-hover/code:opacity-100 transition-opacity">
                  <Terminal className="w-4 h-4 text-slate-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header Impact */}
      <div className="p-10 sm:p-16 rounded-[4rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 relative overflow-hidden mb-20 text-center sm:text-left">
        <div className="absolute top-0 right-0 p-12 opacity-10 animate-pulse">
          <Sparkles className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-primary border border-primary/30">
            Digital Pierre: Mentor Senior
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
            Estrategia Maestra: <span className="text-primary italic">{moduleTitle}</span>
          </h2>
          <p className="text-slate-300 text-xl font-medium leading-relaxed border-l-4 border-primary/40 pl-8 italic">
            "{typeof data.context === 'string' ? data.context : JSON.stringify(data.context)}"
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Diagnostic (Honest Pierre) */}
        <Section 
          icon={ShieldAlert}
          title="Diagnóstico Realista"
          variant="warning"
          content={data.diagnostic}
        />

        {/* Strategy */}
        <Section 
          icon={Target}
          title="La Estrategia Pierre"
          content={data.strategy}
        />

        {/* Action Steps */}
        <Section 
          icon={ListChecks}
          title="Plan de Ejecución Paso a Paso"
          type="list"
          variant="accent"
          content={data.steps}
        />

        {/* Examples */}
        <Section 
          icon={Trophy}
          title="Casos y Ejemplos de Éxito"
          variant="success"
          content={data.examples}
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Templates */}
          <Section 
            icon={FileText}
            title="Plantillas y Mensajes"
            type="code"
            content={data.templates}
          />

          {/* AI Prompts */}
          <Section 
            icon={Terminal}
            title="Prompts Especializados de IA"
            type="code"
            content={data.prompts}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Common Errors */}
          <Section 
            icon={AlertCircle}
            title="Errores que Debes Evitar"
            variant="warning"
            content={data.commonErrors}
          />

          {/* Quick Wins */}
          <Section 
            icon={Zap}
            title="Quick Wins (48h)"
            variant="success"
            content={data.quickWins}
          />
        </div>

        {/* Final Result */}
        <div className="p-12 rounded-[3.5rem] bg-slate-900 border border-white/10 text-center space-y-6">
           <Trophy className="w-12 h-12 text-primary mx-auto" />
           <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Resultado Esperado</h4>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
             "{typeof data.expectedResult === 'string' ? data.expectedResult : JSON.stringify(data.expectedResult)}"
           </p>
        </div>
      </div>
    </div>
  );
}
