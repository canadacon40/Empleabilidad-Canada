import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "emerald" | "amber" | "indigo";
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = "indigo" }: StatCardProps) {
  const colorMap = {
    blue: "from-blue-500/10 to-blue-500/5 text-blue-600",
    emerald: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
    amber: "from-amber-500/10 to-amber-500/5 text-amber-600",
    indigo: "from-indigo-500/10 to-indigo-500/5 text-indigo-600",
  };

  return (
    <div className="relative group overflow-hidden bg-white/50 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorMap[color]} blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 ${colorMap[color].split(' ')[2]}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
              {trend}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}
