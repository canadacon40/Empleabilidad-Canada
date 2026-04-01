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
  Briefcase,
  X,
  Save,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const updateLead = async (leadId: string, status: string, notes: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}?pw=${password}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNotes: notes })
      });
      if (res.ok) {
        await fetchLeads(); // Recargar datos
        setSelectedLead(null); // Cerrar modal
      } else {
        alert("Error al actualizar");
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.noc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONTACTED': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Contactado</span>;
      case 'CONVERTED': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Vendido</span>;
      case 'REJECTED': return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Descartado</span>;
      case 'EVALUATED': return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Evaluado</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Nuevo</span>;
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
               <Target className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Pierre Admin</h1>
            <p className="text-slate-500 text-sm mt-1 text-center">Gestión Profesional de Candidatos Seleccionados.</p>
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
              Acceso CRM Pierre
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
               <Target className="text-white w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-black italic tracking-tight">PIERRE <span className="text-slate-400 not-italic font-light">CRM</span></h1>
               <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Conexión en Vivo @ Vercel
               </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={fetchLeads}
                className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all text-slate-600"
             >
                <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
             </button>
             <button 
                onClick={() => setIsAuthorized(false)}
                className="h-12 px-6 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all text-xs font-bold uppercase tracking-widest"
             >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
             </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-slate-900 transition-all cursor-default">
             <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <Users className="w-5 h-5" />
             </div>
             <div className="text-2xl font-black">{leads.length}</div>
             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Total Prospectos</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-emerald-500 transition-all cursor-default">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <CheckCircle className="w-5 h-5" />
             </div>
             <div className="text-2xl font-black">
                {leads.filter(l => l.score === 'HIGH').length}
             </div>
             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Candidatos Élite</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-500 transition-all cursor-default">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Clock className="w-5 h-5" />
             </div>
             <div className="text-2xl font-black">
                {leads.filter(l => l.status === 'NEW').length}
             </div>
             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Por Gestión</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ring-2 ring-slate-900/5">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
             </div>
             <input 
                  type="text" 
                  placeholder="Buscar Lead..."
                  className="w-full text-base font-bold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-300 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Filtro en Tiempo Real</div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Candidato / Contacto</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NOC / Cargo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pierre Score</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado CRM</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="font-black text-slate-900 tracking-tight text-lg">{lead.name}</span>
                          <div className="flex items-center gap-4 mt-1">
                             <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                <Mail className="w-3.5 h-3.5" />
                                {lead.email}
                             </div>
                             <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                                <Phone className="w-3.5 h-3.5" />
                                {lead.phone}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-slate-300 rounded-full" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{lead.noc}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`
                          px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest
                          ${lead.score === 'HIGH' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            lead.score === 'MID' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                            'bg-slate-100 text-slate-500 border border-slate-200'}
                       `}>
                          {lead.score}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                       <div className="flex flex-col items-center opacity-30">
                          <AlertCircle className="w-12 h-12 mb-4" />
                          <p className="text-xl font-black uppercase tracking-widest">Sin Prospectos Activos</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
               {/* Modal Header */}
               <div className="px-8 py-8 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                  <div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 block">Gestión de Candidato</span>
                     <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedLead.name}</h2>
                     <div className="flex gap-4 mt-2">
                        <a href={`mailto:${selectedLead.email}`} className="text-slate-500 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-bold">
                           <Mail className="w-4 h-4" /> {selectedLead.email}
                        </a>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 flex items-center gap-1.5 text-xs font-bold">
                           <Phone className="w-4 h-4" /> {selectedLead.phone}
                        </span>
                     </div>
                  </div>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Estado de Gestión</label>
                        <select 
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all cursor-pointer"
                          value={selectedLead.status}
                          onChange={(e) => setSelectedLead({...selectedLead, status: e.target.value})}
                        >
                           <option value="NEW">🆕 NUEVO PROSPECTO</option>
                           <option value="CONTACTED">📞 YA CONTACTADO</option>
                           <option value="EVALUATED">🔍 EVALUACIÓN EN CURSO</option>
                           <option value="CONVERTED">👑 CLIENTE VENDIDO</option>
                           <option value="REJECTED">❌ DESCARTADO / NO APTO</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Resumen Pierre</label>
                        <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center px-4">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${selectedLead.score === 'HIGH' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              PERFIL {selectedLead.score} • {selectedLead.noc}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="mb-8">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex justify-between items-center">
                        <span>Notas Internas de Agente</span>
                        <MessageSquare className="w-3.5 h-3.5" />
                     </label>
                     <textarea 
                        placeholder="Escribe aquí los detalles de la última interacción..."
                        className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                        value={selectedLead.internalNotes}
                        onChange={(e) => setSelectedLead({...selectedLead, internalNotes: e.target.value})}
                     />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                     <button 
                        onClick={() => updateLead(selectedLead.id, selectedLead.status, selectedLead.internalNotes)}
                        disabled={isUpdating}
                        className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {isUpdating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Guardar Gestión
                     </button>
                     <a 
                        href={`mailto:${selectedLead.email}?subject=Seguimiento a tu Reporte de Empleabilidad - Pierre&body=Hola ${selectedLead.name}, revisamos tu reporte de Pierre y nos gustaría ayudarte con tu perfil de ${selectedLead.noc}...`}
                        className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all shadow-sm group"
                        title="Enviar Correo de Seguimiento"
                     >
                        <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                     </a>
                  </div>
               </div>
            </div>
          </div>
        )}
        
        {/* Footer info */}
        <p className="mt-8 text-center text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em]">
           Pierre Dashboard CRM v1.1 • Misión: Canadá con Trabajo
        </p>
      </div>
    </div>
  );
}
