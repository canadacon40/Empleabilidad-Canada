import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, ClipboardCheck, MessagesSquare, Sparkles, Gift, Globe2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Enlaces y recursos | Empleabilidad Canadá",
  description: "Herramientas CAPI, diagnóstico profesional, estrategia de empleabilidad y preparación de entrevistas en Canadá.",
  alternates: { canonical: "https://www.canadacontrabajo.com/links" },
};

const actions = [
  { title: "CAPI · Herramientas con IA", detail: "Organiza y fortalece tu búsqueda de empleo", href: "https://www.canadacontrabajo.com/capi", icon: Sparkles, featured: true, external: false },
  { title: "Diagnóstico de empleabilidad", detail: "Evalúa tu perfil y define tus próximos pasos", href: "mailto:canadacon40@gmail.com?subject=Consulta%20-%20Diagn%C3%B3stico%20de%20empleabilidad", icon: ClipboardCheck, external: true },
  { title: "Diseño de estrategia de empleabilidad", detail: "Construye una ruta profesional para Canadá", href: "/#pricing", icon: BriefcaseBusiness, external: false },
  { title: "Preparación de entrevistas", detail: "Practica con preguntas reales y feedback profesional", href: "mailto:canadacon40@gmail.com?subject=Consulta%20-%20Preparaci%C3%B3n%20de%20entrevistas", icon: MessagesSquare, external: true },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-10 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-lg">
        <header className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-[#143d65] text-3xl font-black tracking-tight text-white shadow-lg shadow-slate-900/10" aria-hidden="true">EC</div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-[#24689a]">Empleabilidad Canadá</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Tu carrera en Canadá, con estrategia.</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">Herramientas, orientación profesional y preparación para avanzar en el mercado laboral canadiense.</p>
          <p className="mt-3 text-xs font-medium text-slate-500">Con Pierre · Estrategia de empleabilidad</p>
        </header>

        <section aria-label="Servicios y herramientas" className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const classes = `group flex min-h-[82px] items-center gap-4 rounded-2xl border px-4 py-4 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${action.featured ? "border-[#143d65] bg-[#143d65] text-white shadow-[#143d65]/15" : "border-slate-200 bg-white text-slate-900 hover:border-blue-300"}`;
            const inner = <><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.featured ? "bg-white/15" : "bg-blue-50 text-[#205d8c]"}`}><Icon size={22} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-[15px] font-bold leading-5">{action.title}</span><span className={`mt-1 block text-xs leading-5 ${action.featured ? "text-blue-100" : "text-slate-500"}`}>{action.detail}</span></span><ArrowUpRight className="h-5 w-5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true"/></>;
            return action.external || action.href.startsWith("https://") ? <a key={action.title} className={classes} href={action.href} {...(action.href.startsWith("https://") ? {target:"_blank",rel:"noopener noreferrer"} : {})}>{inner}</a> : <Link key={action.title} className={classes} href={action.href}>{inner}</Link>;
          })}
        </section>

        <section className="mt-7 rounded-2xl border border-dashed border-blue-200 bg-white/80 p-5">
          <div className="flex items-center gap-2"><Gift size={20} className="text-[#205d8c]" aria-hidden="true" /><h2 className="font-bold">Recursos gratuitos</h2></div>
          <p className="mt-2 text-sm leading-6 text-slate-600">Comienza por las herramientas disponibles de CAPI. Próximamente agregaremos guías y plantillas gratuitas.</p>
          <Link href="/capi" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#205d8c] hover:underline">Explorar CAPI <ChevronRight size={17} aria-hidden="true"/></Link>
        </section>

        <footer className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#205d8c] hover:underline"><Globe2 size={17} aria-hidden="true" /> Visitar canadacontrabajo.com</Link>
          <p className="mx-auto mt-5 max-w-sm text-[11px] leading-5 text-slate-500">Orientación de empleabilidad. No ofrecemos visas ni garantizamos contratación.</p>
        </footer>
      </div>
    </main>
  );
}
