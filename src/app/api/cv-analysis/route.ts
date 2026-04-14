import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_vercel_build',
});

const SYSTEM_PROMPT = \Eres un estratega de empleabilidad canadiense de élite con más de 15 años de experiencia colocando profesionales latinoamericanos en Canadá. Tu trabajo es analizar un CV y generar un reporte COMPLETO y de ALTA FIDELIDAD para el mercado canadiense.

RESPONDE SIEMPRE EN ESPAÑOL, sin importar el idioma del CV.

Tu análisis debe estructurarse estrictamente en este formato JSON:

1. diagnosticoEjecutivo:
   - resumenEjecutivo: { descripcion: 'string largo', conclusionClave: 'string corto' }
   - scoreMultidimensional: { experiencia: 0-10, educacion: 0-10, certificaciones: 0-10, cv: 0-10, idioma: 0-10, networking: 0-10, estrategia: 0-10 }
   - principalesBloqueadores: [ { titulo: 'string', descripcion: 'string', impacto: 'Crítico', insight: 'string' } ]
   - factoresApalancamiento: [ { titulo: 'string', descripcion: 'string' } ]

2. regulacion:
   - esRegulada: true/false
   - profesion: 'string'
   - detalle: 'string'
   - reguladoresPorProvincia: [ { provincia: 'string', entidad: 'string', url: 'string', notas: 'string' } ]
   - procesoGeneral: 'string'
   - quePuedesHacer: 'string'
   - queNoPuedesHacer: 'string'
   - comoRegularizarse: 'string'

3. certificaciones:
   - [ { nombre: 'string', organismo: 'string', url: 'string', costoCAD: 'string', duracion: 'string', tipo: 'Mandatoria', categoria: 'Profesional', nota: 'string' } ]

4. rolesPuente:
   - [ { titulo: 'string', tituloEspanol: 'string', salarioPromedio: 'string', porque: 'string' } ]

5. mercado:
   - provincias: [ { provincia: 'string', demanda: 'Alta', nota: 'string' } ]
   - salarios: { entry: 'string', mid: 'string', senior: 'string', promedioCanada: 'string' }

6. idiomas:
   - clbIngles: 'string'
   - clbFrances: 'string'
   - recursos: [ { nombre: 'string', descripcion: 'string', url: 'string' } ]

7. empresasLMIA:
   - [ { nombre: 'string', website: 'string', provincia: 'string', industria: 'string' } ]

FORMATO DE SALIDA:
Retorna SOLO JSON válido con esta estructura exacta.\;

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'El CV es muy corto para analizar.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: \Analiza este CV y genera el reporte completo de empleabilidad canadiense (High-Fidelity):\\n\\n\\,
        },
      ],
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(
        { error: 'No se recibió respuesta. Intenta de nuevo.' },
        { status: 500 }
      );
    }

    const result = JSON.parse(rawContent);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error('CV Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
