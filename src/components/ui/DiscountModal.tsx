"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DiscountModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 mins

    useEffect(() => {
        if (!isOpen) return;
        const intervalId = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0))
        }, 1000)
        return () => clearInterval(intervalId)
    }, [isOpen])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] overflow-y-auto bg-background/80 backdrop-blur-sm">
                <div className="flex min-h-screen items-start justify-center p-4 pt-10 pb-10 sm:pt-16 sm:pb-16 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-8 text-left transition-all sm:my-8"
                    >
                    <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">¡Espera! Oferta Exclusiva</h2>
                        <p className="text-muted-foreground mb-6">
                            Ya diste el primer paso. Por los próximos 15 minutos, llévate el <strong className="text-foreground">Plan de Empleabilidad Personalizado</strong> con un descuento de $40 USD.
                        </p>
                        
                        <div className="bg-muted p-4 rounded-xl mb-6">
                            <div className="text-sm text-muted-foreground mb-1">Precio Normal: <span className="line-through">$149 USD</span></div>
                            <div className="text-3xl font-black text-primary mb-2">$109 USD</div>
                            <div className="text-sm font-semibold text-foreground flex items-center justify-center gap-2">
                                Oferta Especial por Tiempo Limitado
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-6">
                            <Clock className="h-4 w-4" />
                            <span>La oferta expira en: {formatTime(timeLeft)}</span>
                        </div>

                        <div className="space-y-3">
                            <Button size="lg" className="w-full text-base h-12" asChild>
                                <a href="https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon" target="_blank" rel="noopener noreferrer">
                                    Reclamar Oferta y Agendar
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                            <button onClick={() => { window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon', '_blank'); onClose(); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 block w-full text-center">
                                No gracias, prefiero ver los detalles del plan completo.
                            </button>
                        </div>
                    </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    )
}
