import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import PricingSection from "@/components/sections/PricingSection"
import ProblemSection from "@/components/sections/ProblemSection"
import ObjectionsSection from "@/components/sections/ObjectionsSection"
import ApproachSection from "@/components/sections/ApproachSection"
import MethodologySection from "@/components/sections/MethodologySection"
import ProofSection from "@/components/sections/ProofSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import FaqSection from "@/components/sections/FaqSection"
import CtaSection from "@/components/sections/CtaSection"
import LeadForm from "@/components/LeadForm"

export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <PricingSection />

                <ProblemSection />
                <ObjectionsSection />
                <ApproachSection />
                <MethodologySection />
                
                <TestimonialsSection />
                <ProofSection />
                <FaqSection />
                <CtaSection />

                <section id="lead-form" className="bg-muted/50 py-16 px-4 sm:px-6 border-t border-border/50">
                    <div className="container mx-auto max-w-3xl">
                        <div className="mb-10 text-center">
                            <h3 className="text-2xl font-bold text-foreground">¿Aún tienes dudas?</h3>
                            <p className="mt-3 text-muted-foreground">Déjanos tus datos si prefieres que analicemos tu caso antes de agendar o comprar.</p>
                        </div>
                        <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/50">
                            <LeadForm />
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    )
}
