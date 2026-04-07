import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { cvText, jobDescription, category = "mixed" } = await req.json();

        if (!cvText || !jobDescription) {
            return NextResponse.json({ error: "Falta el CV o el Job Description" }, { status: 400 });
        }

        const systemPrompt = `Eres un Senior Hiring Manager en una multinacional canadiense y experto en reclutamiento quirúrgico.
        Tu misión es preparar al candidato para una entrevista exitosa basándote en su perfil real y la vacante (Job Description).
        
        REGLAS DE ORO DE PREPARACIÓN (MODO ENTRENAMIENTO):
        1. STAR UNIVERSAL: Cada respuesta modelo (sampleAnswer) debe seguir estrictamente la metodología STAR (Situation, Task, Action, Result). 
        2. TÉCNICO-ESCENARIO: Las preguntas técnicas NO deben ser teóricas. Preséntalas como ESCENARIOS (ej: "Describe una vez que tuviste que optimizar X..."). Usa la experiencia del CV para que la respuesta STAR sea verídica.
        3. CATEGORIZACIÓN: Genera solo preguntas de la categoría: ${category}.
        
        INSTRUCCIONES DE SALIDA:
        - Si category es "technical": Genera 3 preguntas técnicas complejas basadas en la vacante.
        - Si category is "behavioral": Genera 3 preguntas conductuales (soft skills/leadership).
        - Si category is "mixed": Genera 2 técnicas y 2 conductuales.
        
        Devolver un JSON estrictamente con:
        - technicalQuestions: (array de objetos) { question, whyTheyAsk, starTemplate: { situation, task, action, result }, sampleAnswer }
        - behavioralQuestions: (array de objetos) { question, competency, starTemplate: { situation, task, action, result }, sampleAnswer }
        - redFlags: (string[]) Qué evitar decir.
        - generalTips: (string[]) Tips maestros.
        - language: Idioma detectado en la vacante.`;

        const userPrompt = `Job Description: ${jobDescription}\n\nCV del Candidato: ${cvText}\n\nCategoría solicitada: ${category}`;

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
        console.error("Error in interview-prep API:", error);
        return NextResponse.json({ error: "Error generando la preparación de entrevista" }, { status: 500 });
    }
}
