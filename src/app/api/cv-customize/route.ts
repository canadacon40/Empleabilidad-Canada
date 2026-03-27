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
            systemPrompt = `Eres un Consultor de Carrera Canadiense de Élite. 
            Tu misión es RE-ESCRIBIR el CV del candidato para que sea una coincidencia del 95% con el Job Description proporcionado.
            
            REGLAS CRÍTICAS:
            1. IDIOMA: Si el Job Description está en Inglés o Francés, TRADUCE el CV a ese idioma automáticamente con un nivel C1/C2 Profesional.
            2. LOOK EJECUTIVO: Usa verbos de acción fuertes (Managed, Orchestrated, Designed, Delivered) y métricas (KPIs).
            3. LONGITUD: El CV debe estructurarse para no exceder las 2 páginas.
            4. ATS MATCH: Inserta las keywords de la vacante de forma natural.
            
            Devolver un JSON con:
            - customizedSummary: Un resumen profesional de alto impacto (3-4 líneas).
            - customizedExperience: (array de objetos) { title, company, period, achievements: string[] }.
            - matchScore: (number 0-100) Estimado de compatibilidad tras la adaptación.
            - addedKeywords: (string[]) Keywords clave que incorporaste.
            - fullCvText: El texto completo del CV formateado profesionalmente.`;
            
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
