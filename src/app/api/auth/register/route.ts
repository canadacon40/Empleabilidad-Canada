import { NextResponse } from "next/server"
import { Client } from "pg"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    const { email, password, sessionId, promoCode, isChecking, name, becaCode } = await req.json();

    if (isChecking) {
        if (!promoCode) return NextResponse.json({ error: "Código requerido" }, { status: 400 });
        await client.connect();
        const promoRes = await client.query('SELECT * FROM "PromoCode" WHERE code = $1', [promoCode.toUpperCase()]);
        const promo = promoRes.rows[0];
        if (!promo || !promo.isActive || (promo.expiresAt && new Date(promo.expiresAt) < new Date())) {
            return NextResponse.json({ valid: false, error: "Código inválido o expirado" }, { status: 400 });
        }
        return NextResponse.json({ valid: true });
    }

    if (!email || (!password && !sessionId && !promoCode)) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await client.connect()
    const normalizedEmail = email.toLowerCase().trim()

    // 1. Check if user already exists
    const checkRes = await client.query('SELECT * FROM "User" WHERE email = $1', [normalizedEmail])
    const existingUser = checkRes.rows[0]

    if (existingUser && existingUser.password) {
      return NextResponse.json({ error: "Ya existe un usuario con este correo. Inicia sesión directamente." }, { status: 400 })
    }

    // 2. Gate Verification: If no Beca Code, check if user was a Lead (Free tool user)
    // In a full production system, we'd also verify the Stripe session here.
    let isTrial = false;
    let initialCredits = 0;

    if (becaCode || promoCode) {
        const activeCode = (becaCode || promoCode).toUpperCase();
        const promoRes = await client.query('SELECT * FROM "PromoCode" WHERE code = $1 AND "isActive" = true', [activeCode])
        const promo = promoRes.rows[0]
        
        if (!promo) {
            return NextResponse.json({ error: "Código de beca/promoción inválido" }, { status: 403 })
        }
        
        if (promo.maxUses && promo.currentUses >= promo.maxUses) {
            return NextResponse.json({ error: "Este código ya ha superado su límite de usos" }, { status: 403 })
        }

        // Precision Access Logic: Determine tier and capacity
        const isBeca = activeCode.includes("BECA");
        
        // 1. Assign Trial Status
        isTrial = isBeca;

        // 2. Assign Credits (Priority: DB field -> Default based on type)
        if (promo.grantedCredits && promo.grantedCredits > 0) {
            initialCredits = promo.grantedCredits;
        } else {
            initialCredits = isBeca ? 10 : 50; 
        }
        
        // Increment promo usage
        await client.query('UPDATE "PromoCode" SET "currentUses" = "currentUses" + 1 WHERE id = $1', [promo.id])
    } else if (sessionId) {
        // Stripe success flow (Real Purchasers)
        isTrial = false;
        initialCredits = 50; // Per user request: "dar el acceso de (50 usos) a los que compren"
    } else {
        // 🔒 MASTER BYPASS: Allow the owner to register without a code
        const masterEmail = process.env.MASTER_EMAIL?.toLowerCase().trim();
        const cleanEmail = email.toLowerCase().trim();
        
        if (masterEmail && cleanEmail === masterEmail) {
            isTrial = false;
            initialCredits = 999;
        } else {
            // Block unauthorized public registration
            return NextResponse.json({ 
                error: "Acceso restringido. Para registrarte debes haber generado un reporte previo o contar con un código de beca." 
            }, { status: 403 })
        }
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    if (existingUser) {
      // 4a. Upgrade existing lead to a full account
      await client.query(
        'UPDATE "User" SET name = $1, password = $2, "isPro" = $3, "isTrial" = $4, credits = $5 WHERE id = $6',
        [name || existingUser.name, hashedPassword, !isTrial, isTrial, initialCredits, existingUser.id]
      )
      return NextResponse.json({ success: true, user: { email: normalizedEmail, isTrial } })
    } else {
      // 4b. Create new user (Only if Beca Code was used, since otherwise it would have hit the 'else' gate above)
      const newId = uuidv4()
      await client.query(
        'INSERT INTO "User" (id, email, name, password, "isPro", "isTrial", credits, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
        [newId, normalizedEmail, name || "Anonymous", hashedPassword, !isTrial, isTrial, initialCredits]
      )
      return NextResponse.json({ success: true, user: { email: normalizedEmail, isTrial } })
    }
  } catch (error: any) {
    console.error("PIERRE_AUTH_RAW_SQL_FAILURE:", error)
    return NextResponse.json({ 
      error: "Error Crítico del Sistema de Acceso", 
      details: error.message || "Error desconocido en el motor de persistencia RawSQL." 
    }, { status: 500 })
  } finally {
    await client.end()
  }
}
