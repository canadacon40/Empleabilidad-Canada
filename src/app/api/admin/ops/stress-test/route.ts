import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { count = 1, type = 'NORMAL' } = await req.json();

    const sandboxLeads = [];
    for (let i = 0; i < count; i++) {
      const lead = await prisma.lead.create({
        data: {
          name: `Sandbox_${type}_${Math.floor(Math.random() * 1000)}`,
          email: `sandbox_${Date.now()}_${i}@test.io`,
          phone: "+1 000 000 0000",
          noc: type === 'COMPLEX' ? '4112 / 2173' : '2173',
          score: 'HIGH',
          status: 'INTAKE_RECEIVED',
          internalNotes: `SANDBOX LEAD: TYPE=${type}`,
          intake: {
            create: {
              rawTallyData: {
                submissionId: `sandbox_${i}`,
                fields: [
                  { label: "Experience", value: type === 'EMPTY' ? "" : "10 years in engineering" }
                ]
              }
            }
          }
        }
      });
      sandboxLeads.push(lead);
    }

    return NextResponse.json({ success: true, count: sandboxLeads.length });
  } catch (error: any) {
    console.error("STRESS_TEST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
