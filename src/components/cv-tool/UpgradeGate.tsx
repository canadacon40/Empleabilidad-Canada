"use client"

import { Button } from "@/components/ui/button";
import { 
    Rocket, 
    Sparkles, 
    ArrowRight, 
    CheckCircle2, 
    Zap, 
    ShieldCheck, 
    Target, 
    FileText, 
    Search,
    Lock
} from "lucide-react";
import { motion } from "framer-motion";

interface UpgradeGateProps {
    onBack: () => void;
    email?: string;
}

export default function UpgradeGate({ onBack, email }: UpgradeGateProps) {
    const stripeUrl = `/api/create-checkout?success=/cv-tool&price=2900&product=pro${email ? `&customer_email=${encodeURIComponent(email)}` : ""}`;

    const features = [
        {
            icon: FileText,
            title: "Rediseñador de CV Maestro",
            desc: "Transforma tu CV al estándar Canadiense/Quebequense en segundos (Inglés o Francés)."
        },
        {
            icon: Target,
            title: "AI Job Matcher",
            desc: "Pega una vacante y Pierre adaptará tu CV específicamente para ese algoritmo ATS."
        },
        {
            icon: Search,
            title: "Mapa del Mercado Oculto",
            desc: "Acceso a la base de datos de empresas con historial de patrocinio LMIA."
        },
        {
            icon: Sparkles,
            title: "Los 11 Bloques del Éxito",
            desc: "La metodología exacta para conseguir ofertas High-Ticket en Canadá."
        }
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 relative"
            >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
                    <Rocket className="w-64 h-64 text-slate-900" />
                </div>

                <div className="grid lg:grid-cols-12 gap-0">
                    {/* Left: Benefits */}
                    <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-12">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-400/20">
                                <Zap className="w-3 h-3 fill-amber-400" /> Pierre PRO Access
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none italic">
                                Has llegado al <span className="text-primary relative inline-block">
                                    Límite
                                    <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-primary/20 rounded-full" />
                                </span> Gratuito.
                            </h2>
                            <p className="text-slate-500 text-lg font-medium max-w-md">
                                Tu diagnóstico está listo, pero la ejecución es donde se gana la guerra. Desbloquea el arsenal completo de Pierre.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {features.map((f, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                                        <f.icon className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{f.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Checkout */}
                    <div className="lg:col-span-5 bg-slate-900 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.2),transparent_70%)]" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-2xl mb-8">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Acceso de por Vida</p>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-3xl font-medium text-white/50 line-through">$100</span>
                                    <span className="text-6xl font-black text-white tracking-tighter">$51</span>
                                    <span className="text-xl font-bold text-primary">USD</span>
                                </div>
                            </div>

                            <Button 
                                size="lg" 
                                className="w-full h-20 rounded-2xl bg-primary text-white font-black text-xl shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.03] transition-all group"
                                asChild
                            >
                                <a href={stripeUrl}>
                                    ACTIVAR PIERRE PRO <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </a>
                            </Button>

                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest px-8">
                                Pago único. Acceso ilimitado a actualizaciones y herramientas.
                            </p>
                        </div>

                        <button 
                            onClick={onBack}
                            className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em] relative z-10"
                        >
                            ← Volver a mi reporte gratuito
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
