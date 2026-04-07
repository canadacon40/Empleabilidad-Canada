"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import DiscountModal from "@/components/ui/DiscountModal"
import PlanDetailsModal from "@/components/ui/PlanDetailsModal"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { Sparkles, Layout } from "lucide-react"

export default function Navbar() {
    const { trackEvent } = useLeadTracking();
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    const handleClaimOffer = () => {
        setIsDetailsModalOpen(false);
        setTimeout(() => setIsDiscountModalOpen(true), 300);
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <span className="font-black tracking-tighter text-slate-900 text-lg sm:text-xl uppercase flex flex-col sm:flex-row sm:gap-1 leading-[0.8] sm:leading-none">
                                <span>Radar de</span>
                                <span className="text-primary italic">Empleo</span>
                            </span>
                        </Link>
                    </div>
                    
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <Button 
                            variant="ghost" 
                            className="flex h-10 px-2 sm:px-4 text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors focus:ring-0" 
                            asChild
                        >
                            <Link href="/login">
                                ENTRAR
                            </Link>
                        </Button>

                        <Button 
                            variant="ghost" 
                            className="flex h-10 px-2 sm:px-4 text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors focus:ring-0" 
                            onClick={() => {
                                trackEvent("CTA_CLICK", { zone: "Navbar", action: "Agendar" });
                                setIsDetailsModalOpen(true);
                            }}
                        >
                            Agendar 1-a-1
                        </Button>
                        
                        <Button asChild size="lg" className="h-10 sm:h-12 px-4 sm:px-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all bg-primary text-white">
                            <Link href="/cv-tool" className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 hidden sm:block" />
                                Reporte Gratis
                            </Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <PlanDetailsModal 
                isOpen={isDetailsModalOpen} 
                onClose={() => setIsDetailsModalOpen(false)} 
                onClaimOffer={handleClaimOffer}
            />
            <DiscountModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} />
        </>
    )
}
