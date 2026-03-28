"use client"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight } from "lucide-react"

export default function LeadForm() {
    return (
        <form className="flex flex-col gap-6" action="https://formsubmit.co/canadacon40@gmail.com" method="POST">
            {/* Opciones ocultas para FormSubmit */}
            <input type="hidden" name="_subject" value="Nuevo prospecto - Empleabilidad Canadá" />
            <input type="hidden" name="_captcha" value="false" />

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nombre Completo</label>
                    <input 
                        id="name" 
                        name="name" 
                        type="text" 
                        className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all outline-none placeholder:text-slate-300" 
                        placeholder="Ej: Ana Garcia" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Correo Corporativo/Personal</label>
                    <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all outline-none placeholder:text-slate-300" 
                        placeholder="ana@ejemplo.com" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="linkedin" className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">LinkedIn (Vital para el análisis)</label>
                    <input 
                        id="linkedin" 
                        name="linkedin" 
                        type="url" 
                        className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all outline-none placeholder:text-slate-300" 
                        placeholder="https://linkedin.com/in/..." 
                    />
                </div>
            </div>

            <div className="pt-2">
                <Button type="submit" className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3">
                    Solicitar Análisis Gratuito
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Tus datos están protegidos y son 100% privados.
            </div>
        </form>
    )
}
