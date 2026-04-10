import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { cvText, jobDescription, companyInfo, tone = "formal", contactName = "", companyName = "", targetRole = "" } = await req.json();

        if (!cvText || !jobDescription) {
            return NextResponse.json({ error: "Falta el CV o el Job Description" }, { status: 400 });
        }

        const toneInstructions: Record<string, string> = {
            formal: "TONO: Corporativo, serio, impecable y protocolario. Usa un léxico de alto nivel y estructuras tradicionales de grandes corporaciones Canadienses.",
            cercano: "TONO: Moderno, entusiasta y directo. Enfócate en la cultura de la empresa y muestra una personalidad proactiva y cercana pero muy profesional.",
            espontaneo: "TONO: Audaz (Bold) y creativo. Empieza con un gancho no convencional (una historia corta, un dato impactante o una visión única). Ideal para Startups que buscan gente que piense fuera de la caja. Evita clichés de apertura.",
            amigable: "TONO: Cálido, centrado en las personas y en las 'Soft Skills'. Destaca la colaboración en equipo, la misión de la empresa y cómo tus valores humanos encajan con ellos."
        };

        const currentTone = toneInstructions[tone] || toneInstructions.formal;

        const systemPrompt = `Eres un Estratega de Empleabilidad Canadiense Senior con 20 años de experiencia ejecutando el "Método de 11 Bloques para el Éxito".
        Tu misión es redactar una Cover Letter (Carta de Presentación) QUIRÚRGICA, de alto impacto y orientada a RESULTADOS.
        
        ${currentTone}

        ESTRATEGIA "SURGICAL CANADA":
        - No seas un solicitante, sé el SOLUCIONADOR de problemas.
        - Identifica el "Dolor" o "Pain Point" principal en el Job Description y posiciónate como la cura inmediata.
        - Usa logros CUANTIFICABLES (%, $, #) extraídos del CV que resuelvan directamente los requisitos del JD.
        - El tono debe ser de CONSULTOR experto, no de empleado necesitado.

        REGLAS DE ORO DE FORMATO (CRÍTICO):
        1. CONTENIDO ÚNICAMENTE DEL CUERPO: NO incluyas encabezados de contacto, NO incluyas la fecha, NO incluyas el bloque del destinatario, NO incluyas el saludo inicial (ej: "Dear..."), y NO incluyas la despedida final (ej: "Sincerely..."). Estos elementos ya están en la plantilla visual.
        2. ESTRUCTURA INTERNA: 
           - Párrafo 1 (El Gancho): Impacto inmediato. Por qué esta empresa y por qué eres el match perfecto desde el segundo 1.
           - Párrafo 2 (La Prueba): Logros específicos que demuestren que ya has hecho lo que ellos necesitan.
           - Párrafo 3 (El Cierre): Call to Action potente y estratégico.
        3. IDIOMA: Debe redactarse en el mismo idioma predominante en el Job Description (Inglés o Francés).
        4. BREVEDAD CRÍTICA: La carta debe tener entre 180 y 220 palabras. Debe ser densa en valor pero corta en lectura.
        5. CERO CLICHÉS: Prohibido "I am writing to...". Empieza con una declaración de valor.
        
        Devolver un JSON con:
        - coverLetter: (string) Solo los párrafos del cuerpo de la carta con line breaks dobles entre párrafos.
        - finalContactName: (string) El nombre del Reclutador o 'Hiring Manager'.
        - finalCompanyName: (string) El nombre de la empresa.
        - finalTargetRole: (string) El rol para el que se aplica.
        - wordCount: (number).
        - keyHighlights: (string[]) Qué puntos del CV usaste para enganchar al reclutador.
        - tips: (string[]) Consejos para que el candidato la personalice antes de enviarla.`;

        const userPrompt = `
        DATOS DE CONTEXTO:
        - Nombre de Contacto: ${contactName}
        - Empresa: ${companyName}
        - Rol: ${targetRole}
        
        Job Description: ${jobDescription}
        
        CV del Candidato: ${cvText}`;

        console.log("PRO_DEBUG: API received cover-letter generation request", { tone, contactName, companyName });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000,
            temperature: 0.7
        });

        let content = completion.choices[0].message.content || "{}";
        // Strip markdown if present
        if (content.includes("```json")) {
            content = content.split("```json")[1].split("```")[0];
        } else if (content.includes("```")) {
            content = content.split("```")[1].split("```")[0];
        }

        const rawResult = JSON.parse(content);
        
        // Normalize keys (ensure coverLetter even if AI uses snake_case)
        const result = {
            ...rawResult,
            coverLetter: rawResult.coverLetter || rawResult.cover_letter || rawResult.content || ""
        };

        return NextResponse.json({ result });

    } catch (error: any) {
        console.error("Error in cover-letter API:", error);
        return NextResponse.json({ error: "Error generando la carta de presentación" }, { status: 500 });
    }
}
