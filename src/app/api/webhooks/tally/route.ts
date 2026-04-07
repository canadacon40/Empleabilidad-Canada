import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // 1. Signature Verification (Optional but robust)
    const signature = req.headers.get("tally-signature");
    const signingSecret = process.env.TALLY_SIGNING_SECRET;

    if (signingSecret && signature) {
      const calculatedSignature = crypto
        .createHmac("sha256", signingSecret)
        .update(rawBody)
        .digest("base64");
      
      if (calculatedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // 2. Extract Fields from Tally Payload
    const fields = body.data?.fields || [];
    let email = "";
    let name = "";
    const formData: any = {};

    fields.forEach((field: any) => {
      const label = field.label?.toLowerCase() || "";
      const value = field.value;

      // Identify special fields
      if (field.type === "INPUT_EMAIL" || label.includes("correo") || label.includes("email")) {
        email = value?.toLowerCase()?.trim();
      }
      if (label.includes("nombre") || label.includes("name")) {
        name = value;
      }

      // Map to internal schema keys
      if (label.includes("linkedin")) formData.linkedinUrl = value;
      if (label.includes("canadá") || label.includes("fuera")) {
          formData.status = label.includes("fuera") ? "outside" : "inside";
      }
      if (label.includes("provincia")) formData.province = value;
      if (label.includes("urgencia")) formData.urgency = value;
      if (label.includes("networking")) formData.networking = value;
      if (label.includes("work permit") || label.includes("permiso")) formData.workPermit = value;

      // Store all as raw for backup
      formData[field.key || label] = value;
    });

    if (!email) {
      return NextResponse.json({ error: "No email found in submission" }, { status: 400 });
    }

    console.log(`📩 Tally submission received from ${email}`);

    // 3. Upsert User & Lead
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name || undefined },
      create: { 
        email, 
        name: name || "Anonymous",
        isPro: false // Default to false unless already pro
      },
    });

    const lead = await prisma.lead.create({
      data: {
        userId: user.id,
        formData: formData,
        status: "NEW",
      },
    });

    // 4. Trigger AI Generation if User is PRO
    if (user.isPro) {
      console.log(`✨ User ${email} is PRO. Triggering deep plan generation...`);
      // We don't await this to respond fast to Tally
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      }).catch(err => console.error("Auto-generation trigger error:", err));
    }

    return NextResponse.json({ 
      success: true, 
      message: "Tally data ingested successfully",
      leadId: lead.id 
    });

  } catch (error: any) {
    console.error("Tally Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
