"use client"

import { Star, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
    return (
        <section id="reviews" className="bg-background py-24 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-12 md:text-center text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Casos de Estudio Verificados
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground mx-auto">
                        Los resultados hablan por sí solos. Nuestra comunidad de profesionales comparte cómo el Sistema Integral de Empleabilidad cambió su trayectoria en Canadá.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
                    <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/10 p-8 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic mb-6">
                                "Llevaba 8 meses mandando el mismo CV que usaba en Colombia. Nadie llamaba. Pierre me destrozó el ego en la primera sesión y me explicó que mi experiencia como Director de Planta aquí no servía sin un 'Bridge Role'. Ajustamos el foco a Supervisor de Operaciones, metimos palabras clave para el ATS y a las 3 semanas firmé mi primer contrato."
                            </p>
                        </div>
                        <div className="border-t border-border/50 pt-4 mt-auto">
                            <p className="font-semibold text-foreground">Luis O.</p>
                            <p className="text-sm text-muted-foreground">Operaciones & Supply Chain</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/10 p-8 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic mb-6">
                                "Pensé que por ser del área de TI me iban a llover ofertas por mi buen inglés. Falso. Mi LinkedIn espantaba a los reclutadores porque no usaba la semántica norteamericana. La mentoría sobre cómo atacar el 'Hidden Market' e interactuar con Hiring Managers me ahorró meses y miles de dólares de ahorros perdidos."
                            </p>
                        </div>
                        <div className="border-t border-border/50 pt-4 mt-auto">
                            <p className="font-semibold text-foreground">Carolina M.</p>
                            <p className="text-sm text-muted-foreground">Analista de Datos</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/10 p-8 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic mb-6">
                                "El mayor valor no son las sesiones, son las herramientas que te entregan. Antes pagaba $150 a 'agencias' para que me arreglaran la Hoja de Vida. Ahora, con el Sistema que me dejó armado, yo misma agarro una vacante de Indeed, la proceso con la herramienta siguiendo su estructura, y saco un formato perfecto en 5 minutos."
                            </p>
                        </div>
                        <div className="border-t border-border/50 pt-4 mt-auto">
                            <p className="font-semibold text-foreground">Fernanda R.</p>
                            <p className="text-sm text-muted-foreground">Especialista en Marketing</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/10 p-8 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic mb-6">
                                "Como Ingeniero Civil me topé de frente con la barrera de las certificaciones (P.Eng). Perdí meses intentando entrar al colegio. El programa me ayudó a pivotar mi perfil completo hacia 'Project Coordinator' en construcción. Entendí cómo funciona el juego en Canadá, entré a la industria y en un año aspiro ascender."
                            </p>
                        </div>
                        <div className="border-t border-border/50 pt-4 mt-auto">
                            <p className="font-semibold text-foreground">David V.</p>
                            <p className="text-sm text-muted-foreground">Construcción e Ingeniería</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/10 p-8 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic mb-6">
                                "Mi pánico era la entrevista metodológica. Las dos veces que llegué a Recursos Humanos me rechazaron porque respondía dando rodeos. El bloque de pronósticos del sistema me enseñó a encuadrar mis errores y éxitos usando el formato S-T-A-R. Fui a la entrevista sabiendo exactamente lo que me iban a preguntar."
                            </p>
                        </div>
                        <div className="border-t border-border/50 pt-4 mt-auto">
                            <p className="font-semibold text-foreground">Javier C.</p>
                            <p className="text-sm text-muted-foreground">Ventas B2B</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/10 p-8 shadow-sm">
                        <div>
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic mb-6">
                                "No se imaginan lo frustrante que es trabajar en un 'survival job' (Retail) teniendo un título en Finanzas en tu país natal. Empleabilidad Canadá cortó la palabrería y me dio un manual de ejecución frío y duro. Borramos mi experiencia irrelevante, nos enfocamos en herramientas financieras locales y salí del Retail."
                            </p>
                        </div>
                        <div className="border-t border-border/50 pt-4 mt-auto">
                            <p className="font-semibold text-foreground">Andrea S.</p>
                            <p className="text-sm text-muted-foreground">Analista Financiero</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
