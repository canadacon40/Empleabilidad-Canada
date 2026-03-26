import Link from "next/link"

export default function FooterEn() {
    return (
        <footer className="border-t border-border/40 bg-muted/20">
            <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 sm:px-6">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Creado para profesionales ambiciosos buscando su próximo salto de carrera. No somos un servicio de asesoría legal.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="#faq" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                        Preguntas Frecuentes
                    </Link>
                    <Link href="/cv-tool" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                        Acelerador de Entrevistas
                    </Link>
                </div>
            </div>
        </footer>
    )
}
