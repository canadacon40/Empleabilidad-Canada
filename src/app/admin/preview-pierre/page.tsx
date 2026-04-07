import prisma from "@/lib/db";
import EbookRoadmap from "@/components/plan/EbookRoadmap";
import { 
  Users, 
  MapPin, 
  Mail, 
  ChevronRight, 
  Search, 
  Zap, 
  FileText, 
  Layers 
} from "lucide-react";
import Link from "next/link";

interface PreviewPageProps {
    searchParams: { leadId?: string; mId?: string };
}

export default async function PierrePreviewPage({ searchParams }: PreviewPageProps) {
  const selectedLeadId = searchParams.leadId;
  const selectedModuleId = searchParams.mId || "m0";

  // 1. Fetch all leads with plans
  const leadsWithPlans = await (prisma.lead as any).findMany({
    where: { personalizedPlan: { isNot: null } },
    include: {
      user: true,
      personalizedPlan: true,
    },
    orderBy: { createdAt: "desc" },
  }) as any[];

  console.log("DEBUG: leadsWithPlans count:", leadsWithPlans.length);
  if (leadsWithPlans.length > 0) {
    console.log("DEBUG: first lead formData sample:", JSON.stringify(leadsWithPlans[0].formData).substring(0, 200));
  }

  const currentLead = leadsWithPlans.find(l => l.id === selectedLeadId) || leadsWithPlans[0];
  const currentPlan = currentLead?.personalizedPlan?.modules as any;
  const currentModuleData = currentPlan?.[selectedModuleId];

  // Helper to extract a title from config if possible
  const moduleTitles: Record<string, string> = {
    m0: "Diagnóstico de Brecha",
    m1: "Bases Estratégicas",
    m2: "Análisis de Mercado",
    m3: "Ejecución Táctica",
    m4: "Networking de Élite",
    m5: "Optimización de LinkedIn",
    m6: "Dominio de Entrevistas",
    // ... add more as needed
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30">
      {/* Top Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-3 px-8 text-center flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pierre Engine Admin Preview v1.0</span>
          </div>
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Volver al Admin</Link>
      </div>

      <div className="flex h-[calc(100-50px)]">
        {/* Sidebar: Lead Selector */}
        <aside className="w-96 border-r border-white/5 bg-slate-900/50 backdrop-blur-3xl overflow-y-auto p-8 space-y-8 flex flex-col">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <Users className="w-5 h-5 text-primary" />
               <h2 className="text-xl font-black text-white uppercase tracking-tighter">Leads Activos</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">Selecciona un perfil para auditar su plan de Pierre.</p>
          </div>

          <div className="space-y-4 flex-1">
            {leadsWithPlans.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-sm text-slate-600 font-bold italic">No hay planes generados aún.</p>
                </div>
            ) : leadsWithPlans.map((lead) => (
              <Link 
                key={lead.id}
                href={`?leadId=${lead.id}&mId=${selectedModuleId}`}
                className={`block group p-6 rounded-[2rem] border transition-all duration-300 ${
                  lead.id === currentLead?.id 
                    ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/10 scale-[1.02]" 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-black uppercase tracking-tight ${lead.id === currentLead?.id ? "text-primary" : "text-white"}`}>
                        {lead.user?.name || "Lead Anónimo"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">{lead.user?.email}</p>
                    </div>
                    {lead.id === currentLead?.id && <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />}
                  </div>
                  
                  <div className="flex gap-4 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 grayscale opacity-50">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase truncate max-w-[80px]">
                          {typeof (lead.formData as any)?.status === 'string' ? (lead.formData as any).status : 
                           typeof (lead.formData as any)?.province === 'string' ? (lead.formData as any).province : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 grayscale opacity-50">
                        <Layers className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase">
                          {Object.keys((lead.personalizedPlan?.modules as any) || {}).length} Módulos
                        </span>
                      </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Area: Module Viewer */}
        <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-transparent to-transparent">
          {currentLead ? (
            <div className="max-w-5xl mx-auto space-y-12">
               {/* Module Navigation Tabs */}
               <div className="flex flex-wrap gap-3 mb-16 p-2 bg-white/5 rounded-[2.5rem] border border-white/10 max-w-fit">
                    {["m0", "m1", "m2", "m3", "m4", "m5", "m6"].map((mId) => {
                        const isAvailable = !!currentPlan?.[mId];
                        return (
                            <Link
                                key={mId}
                                href={`?leadId=${currentLead.id}&mId=${mId}`}
                                className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                    selectedModuleId === mId 
                                        ? "bg-primary text-slate-950 shadow-xl shadow-primary/20 scale-105" 
                                        : isAvailable 
                                            ? "text-slate-200 hover:bg-white/5" 
                                            : "opacity-30 pointer-events-none grayscale"
                                }`}
                            >
                                {mId.toUpperCase()} {isAvailable ? "✓" : ""}
                            </Link>
                        );
                    })}
               </div>

               {/* Content Rendering */}
               {currentModuleData ? (
                   <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <EbookRoadmap 
                            data={currentModuleData} 
                            currentModuleId={selectedModuleId}
                            userEmail={currentLead.user?.email || "Lead Anónimo"}
                            userName={currentLead.user?.name || "Lead Anónimo"}
                        />
                   </div>
               ) : (
                   <div className="py-40 text-center space-y-6 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                            <FileText className="w-10 h-10 text-slate-700" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Módulo No Generado</h3>
                           <p className="text-slate-500 max-w-md mx-auto italic font-medium">Este usuario aún no tiene el contenido de este bloque. Puedes activarlo manualmente o esperar el activador de Tally.</p>
                        </div>
                   </div>
               )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-6">
                <Users className="w-16 h-16 text-slate-800 mx-auto" />
                <h3 className="text-2xl font-black text-slate-700 uppercase tracking-widest">Selecciona un Lead para empezar</h3>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
