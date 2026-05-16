'use client'

import { useSearchParams } from 'next/navigation';
import { Mic, Volume2, FileText, Headphones, Download } from 'lucide-react';

const DATA: any = {
  construccion: { name: "Construcción", pitch: "I have experience in construction.", p: "Ai jav expirians in construccion" },
  transporte: { name: "Transporte", pitch: "I am a professional driver.", p: "Ai am a profesional draiver" },
  cocina: { name: "Cocina", pitch: "I am a cook with experience.", p: "Ai am a cuc guit expirians" },
  limpieza: { name: "Limpieza", pitch: "I work in housekeeping.", p: "Ai guork in jaus-kiping" },
  logistica: { name: "Logística", pitch: "I am a warehouse worker.", p: "Ai am a wer-jaus guorker" }
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const sectorKey = searchParams.get('sector') || 'construccion';
  const active = DATA[sectorKey];

  const speak = (t: string) => {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <nav className="w-full md:w-64 bg-white border-r p-8 flex flex-col gap-6">
        <h2 className="font-black text-2xl">MI GUÍA</h2>
        <div className="text-xs font-bold text-emerald-600 uppercase">{active.name}</div>
        <button className="text-left font-bold text-slate-900 border-b pb-2">1. PRESENTACIÓN</button>
        <button className="text-left font-bold text-slate-400">2. EL OÍDO</button>
        <button className="text-left font-bold text-slate-400">3. MI CV</button>
      </nav>

      <main className="flex-1 p-8 md:p-12 max-w-4xl">
        <div className="bg-white p-10 rounded-[40px] border shadow-xl space-y-8">
           <h3 className="text-3xl font-black">Tu Misión: La Presentación</h3>
           <div className="space-y-4">
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Lo que dices:</p>
              <p className="text-3xl font-bold text-slate-900 leading-tight">"{active.pitch}"</p>
              <button onClick={() => speak(active.pitch)} className="flex items-center gap-2 text-emerald-600 font-bold"><Volume2 /> ESCUCHAR AUDIO</button>
           </div>
           <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 italic text-amber-900">
              Pronunciación: {active.p}
           </div>
           <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
              <Mic /> PRACTICAR AHORA
           </button>
        </div>
      </main>
    </div>
  );
}
