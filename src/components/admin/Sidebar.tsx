import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Settings, 
  FileText, 
  LogOut,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Intelligence Hub", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
    { name: "Talent Pipeline", icon: Users, href: "/admin/leads" },
    { name: "Strategic Audits", icon: FileText, href: "/admin/audits" },
    { name: "Market Analytics", icon: TrendingUp, href: "/admin/analytics" },
    { name: "AI Ops", icon: Cpu, href: "/admin/ai-ops" },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Brand */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">Employability<span className="text-indigo-400">OS</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Intelligence System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Core Infrastructure</div>
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
              item.active 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <item.icon size={20} className={item.active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'} />
            <span className="text-sm font-bold tracking-tight">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-bold">Admin Console</p>
              <p className="text-[10px] text-slate-500">v1.2.0-stable</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors border-t border-slate-700 pt-4">
            <LogOut size={14} />
            Terminar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
