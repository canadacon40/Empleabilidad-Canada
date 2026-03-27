import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { cvText, jobDescription } = await req.json();

        if (!cvText || !jobDescription) {
            return NextResponse.json({ error: "Falta el CV o el Job Description" }, { status: 400 });
        }

        const systemPrompt = `Eres un Senior Hiring Manager en una multinacional canadiense.
        Tu misión es preparar al candidato para una entrevista exitosa basándote en su perfil y la vacante (Job Description).
        
        REQUISITOS DE EVALUACIÓN:
        1. PREDICCIÓN: Predice las 3 preguntas técnicas y 3 preguntas de comportamiento (Behavioral) más probables.
        2. METODOLOGÍA STAR: Para las preguntas de comportamiento, ofrece una respuesta modelo estructurada en: Situation, Task, Action, Result.
        3. RED FLAGS: Identifica 3 temas o habilidades que el candidato NO debe mencionar o debe manejar con extremo cuidado.
        4. TIPS ESTRATÉGICOS: Proporciona 3 consejos para ganar confianza.
        
        Devolver un JSON con:
        - technicalQuestions: (array de objetos) { question, whyTheyAsk, howToAnswer, sampleAnswer }.
        - behavioralQuestions: (array de objetos) { question, competency, starTemplate: { situation, task, action, result } }.
        - redFlags: (string[]) Qué evitar decir.
        - generalTips: (string[]) Tips maestros.
        - language: Idioma detectado en la vacante.`;

        const userPrompt = `Job Description: ${jobDescription}\n\nCV del Candidato: ${cvText}`;

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
