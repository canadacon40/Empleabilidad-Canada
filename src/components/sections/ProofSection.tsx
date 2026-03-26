"use client"

import { ShieldCheck, TrendingUp, Users } from "lucide-react"

export default function ProofSection() {
    return (
        <section className="bg-background py-20 px-4 sm:px-6 border-t border-border/50">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-12 md:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Resultados basados en estrategia
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        No garantizamos empleos. Estos profesionales consiguieron sus entrevistas porque descartaron tácticas obsoletas y ejecutaron su parte del plan norteamericano al pie de la letra.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center">
                        <TrendingUp className="h-10 w-10 text-primary mb-4" />
                        <h3 className="font-bold text-xl mb-2">Tracción Rápida</h3>
                        <p className="text-sm text-muted-foreground">
                            De 0 respuestas a conseguir invitaciones a entrevistas en un promedio de 4 semanas tras adaptar los perfiles a formatos 100% compatibles con ATS.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center">
                        <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                        <h3 className="font-bold text-xl mb-2">Pivote Seguro</h3>
                        <p className="text-sm text-muted-foreground">
                            Identificación exacta del "Bridge Role" viable para frenar el rechazo inmediato al aplicar a posiciones jerárquicas irrealistas para recién llegados.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center">
                        <Users className="h-10 w-10 text-primary mb-4" />
                        <h3 className="font-bold text-xl mb-2">Mercado Oculto</h3>
                        <p className="text-sm text-muted-foreground">
                            80% de los roles corporativos no se publican. El sistema te empuja a contactar y hacer networking directo con Hiring Managers para asegurar ofertas.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
