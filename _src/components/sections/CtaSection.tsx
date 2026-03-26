"use client"

import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
    return (
        <section className="bg-primary py-24 px-4 sm:px-6 text-primary-foreground relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary-hover/50 blur-3xl" />

            <div className="container relative mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-6">
                    ¿Listo para competir de verdad?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80 mb-10">
                    Deja de intentar adivinar por qué no te llaman y de perder tiempo valioso en tu búsqueda. Diagnostica tu CV o déjanos tus datos si aún tienes dudas sobre tu perfil.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-14 w-full sm:w-auto px-8 text-base bg-white text-[#0f172a] hover:bg-gray-100 font-bold shadow-lg" asChild>
                        <Link href="/cv-tool">
                            <Calendar className="mr-2 h-5 w-5" />
                            Subir mi CV ahora
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 w-full sm:w-auto px-8 text-base bg-white text-[#0f172a] hover:bg-gray-100 font-bold border-0 shadow-lg" asChild>
                        <Link href="#lead-form">
                            Verificar viabilidad del perfil
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
