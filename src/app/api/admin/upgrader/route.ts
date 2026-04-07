import { NextResponse } from "next/server"
import { Client } from "pg"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await client.connect()
    const normalizedEmail = email.toLowerCase().trim()

    // 1. Check if user exists
    const checkRes = await client.query('SELECT * FROM "User" WHERE email = $1', [normalizedEmail])
    const existingUser = checkRes.rows[0]

    if (existingUser) {
      // 2a. Upgrade existing user/lead
      await client.query(
        'UPDATE "User" SET "isPro" = true WHERE id = $1',
        [existingUser.id]
      )
      return NextResponse.json({ 
        success: true, 
        message: `Usuario ${normalizedEmail} actualizado a PRO con éxito.`,
        action: "UPGRADED"
      })
    } else {
      // 2b. Create a "Placeholder" PRO user (pre-authorized)
      const newId = uuidv4()
      await client.query(
        'INSERT INTO "User" (id, email, name, "isPro", "createdAt") VALUES ($1, $2, $3, $4, NOW())',
        [newId, normalizedEmail, "Cliente de Asesoría", true]
      )
      return NextResponse.json({ 
        success: true, 
        message: `Nuevos acceso PRO pre-creado para ${normalizedEmail}.`,
        action: "CREATED"
      })
    }
  } catch (error: any) {
    console.error("ADMIN_UPGRADE_FAILURE:", error)
    return NextResponse.json({ 
      error: "Error en la activación manual.", 
      details: error.message 
    }, { status: 500 })
  } finally {
    await client.end()
  }
}
