import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { pw, action } = await req.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
    if (pw !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === 'GENERATE') {
      const lead = await prisma.lead.update({
        where: { id },
        data: {
          portalToken: uuidv4(),
          portalAccessActive: true
        }
      });
      return NextResponse.json({ success: true, token: lead.portalToken });
    }

    if (action === 'TOGGLE_ACCESS') {
      const lead = await prisma.lead.findUnique({ where: { id } });
      const updated = await prisma.lead.update({
        where: { id },
        data: { portalAccessActive: !lead?.portalAccessActive }
      });
      return NextResponse.json({ success: true, active: updated.portalAccessActive });
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

  } catch (error: any) {
    console.error("PORTAL_TOKEN_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
