import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { cvText, jobDescription, action } = await req.json();

        if (!cvText || !jobDescription) {
            return NextResponse.json({ error: "Falta el CV o el Job Description" }, { status: 400 });
        }

        let systemPrompt = "";
        let userPrompt = "";

        if (action === "analyze") {
            systemPrompt = `Eres un Experto Reclutador Canadiense y Analista de ATS. 
            Tu misión es analizar una vacante (Job Description) y compararla con el perfil del candidato.
            Devolver un JSON con:
            - topKeywords: (string[]) Las 10 palabras clave más importantes para el ATS.
            - hardSkills: (string[]) Habilidades técnicas mandatorias detectadas.
            - softSkills: (string[]) Habilidades blandas requeridas.
            - tips: (string[]) 3 consejos estratégicos para este rol específico.`;
            
            userPrompt = `Job Description: ${jobDescription}\n\nCV del Candidato: ${cvText}`;
        } else if (action === "customize") {
            systemPrompt = `Eres un Consultor de Carrera Canadiense de Élite y experto en "Ingeniería Quirúrgica" de CVs. 
            Tu misión es ADAPTAR el CV del candidato a una vacante (Job Description) con precisión quirúrgica, asegurando un match del 95% o superior.
            
            REGLAS CRÍTICAS:
            1. IDIOMA: Traduce el resultado al idioma dominante del Job Description (En/Fr).
            2. LOOK EJECUTIVO: Usa la fórmula: VERBO DE ACCIÓN + TAREA + RESULTADO (KPIs).
            3. ATS MATCHING: Inyecta keywords de forma natural pero densa.
            4. HEADLINE: Crea un titular táctico alineado a la vacante (ej: "Senior Cloud Engineer | AWS Expert | Infrastructure Lead").
            
            Devolver un JSON estructurado igual a la fase de rediseño:
            {
              "personalInfo": {
                "fullName": "Nombre real",
                "headline": "Titular estratégico adaptado a la vacante",
                "contactDetails": { "email": "...", "phone": "...", "linkedin": "...", "location": "..." }
              },
              "professionalSummary": "Resumen adaptado de alto impacto enfocándose en el match con la JD.",
              "coreCompetencies": ["Habilidades clave del JD encontradas en el candidato"],
              "workExperience": [
                {
                  "jobTitle": "Título adaptado",
                  "company": "Compañía",
                  "location": "Ubicación",
                  "period": "Periodo",
                  "achievements": ["Logros adaptados usando keywords del JD y métricas"]
                }
              ],
              "education": [...],
              "certifications": [...],
              "achievements": [...],
              "languages": [...],
              "matchScore": 95, // Tu estimación técnica de compatibilidad
              "addedKeywords": ["Keyword 1", "Keyword 2"]
            }`;
            
            userPrompt = `CV Original: ${cvText}\n\nRE-ESCRIBIR PARA ESTA VACANTE: ${jobDescription}`;
        } else if (action === "ats-check") {
            systemPrompt = `Eres un software de filtrado ATS canadiense. 
            Analiza el CV adaptado frente a la vacante y da un veredicto técnico.
            Devolver un JSON con:
            - score: (number 0-100).
            - verdict: ("PASS" | "FAIL").
            - overallFeedback: Breve feedback táctico.
            - matchedKeywords: (string[]) Keywords encontradas.
            - missingKeywords: (string[]) Keywords críticas que faltan.
            - suggestions: (string[]) Acciones finales.`;
            
            userPrompt = `Job Description: ${jobDescription}\n\nCV Enviado: ${cvText}`;
        }

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
        console.error("Error in cv-customize:", error);
        return NextResponse.json({ error: "Error procesando la adaptación" }, { status: 500 });
    }
}
