import { Search, Bell, RefreshCcw, Command } from "lucide-react";

interface DashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function DashboardHeader({ searchTerm, setSearchTerm, onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h2>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Real-time Talent Monitoring Active
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search candidates by name, email or NOC..."
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <Command size={10} /> K
            </div>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="h-12 w-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 disabled:opacity-50"
        >
          <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
        
        <div className="relative">
          <button className="h-12 w-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all text-slate-600">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
