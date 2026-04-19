import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from "@/auth";
import { consumeCredit } from "@/lib/credits";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Configuración incompleta: Hace falta la clave de OpenAI");
        }

        const openai = new OpenAI({ apiKey });
        const { offerText } = await req.json();

        if (!offerText || offerText.length < 20) {
            return NextResponse.json({ error: 'Falta el texto de la oferta o es muy corto.' }, { status: 400 });
        }

        // --- CREDIT ENFORCEMENT ---
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Sesión expirada o no autorizada.' }, { status: 401 });
        }

        const creditCheck = await consumeCredit(session.user.email);
        if (!creditCheck.success) {
            return NextResponse.json({ 
                error: 'Créditos Insuficientes', 
                details: 'Has superado tu límite de interacciones. Actualiza a PRO para acceso ilimitado.' 
            }, { status: 403 });
        }

        const systemPrompt = `Eres un Agente Experto en Prevención de Fraudes Migratorios y Laborales de Canadá.
Tu objetivo es analizar ofertas de trabajo, correos o mensajes de reclutadores enviados a latinos y determinar si se trata de una estafa (LMIA scam, ghost job, phishing).

Busca activamente "Red Flags" como:
- Uso de correos genéricos (gmail, hotmail) en vez de corporativos.
- Promesas irreales ("visa express", "LMIA garantizado").
- Solicitud de dinero por adelantado (para trámites, vuelos, equipos).
- Entrevistas por WhatsApp o Telegram.
- Falta de requisitos de idioma o experiencia para trabajos complejos.
- Errores gramaticales graves en inglés/francés.

Devuelve un JSON estrictamente con esta estructura:
{
    "riskLevel": "HIGH" | "MEDIUM" | "LOW", // HIGH = Estafa segura, MEDIUM = Sospechoso, LOW = Parece legítimo
    "redFlags": ["Red flag 1 encontrada", "Red flag 2 encontrada"], // Arreglo vacío si no hay red flags
    "verdict": "Un párrafo corto y directo explicando por qué es o no es una estafa.",
    "action": "Un consejo claro de qué debe hacer el candidato (ej. 'Bloquear el contacto' o 'Proceder con cautela e investigar a la empresa en LinkedIn')."
}`;

        const userPrompt = `Analiza este mensaje/oferta:

"${offerText}"`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{}';
        const result = JSON.parse(content);

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error('Scam Checker error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
