"use client";

import { useState } from "react";
import { Search, Loader2, FileText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import GapAnalysis from "./GapAnalysis";

interface JdMatcherProps {
  cvText: string;
  onOptimize?: (jdText: string) => void;
  isOptimizing?: boolean;
}

export default function JdMatcher({ cvText, onOptimize, isOptimizing }: JdMatcherProps) {
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!jdText.trim()) {
      setError("Por favor, pega una Job Description.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jdText }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Ocurrió un error en el Matcher");
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
              <Target className="w-4 h-4 text-primary" /> Nuevo Tool
            </div>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight">
              Alineación Perfecta: <span className="text-primary italic">JD Matcher</span>
            </h3>
            <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-md">
              Pega la descripción de la vacante a la que quieres aplicar. Pierre cruzará tu CV contra la oferta para decirte exactamente por qué te van a contratar (o por qué te van a rechazar) y cómo solucionarlo.
            </p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
            <textarea
              className="w-full h-48 sm:h-64 bg-black/40 border sm:border-2 border-white/10 rounded-2xl p-6 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none font-mono"
              placeholder="Pega aquí la descripción del puesto (Job Description) de Job Bank, LinkedIn, Indeed..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            {error && <p className="text-red-400 text-xs font-bold mt-4 px-2">{error}</p>}
            <Button
              className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-xl shadow-xl transition-all active:scale-95"
              onClick={handleMatch}
              disabled={isLoading || !jdText.trim()}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Escaneando Oferta...</>
              ) : (
                <><Search className="w-5 h-5 mr-3" /> Analizar Match</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="p-16 text-center animate-pulse">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <p className="text-lg font-black tracking-tight text-slate-500">Pierre está cruzando 50+ variables ATS...</p>
        </div>
      )}

      {result && (
        <div className="pt-8 border-t-2 border-dashed border-slate-200">
            <GapAnalysis data={result} onOptimize={() => onOptimize?.(jdText)} isOptimizing={isOptimizing} />
        </div>
      )}
    </div>
  );
}
