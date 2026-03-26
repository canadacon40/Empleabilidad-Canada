import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { text, email } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un experto en reclutamiento canadiense. Analiza el siguiente CV y proporciona un score de empleabilidad (0-100), un nivel (CRITICAL_RISK, HIGH_RISK, MEDIUM_RISK, LOW_RISK, PREMIUM), un resumen y recomendaciones."
                },
                {
                    role: "user",
                    content: `CV TEXT: ${text}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content || '{}');

        // Save to DB if email provided
        if (email) {
            const prisma = (await import("@/lib/db")).default;
            const user = await prisma.user.upsert({
                where: { email: email.toLowerCase().trim() },
                update: {},
                create: { email: email.toLowerCase().trim() }
            });

            const lead = await prisma.lead.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id }
            });

            await prisma.cvScore.create({
                data: {
                    leadId: lead.id,
                    score: analysis.score || 0,
                    level: analysis.level || 'MEDIUM_RISK',
                    summary: analysis.summary || '',
                    rawAnalysis: analysis,
                }
            });
        }

        return NextResponse.json(analysis);
    } catch (error: any) {
        console.error('CV Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
