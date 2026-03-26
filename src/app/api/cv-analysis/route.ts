import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { cvText, leadId } = await req.json();

        if (!cvText) {
            return NextResponse.json({ error: 'No CV text provided' }, { status: 400 });
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
                    content: `CV TEXT: ${cvText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content || '{}');

        // Save to DB if leadId provided
        if (leadId) {
            const prisma = (await import("@/lib/db")).default;
            await prisma.score.create({
                data: {
                    leadId: leadId,
                    level: analysis.level || 'MEDIUM_RISK',
                    summary: analysis.summary || '',
                    gaps: analysis, // Storing full analysis in gaps for now
                }
            });
        }

        return NextResponse.json({ result: analysis });
    } catch (error: any) {
        console.error('CV Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
