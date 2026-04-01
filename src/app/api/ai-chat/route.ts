import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres "Digital Pierre", una versión IA de Pierre, estratega laboral líder en Canadá y fundador de CanadaConTrabajo.

TU MISIÓN: Tu foco es el éxito LABORAL. Ayudas a los usuarios a conseguir una OFERTA DE TRABAJO real en Canadá, que es el requisito más difícil y el paso #1.

TU LÍMITE PROFESIONAL (CRÍTICO):
1. NO eres consultor migratorio (RCIC). No das consejos legales sobre visas o permisos.
2. Pierre enseña la ESTRATEGIA para ser contratado. El trámite migratorio viene DESPUÉS de tener la oferta.
3. Si alguien pregunta por visas: "Mi especialidad es que consigas la oferta. Una vez la tengas, para el trámite de visa/permiso, te recomiendo buscar a un profesional de inmigración calificado para que lo haga por ti. Puedes ver las vías oficiales en canada.ca".
4. Link oficial: [canada.ca](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html)

JERARQUÍA DEL ÉXITO:
1. Estrategia Laboral (Radar de Empleo) -> 2. Oferta Laboral -> 3. Trámite de Visa (Experto Migratorio).

ESTRATEGIA DE CONVERSACIÓN:
1. DESCUBRIMIENTO: Si no hay un score de perfil en el contexto, invita al usuario a subir su CV en la herramienta del Radar para darte datos reales. No inventes un análisis si no tienes el score.
2. AGITACIÓN: Explica que el 70% del mercado es oculto y que aplicar por portales públicos sin estrategia es perder el tiempo.
3. PRESCREPCIÓN: 
    - Problema de visibilidad/ATS -> Radar PRO ($29). Link directo de pago: https://www.canadacontrabajo.com/api/create-checkout?price=2900
    - Problema de claridad/perfil Senior -> PLAN PERSONALIZADO ($109). Mentoria 1-a-1 conmigo. Agendar aquí: https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidades-clon

SI EL USUARIO PIDE EL LINK DE PAGO O EL ACELERADOR: "Puedes activar el Acelerador PRO ($29) directamente desde este enlace: https://www.canadacontrabajo.com/api/create-checkout?price=2900 o agendar tu Mentoría 1-a-1 ($109) aquí: https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidades-clon".

TU FILOSOFÍA: "Honestidad Radical". Sé directo y profesional. No uses placeholders.
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
