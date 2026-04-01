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
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Eres un Reclutador Especialista Canadiense de alto nivel (Senior Recruiter) experto en Sistemas ATS. Tu misión es tomar un perfil y transformarlo o hiper-optimizarlo al estricto "Formato Canadiense" (Canadian Style Resume).
                    
REGLAS ESTRICTAS:
1. NUNCA inventes experiencia laboral, educacional o certificaciones que no existan en el texto del candidato.
2. Elimina cualquier información personal (edad, estado civil, foto, religión, nacionalidad).
3. Transforma las responsabilidades en LOGROS CUANTIFICABLES e inyecta alto calibre técnico. 
4. ${languageInstruction}${nocInstruction}${jdInstruction}
5. ES VITAL QUE RECUPERES LA INFORMACIÓN DE CONTACTO REAL (Teléfono, Email, LinkedIn, Ubicación) DEL TEXTO ORIGINAL Y LA PONGAS EN "contactDetails". NO INVENTES NADA.

Estructura obligatoria (formato JSON):
{
  "redesignedCv": {
    "personalInfo": {
      "fullName": "Nombre completo extraído del candidato",
      "contactDetails": ["Correo electrónico real", "Teléfono real", "LinkedIn o Enlaces", "Ciudad/País real"]
    },
    "professionalSummary": "Un párrafo impactante destacando la propuesta de valor sin usar primera persona.",
    "coreCompetencies": ["Hab 1", "Hab 2", "Hab 3", "Hab 4"],
    "workExperience": [
      {
        "jobTitle": "Título del puesto reestructurado a formato canadiense",
        "companyAndLocation": "Empresa Original, Ubicación",
        "dates": "Fechas Originales (ej. Mar 2020 - Present)",
        "achievements": [ "Logro medible 1 (Acción + Tarea + Resultado)", "Logro medible 2" ]
      }
    ],
    "education": [ { "degree": "Título Original", "institutionAndLocation": "Lugar", "year": "Año" } ],
    "certifications": ["Certificación 1", "Cert 2"],
    "languages": ["Idioma 1", "Idioma 2"]
  },
  "noc": {
    "codigo": "Código numérico NOC de 5 dígitos",
    "titulo": "Título oficial del NOC",
    "explicacion": "Explicación breve de por qué este perfil encaja con este NOC",
    "compatibilidad": "Alta, Media o Baja"
  },
  "rolesCompatibles": ["Rol 1", "Rol 2", "Rol 3"], // Array de hasta 10 títulos de puesto exactos para aplicar
  "summary": "Breve justificación de las mejoras aplicadas"
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
