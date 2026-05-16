import Link from 'next/link';

const SECTORS = [
  { id: 'construccion', name: 'Construcción' },
  { id: 'transporte', name: 'Transporte' },
  { id: 'cocina', name: 'Cocina' },
  { id: 'limpieza', name: 'Limpieza' },
  { id: 'logistica', name: 'Logística' }
];

export default function SelectionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <h2 className="text-4xl font-black text-slate-900">¿En qué área vas a trabajar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SECTORS.map((s) => (
            <Link 
              key={s.id}
              href={`/mi-guia/dashboard?sector=${s.id}`}
              className="bg-white p-10 rounded-[40px] border-2 border-transparent hover:border-emerald-500 hover:shadow-2xl transition-all font-black text-xl text-slate-800"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
