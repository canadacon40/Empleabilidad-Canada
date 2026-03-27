export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
    const prisma = (await import("@/lib/db")).default;
    
    const leads = await prisma.lead.findMany({
        include: {
            user: true,
            scores: { orderBy: { createdAt: 'desc' }, take: 1 },
            decisions: { orderBy: { createdAt: 'desc' }, take: 1 }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Control de Ventas</h1>
                    <p className="text-slate-500">Filtrando automáticamente a los clientes que no califican.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl border shadow-sm text-center min-w-[120px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Leads Totales</p>
                        <p className="text-xl font-black text-slate-900">{leads.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                            <th className="p-4 text-left">Prospecto / Perfil</th>
                            <th className="p-4 text-left">Calificación Pierre</th>
                            <th className="p-4 text-left">Presupuesto</th>
                            <th className="p-4 text-left">Estrategia de Venta</th>
                            <th className="p-4 text-left">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead: any) => {
                            const strategy = lead.decisions[0]?.strategy;
                            const level = lead.scores[0]?.level;
                            const budget = (lead.formData as any)?.budget || "N/A";
                            
                            // Traffic light logic
                            let statusColor = "bg-slate-100 text-slate-500";
                            let statusLabel = "PENDIENTE";
                            
                            if (strategy === "DIRECT_CONVERSION" && (level === "Alta" || level === "PREMIUM")) {
                                statusColor = "bg-emerald-100 text-emerald-700 border border-emerald-200";
                                statusLabel = "🔥 HOT LEAD - LLAMAR YA";
                            } else if (strategy === "EDUCATE_AND_CONVERT") {
                                statusColor = "bg-amber-50 text-amber-600 border border-amber-100";
                                statusLabel = "🟡 EDUCAR (CORREO)";
                            } else if (level === "LOW" || level === "Baja") {
                                statusColor = "bg-slate-100 text-slate-400 opacity-60";
                                statusLabel = "IGNORAR";
                            }

                            return (
                                <tr key={lead.id} className={`border-b transition-colors ${strategy === "DIRECT_CONVERSION" ? "bg-emerald-50/20" : "hover:bg-slate-50"}`}>
                                    <td className="p-4 min-w-[200px]">
                                        <div className="font-bold text-slate-900">{lead.user.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{lead.user.email}</div>
                                        {lead.formData?.phone && (
                                             <div className="text-[10px] text-primary font-bold mt-1">📱 {lead.formData.phone}</div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                                {lead.scores[0]?.score || "?"}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Perfil</p>
                                                <p className="text-xs font-bold">{level || "En Proceso"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 inline-block">
                                            {budget}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-black inline-block ${statusColor}`}>
                                            {statusLabel}
                                        </div>
                                        {lead.decisions[0]?.offer && (
                                            <p className="text-[11px] font-bold text-slate-500 mt-1 ml-1 italic">{lead.decisions[0].offer}</p>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-400 text-xs font-medium">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
