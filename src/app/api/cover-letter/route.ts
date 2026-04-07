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

        const systemPrompt = `Eres un Experto Reclutador Canadiense con 20 años de experiencia redactando cartas de éxito quirúrgico.
        Tu misión es redactar una Cover Letter (Carta de Presentación) potente y ultra-personalizada.
        
        ${currentTone}

        INSTRUCCIONES DE CONTEXTO:
        - Si 'contactName' no está presente o es vacío, busca el nombre del reclutador en el JD. Si no lo encuentras, usa 'Hiring Manager'.
        - Si 'companyName' no está presente o es vacío, busca el nombre de la empresa en el JD. Si no lo encuentras, usa '[Company Name]'.
        - Si 'targetRole' no está presente o es vacío, busca el título de la posición en el JD.
        - Usa 'finalContactName' y 'finalCompanyName' para el saludo y cuerpo de la carta de forma natural.

        REGLAS DE ORO:
        1. IDIOMA: Debe redactarse en el mismo idioma predominante en el Job Description (Inglés o Francés).
        2. ESTRUCTURA: Saludo Profesional, El Gancho (por qué esta empresa), El Match (logros específicos cuantitativos que resuelven los problemas del JD), y un Call to Action potente.
        3. BREVEDAD CRÍTICA: La carta debe ser de MÁXIMO 250 PALABRAS para asegurar que quepa en 1 sola página PDF incluyendo encabezados.
        4. NO GENÉRICA: Usa detalles cuantitativos del CV. Si el CV dice "líder de equipo", la carta debe decir "lideré un equipo de 10 personas aumentando la productividad en un 15%".
        5. NO CLICHÉS: Prohibido usar "I am writing to...". Empieza directo con el impacto y valor.
        
        Devolver un JSON con:
        - coverLetter: (string) El texto completo de la carta con line breaks.
        - finalContactName: (string) El nombre usado para el saludo (extraído o el proveído).
        - finalCompanyName: (string) El nombre de la empresa usado (extraído o el proveído).
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
        console.error("Error in cover-letter API:", error);
        return NextResponse.json({ error: "Error generando la carta de presentación" }, { status: 500 });
    }
}
