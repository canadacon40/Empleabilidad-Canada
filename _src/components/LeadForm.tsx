"use client"
import { Button } from "@/components/ui/button"

export default function LeadForm() {
    return (
        <form className="flex flex-col gap-4" action="https://formsubmit.co/canadacon40@gmail.com" method="POST">
            {/* Opciones ocultas para FormSubmit */}
            <input type="hidden" name="_subject" value="Nuevo prospecto - Empleabilidad Canadá" />
            <input type="hidden" name="_captcha" value="false" />

            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre Completo</label>
                <input id="name" name="name" type="text" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Ej: Ana Garcia" required />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Correo Electrónico</label>
                <input id="email" name="email" type="email" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="ana@ejemplo.com" required />
            </div>
            <div>
                <label htmlFor="linkedin" className="block text-sm font-medium mb-1">Enlace de LinkedIn (Opcional)</label>
                <input id="linkedin" name="linkedin" type="url" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="https://linkedin.com/in/..." />
            </div>
            <Button type="submit" className="w-full mt-2">
                Solicitar análisis de caso
            </Button>
        </form>
    )
}
