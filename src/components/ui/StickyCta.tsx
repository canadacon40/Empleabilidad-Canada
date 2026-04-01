"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StickyCta() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Show after scrolling 500px, but only on mobile-ish screens
            if (window.scrollY > 500) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-4 right-4 z-[100] md:hidden"
                >
                    <Button 
                        size="lg" 
                        className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] border border-primary/20 backdrop-blur-md flex items-center justify-center gap-3 active:scale-95 transition-all"
                        onClick={() => {
                            window.open('https://calendly.com/canadacon40-2023/cita-1-exploremos-tu-perfil-y-sus-oportunidade-clon', '_blank');
                        }}
                    >
                        AGENDAR ASESORÍA
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
