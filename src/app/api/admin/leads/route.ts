import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const password = searchParams.get("pw");
        
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
        
        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // --- MOCK FALLBACK LOGIC ---
        if (process.env.USE_MOCK_DATA === "true" || !process.env.DATABASE_URL) {
            console.log("🛠️ Admin API: Serving Mock Data");
            return NextResponse.json({ 
                leads: MOCK_LEADS,
                isMock: true 
            });
        }

        const leads = await prisma.lead.findMany({
            include: {
                user: true,
                scores: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedLeads = leads.map(lead => ({
            id: lead.id,
            email: lead.user.email,
            name: (lead.formData as any)?.firstName || lead.user.name || "Sin nombre",
            phone: (lead.formData as any)?.phone || "Sin teléfono",
            noc: (lead.formData as any)?.noc || "N/A",
            score: lead.scores.length > 0 ? "AUDITED" : "PENDING",
            status: lead.status,
            internalNotes: (lead.formData as any)?.internalNotes || "",
            date: lead.createdAt,
            summary: lead.scores[0]?.justification || ""
        }));

        return NextResponse.json({ leads: formattedLeads, isMock: false });
    } catch (error: any) {
        console.error("ADMIN_API_ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch leads from database" }, { status: 500 });
    }
}

const MOCK_LEADS = [
  {
    id: "mock-1",
    name: "Alexander Vance (Mock)",
    email: "a.vance@techcorp.io",
    phone: "+1 (555) 012-3456",
    noc: "Software Engineer (2173)",
    score: "HIGH",
    status: "INTAKE_RECEIVED",
    internalNotes: "Strong background in cloud architecture.",
    date: new Date().toISOString()
  },
  {
    id: "mock-2",
    name: "Elena Rodriguez (Mock)",
    email: "elena.rod@globaltalent.com",
    phone: "+1 (555) 987-6543",
    noc: "Marketing Manager (0124)",
    score: "MID",
    status: "DIAGNOSIS_GENERATED",
    internalNotes: "Needs to improve French score.",
    date: new Date().toISOString()
  }
];
