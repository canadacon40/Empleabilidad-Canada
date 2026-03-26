import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres "Digital Pierre", una versión IA de Pierre, estratega laboral con base en Canadá. 

TU HISTORIA (Solo compártela si te preguntan específicamente por tu experiencia o títulos):
- Tienes casi 20 años de experiencia liderando equipos de Recursos Humanos.
- Llevas 6 años en Canadá trabajando en la misma industria, en el área de consulting enfocada en personas.

TU FILOSOFÍA: "Honestidad Estratégica". No vendes humo. Dices las cosas como son porque el mercado canadiense es agresivo y competitivo.

ESTRATEGIA DE ORIENTACIÓN (4 NIVELES):
1. RIESGO CRÍTICO (Invisible): Formato erróneo, sin logros. Paso: Diagnóstico y Acelerador ($29) para dejar de ser ignorado.
2. RIESGO ALTO/MEDIO (Desafiante): Formato pasable pero genérico. Paso: Acelerador ($29) para destacar sobre el resto.
3. RIESGO BAJO (Optimizado): Buen formato Canada-style. Veredicto: "Tienes el 20% (el CV), pero te falta el 80% (Estrategia/LinkedIn/Networking)". Paso: Plan de Empleabilidad Personalizado ($109).
4. PERFIL PREMIUM (Sobresaliente): Perfil impecable. Paso: Plan de Empleabilidad Personalizado ($109) para negociación salarial y mercado oculto.

TU ESTILO: 
- Directo, profesional y equilibrado. Evita el lenguaje excesivamente publicitario o "inflado".
- Habla como un mentor que quiere que el usuario deje de perder tiempo.
- Regla de Oro: Un buen CV es solo el "ticket de entrada"; la Estrategia es lo que consigue la oferta.

SOLUCIONES: 
- SI NECESITAN EL CV TOOL ($29 USD): Link: https://buy.stripe.com/8x2cN57a22wo463fXe3gk06
- SI NECESITAN ESTRATEGIA / ASESORÍA ($109 USD): Link: https://buy.stripe.com/8x2cN57a22wo463fXe

REGLAS:
- Responde en el idioma del usuario.
- Habla en primera persona.
`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "save_qualified_lead",
      description: "Guarda la información de un lead altamente calificado (intermedio+ inglés, presupuesto $50-$150).",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nombre del lead" },
          email: { type: "string", description: "Correo electrónico" },
          whatsapp: { type: "string", description: "Número de WhatsApp" },
          language_level: { type: "string", description: "Nivel de inglés/francés detectado" },
          budget_ready: { type: "boolean", description: "Si está dispuesto a invertir entre $50-$150" },
          summary: { type: "string", description: "Breve resumen del perfil y dolor" },
        },
        required: ["email"],
      },
    },
  },
];

export async function POST(req: Request) {
  try {
    const { messages, email } = await req.json();

    let personalizedStyle = "";
    if (email) {
      const prisma = (await import("@/lib/db")).default;
      try {
        const lead = await prisma.lead.findFirst({
          where: { user: { email: email.toLowerCase().trim() } },
          include: { 
            scores: { orderBy: { createdAt: 'desc' }, take: 1 },
            decisions: { orderBy: { createdAt: 'desc' }, take: 1 }
          }
        });

        if (lead && lead.scores.length > 0) {
          const score = lead.scores[0];
          const decision = lead.decisions[0];
          personalizedStyle = `
          CONTEXTO DEL USUARIO:
          - Estatus detectado: ${score.level}
          - Resumen del perfil: ${score.summary}
          - Estrategia recomendada: ${decision?.strategy || "No definida"}
          - Oferta prioritaria: ${decision?.offer || "Acelerador de Entrevistas"}
          
          INSTRUCCIÓN DE VENTA:
          ${decision?.strategy === "DIRECT_CONVERSION" 
            ? "El usuario tiene un buen perfil. Sé más directo. Enfócate en que el Plan Personalizado ($109) es el paso final para asegurar la oferta." 
            : "El usuario tiene bloqueadores críticos. Sé empático pero firme. Necesita el Acelerador ($29) antes de intentar nada más."}
          `;
        }
      } catch (dbError) {
        console.error("Chat personalization error:", dbError);
      }
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const cleanMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + personalizedStyle },
        ...cleanMessages
      ],
      tools,
      tool_choice: "auto",
      temperature: 0.7,
    });

    let aiMessage = response.choices[0].message;

    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      const toolMessages = [];
      for (const toolCall of aiMessage.tool_calls) {
        if (toolCall.type === "function") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            
            if (process.env.MAKE_WEBHOOK_URL) {
              await fetch(process.env.MAKE_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...args, source: "AI Chatbot Qualified" }),
              });
            }

            toolMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ status: "success" })
            });
          } catch (e) {
            toolMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ status: "error" })
            });
          }
        }
      }

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...cleanMessages,
          {
            role: "assistant",
            content: aiMessage.content || "",
            tool_calls: aiMessage.tool_calls
          },
          ...toolMessages as any
        ],
        temperature: 0.7,
      });
      aiMessage = secondResponse.choices[0].message;
    }

    const finalContent = aiMessage.content || "¡Entendido! Me he asegurado de guardar tus datos.";
    
    return NextResponse.json({ 
      message: { 
        role: "assistant", 
        content: finalContent
      } 
    });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json({ 
      error: "Service error",
      message: {
        role: "assistant",
        content: "Lo siento, Pierre tuvo un pequeño inconveniente técnico."
      }
    }, { status: 500 });
  }
}
