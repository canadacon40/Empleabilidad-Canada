import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { cvText, jobDescription, companyInfo } = await req.json();

        if (!cvText || !jobDescription) {
            return NextResponse.json({ error: "Falta el CV o el Job Description" }, { status: 400 });
        }

        const systemPrompt = `Eres un Experto Reclutador Canadiense con 20 años de experiencia.
        Tu misión es redactar una Cover Letter (Carta de Presentación) IRRESISTIBLE para el candidato basándote en su CV y la vacante (Job Description).
        
        REGLAS DE ORO:
        1. IDIOMA: Debe redactarse en el idioma del Job Description (Inglés o Francés preferentemente).
        2. FORMATO CANADIENSE: Debe tener Headline, Professional Greeting, Hook (por qué yo), The Match (cómo mis logros resuelven tus problemas), y Call to Action.
        3. NO GENÉRICA: Usa detalles específicos del CV y la vacante. No digas "I'm a hard worker", di "In my previous role at [Company], I achieved [X] resulting in [Y]".
        4. BREVEDAD: Máximo 350 palabras. Directo al punto.
        
        Devolver un JSON con:
        - coverLetter: (string) El texto completo de la carta con line breaks.
        - wordCount: (number).
        - keyHighlights: (string[]) Qué puntos del CV usaste para enganchar al reclutador.
        - tips: (string[]) Consejos para que el candidato la personalice antes de enviarla.`;

        const userPrompt = `Job Description: ${jobDescription}\n\nInformación de Empresa: ${companyInfo || "Sin datos extra"}\n\nCV del Candidato: ${cvText}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");
        return NextResponse.json({ result });

    } catch (error: any) {
        console.error("Error in cover-letter API:", error);
        return NextResponse.json({ error: "Error generando la carta de presentación" }, { status: 500 });
    }
}
