import { ChevronRight, Mail, Phone, ExternalLink, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  noc: string;
  score: string;
  status: string;
  date: string;
}

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'CONTACTED': return "bg-blue-50 text-blue-600 border-blue-100";
      case 'CONVERTED': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'REJECTED': return "bg-rose-50 text-rose-600 border-rose-100";
      case 'EVALUATED': return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getScoreColor = (score: string) => {
    if (score === 'HIGH') return "text-emerald-500";
    if (score === 'MID') return "text-amber-500";
    return "text-slate-400";
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Candidato Estratégico</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target NOC</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Score</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pipeline Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                className="hover:bg-indigo-50/30 transition-all group cursor-pointer" 
                onClick={() => onSelectLead(lead)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 text-sm border border-white shadow-sm group-hover:scale-105 transition-transform">
                      {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 tracking-tight text-base leading-tight">{lead.name}</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                          <Mail size={12} className="text-slate-300" /> {lead.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{lead.noc}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Primary Target</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                        <circle 
                          cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" 
                          strokeDasharray={113}
                          strokeDashoffset={lead.score === 'HIGH' ? 20 : lead.score === 'MID' ? 50 : 80}
                          className={getScoreColor(lead.score)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute text-[9px] font-black ${getScoreColor(lead.score)}`}>
                        {lead.score === 'HIGH' ? '85+' : lead.score === 'MID' ? '60' : '30'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${getScoreColor(lead.score)}`}>
                      {lead.score} Profile
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`
                    px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                    ${getStatusStyles(lead.status)}
                  `}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
