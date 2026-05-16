import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { AgentName } from "@/lib/ai/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { pw, agentName } = await req.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
    if (pw !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!agentName) {
      return NextResponse.json({ error: "agentName is required" }, { status: 400 });
    }

    const orchestrator = new AIOrchestrator();
    const module = await orchestrator.generateModule(id, agentName as AgentName);

    return NextResponse.json({ 
      success: true, 
      module,
      message: `Module ${agentName} generated successfully.`
    });

  } catch (error: any) {
    console.error("MODULE_GEN_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
