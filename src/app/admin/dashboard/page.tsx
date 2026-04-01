"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  Target, 
  TrendingUp, 
  Search, 
  RefreshCcw, 
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "1234")) {
      setIsAuthorized(true);
      fetchLeads();
    } else {
      setError("Password incorrecto. Pierre te vigila.");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?pw=${password}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Error cargando leads");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.noc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
               <Target className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Pierre Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Ingresa para ver tus diamantes en bruto.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Contraseña Maestra"
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-rose-500 text-xs font-bold px-1">{error}</p>}
            <button 
              type="submit"
              className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
            >
              Desbloquear Leads
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Dashboard
            </div>
            <h1 className="text-4xl font-black">Tu Radar de Leads</h1>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={fetchLeads}
                className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all"
             >
                <RefreshCcw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
             </button>
             <button 
                onClick={() => setIsAuthorized(false)}
                className="h-12 px-6 bg-slate-900 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all text-xs font-bold uppercase"
             >
                <LogOut className="w-4 h-4" />
                Salir
             </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
             </div>
             <div className="text-2xl font-black">{leads.length}</div>
             <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Leads</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5" />
             </div>
             <div className="text-2xl font-black">
                {leads.filter(l => l.score === 'HIGH').length}
             </div>
             <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Perfil Alto</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
             </div>
             <div className="text-2xl font-black">
                {Math.round((leads.filter(l => l.score === 'HIGH').length / (leads.length || 1)) * 100)}%
             </div>
             <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Calidad Promedio</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
             </div>
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar..."
                  className="w-full text-sm font-bold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Filtrar Leads</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-200">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Lead / Contacto</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">NOC / Cargo</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Pierre Score</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{lead.name}</span>
                        <div className="flex items-center gap-4 mt-1">
                           <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                           </div>
                           <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                           </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{lead.noc}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`
                        px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${lead.score === 'HIGH' ? 'bg-emerald-100 text-emerald-700' : 
                          lead.score === 'MID' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}
                     `}>
                        {lead.score}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-xs font-medium text-slate-400">
                        {format(new Date(lead.date), 'dd MMM, HH:mm')}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     <button className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                     Nadie ha subido su CV todavía... Hay que prender el tráfico.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">
           Pierre Dashboard v1.0 • Acceso Exclusivo • Encriptado de Punto a Punto
        </p>
      </div>
    </div>
  );
}
