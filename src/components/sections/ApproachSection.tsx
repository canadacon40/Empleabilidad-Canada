"use client"

import { Check, X, ShieldCheck, ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"

export default function ApproachSection() {
    const doList = [
        "Instalarte el Sistema Pierre 2.5 (12 Bloques tácticos).",
        "Ejecutar un diagnóstico implacable de viabilidad real.",
        "Darte los scripts exactos para dominar el mercado oculto.",
        "Trabajar en un formato de alta exigencia enfocado en la OFERTA."
    ]

    const dontList = [
        "Hacer el trabajo por ti mientras esperas el milagro.",
        "Diseñar CVs 'estéticos' que no pasan los filtros ATS reales.",
        "Aceptar perfiles con niveles de inglés irreales para el cargo.",
        "Vender promesas de empleo garantizado o vías migratorias."
    ]

    return (
        <section className="bg-white py-24 px-4 sm:px-6 relative">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-16 text-center space-y-4">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block"
                    >
                        El Filtro de Calidad
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                        Esto NO es para todos.
                    </h2>
                    <p className="mt-6 text-lg text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        Si solo esperas pagar para que alguien haga magia, rechazaremos tu aplicación. Yo te instalo la mejor mira telescópica del mercado, <span className="text-slate-900 font-bold">pero tú aprietas el gatillo.</span>
                    </p>
                </div>

                <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
                    {/* What I DO */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[2.5rem] border-2 border-slate-100 bg-slate-50 p-10 md:p-12 relative group hover:border-emerald-200 transition-all duration-500"
                    >
                        <div className="absolute top-8 right-10 text-emerald-500/20 group-hover:scale-110 transition-transform">
                             <ShieldCheck className="w-12 h-12" />
                        </div>
                        <h3 className="mb-8 text-2xl font-black text-slate-900">
                            Lo que SÍ hacemos
                        </h3>
                        <ul className="space-y-6">
                            {doList.map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white stroke-[4]" />
                                    </div>
                                    <span className="text-slate-600 font-bold tracking-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* What I DON'T DO */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 md:p-12 relative group hover:border-red-100 transition-all duration-500"
                    >
                        <div className="absolute top-8 right-10 text-red-500/20 group-hover:scale-110 transition-transform">
                             <ShieldAlert className="w-12 h-12" />
                        </div>
                        <h3 className="mb-8 text-2xl font-black text-slate-900">
                            Lo que NO hacemos
                        </h3>
                        <ul className="space-y-6">
                            {dontList.map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                        <X className="h-3 w-3 text-slate-400 stroke-[4]" />
                                    </div>
                                    <span className="text-slate-400 font-medium tracking-tight line-through decoration-slate-200">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Solo aceptamos perfiles con mentalidad de éxito.
                    </p>
                </div>
            </div>
        </section>
    )
}
