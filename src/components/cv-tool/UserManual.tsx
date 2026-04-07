"use client"

import { BookOpen, Download, Target, FileText, Layout, CheckCircle2, Search, ArrowRight, Sparkles, ChevronRight, Rocket, Palette, ShieldCheck } from "lucide-react";
import { downloadUserManualPDF } from "@/lib/report-utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function UserManual() {
  return (
    <div className="bg-slate-950 rounded-[4rem] p-10 sm:p-16 text-white overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] space-y-12 border-2 border-white/10">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_60%)] pointer-events-none" />
        
        {/* Header - Solid & Sharp */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 border-b-2 border-white/5 pb-12">
            <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-900 border-2 border-white/5 flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-10 h-10 text-amber-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">Protocolo Oficial Pierre PRO</span>
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <h4 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">Manual de Éxito</h4>
                    <p className="text-base font-medium text-slate-400 max-w-xl italic opacity-80 border-l-2 border-amber-500/30 pl-6 mt-4">
                        "Domina el Mercado Oculto canadiense con precisión técnica y ejecución algorítmica."
                    </p>
                </div>
            </div>
            <Button onClick={downloadUserManualPDF} className="h-16 px-10 rounded-2xl bg-white text-slate-950 font-black hover:bg-slate-100 transition-all shrink-0 text-xs uppercase tracking-widest shadow-xl group">
                <Download className="w-5 h-5 mr-3 group-hover:translate-y-1 transition-transform" />
                Descargar Manual Completo PDF
            </Button>
        </div>

        {/* Visual Roadmap - SOLID HIGH CONTRAST CARDS */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-10 rounded-[3rem] bg-slate-900 border-2 border-white/20 relative group transition-all hover:border-primary/40 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    <Layout className="w-8 h-8 text-white scale-110" />
                </div>
                <h5 className="font-black text-xs uppercase tracking-[0.3em] mb-3 text-white">1. FASE 1: REDISEÑO QUIRÚRGICO</h5>
                <p className="text-sm text-slate-100 leading-relaxed font-black">Pierre reconstruye tu perfil bajo la técnica de Ingeniería Quirúrgica.</p>
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 opacity-10">
                    <ChevronRight className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Step 2 - Current Focus (Highlight) */}
            <div className="flex flex-col items-center text-center p-10 rounded-[3rem] bg-slate-900 border-4 border-amber-500 shadow-[0_30px_70px_rgba(245,158,11,0.3)] relative group z-10 scale-105">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/50">
                    <Search className="w-9 h-9 text-slate-950 stroke-[3px]" />
                </div>
                <h5 className="font-black text-xs uppercase tracking-[0.3em] mb-3 text-white bg-slate-800 px-3 py-1 rounded-full">2. TU RADAR MATCH</h5>
                <p className="text-sm text-white leading-relaxed font-black drop-shadow-md">Análisis algorítmico contra vacantes reales para ver brechas críticas.</p>
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 opacity-40">
                    <ChevronRight className="w-8 h-8 text-amber-500" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">ENCENDIDO</div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-10 rounded-[3rem] bg-slate-900 border-2 border-white/20 relative group transition-all hover:border-primary/40 shadow-2xl">
                 <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    <Target className="w-8 h-8 text-white scale-110" />
                </div>
                <h5 className="font-black text-xs uppercase tracking-[0.3em] mb-3 text-white">3. TU ATAQUE FINAL</h5>
                <p className="text-sm text-slate-100 leading-relaxed font-black">Personalización específica para superar filtros ATS al 100%.</p>
            </div>
        </div>

        {/* Interactive Guide - SOLID DARK ACCORDIONS */}
        <div className="relative z-10 pt-4">
            <Accordion type="single" collapsible className="w-full space-y-6">
                <AccordionItem value="step-1" className="border-2 border-white/5 rounded-[2.5rem] bg-slate-900 px-8 overflow-hidden transition-all hover:border-white/10 shadow-xl">
                    <AccordionTrigger className="hover:no-underline py-8">
                        <div className="flex items-center gap-6 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center text-lg font-black shrink-0 border border-white/10">01</div>
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Cimiento Maestro</span>
                                <span className="text-2xl font-black text-white tracking-tight">Rediseño CV Estilo Pierre</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 pb-10 pl-[68px] max-w-3xl">
                        <div className="space-y-6 border-l-2 border-white/10 pl-6">
                            <p className="text-base leading-relaxed italic font-medium">"Tu currículum no es un historial, es un folleto de ventas técnico."</p>
                            <p className="text-base leading-relaxed">Pierre re-estructurará tu información bajo los estándares de reclutamiento canadiense (NOC, logros cuantificables y verbos de acción).</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-sm text-white">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Formato Compatible ATS
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-sm text-white">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Traducción Técnica PRO
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-2" className="border-2 border-white/5 rounded-[2.5rem] bg-slate-900 px-8 overflow-hidden transition-all hover:border-white/10 shadow-xl">
                    <AccordionTrigger className="hover:no-underline py-8">
                        <div className="flex items-center gap-6 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center text-lg font-black shrink-0 border border-white/10">02</div>
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Inteligencia Premonitoria</span>
                                <span className="text-2xl font-black text-white tracking-tight">Prueba de Compatibilidad</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 pb-10 pl-[68px] max-w-3xl">
                         <div className="space-y-6 border-l-2 border-white/10 pl-6">
                            <p className="text-base leading-relaxed">No apliques a ciegas. Pierre compara tu CV reformateado contra la vacante específica para darte tu probabilidad real de éxito.</p>
                            <div className="bg-slate-950 border-2 border-white/5 p-8 rounded-[2rem] grid grid-cols-1 sm:grid-cols-2 gap-8 shadow-inner">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <strong className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block">Score Técnico</strong>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Medición precisa de keywords, jerarquía y skills contra el algoritmo del JD.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        <strong className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block">Gap Analysis</strong>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Detección exacta de qué experiencia te falta para ser el candidato dominante.</p>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-3" className="border-2 border-white/5 rounded-[2.5rem] bg-slate-900 px-8 overflow-hidden transition-all hover:border-white/10 shadow-xl">
                    <AccordionTrigger className="hover:no-underline py-8">
                        <div className="flex items-center gap-6 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center text-lg font-black shrink-0 border border-white/10">03</div>
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Optimización de Ataque</span>
                                <span className="text-2xl font-black text-white tracking-tight">Adaptación Específica</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 pb-10 pl-[68px] max-w-3xl">
                         <div className="space-y-6 border-l-2 border-white/10 pl-6">
                            <p className="text-base leading-relaxed">Pierre inyecta tus logros y resumen profesional con las keywords del Job Description para asegurar el 100% de match sin perder naturalidad profesional.</p>
                            <div className="flex items-center gap-4 p-6 bg-primary text-slate-950 border-2 border-primary/20 rounded-[2rem] shadow-2xl shadow-primary/20">
                               <Target className="w-8 h-8 flex-shrink-0 animate-pulse" />
                               <div className="font-black text-sm uppercase tracking-tight leading-tight">
                                    Genera un documento único por cada aplicación. Máxima personalización = Más entrevistas.
                               </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="step-4" className="border-2 border-white/5 rounded-[2.5rem] bg-slate-900 px-8 overflow-hidden transition-all hover:border-white/10 shadow-xl border-amber-500/20">
                    <AccordionTrigger className="hover:no-underline py-8">
                        <div className="flex items-center gap-6 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center text-lg font-black shrink-0 border border-amber-500/50">04</div>
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-1">Cierre Estratégico</span>
                                <span className="text-2xl font-black text-white tracking-tight">Fase Post-Oferta y Visas</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 pb-10 pl-[68px] max-w-3xl">
                         <div className="space-y-6 border-l-2 border-amber-500/10 pl-6">
                            <p className="text-base leading-relaxed">¡Felicidades! Pierre ha cumplido su misión de llevarte a la oferta. Ahora comienza el proceso formal migratorio donde mi rol estratégico termina e inicia tu gestión legal.</p>
                            <div className="bg-slate-950 border-2 border-white/5 p-8 rounded-[2rem] space-y-6 shadow-inner">
                                <div className="flex items-start gap-4">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-xs font-black text-white uppercase tracking-widest block mb-2">Verificación de la Oferta</strong>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed">Asegúrate de que tu oferta incluya todos los beneficios, salario y condiciones pactadas. Revisa tus derechos como trabajador en Canadá.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Target className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-xs font-black text-white uppercase tracking-widest block mb-2">Fuentes Oficiales (IRCC)</strong>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed">Para tu permiso de trabajo y visa, dirígete siempre a <a href="https://www.canada.ca" target="_blank" className="text-primary hover:underline">Canada.ca (IRCC)</a>. Pierre es tu estratega de empleo, no tu consultor legal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        {/* Footer CTA - SOLID PREMIUM */}
        <div className="relative z-10 flex flex-col items-center text-center p-12 bg-white rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/20 transition-all" />
            
            <div className="w-24 h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                 <Rocket className="w-10 h-10 text-amber-400" />
                 <div className="absolute inset-0 bg-amber-400/20 rounded-[2rem] animate-ping scale-75" />
            </div>
            
            <h5 className="text-3xl font-black text-slate-950 mb-3 tracking-tight">¿Listo para ejecutar tu transformación?</h5>
            <p className="text-slate-500 font-bold mb-10 text-lg opacity-80 max-w-md italic">
                "El éxito es donde la preparación técnica se encuentra con la oportunidad."
            </p>
            
            <div className="flex items-center gap-4 text-[11px] font-black text-slate-950 uppercase tracking-[0.4em] bg-slate-50 px-10 py-5 rounded-full border-2 border-slate-100 shadow-sm group-hover:bg-amber-400 group-hover:border-amber-400 transition-all duration-500 mb-2">
                Sigue bajando para el Motor Pierre PRO <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
        </div>
    </div>
  );
}
