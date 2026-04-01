import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const password = searchParams.get("pw");
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { status, internalNotes } = await request.json();
        const leadId = params.id;

        // Recuperar Lead actual para no sobreescribir otros campos de formData
        const currentLead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        if (!currentLead) {
            return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
        }

        // Actualizar formData con la nueva nota y el status
        const updatedFormData = {
            ...(currentLead.formData as any || {}),
            internalNotes: internalNotes || (currentLead.formData as any)?.internalNotes
        };

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                status: status || currentLead.status,
                formData: updatedFormData
            }
        });

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error: any) {
        console.error("CRM_PATCH_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
