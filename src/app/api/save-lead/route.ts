import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, cvText, ...formData } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const prisma = (await import("@/lib/db")).default;
        
        // 1. Upsert the User
        const user = await prisma.user.upsert({
            where: { email: email.toLowerCase().trim() },
            update: { 
                name: name || undefined,
            },
            create: {
                email: email.toLowerCase().trim(),
                name: name || "Anonymous",
            },
        });

        // 2. Create the Lead record
        const lead = await prisma.lead.create({
            data: {
                userId: user.id,
                cvText: cvText || null,
                formData: formData || {},
                status: "NEW",
            },
        });

        console.log(`Lead created: ${lead.id} for user ${user.email}`);

        // 3. Optional: Sync with Make.com / CRM
        if (process.env.MAKE_WEBHOOK_URL) {
            try {
                await fetch(process.env.MAKE_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        ...body, 
                        leadId: lead.id,
                        userId: user.id,
                        source: "CV Tool / Analysis" 
                    }),
                });
            } catch (webhookError) {
                console.error("Webhook sync error:", webhookError);
            }
        }

        return NextResponse.json({ 
            success: true, 
            id: lead.id,
            userId: user.id 
        });
    } catch (error) {
        console.error("Save lead error:", error);
        return NextResponse.json(
            { error: "Failed to save lead info" }, 
            { status: 500 }
        );
    }
}
