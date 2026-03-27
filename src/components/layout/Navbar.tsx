"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import DiscountModal from "@/components/ui/DiscountModal"
import PlanDetailsModal from "@/components/ui/PlanDetailsModal"
import { useLeadTracking } from "@/hooks/useLeadTracking"

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
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        {/* Logo / Brand Name */}
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-semibold tracking-tight text-primary sm:text-lg">
                                Acelerador de <span className="font-light">Entrevistas</span>
                            </span>
                        </Link>
                    </div>
                    <nav className="flex items-center gap-2 sm:gap-4">

                        <Button 
                            variant="ghost" 
                            className="inline-flex focus:ring-0 px-1 sm:px-4 text-[10px] sm:text-sm font-black uppercase tracking-tight" 
                            onClick={() => {
                                trackEvent("CTA_CLICK", { zone: "Navbar", action: "Agendar" });
                                setIsDetailsModalOpen(true);
                            }}
                        >
                            <span className="sm:hidden">Agendar 1:1</span>
                            <span className="hidden sm:inline">AGENDAR Plan Personalizado</span>
                        </Button>
                        <Button asChild size="sm" className="px-2 sm:px-4 text-[10px] sm:text-sm font-black uppercase tracking-tight">
                            <Link href="/cv-tool">Reporte Gratis</Link>
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
