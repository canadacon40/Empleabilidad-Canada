import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // 🛡️ SECURITY: If user doesn't exist, don't reveal it. Just return success.
    if (!user || !user.password) {
      return NextResponse.json({ success: true, message: "Si el correo está registrado, recibirás un enlace en un momento." });
    }

    // 2. Generate token (valid for 1 hour)
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // 3. Save reset token (VerificationToken model)
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: normalizedEmail, token } },
      update: { token, expires }, // Should theoretically not overlap with uuidv4 but upsert is safer
      create: { 
        identifier: normalizedEmail,
        token,
        expires 
      },
    });

    // 4. Send email
    await sendPasswordResetEmail(normalizedEmail, token);

    return NextResponse.json({ 
      success: true, 
      message: "Si el correo está registrado, recibirás un enlace en un momento." 
    });

  } catch (error: any) {
    console.error("PIERRE_FORGOT_PW_FAILURE:", error);
    return NextResponse.json({ 
      error: "Error Crítico del Sistema de Recuperación", 
      details: error.message 
    }, { status: 500 });
  }
}
