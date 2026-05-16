import React from "react";
import { ShieldCheck, Target, TrendingUp, CheckCircle2 } from "lucide-react";

interface PDFReportTemplateProps {
  lead: any;
}

export const PDFReportTemplate = React.forwardRef<HTMLDivElement, PDFReportTemplateProps>(({ lead }, ref) => {
  const approvedModules = lead.modules?.filter((m: any) => m.status === 'APPROVED') || [];

  return (
    <div 
      ref={ref}
      style={{ width: '210mm', minHeight: '297mm', background: 'white', color: '#1a1f2e' }}
      className="p-[20mm] font-sans relative"
    >
      {/* Cover Page */}
      <div className="h-[257mm] flex flex-col justify-between border-b-[2px] border-slate-900 pb-20">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h1 className="text-xl font-black uppercase tracking-[0.3em]">Employability OS</h1>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidential Executive Strategy</p>
            </div>
         </div>

         <div className="space-y-6">
            <p className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.4em]">Strategic Report v3.0</p>
            <h2 className="text-7xl font-black tracking-tighter leading-none">
               Employability <br />
               Architecture <br />
               <span className="text-slate-400">Briefing.</span>
            </h2>
            <div className="h-2 w-32 bg-slate-900" />
         </div>

         <div className="grid grid-cols-2 gap-20 border-t border-slate-100 pt-12">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prepared For</p>
               <p className="text-xl font-black">{lead.name}</p>
               <p className="text-sm font-bold text-slate-500">{lead.noc}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Date</p>
               <p className="text-sm font-bold">{new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
         </div>
      </div>

      {/* Table of Contents */}
      <div className="py-20 space-y-12 page-break-before">
         <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">00 / Structure</h3>
         <div className="space-y-4">
            {['Strategic Diagnosis', 'Market Positioning', 'Resume Strategy', 'LinkedIn Branding', 'Execution Roadmap'].map((item, idx) => (
               <div key={idx} className="flex items-end gap-4">
                  <span className="text-sm font-black uppercase tracking-widest">0{idx + 1}</span>
                  <span className="text-lg font-black">{item}</span>
                  <div className="flex-1 border-b border-dotted border-slate-200 mb-1" />
                  <span className="text-sm font-bold text-slate-400">P. {idx + 2}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Modules Content */}
      {approvedModules.map((m: any, idx: number) => (
         <div key={idx} className="py-20 space-y-10 page-break-before">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Module 0{idx + 1}</p>
                  <h3 className="text-3xl font-black uppercase tracking-tight">{m.agentName.replace(/([A-Z])/g, ' $1').trim()}</h3>
               </div>
               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <Target size={24} />
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2rem]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Strategic Recommendation</p>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                     <pre className="whitespace-pre-wrap font-sans text-sm font-medium">
                        {JSON.stringify(require('@/lib/ai/utils').sanitizeAIContent(m.content), null, 2)}
                     </pre>
                  </div>
               </div>
            </div>
         </div>
      ))}

      {/* Roadmap Page */}
      <div className="py-20 space-y-12 page-break-before">
         <div className="space-y-4">
            <h3 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.3em]">05 / Execution</h3>
            <h2 className="text-5xl font-black">Strategic Roadmap.</h2>
         </div>

         <div className="space-y-8">
            {[
               { w: '1-2', t: 'Market Repositioning', d: 'Alignment of digital footprints with target NOC requirements.' },
               { w: '3-4', t: 'Resume Architecture', d: 'Deployment of achievement-based narrative frameworks.' },
               { w: '5-8', t: 'Networking Outreach', d: 'Engagement with high-value hidden market contacts.' },
               { w: '9-12', t: 'Conversion & Closing', d: 'Technical interview mastery and salary negotiation.' }
            ].map((step, idx) => (
               <div key={idx} className="flex gap-8 group">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-white shrink-0">
                     <span className="text-[10px] font-black uppercase">Week</span>
                     <span className="text-xl font-black">{step.w}</span>
                  </div>
                  <div className="py-2 space-y-1">
                     <h4 className="text-lg font-black uppercase tracking-tight">{step.t}</h4>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.d}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Footer (On every page via relative positioning or simple repeat) */}
      <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
         <span>Employability OS • Proprietary Intelligence</span>
         <span>Confidential Strategy # {lead.id.slice(0, 8)}</span>
      </div>
    </div>
  );
});

PDFReportTemplate.displayName = "PDFReportTemplate";
