'use client'

import React, { useState, useEffect } from 'react';
import { User, Phone, MessageSquare, AlertTriangle, TrendingUp, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminLeadsDashboard() {
  const [leads, setLeads] = useState<any[]>([]);

  // Simulación de carga de datos para el demo
  useEffect(() => {
    setLeads([
      { id: 1, name: "Juan Perez", phone: "+1 555 1234", status: "REQUIRES_HUMAN", offer: "Mentoría VIP", diagnosis: "Ingeniero Civil, 15 años exp, Inglés Básico." },
      { id: 2, name: "Maria Garcia", phone: "+52 1 444 5555", status: "AI_NURTURING", offer: "Puente Inglés $19", diagnosis: "Limpieza, Recién llegada, Sin inglés." },
      { id: 3, name: "Carlos Ruiz", phone: "+1 604 777 8888", status: "NEW", offer: "Radar PRO", diagnosis: "IT Senior, Fuera de Canadá, Buscando patrocinio." },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Centro de Comando: <span className="text-emerald-600">Leads WhatsApp</span></h1>
          <p className="text-slate-500">Monitorea las ventas automatizadas por la IA.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-900">Conversión: 12%</span>
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        {leads.map((lead) => (
          <div key={lead.id} className={`bg-white rounded-3xl border p-6 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all hover:shadow-lg ${lead.status === 'REQUIRES_HUMAN' ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'}`}>
            
            {/* Status Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${lead.status === 'REQUIRES_HUMAN' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              {lead.status === 'REQUIRES_HUMAN' ? <AlertTriangle className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-slate-900">{lead.name}</h3>
                {lead.status === 'REQUIRES_HUMAN' && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-200">INTERVENCIÓN HUMANA</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {lead.phone}</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="w-4 h-4" /> Oferta: {lead.offer}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="md:w-1/3 p-4 bg-white/50 rounded-2xl border border-slate-100 italic text-sm text-slate-600">
               "{lead.diagnosis}"
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">Ver Chat</button>
              {lead.status === 'REQUIRES_HUMAN' && (
                <button className="flex-1 md:flex-none bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">LLAMAR AHORA</button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
