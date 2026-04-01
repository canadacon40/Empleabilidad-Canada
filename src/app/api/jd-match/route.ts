import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Configuración incompleta: Hace falta la clave de OpenAI (OPENAI_API_KEY) en las variables de entorno.");
        }

        const openai = new OpenAI({ apiKey });
        const { cvText, jdText } = await req.json();

        if (!cvText || !jdText) {
            return NextResponse.json({ error: 'Faltan datos: se requiere CV y Job Description' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Eres "Digital Pierre", un avanzado sistema ATS (Applicant Tracking System) e Inteligencia de Reclutamiento. Tu tarea es hacer un "Deep Match" entre un CV y una oferta de empleo (Job Description o JD).

OBJETIVO:
Calcular el porcentaje exacto de afinidad (0-100) y generar un "Gap Analysis" preciso que le diga al candidato exactamente qué le falta para llegar al 90%+ y ser contratado.

Estructura obligatoria (formato JSON):
{
  "matchScore": {
      "total": 85, // Promedio
      "skills": 90, // Coincidencia de habilidades técnicas
      "experience": 80, // Coincidencia en años y sector
      "keywords": 70 // Coincidencia de palabras clave ATS
  },
  "verdict": "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "PARTIAL" | "DO_NOT_APPLY", // APPLY si >= 90, APPLY_WITH_IMPROVEMENTS si 80-89, PARTIAL si 75-79, DO_NOT_APPLY si < 75
  "strengths": [
    "Experiencia en X que coincide perfectamente con el requerimiento Y."
  ],
  "gaps": {
    "missingSkills": ["Habilidad vital faltante 1", "Habilidad vital faltante 2"],
    "missingExperience": ["Dominio en X herramienta", "Años en sector Y"],
    "missingCertifications": ["Certificación obligatoria"],
    "languageGap": "Nivel de idioma requerido vs actual",
    "regulatoryGaps": ["Restricciones legales o provinciales"]
  },
  "roadmapTo90": [
    "Paso 1 hiper específico",
    "Paso 2 hiper específico"
  ],
  "atsKeywordsToInject": [
    "Keyword 1", "Keyword 2", "Keyword 3"
  ]
}`
                },
                {
                    role: "user",
                    content: `Aquí está el CV del candidato:\n\n${cvText}\n\n=================\n\nAquí está la oferta de trabajo (Job Description):\n\n${jdText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{}';
        const matchData = JSON.parse(content);

        return NextResponse.json({ result: matchData });
    } catch (error: any) {
        console.error('JD Match error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
