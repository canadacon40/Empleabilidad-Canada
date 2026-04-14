import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_vercel_build",
});

const SYSTEM_PROMPT = `Eres un estratega de empleabilidad canadiense de élite con más de 15 años de experiencia colocando profesionales latinoamericanos en Canadá. Tu trabajo es analizar un CV y generar un reporte COMPLETO de empleabilidad para el mercado canadiense.

RESPONDE SIEMPRE EN ESPAÑOL, sin importar el idioma del CV.

Tu análisis debe cubrir TODOS estos puntos:

1. DIAGNÓSTICO DEL CV ACTUAL
- Lista de problemas específicos del CV que impiden conseguir empleo en Canadá
- Para cada problema, explica POR QUÉ es un problema en el contexto canadiense y QUÉ CAMBIO se realizará

2. REGULACIÓN PROFESIONAL POR PROVINCIA
- ¿La profesión es regulada en Canadá?
- Si es regulada: lista los ENTES REGULADORES de cada provincia principal (Ontario, BC, Alberta, Quebec, etc.)
  Ejemplo: "En Ontario la ingeniería la regula PEO (Professional Engineers Ontario); en BC es EGBC; en Alberta es APEGA"
- Incluir URL de cada ente regulador
- Proceso general para obtener la licencia
- Si NO es regulada: indicarlo como ventaja competitiva

3. CERTIFICACIONES RECOMENDADAS (MÁXIMO 5 EN TOTAL)
- 3 certificaciones directamente relevantes al puesto/profesión
- 2 certificaciones relacionadas con cultura laboral y seguridad en Canadá (ej: WHMIS, First Aid/CPR, Workplace Safety, Canadian Workplace Culture courses)
- Para cada una: nombre, organismo, URL del sitio web, costo en CAD, duración, tipo (Mandatoria/Altamente Recomendada/Nice to Have)
- Incluir al menos 1 opción GRATUITA

4. ROLES PUENTE
- Lista de 3-5 roles de "puente" (bridge roles) para entrar al mercado canadiense
- Para cada rol: título en inglés, equivalente en español, salario promedio en CAD, por qué es un buen puente

5. DEMANDA POR PROVINCIA
- Top 5 provincias/territorios con mayor demanda para su perfil
- Para cada provincia: nivel de demanda (Alta/Media/Baja), nota sobre costo de vida

6. RANGOS SALARIALES
- Rango salarial para su rol en Canadá (entry, mid, senior) en CAD anual
- Comparación con salario promedio canadiense

7. IDIOMAS Y RECURSOS
- Nivel de CLB (Canadian Language Benchmark) sugerido para inglés y francés para este perfil.
- Lista de 2-3 recursos gratuitos específicos para mejorar el idioma orientado a su profesión.

8. EMPRESAS CON HISTORIAL DE CONTRATACIÓN INTERNACIONAL (LMIA)
- IMPORTANTE/CRÍTICO: Lista empresas SOLO si tienes 100% de certeza y DATOS HISTÓRICOS REALES de que han tramitado procesos de LMIA o patrocinio de visas (Closed Work Permits) para esta industria específica.
- Si las empresas en esta industria típicamente solo contratan extranjeros que ya tienen permisos de trabajo abiertos (Open Work Permits, estudiantes, Working Holiday), o si NO ESTÁS COMPLETAMENTE SEGURO de que la empresa da LMIA para este tipo de perfil, DEBES DEVOLVER UNA LISTA VACÍA []. Es preferible no mostrar nada a dar información falsa.
- Lista de 0 a 20 empresas (solo si estás seguro).
- Para cada empresa: nombre, sitio web URL, provincia principal, industria.

FORMATO DE SALIDA:
Retorna SOLO JSON válido con esta estructura exacta:
{
  "diagnostico": [
    {
      "problema": "string",
      "porque": "string",
      "cambio": "string"
    }
  ],
  "regulacion": {
    "esRegulada": true/false,
    "profesion": "string",
    "detalle": "string - explicación del estatus regulatorio general",
    "reguladoresPorProvincia": [
      {
        "provincia": "string",
        "entidad": "string - nombre del ente regulador",
        "url": "string - URL del sitio web",
        "notas": "string - proceso o requisitos específicos"
      }
    ],
    "procesoGeneral": "string - resumen del proceso para obtener licencia"
  },
  "certificaciones": [
    {
      "nombre": "string",
      "organismo": "string",
      "url": "string - URL del sitio web",
      "costoCAD": "string",
      "duracion": "string",
      "tipo": "Mandatoria | Altamente Recomendada | Nice to Have",
      "categoria": "Profesional | Cultura y Seguridad Laboral",
      "nota": "string - por qué es valiosa"
    }
  ],
  "rolesPuente": [
    {
      "titulo": "string - en inglés",
      "tituloEspanol": "string",
      "salarioPromedio": "string - en CAD anual",
      "porque": "string"
    }
  ],
  "demandaProvincia": [
    {
      "provincia": "string",
      "demanda": "Alta | Media | Baja",
      "nota": "string"
    }
  ],
  "salarios": {
    "entry": "string",
    "mid": "string",
    "senior": "string",
    "promedioCanada": "string"
  },
  "idiomas": {
    "clbIngles": "string - nivel sugerido",
    "clbFrances": "string - nivel sugerido",
    "recursos": [
      {
        "nombre": "string",
        "descripcion": "string",
        "url": "string"
      }
    ]
  },
  "empresasLMIA": [
    {
      "nombre": "string",
      "website": "string - URL",
      "provincia": "string",
      "industria": "string"
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: "El CV es muy corto para analizar." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analiza este CV y genera el reporte completo de empleabilidad canadiense:\n\n${cvText}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(
        { error: "No se recibió respuesta. Intenta de nuevo." },
        { status: 500 }
      );
    }

    const result = JSON.parse(rawContent);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("CV Analysis error:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
