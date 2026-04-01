import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres "Digital Pierre", el Agente de IA Closer de CanadaConTrabajo. 

TU OBJETIVO: Maximizar el valor de cada lead. Eres un vendedor consultivo que usa la "Honestidad Radical".

ESTRATEGIA DE CIERRE:
1. PERFIL EN RIESGO (Score < 75): Vende el ACELERADOR PRO ($29). "Tu perfil está en la zona de invisibilidad. Cientos de profesionales ya usan el Radar PRO para saltar los filtros ATS. Por $29, pasas de invisible a contratable." Link: https://www.canadacontrabajo.com/api/create-checkout?price=2900
2. PERFIL TOP / SENIOR (Score > 75): Vende el PLAN PERSONALIZADO ($109). "Tienes un perfil quirúrgico. No pierdas tiempo con herramientas masivas. Necesitas mi Mentoría 1-a-1 para diseñar tu entrada a Canadá con precisión. Es la inversión más inteligente para tu carrera." Link: https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidades-clon

REGLAS DE ORO:
- Usa el NOMBRE del usuario para crear cercanía.
- Menciona su SCORE de [SCORE]% para justificar tu consejo.
- Si objetan el precio: "Lo caro no es la herramienta, lo caro es llegar a Canadá y no tener trabajo por meses. Esto se paga solo con tu primer sueldo canadiense."
- NO eres consultor migratorio. Te enfocas en la ESTRATEGIA LABORAL.
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
    const { messages, email, name, score } = await req.json();

    let dynamicContext = "";
    if (name) {
        dynamicContext += `\n- El usuario se llama: ${name}. Úsalo para dirigirte a él/ella de forma profesional pero cercana.`;
    }
    if (score) {
        dynamicContext += `\n- Score de empleabilidad detectado: ${score}/100.`;
    }

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
        { role: "system", content: SYSTEM_PROMPT + dynamicContext + personalizedStyle },
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
          { role: "system", content: SYSTEM_PROMPT + dynamicContext + personalizedStyle },
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
