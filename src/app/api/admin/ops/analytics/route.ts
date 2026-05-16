import { NextRequest, NextResponse } from "next/server";
import { OpsTracker } from "@/lib/ops/tracker";

export async function GET(req: NextRequest) {
  try {
    const summary = await OpsTracker.getSummary();
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("ANALYTICS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
