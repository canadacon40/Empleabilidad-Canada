"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Activity, Zap, DollarSign, Target, AlertTriangle, RefreshCcw, ShieldCheck, TrendingUp, BarChart3 } from "lucide-react";

export default function CalibrationDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ops/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                   <ShieldCheck size={14} /> System Calibration & Audit
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Intelligence Performance</h1>
             </div>
             <button 
              onClick={fetchStats}
              className="h-12 px-6 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
             >
               <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Metrics
             </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard title="Avg Gen Time" value={`${(stats?.avgTime / 1000).toFixed(1)}s`} icon={Zap} color="indigo" />
            <StatCard title="Avg Token Cost" value={stats?.avgCost.toLocaleString()} icon={DollarSign} color="amber" />
            <StatCard title="Quality Index" value={`${(stats?.avgQuality * 10).toFixed(1)}%`} icon={Target} color="emerald" />
            <StatCard title="Stress Load" value={stats?.totalProcessed} icon={Activity} color="slate" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rejection & Regeneration Trends */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tight">Reliability Trends</h3>
                  <TrendingUp size={20} className="text-slate-300" />
               </div>
               <div className="space-y-6">
                  <MetricLine label="Regeneration Rate" value={stats?.regenerationRate} color="bg-amber-500" />
                  <MetricLine label="Rejection Rate" value={stats?.rejectionRate} color="bg-red-500" />
                  <MetricLine label="Hallucination Frequency" value={stats?.hallucinationRate} color="bg-indigo-500" />
               </div>
            </div>

            {/* Scalability Insights */}
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tight">Scalability Audit</h3>
                  <BarChart3 size={20} className="text-indigo-400" />
               </div>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Max Monthly Capacity</p>
                     <p className="text-2xl font-black">120 Clients</p>
                     <p className="text-[10px] text-slate-500 font-medium italic mt-1">Based on current human-in-the-loop audit time.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Unit Cost Estimate</p>
                     <p className="text-2xl font-black">$0.28 / Lead</p>
                     <p className="text-[10px] text-slate-500 font-medium italic mt-1">Includes all 9 modular generation steps.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-600 shadow-indigo-200",
    amber: "bg-amber-500 shadow-amber-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    slate: "bg-slate-900 shadow-slate-200"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function MetricLine({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{value?.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${Math.min(value || 0, 100)}%` }} 
        />
      </div>
    </div>
  );
}
