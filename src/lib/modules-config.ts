import { 
  Target, 
  Map, 
  FileText, 
  EyeOff, 
  Users, 
  MessageSquare, 
  Video, 
  DollarSign, 
  Zap, 
  Globe, 
  Share2,
  ShieldCheck 
} from "lucide-react"

export interface Module {
  id: string
  title: string
  description: string
  icon: any
  duration: string
  category: "Estrategia" | "Herramientas" | "Entrevistas" | "Cierre"
  proToolLink?: string
  objectives: string[]
  keyTakeaways: string[]
}

export const employabilityModules: Module[] = [
  {
    id: "m0",
    title: "M0: Diagnóstico de Brecha",
    description: "Evaluación Crítica. Descubre exactamente qué te separa de tu primer contrato en Canadá.",
    icon: Target,
    duration: "20 min",
    category: "Estrategia",
    objectives: [
      "Obtener un score de empleabilidad realista",
      "Identificar los 3 bloqueadores críticos de tu perfil",
      "Mapear los escenarios optimistas y restrictivos de tu búsqueda"
    ],
    keyTakeaways: [
      "La honestidad sobre tu nivel actual es el primer paso para ganar",
      "No todas las brechas se cierran con estudio; algunas se cierran con estrategia",
      "Tu mapa de ruta depende de tu punto de partida real, no del ideal"
    ]
  },
  {
    id: "m1",
    title: "M1: Mentalidad y Mercado",
    description: "Elimina los bloqueos mentales y entiende la realidad del reclutamiento en Canadá.",
    icon: Target,
    duration: "45 min",
    category: "Estrategia",
    objectives: [
      "Comprender la diferencia entre el mercado latino y el canadiense",
      "Identificar bloqueos mentales sobre la experiencia internacional",
      "Definir el nuevo posicionamiento estratégico de valor"
    ],
    keyTakeaways: [
      "El mercado canadiense no busca 'jefes', busca 'solucionadores de problemas'",
      "Tu título no es lo que importa, sino el impacto medible que generas",
      "La humildad estratégica es la clave para entrar en roles de liderazgo"
    ]
  },
  {
    id: "m2",
    title: "M2: Inteligencia de Mercado (NOC)",
    description: "Tu código NOC es tu brújula. Aprende a leer la demanda real por provincia.",
    icon: Map,
    duration: "60 min",
    category: "Estrategia",
    objectives: [
      "Encontrar tu código NOC primario y secundarios",
      "Analizar la demanda laboral por provincia y ciudad",
      "Identificar brechas salariales reales para tu perfil"
    ],
    keyTakeaways: [
      "El NOC es el lenguaje técnico que usan los reclutadores y migración",
      "No todas las provincias necesitan tu perfil por igual; elige tu batalla",
      "La concordancia entre tus tareas previas y el NOC es un requisito legal y laboral"
    ]
  },
  {
    id: "m3",
    title: "M3: El CV Estratégico (ATS)",
    description: "Deja de enviar currículums. Empieza a enviar soluciones adaptadas al sistema local.",
    icon: FileText,
    duration: "90 min",
    category: "Herramientas",
    proToolLink: "/cv-tool",
    objectives: [
      "Crear un Master CV con enfoque en logros",
      "Optimizar el documento para filtros ATS (Applicant Tracking Systems)",
      "Eliminar sesgos internacionales innecesarios"
    ],
    keyTakeaways: [
      "Un CV de 2 páginas es el estándar de oro en Canadá",
      "Usa verbos de acción y métricas (%, $, #) en cada bala de experiencia",
      "El CV es un documento de marketing, no una biografía histórica"
    ]
  },
  {
    id: "m4",
    title: "M4: LinkedIn Power Up",
    description: "Configura tu imán de reclutadores. SEO y Branding para el mercado canadiense.",
    icon: Share2,
    duration: "75 min",
    category: "Herramientas",
    objectives: [
      "Configurar el titular y el 'About' para SEO local",
      "Activación estratégica de la sección 'Skills'",
      "Diseño de una red de contactos de alto valor"
    ],
    keyTakeaways: [
      "Tu titular debe decir qué problema resuelves, no solo tu puesto",
      "El 'About' debe narrar tu propuesta de valor única en primera persona",
      "LinkedIn es una herramienta de búsqueda para reclutadores; facilítales encontrarte"
    ]
  },
  {
    id: "m5",
    title: "M5: El Mercado Oculto (70/30)",
    description: "Descubre dónde están las vacantes que nunca llegan a LinkedIn o Indeed.",
    icon: EyeOff,
    duration: "50 min",
    category: "Estrategia",
    objectives: [
      "Mapear empresas objetivo que no publican vacantes activamente",
      "Entender cómo funcionan los programas de referidos internos",
      "Identificar los 'Gatekeepers' de las oportunidades"
    ],
    keyTakeaways: [
      "El 70% de los empleos en Canadá se llenan por contactos y referidos",
      "Postular por portales es la forma más lenta y competitiva de buscar",
      "La estrategia de 'Target Companies' vence a la de 'Infinite Scrolling'"
    ]
  },
  {
    id: "m6",
    title: "M6: Networking de Alto Impacto",
    description: "Cómo conectar con managers sin parecer desesperado. El arte del Coffee Chat.",
    icon: Users,
    duration: "90 min",
    category: "Estrategia",
    objectives: [
      "Aprender a solicitar 'Informational Interviews'",
      "Protocolo de un Coffee Chat productivo (Presencial/Virtual)",
      "Seguimiento estratégico sin ser invasivo"
    ],
    keyTakeaways: [
      "Un Coffee Chat NO es para pedir trabajo, es para pedir información",
      "La curiosidad por la cultura local abre más puertas que tu CV",
      "Siempre termina una conversación preguntando: '¿A quién más me recomiendas conocer?'"
    ]
  },
  {
    id: "m7",
    title: "M7: Entrevistas Ganadoras (STAR)",
    description: "Domina la técnica de respuesta conductual que exigen las empresas canadienses.",
    icon: MessageSquare,
    duration: "120 min",
    category: "Entrevistas",
    objectives: [
      "Estructurar historias de éxito usando el método STAR",
      "Anticipar preguntas de comportamiento y situacionales",
      "Controlar la narrativa durante momentos de presión"
    ],
    keyTakeaways: [
      "Situación, Tarea, Acción y Resultado: No te saltes el Resultado",
      "Se busca consistencia entre lo que dice tu CV y lo que narras",
      "El 80% de las entrevistas en Canadá fallan por falta de estructura en las respuestas"
    ]
  },
  {
    id: "m8",
    title: "M8: Entrevistas Virtuales (Cultura)",
    description: "Pequeños detalles, gran impacto. El ajuste cultural es la clave del 'Yes'.",
    icon: Video,
    duration: "45 min",
    category: "Entrevistas",
    objectives: [
      "Optimización de entorno para entrevistas por Zoom/Teams",
      "Dominar el 'Small Talk' cultural canadiense",
      "Manejo de lenguaje corporal en entornos digitales"
    ],
    keyTakeaways: [
      "El reclutador está evaluando si quiere trabajar contigo 8 horas al día",
      "La puntualidad y el entorno profesional demuestran 'Canadian Fit'",
      "Haz preguntas inteligentes al final; el silencio es falta de interés"
    ]
  },
  {
    id: "m9",
    title: "M9: Negociación Salarial",
    description: "No aceptes la primera oferta. Aprende a negociar beneficios y salario base.",
    icon: DollarSign,
    duration: "60 min",
    category: "Cierre",
    objectives: [
      "Investigar rangos salariales reales por industria",
      "Entender el paquete de beneficios (RRSP, Extended Health)",
      "Técnicas de contraoferta sin poner en riesgo la vacante"
    ],
    keyTakeaways: [
      "Nunca des un número primero si puedes evitarlo",
      "Todo en Canadá es negociable: Vacaciones, bonos, trabajo remoto",
      "Una buena negociación puede significar 10k-20k adicionales al año"
    ]
  },
  {
    id: "m10",
    title: "M10: Uso Experto del Radar PRO",
    description: "Automatiza tu búsqueda. Deja que la IA haga el trabajo pesado de matching.",
    icon: Zap,
    duration: "40 min",
    category: "Herramientas",
    proToolLink: "/radar",
    objectives: [
      "Configuración de alertas de alta precisión",
      "Uso de IA para adaptar el CV a cada oferta en segundos",
      "Gestión de canales de aplicación masiva inteligente"
    ],
    keyTakeaways: [
      "La IA es tu asistente, no tu reemplazo; revisa siempre el output",
      "Calidad sobre cantidad: 5 aplicaciones perfectas valen más que 50 genéricas",
      "Usa el Radar para medir tu progreso y ajustar tu estrategia semanal"
    ]
  },
  {
    id: "m11",
    title: "M11: Multiculturalidad",
    description: "Cómo integrarte en un equipo diverso y entender el 'small talk' canadiense.",
    icon: Globe,
    duration: "50 min",
    category: "Estrategia",
    objectives: [
      "Comprender la etiqueta laboral canadiense",
      "Navegar la diversidad cultural en el lugar de trabajo",
      "Construir relaciones profesionales a largo plazo"
    ],
    keyTakeaways: [
      "La comunicación directa pero educada es la norma",
      "El respeto a la diversidad no es opcional, es parte del ADN corporativo",
      "Tu red de contactos interna es tan importante como la externa"
    ]
  },
  {
    id: "m12",
    title: "M12: Hoja de Ruta Final",
    description: "Tu plan de acción diario para conseguir tu primer contrato en 90 días.",
    icon: ShieldCheck,
    duration: "30 min",
    category: "Cierre",
    objectives: [
      "Diseñar tu rutina diaria de búsqueda de alto impacto",
      "Establecer KPIs de éxito (Contactos/Semana, Aplicaciones/Semana)",
      "Plan de mantenimiento de moral y resiliencia"
    ],
    keyTakeaways: [
      "La búsqueda de empleo es un trabajo de tiempo completo",
      "Consistencia > Intensidad",
      "Este es solo el comienzo de tu carrera en Canadá"
    ]
  }
]
