import { Metadata } from 'next'
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { employabilityModules } from "@/lib/modules-config"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Play, Zap, CheckCircle2, ChevronRight, Lock, Target, ShieldCheck, Sparkles } from "lucide-react"
import ModuleContent from "@/components/sections/ModuleContent"
import DeepPersonalizedContent from "@/components/plan/DeepPersonalizedContent"
import PlanGeneratorTrigger from "@/components/plan/PlanGeneratorTrigger"

import { auth } from "@/auth"
import prisma from "@/lib/db"

interface PageProps {
  params: { moduleId: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const module = employabilityModules.find(m => m.id === params.moduleId)
  return {
    title: `${module?.title || 'Módulo'} | Plan de Empleabilidad`,
    description: module?.description
  }
}

export default async function ModulePage({ params }: PageProps) {
  const session = await auth()
  const moduleIndex = employabilityModules.findIndex(m => m.id === params.moduleId)
  const module = employabilityModules[moduleIndex]

  if (!module) notFound()

  // 1. Fetch Personalized Plan for the user
  let personalizedAdvice = null
  let leadId = null
  
  if (session?.user?.email) {
    const lead = await (prisma.lead as any).findFirst({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: 'desc' },
      include: { personalizedPlan: true }
    })
    
    if (lead) {
      leadId = lead.id
      if (lead.personalizedPlan) {
        const planModules = (lead as any).personalizedPlan.modules as any
        personalizedAdvice = planModules[params.moduleId]
      }
    }
  }

  const prevModule = moduleIndex > 0 ? employabilityModules[moduleIndex - 1] : null
  const nextModule = employabilityModules[moduleIndex + 1]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <div className="flex-1">
            <Link 
              href="/plan-de-empleabilidad"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold text-sm tracking-widest group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              DASHBOARD DEL PLAN
            </Link>

            <div className="mb-10">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                <Target className="w-4 h-4" />
                {module.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
                {module.title}
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed max-w-4xl font-medium">
                {module.description}
              </p>
            </div>

            {/* Premium Video Container */}
            <div className="aspect-video bg-slate-900 border border-white/5 rounded-[3rem] relative overflow-hidden group mb-16 shadow-2xl shadow-primary/5 ring-1 ring-white/10">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50" />
               
               {/* Video Overlay Info */}
               <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">Video Tutorial</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{module.duration}</span>
                  </div>
               </div>

               <div className="z-10 text-center relative h-full flex flex-col items-center justify-center p-8">
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-8 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                    <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 backdrop-blur-sm group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 relative">
                      <Play className="w-10 h-10 fill-current translate-x-1" />
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <h4 className="text-white font-black text-sm tracking-widest uppercase opacity-40">Procesando Video en Alta Definición</h4>
                    <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto italic">
                      Estamos renderizando la versión final de esta lección estratégica para tu perfil.
                    </p>
                  </div>
               </div>

               {/* Video Progress Bar Mock */}
               <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                  <div className="w-[15%] h-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
               </div>
            </div>

            {/* Strategic Content Renderer */}
            <div className="mb-16 space-y-16">
              {/* Personalized Section for PR0 */}
              {personalizedAdvice ? (
                <DeepPersonalizedContent 
                  data={personalizedAdvice} 
                  moduleTitle={module.title}
                />
              ) : leadId ? (
                <PlanGeneratorTrigger 
                  leadId={leadId} 
                  moduleId={params.moduleId} 
                  moduleTitle={module.title} 
                />
              ) : (
                <div className="p-12 rounded-[4rem] bg-white/5 border border-white/10 text-center space-y-8 group">
                   <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Lock className="w-8 h-8 text-primary" />
                   </div>
                   <div className="max-w-md mx-auto space-y-4">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Contenido Bloqueado</h3>
                      <p className="text-slate-500 font-medium leading-relaxed italic">
                        "Este módulo incluye una hoja de ruta 100% personalizada por Pierre basada en tu perfil real. Identifícate para desbloquearla."
                      </p>
                      <Link 
                        href="/login"
                        className="inline-flex h-12 items-center px-8 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all"
                      >
                        INICIAR SESIÓN
                      </Link>
                   </div>
                </div>
              )}

              <div className="pt-20 border-t border-white/5 text-center">
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] mb-12">Principios Estratégicos del Módulo</p>
                 <ModuleContent 
                   objectives={module.objectives}
                   keyTakeaways={module.keyTakeaways}
                 />
              </div>
            </div>

