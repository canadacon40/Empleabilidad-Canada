"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
    const faqs = [
        {
            question: "¿Este servicio me garantiza entrevistas de trabajo?",
            answer: "No. Ningún profesional honesto puede garantizar llamadas ni ofertas. Este es un servicio estratégico y técnico. Yo te doy un mapa claro, transformo tu perfil (CV) al formato ATS canadiense, y te enseño a ejecutar, pero el desempeño en la entrevista y la constancia de aplicar dependen de ti."
        },
        {
            question: "¿Haces trámites de inmigración o visas?",
            answer: "No. No soy consultor de inmigración (RCIC) ni vendo programas de estudio. Mi asesoría se centra 100% en posicionamiento laboral. Asumo que ya tienes o estás resolviendo tu vía migratoria."
        },
        {
            question: "Estoy fuera de Canadá, ¿me sirve comprar esto ahora?",
            answer: "Sí, es el mejor momento. El error de muchos es llegar a Canadá con un CV de su país y aplicar sin saber cómo funciona el mercado. Conocer el terreno y tener tus herramientas listas antes de llegar te ahorrará meses de frustración y gastos."
        },
        {
            question: "Aplicas por mí a las empresas?",
            answer: "No aplico por el cliente. En el formato 'Canadian CV + Strategy Tool', recibes herramientas especializadas y tutoriales para adaptar tu perfil a cada oferta de trabajo de forma inteligente. En el 'Sistema Integral', te enseño la estrategia exacta de búsqueda y networking."
        },
        {
            question: "¿Cuánto dura la asesoría del Sistema Integral ($89)?",
            answer: "Es una sesión profunda e intensiva (usualmente de 1 hora) donde trazamos tu ruta. Saldrás con claridad total sobre qué roles buscar, qué evitar, y los siguientes pasos exactos para los próximos 60-90 días."
        }
    ]

    return (
        <section id="faq" className="bg-muted/10 py-24 px-4 sm:px-6">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Preguntas Frecuentes
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Hablemos claro para evitar cualquier falsa expectativa.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full rounded-xl border bg-background px-6 shadow-sm">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="last:border-0 border-b border-border/50 py-2">
                            <AccordionTrigger className="text-base text-foreground font-semibold hover:no-underline hover:text-primary transition-colors text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed text-sm pt-2 pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
