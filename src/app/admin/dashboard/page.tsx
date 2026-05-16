"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight
} from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { StatCard } from "@/components/admin/StatCard";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";

const MOCK_LEADS = [
  {
    id: "1",
    name: "Alexander Vance",
    email: "a.vance@techcorp.io",
    phone: "+1 (555) 012-3456",
    noc: "Software Engineer (2173)",
    score: "HIGH",
    status: "INTAKE_RECEIVED",
    internalNotes: "Strong background in cloud architecture. Ready for immediate relocation.",
    date: new Date().toISOString()
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    email: "elena.rod@globaltalent.com",
    phone: "+1 (555) 987-6543",
    noc: "Marketing Manager (0124)",
    score: "MID",
    status: "DIAGNOSIS_GENERATED",
    internalNotes: "Excellent portfolio. Needs to improve French score.",
    date: new Date().toISOString()
  },
  {
    id: "3",
    name: "Marcus Thorne",
    email: "m.thorne@heavyindustries.uk",
    phone: "+44 20 7123 4567",
    noc: "Mechanical Engineer (2132)",
    score: "HIGH",
    status: "MODULES_GENERATED",
    internalNotes: "Top tier candidate. Multiple patent holder.",
    date: new Date().toISOString()
  },
  {
    id: "4",
    name: "Sarah Jenkins",
    email: "s.jenkins@healthfirst.ca",
    phone: "+1 (416) 555-0987",
    noc: "Registered Nurse (3012)",
    score: "HIGH",
    status: "DELIVERED",
    internalNotes: "Onboarding complete.",
    date: new Date().toISOString()
  }
];

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = async (pw: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/leads?pw=${pw}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
        setIsMockMode(data.isMock);
        setIsAuthorized(true);
      } else {
        setError("Authorization denied. Access logged.");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setError("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDiagnosis = async (id: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/admin/leads/${id}/generate-diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: password })
      });
      
      if (response.ok) {
        alert("AI Diagnostic layer successfully generated. Refreshing intelligence feed...");
        await fetchLeads(password);
      } else {
        const err = await response.json();
        alert(`Generation Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Diagnosis error:", error);
      alert("Intelligence Pipeline Timeout.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateModule = async (id: string, agentName: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}/generate-module`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: password, agentName })
      });
      
      if (response.ok) {
        alert(`${agentName} successfully architected. Pipeline advancing.`);
        await fetchLeads(password);
      } else {
        const err = await response.json();
        alert(`Pipeline Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Module generation error:", error);
      alert("Orchestrator Timeout.");
    }
  };

  const handleApproveModule = async (id: string, agentName: string, status: string, notes: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}/modules/${agentName}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: password, status, notes })
      });
      
      if (response.ok) {
        alert(`Module ${agentName} status updated to ${status}.`);
        await fetchLeads(password);
      } else {
        const err = await response.json();
        alert(`Approval Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Module approval error:", error);
      alert("Orchestrator Timeout during approval.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(password);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.noc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateLead = async (leadId: string, status: string, notes: string) => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status, internalNotes: notes } : l));
      setIsUpdating(false);
      setSelectedLead(null);
    }, 800);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-12 shadow-2xl">
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 group hover:scale-110 transition-transform">
                 <ShieldCheck className="text-white w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Employability<span className="text-indigo-400">OS</span></h1>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-[0.3em]">Central Intelligence Access</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="Master Cryptographic Key"
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-14 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}
              <button 
                type="submit"
                className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
              >
                Establish Secure Connection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
          <p className="mt-8 text-center text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">
            Authorized Personnel Only • IP Logged: 192.168.1.1
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        {isMockMode && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <p className="text-amber-800 text-sm font-semibold">
                OFFLINE MODE: Using mock data repository. Database connection not established.
              </p>
            </div>
            <button 
              onClick={() => fetchLeads(password)}
              className="text-amber-700 text-xs font-bold uppercase tracking-wider hover:underline"
            >
              Retry Connection
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onRefresh={() => {}} 
            isLoading={loading} 
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <StatCard 
              title="Talent Pool" 
              value={leads.length} 
              icon={Users} 
              trend="+12% this week" 
              trendUp={true}
              color="indigo"
            />
            <StatCard 
              title="Strategic Elite" 
              value={leads.filter(l => l.score === 'HIGH').length} 
              icon={Target} 
              trend="Top 5%" 
              trendUp={true}
              color="emerald"
            />
            <StatCard 
              title="Audit Pipeline" 
              value={leads.filter(l => l.status === 'NEW').length} 
              icon={Cpu} 
              trend="Processing" 
              color="blue"
            />
            <StatCard 
              title="Market Velocity" 
              value="84.2%" 
              icon={TrendingUp} 
              trend="+2.1%" 
              trendUp={true}
              color="amber"
            />
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Live Recruitment Feed</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">View:</span>
                <button className="text-[10px] font-black text-indigo-600 uppercase border-b-2 border-indigo-600 pb-0.5">Table</button>
                <button className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-600 transition-colors pb-0.5">Grid</button>
              </div>
            </div>
            
            <LeadTable 
              leads={filteredLeads} 
              onSelectLead={setSelectedLead} 
            />

            {filteredLeads.length === 0 && (
              <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-300 p-32 text-center">
                <div className="flex flex-col items-center max-w-xs mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
                    <Target size={32} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">No Candidates Found</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    The intelligence system couldn't find any profiles matching your current search parameters.
                  </p>
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg"
                  >
                    Clear Filter Protocols
                  </button>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-20 pt-10 border-t border-slate-200 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              EmployabilityOS Intelligence Unit • Secure Node 01
            </p>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold text-slate-400">Status: Operational</span>
              <span className="text-[10px] font-bold text-slate-400">Region: North America</span>
            </div>
          </footer>
        </div>
      </main>

      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={updateLead} 
          onGenerateDiagnosis={handleGenerateDiagnosis}
          onGenerateModule={handleGenerateModule}
          onApproveModule={handleApproveModule}
          isUpdating={isUpdating} 
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
}
