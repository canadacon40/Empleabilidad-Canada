"use client";

import { useState } from "react";
import { Sparkles, Loader2, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlanGeneratorTriggerProps {
  leadId: string;
  moduleId: string;
  moduleTitle: string;
}

export default function PlanGeneratorTrigger({ leadId, moduleId, moduleTitle }: PlanGeneratorTriggerProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleGenerate = async () => {
    setStatus("generating");
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, moduleId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al generar el plan");

      setStatus("success");
      
      // Refresh the page to show the new content
      setTimeout(() => {
        router.refresh();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Ocurrió un error inesperado.");
    }
  };

  if (status === "success") {
    return (
      <div className="p-12 rounded-[3.5rem] bg-emerald-500/10 border border-emerald-500/20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Plan Maestro Generado</h3>
          <p className="text-emerald-200/60 font-medium">Pierre ha terminado tu hoja de ruta para este módulo. Recargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 sm:p-20 rounded-[4rem] bg-slate-900 border border-white/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-10">
        <div className="space-y-4">
          <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary relative">
            {status === "generating" ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : (
              <Sparkles className="w-10 h-10" />
            )}
            {status === "generating" && (
                <div className="absolute -inset-4 border-2 border-primary border-dashed rounded-[2.5rem] animate-spin duration-[10s]" />
            )}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            {status === "generating" ? "Pierre está analizando..." : "Contenido Personalizado Pendiente"}
          </div>
        </div>

        <div className="max-w-2xl space-y-4">
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight">
            Personalizar <span className="text-primary italic">{moduleTitle}</span> con Pierre
          </h3>
          <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
            "Este módulo tiene la teoría, pero para que sea tu victoria, necesito inyectar tu perfil real, tus miedos y tus herramientas actuales. ¿Seguimos?"
          </p>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={status === "generating"}
          className={`group relative px-12 py-6 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center gap-4 overflow-hidden ${
            status === "generating" 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
              : "bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {status === "generating" ? "ESPERANDO A PIERRE..." : "GENERAR HOJA DE RUTA"}
          {status !== "generating" && <Play className="w-6 h-6 fill-current translate-x-1" />}
        </button>

        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
          ESTO TOMARÁ UNOS 30-60 SEGUNDOS. PIERRE ES EXIGENTE.
        </p>
      </div>
    </div>
  );
}
