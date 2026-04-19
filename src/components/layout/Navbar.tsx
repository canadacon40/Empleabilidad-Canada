"use client"
import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import DiscountModal from "@/components/ui/DiscountModal"
import PlanDetailsModal from "@/components/ui/PlanDetailsModal"
import { useLeadTracking } from "@/hooks/useLeadTracking"
import { Sparkles, Layout, LogOut } from "lucide-react"

export default function Navbar() {
    const { data: session } = useSession();
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
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all">
                                <Layout className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                        </Link>
                    </div>
                    
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {session ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    className="h-9 sm:h-12 px-3 sm:px-6 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest rounded-xl hover:bg-slate-50 text-slate-900 border border-slate-100" 
                                    asChild
                                >
                                    <Link href="/cv-tool?view=dashboard" className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        CENTRO TÁCTICO
                                    </Link>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="h-9 w-9 p-0 text-slate-400 hover:text-red-500 transition-colors" 
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                variant="ghost" 
                                className="h-9 sm:h-12 px-3 sm:px-6 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest text-slate-900 hover:bg-slate-50 transition-all border border-slate-100 rounded-xl" 
                                asChild
                            >
                                <Link href="/login?callbackUrl=/cv-tool?view=dashboard">
                                    ACCESO PRO
                                </Link>
                            </Button>
                        )}

                        <Button 
                            className="h-9 sm:h-12 px-4 sm:px-8 text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest rounded-xl bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all" 
                            onClick={() => {
                                trackEvent("CTA_CLICK", { zone: "Navbar", action: "Agendar" });
                                setIsDetailsModalOpen(true);
                            }}
                        >
                            Asesoría 1-1
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
