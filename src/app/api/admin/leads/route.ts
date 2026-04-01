import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const password = searchParams.get("pw");
        
        // Verificación básica de seguridad (Se recomienda canalizar por env var)
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
        
        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const leads = await prisma.lead.findMany({
            include: {
                user: true,
                scores: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Formatear datos para la tabla
        const formattedLeads = leads.map(lead => ({
            id: lead.id,
            email: lead.user.email,
            name: (lead.formData as any)?.firstName || lead.user.name || "Sin nombre",
            phone: (lead.formData as any)?.phone || "Sin teléfono",
            noc: (lead.formData as any)?.noc || "N/A",
            score: lead.scores[0]?.level || "PND",
            date: lead.createdAt,
            summary: lead.scores[0]?.summary || ""
        }));

        return NextResponse.json({ leads: formattedLeads });
    } catch (error: any) {
        console.error("ADMIN_API_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
