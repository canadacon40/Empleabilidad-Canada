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
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Lead Dashboard</h1>
            <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b">
                            <th className="p-4 text-left">Leads</th>
                            <th className="p-4 text-left">Score</th>
                            <th className="p-4 text-left">Level</th>
                            <th className="p-4 text-left">Offer</th>
                            <th className="p-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead: any) => (
                            <tr key={lead.id} className="border-b hover:bg-muted/30">
                                <td className="p-4">
                                    <div className="font-medium text-foreground">{lead.user.email}</div>
                                    <div className="text-xs text-muted-foreground">{lead.user.name}</div>
                                </td>
                                <td className="p-4 font-mono">{lead.scores[0]?.score || "N/A"}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                        {lead.scores[0]?.level || "N/A"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="font-semibold">{lead.decisions[0]?.offer || "N/A"}</span>
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
