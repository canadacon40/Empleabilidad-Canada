import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import PricingSection from "@/components/sections/PricingSection"
import ProblemSection from "@/components/sections/ProblemSection"
import MethodologySection from "@/components/sections/MethodologySection"
import ProofSection from "@/components/sections/ProofSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import FaqSection from "@/components/sections/FaqSection"
import CtaSection from "@/components/sections/CtaSection"
import LeadForm from "@/components/LeadForm"
import StickyCta from "@/components/ui/StickyCta"

export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                {/* [1] HERO - Comprehensión en < 5s */}
                <HeroSection />
                
                {/* [2] PRODUCTOS / OFERTA - Captura de intención inmediata */}
                <PricingSection />
                
                {/* [3] PROBLEMA - Identificación "Esto soy yo" */}
                <ProblemSection />
                
                {/* [4] MÉTODO / SOLUCIÓN - Diferenciador 7/10 Mercado Oculto */}
                <MethodologySection />
                
                {/* [5] PRUEBA / VALIDACIÓN - Autoridad y Casos */}
                <TestimonialsSection />
                <ProofSection />
                
                {/* [6] OBJECIONES / CTA FINAL */}
                <CtaSection />
                {/* Sticky CTA for Mobile Conversion */}
                <StickyCta />

            </main>
            <Footer />
        </>
    )
}
