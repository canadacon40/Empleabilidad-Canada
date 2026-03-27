"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, Calendar } from "lucide-react";

function SuccessSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const CALENDLY_URL = "https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon";

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = CALENDLY_URL;
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">¡Pago Confirmado!</h1>
          <p className="text-slate-500 font-medium">Hemos recibido tu pago para la Sesión + Plan de Empleabilidad.</p>
        </div>
        
        <div className="p-6 bg-primary/5 rounded-3xl border-2 border-primary/20 flex items-center gap-4 text-left">
          <Calendar className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="text-xs font-black text-primary uppercase">Siguiente Paso</p>
            <p className="text-sm font-bold text-slate-700">Agendar tu sesión en Calendly</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Redirigiendo a Calendly...</p>
        </div>

        <button 
          onClick={() => window.location.href = CALENDLY_URL}
          className="text-xs font-black text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          ¿No se redirige automáticamente? Haz clic aquí
        </button>
      </div>
    </div>
  );
}

export default function SuccessSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessSessionContent />
    </Suspense>
  );
}
