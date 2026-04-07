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
    const { name, email, password } = await req.json()

    if (!email || !password) {
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

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    if (existingUser) {
      // 3a. Upgrade existing lead to a full account
      await client.query(
        'UPDATE "User" SET name = $1, password = $2, "isPro" = $3 WHERE id = $4',
        [name || existingUser.name, hashedPassword, true, existingUser.id]
      )
      return NextResponse.json({ success: true, user: { email: normalizedEmail } })
    } else {
      // 3b. Create new user
      const newId = uuidv4()
      await client.query(
        'INSERT INTO "User" (id, email, name, password, "isPro", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
        [newId, normalizedEmail, name || "Anonymous", hashedPassword, true]
      )
      return NextResponse.json({ success: true, user: { email: normalizedEmail } })
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
