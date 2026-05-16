import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
      <div className="max-w-xl space-y-10">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
        <h1 className="text-4xl font-black">LEER ANTES DE EMPEZAR</h1>
        <p className="text-xl text-slate-400">"Este plan no es magia. Canadá es un país de esfuerzo. Nada es 100% seguro, pero la preparación es tu única ventaja."</p>
        <Link 
          href="/mi-guia/seleccion"
          className="block w-full py-6 bg-white text-slate-950 font-black rounded-2xl text-xl hover:scale-105 transition-all shadow-2xl"
        >
          ENTIENDO Y ESTOY LISTO
        </Link>
      </div>
    </div>
  );
}
