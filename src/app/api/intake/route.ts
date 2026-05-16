import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { IntakeMapper } from "@/lib/intake/mapper";
import crypto from "crypto";

// Tally Signature Verification Logic
function verifySignature(payload: string, signature: string, secret: string) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // 1. TALLY_SECRET Verification
    const tallySecret = process.env.TALLY_SECRET;
    const signature = req.headers.get("x-tally-signature");

    if (tallySecret && signature) {
      const isValid = verifySignature(rawBody, signature, tallySecret);
      if (!isValid) {
        console.warn("🛡️ Security: Invalid Tally signature received.");
        return NextResponse.json({ error: "Unauthorized: Invalid signature" }, { status: 401 });
      }
    } else if (tallySecret && !signature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized: Missing signature" }, { status: 401 });
    }

    // --- MOCK MODE ---
    if (process.env.USE_MOCK_DATA === "true" || !process.env.DATABASE_URL) {
      console.log("🛠️ Intake API (Mock): Received Submission", body.data?.submissionId);
      return NextResponse.json({ message: "Intake verified (Mock Mode)", submissionId: body.data?.submissionId });
    }

    // 2. Payload Extraction & Validation
    const mappedData = IntakeMapper.mapTallyToLeadData(body.data || body);
    
    if (!mappedData.email || !mappedData.email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // 3. Duplicate Protection (Throttle same email within 5 minutes)
    const recentLead = await prisma.lead.findFirst({
      where: {
        user: { email: mappedData.email },
        createdAt: {
          gt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
        }
      }
    });

    if (recentLead) {
      return NextResponse.json({ error: "Duplicate submission detected. Please wait." }, { status: 429 });
    }

    // 4. URL Validation (Basic)
    const validateUrl = (url?: string) => url && (url.startsWith("http://") || url.startsWith("https://"));
    if (mappedData.linkedinUrl && !validateUrl(mappedData.linkedinUrl)) {
      return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
    }

    // 5. Find or Create User
    const user = await prisma.user.upsert({
      where: { email: mappedData.email },
      update: {
        name: `${mappedData.firstName || ""} ${mappedData.lastName || ""}`.trim() || undefined,
        phone: mappedData.phone || undefined,
      },
      create: {
        email: mappedData.email,
        name: `${mappedData.firstName || ""} ${mappedData.lastName || ""}`.trim() || "Candidate",
        phone: mappedData.phone,
      }
    });

    // 6. Create Lead and Intake records
    const { lead, intake } = await IntakeMapper.processIntake(body.data || body, user.id);

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id, 
      status: lead.status,
      message: "Client profile established in EmployabilityOS."
    }, { status: 201 });

  } catch (error: any) {
    console.error("INTAKE_API_ERROR:", error);
    return NextResponse.json({ error: "Intelligence Pipeline Error" }, { status: 500 });
  }
}
