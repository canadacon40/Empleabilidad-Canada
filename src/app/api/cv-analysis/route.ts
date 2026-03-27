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
                    content: `Eres un experto estratega para Canadá. 
Instrucción crítica: Tu respuesta DEBE ser un objeto json válido.

Estructura obligatoria (formato json):
{
  "score": 0-100,
  "level": "NIVEL_DE_RIESGO",
  "diagnostico": [{"problema": "string", "porque": "string", "cambio": "string"}],
  "regulacion": {"profesion": "string", "esRegulada": boolean, "detalle": "string", "reguladoresPorProvincia": [], "resumenImpacto": {"estatus": "string", "mensaje": "string"}},
  "idiomas": {"mensajeIngles": "string", "necesitaMejorarIngles": boolean},
  "certificaciones": {"lista": [], "resumenImpacto": {"estatus": "string", "mensaje": "string"}},
  "rolesPuente": {"lista": [], "resumenImpacto": {"estatus": "string", "mensaje": "string"}},
  "demandaProvincia": {"lista": [], "resumenImpacto": {"estatus": "string", "mensaje": "string"}},
  "salarios": {"entry": "string", "mid": "string", "senior": "string", "resumenImpacto": {"estatus": "string", "mensaje": "string"}},
  "empresasLMIA": {"lista": [], "resumenImpacto": {"estatus": "string", "mensaje": "string"}},
  "veredictoFinal": {"demandaMercado": "Alta" | "Media" | "Baja", "calificaciónPerfil": "Alta" | "Media" | "Baja", "conclusion": "string", "puntosFuertes": [], "oportunidadesMejora": [], "recomendaciónPrincipal": "string"}
}

IMPORTANTE: Responde solo json.`
                },
                {
                    role: "user",
                    content: `Analiza este CV y devuelve un json con el reporte: ${cvText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{}';
        const analysis = JSON.parse(content);

        // Save to DB if leadId provided
        if (leadId) {
            try {
                const prisma = (await import("@/lib/db")).default;
                
                // 1. Save Score & Gaps
                await prisma.score.create({
                    data: {
                        leadId: leadId,
                        level: analysis.veredictoFinal?.calificacionPerfil || "MID",
                        summary: analysis.veredictoFinal?.conclusion || "Análisis completado",
                        gaps: analysis.diagnostico || [],
                    }
                });

                // 2. Save Strategic Decision
                await prisma.decision.create({
                    data: {
                        leadId: leadId,
                        strategy: analysis.veredictoFinal?.demandaMercado === "Alta" ? "DIRECT_CONVERSION" : "EDUCATE_AND_CONVERT",
                        message: analysis.veredictoFinal?.recomendacionPrincipal || "",
                        offer: "Acelerador PRO $29",
                    }
                });

                // 3. Update Lead Status
                await prisma.lead.update({
                    where: { id: leadId },
                    data: { status: "EVALUATED" }
                });

                console.log(`Persistence completed for Lead: ${leadId}`);
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
