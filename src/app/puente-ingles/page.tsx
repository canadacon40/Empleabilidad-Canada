'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PuenteInglesSalesPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDemoStart = () => {
    setLoading(true);
    // Para propósitos de prueba de flujo completo, redirigimos directamente al producto
    setTimeout(() => {
      router.push('/mi-guia');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
            Recurso Exclusivo: Inglés Cero
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-center mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-tight">
          El Puente Canadiense: <br /> 
          <span className="text-emerald-400">Canadá con Inglés Básico</span>
        </h1>

        <p className="text-xl text-slate-400 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          El mapa de ruta exacto para entrar al mercado laboral canadiense sin dominar el idioma.
        </p>

        {/* Value Box */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-12 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
             ✓ ¿Qué incluye este Plan?
          </h2>
          <ul className="space-y-6 text-slate-300">
            <li className="flex gap-4">
               <span className="font-bold text-emerald-500">1.</span>
               <p><strong>Personalización por Oficio:</strong> Clasificamos tu NOC automáticamente.</p>
            </li>
            <li className="flex gap-4">
               <span className="font-bold text-emerald-500">2.</span>
               <p><strong>Laboratorio de Pronunciación:</strong> Pierde el miedo con nuestra guía fonética.</p>
            </li>
            <li className="flex gap-4">
               <span className="font-bold text-emerald-500">3.</span>
               <p><strong>Simulador de Entrevista:</strong> Practica las respuestas ganadoras.</p>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10">
          <div className="mb-4">
            <span className="text-slate-400 line-through text-lg mr-3">$49.00</span>
            <span className="text-5xl font-black text-white">$19.00 USD</span>
          </div>
          <button 
            onClick={() => window.location.href = "/mi-guia"}
            disabled={loading}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all"
          >
            {loading ? 'PROCESANDO PAGO...' : 'COMPRAR Y EMPEZAR AHORA 🚀'}
          </button>
        </div>
      </main>
    </div>
  );
}

