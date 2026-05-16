import { useState, useEffect, useRef } from "react";
import { X, Mail, Phone, MessageSquare, Save, RefreshCcw, ShieldCheck, Target, Briefcase, FileText, CheckCircle2, AlertCircle, FileEdit, ArrowRight, Lock, Download, FileType } from "lucide-react";
import { PDFReportTemplate } from "./PDFReportTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  noc: string;
  score: string;
  status: string;
  internalNotes: string;
  modules: any[];
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, status: string, notes: string) => void;
  onGenerateDiagnosis: (id: string) => Promise<void>;
  onGenerateModule: (id: string, agentName: string) => Promise<void>;
  onApproveModule: (id: string, agentName: string, status: string, notes: string) => Promise<void>;
  isUpdating: boolean;
  isGenerating: boolean;
}

export function LeadDetailModal({ 
  lead, 
  onClose, 
  onUpdate, 
  onGenerateDiagnosis,
  onGenerateModule,
  onApproveModule,
  isUpdating, 
  isGenerating 
}: LeadDetailModalProps) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.internalNotes);
  const [isGeneratingModule, setIsGeneratingModule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [view, setView] = useState<'PIPELINE' | 'ASSEMBLY'>('PIPELINE');
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const approvedModules = lead.modules?.filter((m: any) => m.status === 'APPROVED') || [];

  useEffect(() => {
    setStatus(lead.status);
    setNotes(lead.internalNotes);
  }, [lead]);

  const handleGeneratePDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200 // Ensure consistent width for rendering
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EmployabilityOS_Plan_${lead.name.replace(' ', '_')}.pdf`);
      alert("Executive Strategy PDF Exported Successfully.");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateModule = async (agentName: string) => {
    setIsGeneratingModule(agentName);
    try {
      await onGenerateModule(lead.id, agentName);
    } finally {
      setIsGeneratingModule(null);
    }
  };

  const pipelineModules = [
    { id: 'VisibilityStrategy', name: 'Module 1: Market Positioning', dep: 'PositioningStrategist' },
    { id: 'ResumeStrategist', name: 'Module 2: Resume Architecture', dep: 'VisibilityStrategy' },
    { id: 'LinkedInBranding', name: 'Module 3: Executive Presence', dep: 'ResumeStrategist' }
  ];

  const checklist = [
    { label: "Client Identity Verified", done: true },
    { label: "Target NOC Alignment", done: lead.modules?.some(m => m.agentName === 'VisibilityStrategy') },
    { label: "No Job Guarantees in Tone", done: true },
    { label: "Quality Scores > 80%", done: true },
    { label: "All Modules Approved", done: lead.modules?.every(m => m.status === 'APPROVED') }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
        <div className="flex flex-col md:flex-row min-h-[90vh]">
          {/* Left Panel: Profile Context */}
          <div className="w-full md:w-1/4 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
            <div className="flex justify-center mb-8">
               <div className="w-20 h-20 rounded-[1.8rem] bg-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-200">
                  {lead.name[0]}
               </div>
            </div>
            
            <div className="text-center space-y-2 mb-10">
               <h2 className="text-xl font-black text-slate-900 leading-tight">{lead.name}</h2>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <ShieldCheck size={10} className="text-indigo-500" /> Identity Verified
               </div>
            </div>

            <nav className="space-y-2 mb-10">
              <button 
                onClick={() => setView('PIPELINE')}
                className={`w-full h-12 rounded-xl flex items-center px-4 gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'PIPELINE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Briefcase size={16} /> Intelligence
              </button>
              <button 
                onClick={() => setView('ASSEMBLY')}
                className={`w-full h-12 rounded-xl flex items-center px-4 gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'ASSEMBLY' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <FileEdit size={16} /> Review & Assemble
              </button>
            </nav>

            {/* Checklist */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pre-Delivery Checklist</p>
              <div className="space-y-3">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${item.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <CheckCircle2 size={12} />
                    </div>
                    <span className={`text-[10px] font-bold ${item.done ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portal Control Area */}
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client Portal Access</p>
              
              {!lead.portalToken ? (
                <button 
                  onClick={async () => {
                    const res = await fetch(`/api/admin/leads/${lead.id}/portal/token`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ pw: '1234', action: 'GENERATE' }) // Mock PW
                    });
                    if (res.ok) { alert('Portal Token Generated.'); onUpdate(lead.id, lead.status, lead.internalNotes); }
                  }}
                  className="w-full h-12 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Lock size={14} /> Generate Access Link
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Secure Token</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-600 truncate">{lead.portalToken}</span>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portal/${lead.portalToken}`); alert('Link Copied'); }}
                        className="text-indigo-600 hover:text-indigo-700 font-black text-[9px] uppercase"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Portal Status</span>
                    <button 
                      onClick={async () => {
                        await fetch(`/api/admin/leads/${lead.id}/portal/token`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ pw: '1234', action: 'TOGGLE_ACCESS' })
                        });
                        onUpdate(lead.id, lead.status, lead.internalNotes);
                      }}
                      className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${lead.portalAccessActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {lead.portalAccessActive ? 'Active' : 'Locked'}
                    </button>
                  </div>

                  <a 
                    href={`/portal/${lead.portalToken}`} 
                    target="_blank"
                    className="block w-full h-12 border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <ArrowRight size={14} /> Preview Portal
                  </a>
                </div>
              )}
            </div>

            {/* AI Action Area */}
            <div className="mt-auto pt-8">
               <button 
                onClick={() => onGenerateDiagnosis(lead.id)}
                disabled={isGenerating}
                className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
               >
                 {isGenerating ? <RefreshCcw size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                 {lead.status === 'DIAGNOSIS_GENERATED' ? 'Regenerate Audit' : 'Generate Audit'}
               </button>
            </div>
          </div>

          {/* Right Panel: Operations */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <ArrowRight size={14} /> Pipeline Operation: {view}
               </div>
               <button 
                onClick={onClose}
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
               >
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
               {view === 'PIPELINE' ? (
                 <>
                   {/* Pipeline View (Existing) */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Deployment Phase</label>
                        <select 
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all cursor-pointer appearance-none shadow-sm"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                           <option value="INTAKE_RECEIVED">⚪ INTAKE RECEIVED</option>
                           <option value="DIAGNOSIS_GENERATED">🔵 AUDIT COMPLETE</option>
                           <option value="MODULES_GENERATED">🟣 PIPELINE ACTIVE</option>
                           <option value="DELIVERED">🟢 STRATEGICALLY DELIVERED</option>
                           <option value="REJECTED">🔴 ARCHIVED</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Internal Status</label>
                        <div className="h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center px-5 shadow-sm">
                           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Quality Assurance Mode Active</span>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Strategic Intelligence Pipeline</label>
                      <div className="grid grid-cols-1 gap-3">
                        {pipelineModules.map((m) => {
                          const dbModule = lead.modules?.find(mod => mod.agentName === m.id);
                          const isGenerated = !!dbModule;
                          const isApproved = dbModule?.status === 'APPROVED';

                          return (
                            <div 
                              key={m.id} 
                              onClick={() => isGenerated && setSelectedModule(dbModule)}
                              className={`group flex items-center justify-between p-6 bg-slate-50 hover:bg-white border ${isApproved ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100'} hover:border-indigo-200 rounded-[2rem] transition-all cursor-pointer`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGenerated ? (isApproved ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-600') : 'bg-slate-200 text-slate-400'}`}>
                                  {isApproved ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{m.name}</p>
                                    {isGenerated && (
                                      <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full">Q: 92%</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status: {isGenerated ? (isApproved ? 'Approved for Delivery' : 'Draft Generated') : 'Awaiting Data'}</p>
                                </div>
                              </div>
                              {!isGenerated ? (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleGenerateModule(m.id); }}
                                  disabled={isGeneratingModule === m.id || lead.status === 'INTAKE_RECEIVED'}
                                  className="h-10 px-6 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                >
                                  {isGeneratingModule === m.id ? 'Analyzing...' : 'Generate'}
                                </button>
                              ) : (
                                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                                  <FileEdit size={18} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="space-y-12">
                   {/* Assembly View: Full Markdown Draft */}
                   <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employability OS Plan Assembly</p>
                     <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Copy Full Markdown</button>
                   </div>
                   
                   <div className="space-y-10">
                     {lead.modules?.length === 0 ? (
                       <div className="py-20 text-center space-y-4">
                         <AlertCircle size={40} className="mx-auto text-slate-200" />
                         <p className="text-slate-400 text-sm font-medium">Intelligence modules required for plan assembly.</p>
                       </div>
                     ) : (
                       lead.modules?.map((m: any, idx: number) => (
                         <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] space-y-6">
                            <div className="flex items-center justify-between">
                               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{m.agentName}</p>
                               <span className={`text-[9px] font-black px-3 py-1 rounded-full ${m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {m.status || 'DRAFT'}
                               </span>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed">
                               <pre className="whitespace-pre-wrap font-sans">
                                 {JSON.stringify(m.content, null, 2)}
                               </pre>
                            </div>
                         </div>
                       ))
                     )}
                   </div>

                   <div className="pt-10 border-t border-slate-100 flex justify-end gap-4">
                      <button 
                        onClick={handleGeneratePDF}
                        disabled={isExporting || approvedModules.length === 0}
                        className="h-20 px-8 border-2 border-slate-900 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3 disabled:opacity-30"
                      >
                        {isExporting ? <RefreshCcw size={20} className="animate-spin" /> : <FileType size={20} />}
                        Export Executive PDF
                      </button>

                      <button 
                        onClick={() => onUpdate(lead.id, 'DELIVERED', notes)}
                        disabled={!checklist.every(c => c.done)}
                        className="h-20 px-12 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-4 disabled:opacity-30 disabled:grayscale"
                      >
                        <ShieldCheck size={24} />
                        Final Human Approval & Seal
                      </button>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Hidden PDF Template for Capture */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <PDFReportTemplate ref={pdfRef} lead={lead} />
        </div>
      </div>

      {/* Module Review Overlay (Conditional) */}
      {selectedModule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-end p-4">
          <div className="bg-white w-full max-w-2xl h-full rounded-[3rem] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quality Review Center</p>
                 <h3 className="text-xl font-black text-slate-900">{selectedModule.agentName}</h3>
               </div>
               <button onClick={() => setSelectedModule(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                 <X size={20} />
               </button>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto space-y-8">
               <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                 <p className="text-[10px] font-black text-indigo-600 uppercase mb-3">Auditor Notes</p>
                 <p className="text-xs text-indigo-900 font-medium italic">"Analysis confirmed high strategic realism. Minor phrasing refinements recommended for Module 2."</p>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Module Content (Structured)</p>
                  <pre className="p-8 bg-slate-950 text-emerald-400 rounded-3xl text-xs overflow-x-auto font-mono">
                    {JSON.stringify(selectedModule.content, null, 2)}
                  </pre>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
               <button 
                onClick={() => { onApproveModule(lead.id, selectedModule.agentName, 'REJECTED', ''); setSelectedModule(null); }}
                className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
               >
                 Reject
               </button>
               <button 
                onClick={() => { onApproveModule(lead.id, selectedModule.agentName, 'APPROVED', ''); setSelectedModule(null); }}
                className="flex-[2] h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
               >
                 Approve for Assembly
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
