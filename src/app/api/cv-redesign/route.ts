import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Configuración incompleta: Hace falta la clave de OpenAI (OPENAI_API_KEY) en las variables de entorno.");
        }

        const openai = new OpenAI({ apiKey });
        const { cvText, targetLanguage = 'En', nocCode, nocTitle, jdContext } = await req.json();

        if (!cvText) {
            return NextResponse.json({ error: 'No CV text provided' }, { status: 400 });
        }

        const languageInstruction = targetLanguage.toLowerCase() === 'fr' 
            ? 'Traducir y formatear el CV al FRANCÉS (estándar de Quebec).' 
            : 'Traducir y formatear el CV al INGLÉS (estándar del resto de Canadá).';

        const nocInstruction = (nocCode && nocTitle) 
            ? `\n\n[CONTEXTO NOC]: El código NOC objetivo de este candidato es ${nocCode} - ${nocTitle}. Asegúrate de alinear el lenguaje y las responsabilidades a las expectativas de este NOC Canadiense.` 
            : '';

        const jdInstruction = jdContext 
            ? `\n\n[CONTEXTO JD]: El candidato busca optimizar su CV para ESTA oferta laboral específica:\n"${jdContext}"\nDEBES priorizar fuertemente las palabras clave (keywords ATS), habilidades y fraseo de esa oferta en tu reescritura, sin inventar experiencia que no exista en su perfil originario.\n` 
            : '';

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Eres un Senior Executive Recruiter Canadiense de élite, experto en "Ingeniería Quirúrgica" de Perfiles Profesionales. Tu misión es transformar un perfil base en un "Canadian Style Resume" de impacto mundial.
                    
REGLAS DE ORO (SURGICAL PRECISION):
1. HEADLINE: Genera un titular profesional de alto impacto justo debajo del nombre (ej: "Senior Project Manager | PMP Certified | Digital Transformation Leader").
2. CONTACTO: Recupera Email, Teléfono, LinkedIn y Ubicación real. NO INVENTES.
3. LOGROS (KPIs): Usa la fórmula: VERBO DE ACCIÓN + TAREA + RESULTADO CUANTIFICABLE. Ejemplo: "Orchestrated a cross-functional team of 15 to deliver a $2M project 3 weeks ahead of schedule, reducing operational costs by 18%."
4. ATS OPTIMIZATION: Inyecta palabras clave (Keywords) de forma natural pero estratégica.
5. ${languageInstruction}${nocInstruction}${jdInstruction}
6. ENFOQUE: Tu misión es la EMPLEABILIDAD (conseguir la oferta). Menciona sutilmente que para temas migratorios y visas el candidato debe consultar IRCC (Canada.ca).
7. ESTRUCTURA: Mantén una jerarquía limpia y profesional.

Estructura obligatoria (formato JSON):
{
  "redesignedCv": {
    "personalInfo": {
      "fullName": "Nombre completo",
      "headline": "Titular profesional estratégico",
      "contactDetails": {
         "email": "correo@real.com",
         "phone": "+1 (XXX) XXX-XXXX",
         "linkedin": "url o nombre usuario",
         "location": "Ciudad, País (o Provincia, Canada)"
      }
    },
    "professionalSummary": "Párrafo de 3-4 líneas con altísima densidad de valor.",
    "coreCompetencies": ["Habilidad Técnica 1", "Keyword ATS 2", "Competencia 3"],
    "workExperience": [
      {
        "jobTitle": "Título optimizado",
        "company": "Nombre Empresa",
        "location": "Ciudad, País",
        "period": "Mes Año - Mes Año (o Present)",
        "achievements": [ 
           "Logro con métrica 1", 
           "Logro con métrica 2" 
        ]
      }
    ],
    "education": [ { "degree": "Título", "institution": "Universidad/College", "year": "Año" } ],
    "certifications": ["Certificación Pro 1", "Licencia 2"],
    "achievements": ["Logro Extra/Reconocimiento 1"],
    "languages": ["Idioma (Nivel, ej: Fluent or Native)"]
  },
  "noc": {
    "codigo": "XXXXX",
    "titulo": "Título NOC Oficial",
    "explicacion": "Por qué este perfil es este NOC",
    "compatibilidad": "Alta/Media"
  },
  "rolesCompatibles": ["Cargo 1", "Cargo 2", "Cargo 3"], 
  "summary": "Breve nota de Pierre sobre el rediseño aplicado"
}`
                },
                {
                    role: "user",
                    content: `Aplica tus mejoras y transforma este perfil:\n\n${cvText}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{}';
        const redesignedData = JSON.parse(content);

        return NextResponse.json({ result: redesignedData });
    } catch (error: any) {
        console.error('CV Redesign error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
