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
        const { contactName, companyName, jobTitle, cvText } = await req.json();

        if (!contactName || !companyName) {
            return NextResponse.json({ error: 'Faltan datos clave (Nombre del Contacto o Empresa).' }, { status: 400 });
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

        const systemPrompt = `Eres un Estratega de Networking Canadiense de alto nivel.
Tu objetivo es redactar un mensaje de LinkedIn (Cold Outreach) extremadamente efectivo para un candidato que busca conectar con un reclutador o manager en Canadá.

REGLAS DEL MERCADO CANADIENSE:
1. NO pedir trabajo directamente.
2. Ser directo pero extremadamente educado.
3. Pedir un "Coffee Chat" (virtual de 15 min) o charla exploratoria.
4. El mensaje principal debe tener MENOS DE 300 CARACTERES (límite de nota de conexión en LinkedIn).
5. Resaltar brevemente 1 punto de valor del candidato si es relevante.

Devuelve un JSON estrictamente con esta estructura:
{
    "subjectLine": "Asunto corto y magnético (para emails o inMail)",
    "message": "El mensaje principal de conexión (máx 300 caracteres)",
    "followUp": "Un mensaje corto de seguimiento amigable para enviar 4 días después si no hay respuesta"
}`;

        const userPrompt = `Candidato (resumen): ${cvText ? cvText.substring(0, 500) : 'Profesional buscando oportunidades'}

Datos del Contacto:
Nombre/Puesto: ${contactName}
Empresa: ${companyName}
Rol Objetivo: ${jobTitle || 'No especificado'}

Genera la estrategia de conexión en Inglés (estándar corporativo canadiense).`;

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
        console.error('Networking Outreach error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
