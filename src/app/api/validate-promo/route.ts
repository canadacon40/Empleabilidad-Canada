import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Código es requerido" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // 1. DB-MANAGED PROMO CODES (Scholarships & Admin Codes)
    // Every code must be present in the database to be valid.
    const promo = await prisma.promoCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: "Código inválido o inactivo." }, { status: 404 });
    }

    if (promo.currentUses >= promo.maxUses) {
      return NextResponse.json({ error: "Este código ya ha agotado su límite de usos." }, { status: 400 });
    }

    // 3. Increment usage
    await prisma.promoCode.update({
      where: { id: promo.id },
      data: {
        currentUses: { increment: 1 }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `¡Becas aplicada! (${promo.maxUses - promo.currentUses - 1} usos restantes)` 
    });

  } catch (error: any) {
    console.error("PIERRE_PROMO_VALIDATION_FAILURE:", error);
    return NextResponse.json({ 
      error: "Error en el sistema de validación de becas",
      details: error.message 
    }, { status: 500 });
  }
}
