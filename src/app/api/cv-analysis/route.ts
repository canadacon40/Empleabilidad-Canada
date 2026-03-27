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
        const { cvText, leadId } = await req.json();

        if (!cvText) {
            return NextResponse.json({ error: 'No CV text provided' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Eres "Digital Pierre", el estratega de carrera #1 para el mercado canadiense. Tu misión es realizar una auditoría de empleabilidad implacable y de alto valor sobre un CV y devolver un objeto JSON detallado.

OBJETIVO: Diagnosticar exactamente por qué el candidato NO está consiguiendo entrevistas y trazar una ruta clara de éxito hacia Canadá.

Estructura obligatoria (format JSON):
{
  "score": número (0-100),
  "level": "CRITICAL_RISK" | "HIGH_RISK" | "MEDIUM_RISK" | "LOW_RISK" | "PREMIUM",
  "diagnostico": [
    {"problema": string, "porque": string, "cambio": string} // DEBES IDENTIFICAR EXACTAMENTE 5 ERRORES CRÍTICOS (Formato, contenido, métricas, ATS, etc.)
  ],
  "analisisNOC": {
    "codigo": string (NOC 2021),
    "titulo": string,
    "descripcionQueEsNOC": "Explica de forma sencilla qué es el NOC y por qué es vital para su migración y búsqueda laboral",
    "requisitosNoCumplidos": [string]
  },
  "regulacion": { 
    "profesion": string, 
    "esRegulada": boolean, 
    "quePuedesHacer": string,
    "queNoPuedesHacer": string,
    "comoRegularizarse": string,
    "entidades": [{"provincia": string, "nombre": string, "url": string}]
  },
  "idiomas": {
    "nivelActualEstimado": string,
    "cumpleRequerimientoNOC": boolean,
    "evaluacion": string,
    "cronogramaMejora": {
      "horizonteTiempo": string,
      "estrategia": string
    },
    "recursosGratuitos": [{"nombre": string, "url": string}]
  },
  "certificaciones": {
    "mandatory": [{"nombre": string, "costo": string, "duracion": string, "donde": string}],
    "recommended": [{"nombre": string, "costo": string, "duracion": string, "donde": string}],
    "niceToHave": [{"nombre": string, "costo": string, "duracion": string, "donde": string}]
  },
  "rolesPuente": [
    {"titulo": string, "descripcionNOC": string, "funciones": [string], "salarioAnual": string}
  ],
  "demandaLaboral": [
    {"provincia": string, "nivel": "Muy Alta" | "Alta" | "Media" | "Baja" | "Incierta", "fuente": string}
  ],
  "salarios": {"entry": string, "mid": string, "senior": string},
  "conclusionEjecutiva": {
    "esEmpleableAhora": boolean,
    "detalleEmpleabilidad": string, 
    "demandaDesdeFuera": string, 
    "impactoCorrecciones": string, 
    "recomendacionMaestra": string
  },
  "bonus": {
    "estructuraCVRecomendada": {
      "orden": [string],
      "tipsVisuales": [string]
    }
  },
  "veredictoFinal": {
    "conclusion": string,
    "ofertaEstrategica": "Tu perfil tiene brechas críticas que impiden tu éxito. Pierre puede transformar tu CV hoy mismo por una beca especial de $29 USD."
  }
}

IMPORTANTE: Si un CV no está en formato canadiense, eso SIEMPRE computa como un error crítico en diagnóstico.`
                },
                {
                    role: "user",
                    content: `Analiza este CV y genera el reporte estratégico completo Pierre 2.5 en formato json: ${cvText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{}';
        const analysis = JSON.parse(content);

        // Persistent logic (Prisma)
        if (leadId) {
            try {
                const prisma = (await import("@/lib/db")).default;
                await prisma.score.create({
                    data: {
                        leadId: leadId,
                        level: analysis.level || "MID",
                        summary: analysis.veredictoFinal?.conclusion || analysis.conclusionEjecutiva?.recomendacionMaestra || "Análisis completado",
                        gaps: analysis.diagnostico || [],
                    }
                });
                await prisma.lead.update({
                    where: { id: leadId },
                    data: { status: "EVALUATED" }
                });
            } catch (dbError) {
                console.error('Database persistence error:', dbError);
            }
        }

        return NextResponse.json({ result: analysis });
    } catch (error: any) {
        console.error('CV Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
