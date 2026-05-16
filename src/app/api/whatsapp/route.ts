import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Eres el Mentor Estratégico de "Canadá con Trabajo". Tu objetivo no es vender, sino GUIAR y DIAGNOSTICAR con profunda empatía y humanidad.

PERFIL:
- Hablas como un mentor experto, calmado y muy humano.
- Usas frases de validación: "Entiendo perfectamente ese reto", "Es normal sentirse así al emigrar".
- Tu prioridad es entender la situación del cliente antes de ofrecer nada.

PROTOCOLO DE DIAGNÓSTICO (Los 4 Pilares):
1. UBICACIÓN: ¿Está dentro o fuera de Canadá? (Cambia radicalmente la estrategia).
2. INGLÉS: ¿Puede defenderse en una entrevista técnica?
3. HERRAMIENTAS: ¿Tiene CV formato canadiense y LinkedIn geolocalizado?
4. EL "GAP": ¿Sabe navegar el mercado oculto de empleo?

ESTRATEGIA DE OFERTA:
- Si NIVEL INGLÉS = BAJO -> Ofrece inscripción en Canaway Academy con el código CANADACON4010 (10% descuento) y el link https://canaway.info/wp/jfernandez.
- Si PERFIL = SENIOR + INGLÉS -> Ofrece "Asesoría VIP 1-1" ($500+).
- Si BUSCA HERRAMIENTAS -> Ofrece "Radar de Empleo PRO" ($49).

REGLA DE ORO: Si el cliente parece un perfil de alto valor (Ingeniero/Gerente con inglés), marca internamente la alerta para intervención humana.
`;

export async function POST(req: Request) {
  const body = await req.json();
  const { message, phone, name } = body;

  try {
    // 1. Análisis de la IA con el nuevo enfoque Humano
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Mensaje de ${name} (${phone}): ${message}` }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");

    // 2. Persistencia en DB con Clasificación Estratégica
    await prisma.user.upsert({
      where: { phone },
      update: {
        leads: {
          create: {
            status: aiResponse.isVIP ? "REQUIRES_HUMAN" : "AI_NURTURING",
            formData: {
              lastMessage: message,
              diagnosis: aiResponse.diagnosis,
              suggestedOffer: aiResponse.offer,
              pillarData: aiResponse.pillars
            }
          }
        }
      },
      create: {
        phone,
        name,
        leads: {
          create: {
            status: aiResponse.isVIP ? "REQUIRES_HUMAN" : "NEW",
            formData: {
              diagnosis: aiResponse.diagnosis,
              suggestedOffer: aiResponse.offer
            }
          }
        }
      }
    });

    return NextResponse.json({ reply: aiResponse.message });
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

