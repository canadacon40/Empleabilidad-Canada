import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token y contraseña son requeridos" }, { status: 400 });
    }

    // 1. Find token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "El enlace ha expirado o es inválido." }, { status: 400 });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "El usuario no existe." }, { status: 404 });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 5. Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente." });

  } catch (error: any) {
    console.error("PIERRE_RESET_PW_FAILURE:", error);
    return NextResponse.json({ 
      error: "Error Crítico del Sistema de Acceso", 
      details: error.message 
    }, { status: 500 });
  }
}
