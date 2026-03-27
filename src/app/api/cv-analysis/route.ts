import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Configuración incompleta: Hace falta la clave de OpenAI (OPENAI_API_KEY) en las variables de entorno para que Pierre pueda analizar el CV.");
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
                    content: `Eres "Digital Pierre", experto estratega de carrera para el mercado canadiense. Tu objetivo es realizar un análisis de empleabilidad exhaustivo de un CV y devolver un objeto json detallado con datos reales y verificables de Canadá.

Instrucción Crítica: Tu respuesta DEBE ser un objeto json válido.

Estructura obligatoria (format json):
{
  "score": número (0-100) según competitividad real,
  "level": "CRITICAL_RISK" | "HIGH_RISK" | "MEDIUM_RISK" | "LOW_RISK" | "PREMIUM",
  "diagnostico": [{"problema": string, "porque": string, "cambio": string}],
  "regulacion": { 
    "profesion": string, 
    "nocHabitual": string (NOC 2021 code),
    "esRegulada": boolean, 
    "detalle": string (Explica si necesita licencia o si puede ejercer en roles técnicos/asistencia),
    "reguladoresPorProvincia": [{"provincia": string, "entidad": string, "url": string}],
    "procesoGeneral": string, 
    "resumenImpacto": {"estatus": string, "mensaje": string}
  },
  "idiomas": {"mensajeIngles": string, "diagnosticoRealidadIngles": string, "necesitaMejorarIngles": boolean},
  "certificaciones": {"lista": [{"nombre": string, "tipo": string, "organismo": string, "costoCAD": string, "url": string}], "resumenImpacto": {"estatus": string, "mensaje": string}},
  "rolesPuente": {
    "lista": [{"titulo": string, "porque": string, "salarioPromedio": string}],
    "resumenImpacto": {"estatus": string, "mensaje": string}
  },
  "demandaProvincia": {"lista": [{"codigo": string, "provincia": string, "demanda": "Muy Buena" | "Buena" | "Media" | "Baja"}], "resumenImpacto": {"estatus": string, "mensaje": string}},
  "salarios": {"entry": string, "mid": string, "senior": string, "resumenImpacto": {"estatus": string, "mensaje": string}},
  "empresasLMIA": {
    "lista": [{"nombre": string, "industria": string, "provincia": string, "website": string}],
    "resumenImpacto": {"estatus": string, "mensaje": string}
  },
  "veredictoFinal": {
    "demandaMercado": "Alta" | "Media" | "Baja", 
    "calificacionPerfil": "Alta" | "Media" | "Baja", 
    "conclusion": string, 
    "puntosFuertes": [string], 
    "oportunidadesMejora": [string], 
    "recomendacionPrincipal": string
  }
}

REGLAS DE ORO:
1. NOC: Investiga y asigna el código NOC 2021 correcto.
2. EMPRESAS: Lista 3-5 empresas CANADIENSES reales que tengan historial de contratación internacional o LMIA.
3. REGULACIÓN: Sé tajante. Si es un médico, no puede ejercer. Pero si es un enfermero, puede trabajar como "Personal Support Worker" (PSW). Explica esas opciones.
4. ROLES PUENTE: Son trabajos que puede conseguir rápido para entrar a Canadá.
5. IDIOMA: No mientas. Si el CV dice inglés básico, la empleabilidad es bajísima.`
                },
                {
                    role: "user",
                    content: `Analiza este CV y genera el reporte estratégico completo en formato json: ${cvText}`
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
