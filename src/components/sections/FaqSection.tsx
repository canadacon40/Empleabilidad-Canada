"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"

export default function FaqSection() {
    const faqs = [
        {
            question: "¿Este servicio me garantiza entrevistas de trabajo?",
            answer: "No. Ningún profesional honesto puede garantizar llamadas ni ofertas. Este es un servicio estratégico y técnico. Yo te doy un mapa claro, transformo tu perfil al formato ATS canadiense y te enseño a ejecutar, pero el éxito final depende de tu constancia."
        },
        {
            question: "¿Haces trámites de inmigración o visas?",
            answer: "No. No soy consultor de inmigración (RCIC). Mi enfoque es 100% posicionamiento laboral. Asumo que ya tienes o estás gestionando tu permiso de trabajo o residencia."
        },
        {
            question: "Estoy fuera de Canadá, ¿me sirve comprar esto ahora?",
            answer: "Es el mejor momento. El error fatal es llegar a Canadá con un CV de tu país y quemar tus ahorros mientras aprendes a prueba y error. Llegar con herramientas listas te da una ventaja competitiva brutal."
        },
        {
            question: "¿Aplicas por mí a las empresas?",
            answer: "No. En el formato 'Acelerador PRO', recibes IA y tutoriales para adaptar tu perfil en 5 minutos. En el 'Plan + Mentoría', te enseño la estrategia exacta de networking. Tú eres el dueño de tu proceso."
        },
        {
            question: "¿Qué incluye la sesión del Plan + Mentoría ($109)?",
            answer: "Es una sesión profunda e intensiva (45-60 min) donde trazamos tu ruta. Saldrás con claridad total sobre qué roles buscar, qué evitar, y los siguientes pasos exactos para asegurar resultados reales."
        }
    ]

    return (
        <section id="faq" className="bg-slate-50 py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="mb-16 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-2 bg-slate-200 rounded-xl mb-4"
                    >
                         <HelpCircle className="w-5 h-5 text-slate-500" />
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
                        Preguntas Frecuentes. <br /> Respuestas Directas.
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Hablemos claro para evitar falsas expectativas. Aquí no hay magia, hay ejecución.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-2 border-slate-100 bg-white rounded-3xl px-8 py-2 overflow-hidden shadow-sm hover:border-primary/20 transition-all">
                                <AccordionTrigger className="text-base text-slate-900 font-bold hover:no-underline py-4 text-left leading-snug">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-500 leading-relaxed font-medium text-sm pt-2 pb-6 border-t border-slate-50">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">
                        ¿Sigues con dudas? Escríbenos abajo.
                    </p>
                </div>
            </div>
        </section>
    )
}
