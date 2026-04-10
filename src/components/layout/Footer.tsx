"use client"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-white/5 py-20 px-4 sm:px-6 overflow-hidden relative">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/5 pb-12 mb-12">
                    <div className="max-w-xs">
                         <div className="flex items-center space-x-2 mb-6">
                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-black text-xs">P</div>
                            <span className="font-black tracking-tighter text-white text-lg uppercase">
                                Radar de <span className="text-primary">Empleo</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Ingeniería de carrera y posicionamiento estratégico para profesionales ambiciosos en Canadá. El fin del "Invisible Market".
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12 sm:gap-24">
                        <div className="space-y-4">
                            <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Recursos</h4>
                            <ul className="space-y-3">
                                <li><Link href="/cv-tool" className="text-slate-500 hover:text-primary text-sm font-bold transition-colors">Diagnóstico IA</Link></li>
                                <li><Link href="#faq" className="text-slate-500 hover:text-primary text-sm font-bold transition-colors">Preguntas Frecuentes</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Aviso Legal</h4>
                            <ul className="space-y-3">
                                <li className="text-[10px] text-slate-500 leading-tight">
                                    Pierre Employability es un servicio de estrategia laboral. No somos, ni pretendemos ser, consultores de inmigración (RCIC). Para asesoría legal migratoria, consulte a un profesional certificado.
                                </li>
                                <li><span className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">Términos y Privacidad</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <button 
                            onClick={() => {
                                if (typeof window !== "undefined") {
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/30 hover:text-primary font-black text-[8px] sm:text-[9px] uppercase tracking-widest transition-all"
                        >
                            ¿Problemas técnicos? Limpiar Pierre y Reintentar
                        </button>
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                            © 2024 Pierre Employability Engine. All Rights Reserved.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                         {/* Social Placeholders */}
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                         <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Built for Results.</span>
                    </div>
                </div>
            </div>
            
            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </footer>
    )
}
