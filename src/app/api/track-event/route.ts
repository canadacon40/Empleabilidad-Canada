import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { event, properties, userId, sessionId, email } = await req.json();

    const prisma = (await import("@/lib/db")).default;

    // Optional: identify user if email is provided
    let user = null;
    if (email) {
      user = await prisma.user.upsert({
        where: { email: email.toLowerCase().trim() },
        update: { 
          name: properties?.name || undefined,
        },
        create: { 
          email: email.toLowerCase().trim(),
          name: properties?.name || "Anonymous",
        }
      });
    }
    
    // Model in schema is named 'Event'
    const log = await prisma.event.create({
      data: {
        type: event || "UNKNOWN",
        payload: { ...properties, email, sessionId } || {},
        userId: user?.id || userId || null,
      }
    });

    return NextResponse.json({ success: true, id: log.id });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
