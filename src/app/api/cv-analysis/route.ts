import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_vercel_build",
});

const SYSTEM_PROMPT = `Eres un estratega de empleabilidad canadiense de élite. Tu trabajo es realizar una Auditoría de Empleabilidad Quirúrgica para profesionales internacionales.

RESPONDE SIEMPRE EN ESPAÑOL, con tono profesional, directo y estratégico.

Estructura tu respuesta exactamente en este formato JSON:

{
  "diagnostico": [
    { "problema": "string", "porque": "string", "cambio": "string" }
  ],
  "analisisNOC": {
    "codigo": "string",
    "titulo": "string",
    "descripcionQueEsNOC": "string",
    "requisitosNoCumplidos": ["string"]
  },
  "idiomas": {
    "nivelActualEstimado": "string",
    "evaluacion": "string",
    "cronogramaMejora": { "horizonteTiempo": "string", "estrategia": "string" }
  },
  "certificaciones": {
    "mandatory": [ { "nombre": "string", "costo": "string" } ]
  },
  "regulacion": {
    "esRegulada": true,
    "quePuedesHacer": "string",
    "queNoPuedesHacer": "string",
    "comoRegularizarse": "string"
  },
  "rolesPuente": [
    { "titulo": "string", "salarioAnual": "string", "descripcionNOC": "string" }
  ],
  "demandaLaboral": [
    { "provincia": "string", "nivel": "Alta" }
  ],
  "salarios": {
    "entry": "string",
    "mid": "string",
    "senior": "string"
  },
  "conclusionEjecutiva": {
    "recomendacionMaestra": "string",
    "detalleEmpleabilidad": "string"
  },
  "bonus": {
    "estructuraCVRecomendada": {
      "orden": ["string"],
      "tipsVisuales": ["string"]
    }
  }
}

IMPORTANTE: No inventes datos. Si no hay información específica, usa términos generales del mercado laboral canadiense 2026.`;

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: "El CV es muy corto para analizar." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analiza este CV y genera el Reporte de Estrategia de Acceso al Mercado Canadiense (Formato Narrativo):\n\n${cvText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(
        { error: "No se recibió respuesta del motor de análisis." },
        { status: 500 }
      );
    }

    const result = JSON.parse(rawContent);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("CV Analysis error:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
