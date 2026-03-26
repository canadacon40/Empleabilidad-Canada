"use client"

import { Check, X } from "lucide-react"

export default function ApproachSection() {
    const doList = [
        "Instalarte el Sistema Integral de Empleabilidad (12 Bloques).",
        "Ejecutar un diagnóstico implacable de viabilidad (Bloque 0).",
        "Aportar las herramientas y guiones exactos para que TÚ seas el francotirador.",
        "Trabajar en un formato 'Done-With-You' riguroso y enfocado en resultados."
    ]

    const dontList = [
        "Hacer el trabajo por ti mientras te cruzas de brazos esperando ofertas.",
        "Diseñar CVs 'bonitos' o estéticos que no pasan los filtros ATS reales.",
        "Aceptar perfiles con niveles de inglés irreales para The Target Role.",
        "Vender falsas promesas de empleo o 'vías rápidas' de inmigración."
    ]

    return (
        <section className="bg-background py-20 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-12 md:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Esto NO es para todos
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Si solo esperas pagar para que alguien haga magia por ti, rechazaremos tu aplicación. Ya sea que estés planeando tu llegada o viendo cómo se esfuman tus ahorros sin resultados, yo te instalo la mejor mira telescópica del mercado, pero tú aprietas el gatillo.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* What I DO */}
                    <div className="rounded-2xl border border-primary/10 bg-muted/30 p-8">
                        <h3 className="mb-6 text-2xl font-semibold text-foreground flex items-center">
                            <span className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                                <Check className="h-6 w-6" />
                            </span>
                            Lo que SÍ hacemos
                        </h3>
                        <ul className="space-y-4">
                            {doList.map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <Check className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* What I DON'T DO */}
                    <div className="rounded-2xl border border-red-500/10 bg-red-50/30 p-8 dark:bg-red-950/10">
                        <h3 className="mb-6 text-2xl font-semibold text-foreground flex items-center">
                            <span className="bg-red-500/10 text-red-600 p-2 rounded-full mr-3">
                                <X className="h-6 w-6" />
                            </span>
                            Lo que NO hacemos
                        </h3>
                        <ul className="space-y-4">
                            {dontList.map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <X className="mr-3 h-5 w-5 flex-shrink-0 text-red-500/70" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
