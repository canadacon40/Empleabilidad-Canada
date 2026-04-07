import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        isPro: true,
        isTrial: true,
        credits: true,
      }
    });

    if (!user) {
      // 🔒 MASTER BYPASS: For secret testing and owner access
      const masterEmail = process.env.MASTER_EMAIL;
      if (masterEmail && session.user.email.toLowerCase() === masterEmail.toLowerCase()) {
        return NextResponse.json({ 
          user: {
            id: "master-admin",
            email: masterEmail,
            name: "Master Pierre Admin",
            isPro: true,
            isTrial: false,
            credits: 999
          }
        });
      }
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("ME_API_ERROR:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
