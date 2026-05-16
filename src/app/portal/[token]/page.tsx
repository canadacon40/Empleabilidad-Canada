import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { ShieldCheck, Target, TrendingUp, Calendar, Lock, Download, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default async function ClientPortalPage({ params }: { params: { token: string } }) {
  const { token } = params;

  // Use Mock Data if DB is missing or token is 'demo'
  const isMock = process.env.USE_MOCK_DATA === "true" || token === "demo";
  
  let lead: any;

  if (isMock) {
    lead = {
      name: "Alex Sterling",
      noc: "2173 - Software Engineer",
      portalAccessActive: true,
      scores: [
        { category: 'ATS_READINESS', value: 85, justification: "Core technical keywords are present, but structural logic needs refinement." },
        { category: 'POSITIONING_CLARITY', value: 92, justification: "UVP is strongly aligned with senior-level architecture roles." }
      ],
      modules: [
        { agentName: 'VisibilityStrategy', status: 'APPROVED', content: { strategy: "Strategic Canadian Market Repositioning", actions: ["Optimize LinkedIn for North American search intent", "Reframe international experience as cultural leverage"] } },
        { agentName: 'ResumeStrategist', status: 'APPROVED', content: { strategy: "Executive Impact Architecture", summary: "Shifting from duty-based to achievement-based narrative." } }
      ]
    };
  } else {
    lead = await prisma.lead.findUnique({
      where: { portalToken: token },
      include: {
        scores: true,
        modules: {
          where: { status: 'APPROVED' }
        }
      }
    });

    if (!lead || !lead.portalAccessActive) {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Premium Navigation */}
      <nav className="h-24 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
               <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black text-white uppercase tracking-[0.2em]">EmployabilityOS</span>
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Executive Delivery Portal</span>
            </div>
         </div>
         <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <Lock size={12} className="text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Channel Active</span>
            </div>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 md:p-12 lg:p-16 space-y-16">
         {/* Hero Briefing */}
         <section className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
               <Target size={12} /> Strategic Briefing
            </div>
            <div className="space-y-2">
               <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Welcome, {lead.name}</h1>
               <p className="text-lg text-slate-400 font-medium max-w-2xl leading-relaxed">
                  Your strategic employability roadmap is now active. This document outlines the surgical adjustments required to secure your target position in the Canadian market.
               </p>
            </div>
         </section>

         {/* Scores Grid */}
         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lead.scores?.map((s: any, idx: number) => (
               <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{s.category.replace('_', ' ')}</p>
                  <div className="flex items-end gap-2 mb-4">
                     <span className="text-4xl font-black text-white">{s.value}</span>
                     <span className="text-sm font-bold text-slate-500 mb-1">/100</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.value}%` }} />
                  </div>
               </div>
            ))}
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content: Approved Modules */}
            <div className="lg:col-span-2 space-y-12">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                     <ShieldCheck size={20} className="text-indigo-500" /> Approved Strategy Modules
                  </h2>
               </div>

               <div className="space-y-6">
                  {lead.modules?.map((m: any, idx: number) => (
                     <div key={idx} className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 hover:bg-white/[0.07] transition-all">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Phase 0{idx + 1}</p>
                              <h3 className="text-2xl font-black text-white">{m.agentName.replace(/([A-Z])/g, ' $1').trim()}</h3>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                              <CheckCircle2 size={24} />
                           </div>
                        </div>
                        <div className="prose prose-invert max-w-none">
                           <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-sm">
                              {JSON.stringify(require('@/lib/ai/utils').sanitizeAIContent(m.content), null, 2)}
                           </pre>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Sidebar: Roadmap & Actions */}
            <div className="space-y-12">
               {/* 12-Week Roadmap */}
               <div className="bg-indigo-600 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl shadow-indigo-500/20">
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                     <TrendingUp size={20} /> 12-Week Roadmap
                  </h3>
                  <div className="space-y-6">
                     <RoadmapStep week="1-2" label="Market Repositioning" done />
                     <RoadmapStep week="3-4" label="Resume Architecture" done />
                     <RoadmapStep week="5-8" label="Outreach Execution" />
                     <RoadmapStep week="9-12" label="Interview Mastery" />
                  </div>
               </div>

               {/* Download Area */}
               <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3 text-white">
                     <Download size={20} /> Strategy Exports
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Approved assets will appear here as they are finalized.</p>
                  <div className="grid grid-cols-1 gap-3">
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 opacity-50 cursor-not-allowed">
                        <span className="text-[10px] font-black text-white uppercase">Full Strategic Plan (PDF)</span>
                        <Lock size={14} />
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 opacity-50 cursor-not-allowed">
                        <span className="text-[10px] font-black text-white uppercase">Resume Template (DOCX)</span>
                        <Lock size={14} />
                     </div>
                  </div>
               </div>

               {/* Support Brief */}
               <div className="p-8 border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-[2.5rem] space-y-4">
                  <div className="flex items-center gap-3 text-white">
                     <AlertCircle size={20} className="text-indigo-400" />
                     <span className="text-sm font-black uppercase tracking-tight">Need Support?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                     Your strategist is monitoring your execution. If you encounter specific hurdles, use the established communication channel.
                  </p>
                  <button className="w-full h-12 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                     Open Advisor Channel
                  </button>
               </div>
            </div>
         </div>
      </main>

      <footer className="p-12 border-t border-white/5 text-center">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            © 2026 EmployabilityOS • Confidential Executive Property
         </p>
      </footer>
    </div>
  );
}

function RoadmapStep({ week, label, done = false }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-1 w-2 h-2 rounded-full ${done ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-white/30'}`} />
      <div className="space-y-1">
        <p className={`text-[10px] font-black uppercase tracking-widest ${done ? 'text-emerald-400' : 'text-white/50'}`}>Week {week}</p>
        <p className={`text-sm font-bold ${done ? 'text-white' : 'text-white/70'}`}>{label}</p>
      </div>
    </div>
  );
}
