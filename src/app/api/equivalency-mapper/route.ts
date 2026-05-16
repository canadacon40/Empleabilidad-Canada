import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/auth';
import { consumeCredit } from '@/lib/credits';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { latamTitle, experienceYears } = body;

        if (!latamTitle) {
            return NextResponse.json({ error: 'Faltan datos (título LATAM)' }, { status: 400 });
        }

        // 1. Validar y consumir créditos
        const hasCredits = await consumeCredit(session.user.email, 'equivalency-mapper');
        if (!hasCredits) {
            return NextResponse.json({ error: 'Créditos insuficientes. Por favor mejora tu cuenta a PRO.' }, { status: 403 });
        }

        // 2. Ejecutar OpenAI
        const systemPrompt = `
Eres "Pierre", el Consultor de Empleabilidad Canadiense Senior para inmigrantes latinos.
Tu tarea es traducir un título profesional y nivel de experiencia de LATAM al estándar del mercado laboral canadiense (NOC System).

Devuelve la respuesta ESTRICTAMENTE EN FORMATO JSON válido, con las siguientes claves:
- "canadianTitle": El título de trabajo canadiense más exacto y comúnmente usado (Ej. "Business Analyst").
- "nocCode": El código NOC aproximado más relevante.
- "regulation": Estado de regulación de la profesión en Canadá (Ej. "Profesión NO Regulada - Puedes aplicar directo" o "Profesión Regulada - Requiere certificación provincial"). Sé específico.
- "certifications": Array de strings con 2 o 3 certificaciones altamente valoradas en Canadá para este rol (Ej. ["PMP", "CBAP"]).
- "resumeKeywords": Array de strings con 5 palabras clave (keywords) duras vitales para los sistemas ATS canadienses en este rol.

Reglas:
- Mantén un tono directo, táctico y corporativo canadiense.
- Todo el JSON debe estar en español (excepto los títulos canadienses, NOCs y keywords que deben ir en inglés o su formato original canadiense).
- NO devuelvas markdown, solo el JSON puro.
`;

        const prompt = `Título/Profesión en LATAM: ${latamTitle}\nAños de experiencia: ${experienceYears || 'No especificado'}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content || "{}";
        let result;
        try {
            result = JSON.parse(content);
        } catch (e) {
            console.error("Error parsing JSON from OpenAI:", content);
            return NextResponse.json({ error: 'Error procesando la respuesta de la IA' }, { status: 500 });
        }

        return NextResponse.json({ result });

    } catch (error: any) {
        console.error('Error en equivalency-mapper:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
