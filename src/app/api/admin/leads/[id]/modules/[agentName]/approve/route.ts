import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string, agentName: string } }
) {
  try {
    const { id, agentName } = params;
    const { pw, status, notes } = await req.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
    if (pw !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const module = await prisma.aIModule.update({
      where: { 
        leadId_agentName: { 
          leadId: id, 
          agentName 
        } 
      },
      data: {
        status, // APPROVED, REJECTED, NEEDS_REVISION
        internalNotes: notes
      }
    });

    return NextResponse.json({ success: true, module });

  } catch (error: any) {
    console.error("MODULE_APPROVE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
