import { NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { leadId, moduleId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    // 1. Fetch lead context
    const lead = await (prisma.lead as any).findUnique({
      where: { id: leadId },
      include: {
        scores: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        personalizedPlan: true
      }
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 2. Prepare context for AI
    const cvText = lead.cvText || "No CV provided";
    const formData = lead.formData as any;
    const lastScore = lead.scores[0];

    const userContext = `
    - Ubicación: ${formData.status === 'outside' ? 'Fuera de Canadá' : 'Dentro de Canadá (' + (formData.province || 'Desconocida') + ')'}
    - Urgencia: ${formData.urgency}
    - LinkedIn: ${formData.linkedinUrl || 'No proporcionado'}
    - Networking: ${formData.networking || 'Desconocida'}
    - Permiso de Trabajo: ${formData.workPermit || 'No proporcionado'}
    - Diagnóstico Previo: ${lastScore?.summary || 'N/A'}
    `;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: true, message: "Mock mode" });
    }

    const openai = new OpenAI({ apiKey });

    // Target specific module or all if not specified (though single is preferred for depth)
    const targetModule = moduleId || "m0"; 

    console.log(`🤖 Generando Módulo Profundo ${targetModule} para Lead: ${leadId}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres "Pierre", el mentor senior de empleabilidad #1 en Canadá. 
          Tu tono es DIRECTO, HONESTO y ESTRATÉGICO. Le hablas de "tú" al cliente.
          No eres un asistente genérico; eres un estratega que no tiene miedo de decir la verdad aunque incomode.
          
          REGLAS DE ORO:
          - No suavices la realidad del cliente.
          - Si el inglés es un problema, dilo. Si el CV es malo, dilo.
          - Cada sección debe ser accionable (Haz esto -> Luego esto).
          - No uses teoría genérica. Usa ejemplos reales basados en su perfil.
          - Prioriza ejemplificar el formato Canadiense sobre el Latino.

          ESTRUCTURA OBLIGATORIA DEL MÓDULO (JSON):
          Debes devolver un objeto JSON para el módulo solicitado (${targetModule}) con los siguientes campos:
          {
            "context": "Breve explicación de por qué este módulo es crítico para ESTE cliente.",
            "diagnostic": "Qué está mal actualmente en este aspecto específico de su perfil.",
            "strategy": "Qué debe hacer específicamente y por qué (lógica de mercado canadiense).",
            "steps": ["Paso 1: ...", "Paso 2: ...", "Paso 3: ..."],
            "examples": "Ejemplos específicos aplicados a su industria y perfil.",
            "templates": "Plantillas, mensajes o scripts listos para copiar y pegar.",
            "prompts": "Prompts de IA específicos que el cliente puede usar hoy.",
            "commonErrors": "Errores que este cliente específico probablemente cometería.",
            "quickWins": "Acciones que puede ejecutar en menos de 48 horas.",
            "expectedResult": "Qué debería pasar si ejecuta esto correctamente."
          }

          MODULO SOLICITADO: ${targetModule}
          
          GUÍA DE MÓDULOS:
          m0: Diagnóstico de brecha y mapa de ruta.
          m1: Reposicionamiento y Propuesta de Valor (Narrativa).
          m2: CV Canadiense (ATS) - Reescritura de bullets reales.
          m3: LinkedIn 360 - Headline y About optimizados.
          m4: Estrategia de Contenido (si aplica).
          m5: Calendario de Contenido.
          m6: Pre-Networking y Comentarios Estratégicos.
          m7: Networking y Coffee Chats (Mensajes de conexión).
          m8: Smart Applications (Plataformas y Filtros).
          m9: Entrevistas (Preguntas probables + STAR).
          m10: Calendario de Ejecución a 12 semanas.
          m11: Playbook Personalizado (Si ocurre X -> hacer Y).
          m12: Upskilling Estratégico (Qué estudiar y qué NO estudiar).`
        },
        {
          role: "user",
          content: `CONTEXTO DEL USUARIO:
          ${userContext}
          
          CV TEXT:
          ${cvText.substring(0, 6000)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const moduleData = JSON.parse(completion.choices[0].message.content || "{}");
    
    // 3. Merge and Persist
    const currentModules = (lead.personalizedPlan?.modules as any) || {};
    const updatedModules = { ...currentModules, [targetModule]: moduleData };

    const personalizedPlan = await (prisma as any).personalizedPlan.upsert({
      where: { leadId },
      update: { modules: updatedModules },
      create: {
        leadId,
        modules: updatedModules
      }
    });

    return NextResponse.json({ 
      success: true, 
      module: targetModule,
      data: moduleData 
    });

  } catch (error: any) {
    console.error("Error generating deep module:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
