"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ArrowRight, FileCheck, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProPurchaseModalProps {
    isOpen: boolean
    onClose: () => void
    onContinueToCheckout: () => void
    onGoToFreeReport: () => void
}

export default function ProPurchaseModal({ 
    isOpen, 
    onClose, 
    onContinueToCheckout, 
    onGoToFreeReport 
}: ProPurchaseModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border shadow-2xl"
                >
                    {/* Header with Gradient */}
                    <div className="h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                    
                    <button 
                        onClick={onClose} 
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            ¡Excelente elección!
                        </h2>
                        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                            Para que el **Acelerador PRO** sea 100% efectivo, lo ideal es que ya tengas tu diagnóstico base. ¿Cuál es tu situación actual?
                        </p>
                        
                        <div className="space-y-4">
                            {/* Opción A: No tiene reporte */}
                            <button 
                                onClick={onGoToFreeReport}
                                className="w-full group p-4 rounded-2xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all text-left flex items-start gap-4"
                            >
                                <div className="p-2 rounded-xl bg-background border border-border group-hover:border-primary/20">
                                    <FileCheck className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-foreground">Aún no tengo mi reporte</h4>
                                    <p className="text-[11px] text-muted-foreground">Empezar por el diagnóstico gratuito (Recomendado)</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground self-center group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </button>

                            {/* Opción B: Ya tiene reporte */}
                            <button 
                                onClick={onContinueToCheckout}
                                className="w-full group p-4 rounded-2xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all text-left flex items-start gap-4"
                            >
                                <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-foreground">Ya generé mi reporte</h4>
                                    <p className="text-[11px] text-muted-foreground">Continuar al pago seguro de $29 USD</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-primary self-center group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                        
                        <p className="mt-8 text-[10px] text-muted-foreground italic">
                            * Acceso instantáneo tras procesar el pago.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
