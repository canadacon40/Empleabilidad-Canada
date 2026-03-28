"use client"

import { Star, ShieldCheck, Quote, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Luis O.",
            role: "Operaciones & Supply Chain",
            content: "Llevaba 8 meses mandando el mismo CV que usaba en Colombia. Nadie llamaba. Pierre me explicó que mi experiencia como Director de Planta no servía sin un 'Bridge Role'. Ajustamos el foco a Supervisor, metimos keywords y a las 3 semanas firmé mi primer contrato.",
            tag: "Contratación en 21 días"
        },
        {
            name: "Carolina M.",
            role: "Analista de Datos",
            content: "Pensé que por ser de IT me iban a llover ofertas. Falso. Mi LinkedIn espantaba a los reclutadores por la semántica. Atacar el 'Hidden Market' me ahorró meses de ahorros perdidos.",
            tag: "Estrategia LinkedIn"
        },
        {
            name: "Fernanda R.",
            role: "Marketing Specialist",
            content: "El mayor valor son las herramientas. Antes pagaba $150 a agencias para que arreglaran mi CV. Ahora, yo misma proceso una vacante y saco un formato perfecto en 5 minutos.",
            tag: "Herramientas de IA"
        },
        {
            name: "David V.",
            role: "Construction Engineer",
            content: "Como Ingeniero Civil me topé con la barrera de las certificaciones (P.Eng). El programa me ayudó a pivotar mi perfil hacia 'Project Coordinator'. Entré a la industria en tiempo récord.",
            tag: "Pivot de Perfil"
        },
        {
            name: "Javier C.",
            role: "Ventas B2B",
            content: "Mi pánico era la entrevista metodológica. El bloque de pronósticos del sistema me enseñó a encuadrar mis éxitos usando el formato S-T-A-R. Fui sabiendo exactamente lo que iban a preguntar.",
            tag: "Dominio de Entrevistas"
        },
        {
            name: "Andrea S.",
            role: "Analista Financiero",
            content: "Es frustrante trabajar en un 'survival job' teniendo un título en Finanzas. Empleabilidad Canadá cortó la palabrería y me dio un manual de ejecución frío. Salí del Retail para siempre.",
            tag: "Salida del Survival Job"
        }
    ]

    return (
        <section id="reviews" className="py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative">
                <div className="mb-20 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex -space-x-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">+500 Profesionales Ayudados</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
                        De Invisibles a Indispensables.
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        No son solo testimonios; son hojas de ruta de transformación real en el mercado laboral canadiense.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="break-inside-avoid relative p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            
                            <div className="absolute top-8 right-8 text-slate-200 group-hover:text-primary/10 transition-colors">
                                <Quote className="w-8 h-8 fill-current" />
                            </div>

                            <p className="text-slate-600 leading-relaxed font-medium mb-6 relative z-10">
                                "{t.content}"
                            </p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-xs">
                                        {t.name.split(' ')[0][0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{t.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.role}</p>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 w-fit">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-tight">{t.tag}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 max-w-lg text-center md:text-left">
                        <h4 className="text-2xl font-black mb-2">¿Listo para ser el próximo caso de éxito?</h4>
                        <p className="text-slate-400 font-medium">Únete a cientos de profesionales que ya hackearon el sistema de contratación canadiense.</p>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-3">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                             <ShieldCheck className="w-4 h-4" /> Resultados Verificados
                         </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