            {/* Action Card (PRO Integration) */}
            {module.proToolLink && (
              <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 overflow-hidden mb-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 flex-shrink-0 animate-bounce-slow">
                    <Zap className="w-12 h-12" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-black text-white mb-3">
                      Lleva la Teoría a la <span className="text-primary italic">Acción</span>
                    </h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                      Para completar este módulo, debes utilizar el <span className="text-white font-bold underline decoration-primary/30 underline-offset-4">Radar de Empleo</span> para aplicar los conceptos aprendidos a tu búsqueda real.
                    </p>
                  </div>
                  <Link 
                    href={module.proToolLink}
                    className="group relative px-10 py-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl shadow-primary/30 flex items-center gap-3"
                  >
                    ACCEDER AHORA
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}

            {/* Next Step Navigation */}
            <div className="flex items-center justify-between border-t border-white/10 pt-16 mt-16">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 mb-3 block">Anterior</span>
                  {prevModule ? (
                    <Link 
                      href={`/plan-de-empleabilidad/${prevModule.id}`}
                      className="text-slate-400 font-black text-lg flex items-center gap-2 hover:text-white transition-all group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      {prevModule.title}
                    </Link>
                  ) : (
                    <span className="text-slate-700 font-black text-sm italic">Primer Módulo</span>
                  )}
               </div>
               
               {nextModule ? (
                 <Link 
                    href={`/plan-de-empleabilidad/${nextModule.id}`}
                    className="flex flex-col items-end group"
                 >
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-primary mb-3 block">Siguiente Módulo</span>
                    <span className="text-white font-black text-2xl md:text-3xl flex items-center gap-3 group-hover:text-primary transition-all tracking-tighter">
                      {nextModule.title}
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                    </span>
                 </Link>
               ) : (
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-green-500 mb-3 block">Ruta Completada</span>
                    <span className="text-white font-black text-2xl flex items-center gap-3 opacity-60">
                       ¡Dominio Total!
                       <ShieldCheck className="w-8 h-8 text-green-500" />
                    </span>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar Modules List - Desktop */}
          <aside className="hidden lg:block w-96 flex-shrink-0">
             <div className="sticky top-32 p-8 rounded-[3rem] bg-slate-950 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10">
                    <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs">Curriculum del Éxito</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Nivel: Profesional Senior</p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {employabilityModules.map((m, idx) => (
                      <Link 
                        key={m.id}
                        href={`/plan-de-empleabilidad/${m.id}`}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden ${
                          m.id === params.moduleId 
                            ? "bg-primary/10 border border-primary/20 text-white" 
                            : "hover:bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent"
                        }`}
                      >
                         {m.id === params.moduleId && (
                           <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                         )}
                         <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black border transition-colors ${
                            m.id === params.moduleId 
                               ? "bg-primary border-primary/20 text-white" 
                               : "bg-white/5 border-white/10 text-slate-600 group-hover:text-slate-400"
                         }`}>
                           {idx + 1}
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 mb-0.5">{m.category}</span>
                           <span className="text-xs font-black truncate">{m.title}</span>
                         </div>
                         {m.id !== params.moduleId && <Lock className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-600" />}
                      </Link>
                   ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                   <div className="bg-primary/5 p-4 rounded-[2rem] border border-primary/10">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Estado del Plan</span>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
                         <div className="bg-primary h-full rounded-full" style={{ width: `${Math.round(((moduleIndex + 1) / employabilityModules.length) * 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                         <span>Módulo {moduleIndex + 1} de {employabilityModules.length}</span>
                         <span>{Math.round(((moduleIndex + 1) / employabilityModules.length) * 100)}%</span>
                      </div>
                   </div>
                </div>
             </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  )
}
