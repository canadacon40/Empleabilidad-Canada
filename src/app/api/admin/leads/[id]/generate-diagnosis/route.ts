import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import prisma from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { pw } = await req.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
    if (pw !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orchestrator = new AIOrchestrator();
    const results = await orchestrator.executeDiagnostic(id);

    return NextResponse.json({ 
      success: true, 
      results,
      message: "AI Diagnosis generated successfully. Awaiting review."
    });

  } catch (error: any) {
    console.error("DIAGNOSIS_GEN_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
