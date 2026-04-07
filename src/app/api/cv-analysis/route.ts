import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from "@/auth";
import { consumeCredit } from "@/lib/credits";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        const isMockMode = process.env.MOCK_ANALYSIS === 'true';

        if (isMockMode) {
            const mockAnalysis = {
                // ... (keeping structure)
                diagnosticoEjecutivo: {
                    resumenEjecutivo: {
                        descripcion: "Perfil con talento técnico latente pero con una arquitectura de CV obsoleta para el mercado canadiense (ATS).",
                        conclusionClave: "Tienes el talento, pero tu CV actual te hace invisible. Estás enviando botellas al mar sin brújula."
                    },
                    scoreMultidimensional: {
                        tecnica: 6,
                        transferibilidad: 4,
                        ingles: 4,
                        posicionamiento: 2,
                        acceso: 3,
                        red: 2,
                        interpretacionEstrategica: "Riesgo de estancamiento. El perfil requiere una reestructuración total de marca personal y networking."
                    },
                    principalesBloqueadores: [
                        {titulo: "Formato 'Latino' Detectado", descripcion: "Tu CV incluye foto, edad y datos irrelevantes que activan el rechazo automático en Canadá.", impacto: "Crítico", insight: "El ATS te descarta en 2 segundos."},
                        {titulo: "Falta de Palabras Clave", descripcion: "No mencionas las herramientas del stack tecnológico canadiense para tu NOC.", impacto: "Alto", insight: "No existes para los motores de búsqueda."}
                    ],
                    factoresApalancamiento: [
                        {titulo: "Experiencia Senior", descripcion: "Tus años de trabajo son valiosos, pero están 'escondidos' bajo una mala narrativa."},
                        {titulo: "Potencial NOC", descripcion: "Tu ocupación está en demanda, solo falta demostrarlo bajo el estándar local."}
                    ],
                    diagnosticoEstrategicoFinal: {
                        realidadActual: "Estás aplicando a ciegas y perdiendo tiempo.",
                        potencial: "Si optimizas hoy, podrías duplicar tu score en 1 semana.",
                        conclusionClave: "La brecha es de posicionamiento, no de capacidad técnica."
                    },
                    nivelEsfuerzoRequerido: { cortoPlazo: "Reforma total de CV", medianoPlazo: "Mejora de Inglés CLB", largoPlazo: "Estrategia de Networking" },
                    disclaimerEstrategico: "Simulación de Diagnóstico Inicial (40%) por Digital Pierre."
                },
                introduccion: "¡Hola! Mi análisis indica que tienes un perfil con potencial, pero tu estrategia de entrada a Canadá está en alto riesgo. Aquí te explico por qué.",
                puntaje: {
                    base: 40,
                    penalizacionIdioma: -10,
                    final: 30,
                    potencialCrecimiento: [{accion: "Optimización ATS Estratégica", impactoPorcentaje: "+45%"}],
                    level: "HIGH_RISK",
                    analisisScore: "Score bajo. Falta de adaptabilidad al estándar canadiense y debilidad en la visibilidad del talento."
                },
                diagnostico: [{problema: "CV no amigable con ATS", porque: "Contiene demasiadas tablas e imágenes", cambio: "Usa el formato canadiense minimalista de texto puro"}],
                analisisNOC: {
                    codigo: "2171",
                    titulo: "Information Systems Analysts",
                    queEsElNOC: "El código que define tu profesión ante el gobierno de Canadá.",
                    linkOficialNOC: "https://noc.esdc.gc.ca/",
                    requisitosNoCumplidos: ["Certificación local", "Validación de credenciales"]
                },
                mercado: {
                    demandaGeneral: "Alta",
                    razonamiento: "Tu ocupación hace falta, pero el mercado es ultra-competitivo.",
                    provincias: [
                        {provincia: "Ontario", nivel: "Alta", razon: "Fuerte competencia local"},
                        {provincia: "Quebec", nivel: "Media", razon: "Requiere francés fluido"},
                        {provincia: "BC", nivel: "Media", razon: "Costos de vida altos"},
                        {provincia: "Alberta", nivel: "Alta", razon: "Buena relación salario/costo"},
                        {provincia: "Saskatchewan", nivel: "Muy Alta", razon: "Programas provinciales amigables"}
                    ]
                },
                idiomas: {
                    clbActualEstimado: 5,
                    minimoFuncional: "CLB 7",
                    competitivoMercado: "CLB 9",
                    evaluacion: "Nivel insuficiente para roles profesionales. Prioridad #1: Mejorar el CLB.",
                    cronogramaMejora: {horizonteTiempo: "4 meses", estrategia: "Inmersión total", enlacesGratuitos: [{nombre: "Duolingo for Biz", url: "#"}]}
                },
                rolesPuente: [
                    {titulo: "Help Desk Support", descripcionNOC: "Soporte técnico", porque: "Mejora tu inglés técnico", funciones: ["Resolución de tickets"], salarioAnual: "55,000 CAD"},
                    {titulo: "Data Entry Specialist", descripcionNOC: "Entrada de datos", porque: "Barrera baja", funciones: ["Procesamiento"], salarioAnual: "45,000 CAD"},
                    {titulo: "IT Field Technician", descripcionNOC: "Técnico de campo", porque: "Experiencia canadiense rápida", funciones: ["Mantenimiento"], salarioAnual: "60,000 CAD"}
                ],
                atsYEtica: { keywordsFaltantes: ["Compliance", "Agile Management", "Cloud architecture"], quickWins: ["Quitar la foto", "Traducir al inglés"], cumplimientoEtico: "Requiere ajustes legales." },
                regulacion: { profesion: "Tecnología", esRegulada: false, quePuedesHacer: "Soporte técnico", queNoPuedesHacer: "Firma de proyectos", comoRegularizarse: "WES Evaluation", entidades: [] },
                certificaciones: { mandatory: [], highlyRecommended: [{nombre: "CompTIA A+", estimadoInversion: "$$", duracion: "3 meses", sitioOficial: "#"}], niceToHave: [] },
                salarios: {entry: "45k", mid: "75k", senior: "110k"},
                conclusionEjecutiva: { esEmpleableAhora: false, detalleEmpleabilidad: "Talento alto, pero invisible para las empresas.", probabilidadDesdeDentro: "20%", probabilidadDesdeFuera: "2%", impactoCorrecciones: "Subirías de 2% a 40% de éxito en 2 semanas.", recomendacionMaestra: "No apliques más en este momento. Tu CV actual está dañando tu reputación digital." },
                bonus: { estructuraCVRecomendada: { orden: ["Resumen Profesional", "Core Skills", "Logros"], tipsVisuales: ["Sin fotos", "Máximo 2 páginas", "Blanco y negro"] } },
                empresasLMIA: { lista: [{nombre: "Consultora Tech Inc", industria: "Tech", provincia: "AB", website: "#"}] },
                veredictoFinal: { conclusion: "Estás estancado por falta de estrategia, no por falta de capacidad.", ofertaEstrategica: "Optimiza tu CV con Pierre PRO para salir del riesgo hoy." }
            };

            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json({ result: mockAnalysis });
        }

        const openai = new OpenAI({ apiKey });
        const body = await req.json();
        const { cvText, leadId, linkedinUrl, networking, workPermitStatus } = body;

        if (!cvText) {
            return NextResponse.json({ error: 'No CV text provided' }, { status: 400 });
        }

        // --- CREDIT ENFORCEMENT ---
        const session = await auth();
        if (session?.user?.email) {
            const creditCheck = await consumeCredit(session.user.email);
            if (!creditCheck.success) {
                return NextResponse.json({ 
                    error: 'Créditos Insuficientes', 
                    details: 'Has superado el límite de 10 interacciones de tu beca. Actualiza a PRO para acceso ilimitado.' 
                }, { status: 403 });
            }
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Eres "Digital Pierre", el estratega de carrera #1 para el mercado canadiense y creador del "Radar de Empleo". Tu misión es realizar una auditoría de empleabilidad estratégica, implacable y de alto valor sobre un CV.

### 1. CONTEXTO Y FILOSOFÍA
- El reporte debe empezar explicando que analizar el perfil es el "Paso 0" crítico. Aplicar sin este diagnóstico es una pérdida de tiempo y recursos.
- Tu tono es profesional, directo, mentor y visionario.

### 2. LÓGICA DE PUNTUACIÓN (REGLAS DE ORO)
- scoreBase: Calidad técnica, estructura y logros (0-100).
- penalizacionIdioma: Valor negativo si el CV no está en Inglés o Francés.
- REGLA MANDATORIA: Si el CV está en ESPAÑOL, el 'scoreFinal' NO PUEDE superar los 40 puntos.
- PERFILES DE OFICIOS (TRADES): Para soldadores, electricistas, mecánicos, etc., valora la EXPERIENCIA TÉCNICA y certificaciones por encima del idioma. Si tienen inglés básico pero técnica sólida, el 'scoreFinal' puede ser hasta 45 si el CV está en español, o 65 si ya está en inglés.
- Explica qué nivel CLB es "Mínimo Funcional" (para entrar) e identifica si el usuario ya lo cumple.
- **DIMENSIONES ESTRATÉGICAS (0-10):** Valora 'acceso' según el estatus migratorio real proporcionado. Valora 'red' según la respuesta de networking del usuario.

### 3. REDUCCIÓN DE ALUCINACIONES
- No inventes nombres de empresas específicas con LMIA ni precios exactos de certificaciones.
- En Certificaciones, usa 'estimadoInversion' con símbolos ($, $$, $$$).
- Redirige siempre al "Job Bank" o sitios oficiales (.gc.ca).

### 4. SECCIONES "WOW" (VALOR AGREGADO)
- Keyword Gap (ATS): Lista 10 palabras clave que el CV NECESITA para ese NOC.
- TLC (IMP): Si el usuario es de México, Colombia, Chile, Perú o Panamá, indica sus ventajas migratorias específicas (exención de LMIA).

Estructura obligatoria (format JSON):
{
  "diagnosticoEjecutivo": {
    "resumenEjecutivo": {
      "descripcion": "Análisis de alto nivel sobre la competitividad técnica vs barreras estructurales",
      "conclusionClave": "La verdad cruda sobre si es un problema de experiencia o de posicionamiento"
    },
    "scoreMultidimensional": {
      "tecnica": "número (0-10)",
      "transferibilidad": "número (0-10)",
      "ingles": "número (0-10)",
      "posicionamiento": "número (0-10)",
      "acceso": "número (0-10)",
      "red": "número (0-10)",
      "interpretacionEstrategica": "Descripción basada en el score global"
    },
    "principalesBloqueadores": [
      {"titulo": "string", "descripcion": "string", "impacto": "string", "insight": "string"}
    ],
    "factoresApalancamiento": [
      {"titulo": "string", "descripcion": "string"}
    ],
    "diagnosticoEstrategicoFinal": {
      "realidadActual": "string",
      "potencial": "string",
      "conclusionClave": "string"
    },
    "nivelEsfuerzoRequerido": {
      "cortoPlazo": "0-3 meses",
      "medianoPlazo": "3-6 meses",
      "largoPlazo": "6-12 meses"
    },
    "disclaimerEstrategico": "Texto legal"
  },
  "introduccion": "string",
  "puntaje": {
    "base": "número",
    "penalizacionIdioma": "número",
    "final": "número",
    "potencialCrecimiento": [
        {"accion": "string", "impactoPorcentaje": "string"}
    ],
    "level": "CRITICAL_RISK" | "HIGH_RISK" | "MEDIUM_RISK" | "LOW_RISK" | "PREMIUM",
    "analisisScore": "string"
  },
  "diagnostico": [
    {"problema": "string", "porque": "string", "cambio": "string"}
  ],
  "analisisNOC": {
    "codigo": "string",
    "titulo": "string",
    "queEsElNOC": "string",
    "linkOficialNOC": "string",
    "requisitosNoCumplidos": ["string"]
  },
  "mercado": {
    "demandaGeneral": "Muy Alta" | "Alta" | "Media" | "Baja",
    "razonamiento": "string",
    "provincias": [
      {"provincia": "string", "nivel": "string", "razon": "string"}
    ]
  },
  "idiomas": {
    "clbActualEstimado": "number",
    "minimoFuncional": "string",
    "competitivoMercado": "string",
    "evaluacion": "string",
    "cronogramaMejora": {"horizonteTiempo": "string", "estrategia": "string", "enlacesGratuitos": [{"nombre": "string", "url": "string"}]}
  },
  "rolesPuente": [
    {"titulo": "string", "descripcionNOC": "string", "porque": "string", "funciones": ["string"], "salarioAnual": "string"}
  ],
  "atsYEtica": {
    "keywordsFaltantes": ["string"],
    "quickWins": ["string"],
    "cumplimientoEtico": "string"
  },
  "regulacion": { "profesion": "string", "esRegulada": "boolean", "quePuedesHacer": "string", "queNoPuedesHacer": "string", "comoRegularizarse": "string", "entidades": [{"provincia": "string", "nombre": "string", "url": "string"}] },
  "certificaciones": {
    "mandatory": [{"nombre": "string", "estimadoInversion": "string", "duracion": "string", "sitioOficial": "string"}],
    "highlyRecommended": [{"nombre": "string", "estimadoInversion": "string", "duracion": "string", "sitioOficial": "string"}],
    "niceToHave": [{"nombre": "string", "estimadoInversion": "string", "duracion": "string", "sitioOficial": "string"}]
  },
  "salarios": {"entry": "string", "mid": "string", "senior": "string"},
  "conclusionEjecutiva": { "esEmpleableAhora": "boolean", "detalleEmpleabilidad": "string", "probabilidadDesdeDentro": "string", "probabilidadDesdeFuera": "string", "impactoCorrecciones": "string", "recomendacionMaestra": "string" },
  "bonus": { "estructuraCVRecomendada": { "orden": ["string"], "tipsVisuales": ["string"] } },
  "empresasLMIA": { "lista": [{"nombre": "string", "industria": "string", "provincia": "string", "website": "string"}] },
  "veredictoFinal": { "conclusion": "string", "ofertaEstrategica": "string" }
}

### REGLAS CRÍTICAS DE SALIDA:
- PROVINCIAS: DEBES incluir un análisis de EXACTAMENTE 5 provincias de Canadá en 'mercado.provincias', priorizando mayor demanda para el NOC.
- ROLES PUENTE: DEBES proporcionar EXACTAMENTE 3 roles en 'rolesPuente'. El 'titulo' DEBE ESTAR EN INGLÉS (ej. "Welder Helper", NO "Ayudante de Soldador").
- IDIOMAS Y CERTIFICACIONES: Incluye siempre un horizonte de tiempo y 3 enlaces reales y útiles para aprender gratis en 'enlacesGratuitos', y estimación de costos/sitio oficial en certificaciones.
- PROBABILIDADES Y CRECIMIENTO: En 'conclusionEjecutiva', detalla porcentajes realistas en 'probabilidadDesdeDentro' y 'probabilidadDesdeFuera'. En 'puntaje.potencialCrecimiento' detalla 3 acciones asumiendo que el CV está en español, con su impacto numérico explícito (ej. '+15%', '+10%').
- NOC: Explica qué es el NOC brevemente en 'queEsElNOC' y entrega un link verificable real en 'linkOficialNOC'.`
                },
                {
                    role: "user",
                    content: `Analiza este CV y genera el reporte estratégico completo Pierre 2.5 en formato json. 
CONTEXTO ADICIONAL DEL USUARIO:
- LinkedIn: ${linkedinUrl || 'No proporcionado'}
- Red de Contactos: ${networking || 'Desconocida'}
- Estatus Permiso de Trabajo: ${workPermitStatus || 'No proporcionado'}

CV TEXT: ${cvText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{}';
        const analysis = JSON.parse(content);

        if (leadId) {
            try {
                const prisma = (await import("@/lib/db")).default;
                await prisma.score.create({
                    data: {
                        leadId: leadId,
                        level: analysis.puntaje?.level || "MEDIUM_RISK",
                        summary: analysis.veredictoFinal?.conclusion || analysis.conclusionEjecutiva?.recomendacionMaestra || "Análisis completado",
                        gaps: analysis.diagnostico || [],
                    }
                });
                await prisma.lead.update({
                    where: { id: leadId },
                    data: { status: "EVALUATED" }
                });
            } catch (dbError) {
                console.error('❌ [CV-ANALYSIS] Error de persistencia en DB:', dbError);
            }
        }

        return NextResponse.json({ result: analysis });
    } catch (error: any) {
        console.error('CV Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
