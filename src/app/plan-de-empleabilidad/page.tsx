import { Metadata } from 'next'
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { employabilityModules } from "@/lib/modules-config"
import ModuleCard from "@/components/plan/ModuleCard"
import { LayoutDashboard, GraduationCap, TrendingUp, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: 'Plan de Empleabilidad | Pierre PRO',
  description: 'Acelera tu carrera profesional en Canadá con nuestro plan estratégico de 12 módulos.',
}

export default function PlanDeEmpleabilidad() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-20">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                <GraduationCap className="w-4 h-4" />
                Tu Hoja de Ruta al Éxito
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
                Plan de <span className="text-primary italic">Empleabilidad</span>
              </h1>
              <p className="text-slate-400 mt-4 text-lg max-w-2xl font-medium">
                12 módulos diseñados para transformar tu perfil profesional y dominar el mercado laboral canadiense.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-6 backdrop-blur-sm self-start sm:self-auto">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Progreso</span>
                <span className="text-2xl font-black text-white">0%</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nivel</span>
                <span className="text-2xl font-black text-primary uppercase">PRO</span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
             {[
               { icon: LayoutDashboard, label: "12 Módulos", value: "Completo" },
               { icon: TrendingUp, label: "Resultado", value: "Job Offer" },
               { icon: ShieldCheck, label: "Acceso", value: "De Por Vida" },
               { icon: GraduationCap, label: "Certificación", value: "Consultor" },
             ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                   <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="w-5 h-5" />
                   </div>
                   <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</div>
                    <div className="text-sm font-black text-white">{stat.value}</div>
                   </div>
                </div>
             ))}
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employabilityModules.map((module, index) => (
              <ModuleCard
                key={module.id}
                {...module}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
