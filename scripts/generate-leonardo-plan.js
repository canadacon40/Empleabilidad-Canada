require('dotenv').config({ path: '.env.local' });
const { OpenAI } = require('openai');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateLeonardoPlan() {
  const email = 'leosanchezg05@gmail.com';
  console.log(`🤖 Iniciando Generación de Alta Profundidad para: ${email}...`);

  // 1. Find User by Email
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: { leads: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  if (!user || user.leads.length === 0) {
     console.error("❌ Lead no encontrado para este usuario.");
     return;
  }

  const lead = user.leads[0];
  const moduleId = 'm0';
  
  // prompt remains the same as before, focusing on the real case
  const prompt = `Eres Pierre, un Estratega de Empleabilidad Senior en Canadá con 20 años de experiencia.
Tu misión es redactar el BLOQUE ${moduleId} (Diagnóstico Crítico) de un Roadmap de Empleabilidad Personalizado para: ${email}.

PERFIL DEL CLIENTE (ANÁLISIS REAL COPIA-PEGA):
- Nombre: Leonardo Sanchez Gomez
- Background: Ingeniero Industrial (UC), ex-CEO de Nice Brasil ($25M P&L), actual Head of BU en Canadá.
- Estado Legal: Permiso Cerrado (LMIA). Depende de un empleador.
- Problema: Aplica a cientos de trabajos y NO lo llaman.
- Objetivo: Roles de Director General, Operaciones, Producto, CEO.

REQUISITOS DE VOLUMEN Y PROFUNDIDAD (CRÍTICO - PIERRE v4.0 HIGH-DEPTH):
1. Este documento debe tener una extensión equivalente a 10 PÁGINAS de contenido puro y duro (aprox. 1500-2000 palabras por bloque).
2. Tono: Brutalmente honesto, ejecutivo, senior. Sin rodeos. 
3. Analiza por qué un perfil de CEO/Regional Head con LMIA cerrado está en el 'Black Hole' de ATS y por qué aplicar masivamente es su mayor error.

Formato JSON:
{
  "context": "Contexto estratégico profundo del mercado ejecutivo en Canadá (500+ palabras).",
  "diagnostic": "Diagnóstico de brechas 'incómodo' y real. Por qué el LMIA cerrado y su seniority están chocando (500+ palabras).",
  "strategy": "La Gran Estrategia Pierre: El cambio de mindset de 'Candidato' a 'Partner Estratégico' (500+ palabras).",
  "steps": ["Paso 1 detallado...", "Paso 2...", "Paso 10... (Mínimo 10 pasos tácticos)"],
  "examples": "Casos de éxito de perfiles senior con LMIA que lograron movilidad interna o externa.",
  "templates": "Plantilla de Networking de Élite para hablar con Headhunters (no reclutadores junior personales).",
  "prompts": "Librería de Prompts de IA para optimizar su narrativa de LinkedIn.",
  "commonErrors": "Lista de errores fatales en su enfoque de 'volumen' actual.",
  "quickWins": "3 Acciones para las próximas 48h.",
  "expectedResult": "Estado final esperado."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsedContent = JSON.parse(response.choices[0].message.content);
    
    const plan = await prisma.personalizedPlan.upsert({
      where: { leadId: lead.id },
      update: {
        modules: {
          [moduleId]: parsedContent
        }
      },
      create: {
        leadId: lead.id,
        modules: {
          [moduleId]: parsedContent
        }
      }
    });

    console.log(`✨ ESTRATEGIA GENERADA CON ÉXITO PARA LEONARDO. M0 LISTO.`);
  } catch (error) {
    console.error('❌ Error en la generación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateLeonardoPlan();
