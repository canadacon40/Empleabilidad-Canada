/**
 * PIERRE ENGINE: DIRECT TEST (M0-M3)
 * Este script usa Prisma y OpenAI directamente para generar contenido sin depender del servidor Next.js.
 */
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateModule(leadId, moduleId, cvText, userContext) {
    console.log(`🤖 Generando Módulo Profundo ${moduleId.toUpperCase()} (Tono Pierre)...`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres Pierre, un Estratega de Empleabilidad Senior en Canadá con 20 años de experiencia.
Tu misión es redactar el BLOQUE ${moduleId} de un Roadmap de Empleabilidad Personalizado.

REQUISITOS DE VOLUMEN Y PROFUNDIDAD (CRÍTICO):
1. Este documento debe tener una extensión equivalente a 8-10 PÁGINAS de contenido puro y duro (aprox. 1500-2000 palabras por bloque). NO RESUMAS. Sé denso, quirúrgico y extremadamente detallado.
2. Usa un tono directo, profesional y autoritario. Habla como un mentor que no tiene tiempo para rodeos.
3. El formato de salida debe ser JSON con exactamente estas 10 secciones extensas:

{
  "context": "Contexto estratégico profundo de la situación del candidato en el mercado canadiense actual (500+ palabras).",
  "diagnostic": "Diagnóstico de brechas 'incómodo' y real. Por qué no lo están llamando. Qué está fallando en su perfil (500+ palabras).",
  "strategy": "La Gran Estrategia Pierre: El cambio de mindset y la jugada maestra para este bloque (500+ palabras).",
  "steps": ["Paso 1 detallado...", "Paso 2 detallado...", "Paso 10 detallado... (Mínimo 8-10 pasos tácticos operativos)"],
  "examples": "3 Casos de estudio o ejemplos reales de éxito aplicando esta estrategia (Mínimo 300 palabras).",
  "templates": "3 Plantillas completas (CV, Cover Letter, Mensajes de LinkedIn) adaptadas quirúrgicamente.",
  "prompts": "Librería de 5 Prompts de IA para que el candidato use en ChatGPT para acelerar este bloque.",
  "commonErrors": "Lista de los 5 errores fatales que cometen los migrantes en esta etapa y cómo evitarlos.",
  "quickWins": "3 Acciones que puede hacer en las próximas 48h para ver resultados inmediatos.",
  "expectedResult": "Descripción detallada del estado final del candidato tras completar este bloque (Punto de llegada)."
}

Enfócate en consejos del mercado canadiense real (NOC codes, ATS, Networking frío, cultura laboral de Toronto/Vancouver/Montreal).`
        },
        {
          role: "user",
          content: `CONTEXTO: ${userContext}\nCV: ${cvText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(completion.choices[0].message.content);
    
    // Upsert PersonalizedPlan
    const plan = await prisma.personalizedPlan.findUnique({ where: { leadId } });
    const currentModules = plan?.modules || {};
    const updatedModules = { ...currentModules, [moduleId]: data };

    await prisma.personalizedPlan.upsert({
      where: { leadId },
      update: { modules: updatedModules },
      create: { leadId, modules: updatedModules }
    });

    console.log(`   ✨ ${moduleId.toUpperCase()} LISTO.\n`);
    return data;
}

async function main() {
    const email = `direct_pierre_${Date.now()}@example.com`;
    console.log(`🚀 Iniciando Generación Directa para: ${email}\n`);

    // 1. Crear Lead
    const user = await prisma.user.create({
        data: { email, name: "Prueba Directa Pierre", isPro: true }
    });
    const lead = await prisma.lead.create({
        data: {
            userId: user.id,
            cvText: "10 years Project Manager, PMP, Mexico, English C1.",
            formData: { province: "Ontario", urgency: "High", status: "outside" }
        }
    });

    const userContext = "Ubicación: Fuera de Canadá (México), Urgencia: Alta, NOC: 21310";
    const modules = ["m0", "m1", "m2", "m3"];

    for (const mId of modules) {
        await generateModule(lead.id, mId, lead.cvText, userContext);
    }

    console.log("🏆 --- MISIÓN CUMPLIDA: 4 MÓDULOS GENERADOS --- 🏆");
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
