"use client"

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import LeadCaptureForm from "@/components/cv-tool/CvUploadForm";
import CvAnalysis from "@/components/cv-tool/CvAnalysis";
import StrategyResources from "@/components/cv-tool/StrategyResources";
import PremiumWelcome from "@/components/cv-tool/PremiumWelcome";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DUMMY_LEAD_DATA = {
    name: "Juan Perez (Test)",
    email: "test@example.com",
    status: "outside_canada",
    province: "Ontario",
    urgency: "immediate",
    budget: "yes_pro",
    language: "es",
    empresasLMIA: {
        lista: [
            { nombre: "Shopify Canada", provincia: "Ontario / Remote", website: "https://shopify.ca", industria: "Technology" },
            { nombre: "Royal Bank of Canada (RBC)", provincia: "Ontario / National", website: "https://rbc.com", industria: "Banking" },
            { nombre: "PCL Construction", provincia: "Alberta / National", website: "https://pcl.com", industria: "Construction" },
            { nombre: "Lululemon Athletica", provincia: "British Columbia", website: "https://lululemon.com", industria: "Retail/Apparel" }
        ]
    },
    analisisNOC: {
        codigo: "21222",
        titulo: "Information Systems Specialists",
        descripcionQueEsNOC: "Professional role in charge of systems analysis and enterprise-level architecture.",
        requisitosNoCumplidos: ["Licensure in some provinces", "Local networking certifications"]
    },
    diagnostico: [
        { problema: "Falta de palabras clave ATS específicas del NOC", porque: "Los filtros automatizados descartan perfiles que no usen la jerga técnica canadiense exacta.", cambio: "Inyectar términos clave como 'SDLC', 'Business Requirements' y 'Stakeholder Management'." },
        { problema: "Formato de Experiencia no basado en logros", porque: "En Canadá no importa qué hiciste, sino qué lograste con métricas.", cambio: "Reescribir funciones usando la fórmula: Logro + Métrica + Impacto." },
        { problema: "Inclusión de datos personales sensibles", porque: "La foto y edad en el CV causan rechazo legal por discriminación.", cambio: "Remoción inmediata de datos demográficos." }
    ],
    analysis: {
        score: 85,
        summary: "Perfil altamente competitivo para el sector tecnológico en Canadá.",
        strengths: ["Experiencia internacional", "Nivel de inglés avanzado", "Certificaciones técnicas"],
        weaknesses: ["Falta de experiencia local", "Networking limitado"],
        salary_range: "$70,000 - $95,000 CAD",
        verdict: "Ready to Apply",
        certifications: [
            { name: "PMP Certification", duration: "6 months", price: "$400", link: "#" },
            { name: "AWS Solutions Architect", duration: "3 months", price: "$150", link: "#" }
        ]
    }
};

const DUMMY_CV_TEXT = "Juan Perez. Senior Software Engineer with 8 years of experience in Fullstack Development. Lead teams of 5+ developers. Proficient in React, Node.js, and Cloud Architecture.";


function CvToolContent({ onDashboardEnter }: { onDashboardEnter?: () => void }) {
    const { data: session, status: authStatus } = useSession();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    
    const [step, setStep] = useState<"form" | "analysis" | "strategy" | "premium-onboarding">("form");
    const [cvText, setCvText] = useState("");
    const [leadData, setLeadData] = useState<any>(null);
    const [leadId, setLeadId] = useState<string | undefined>();
    const [accessCode, setAccessCode] = useState("LEAD_MAGNET");

    // 🛡️ ACCESSO DIRECTO PARA ASESORÍA (PRO)
    useEffect(() => {
        const onboardingParam = searchParams.get("onboarding");
        if (authStatus === "authenticated" && (session?.user as any)?.isPro && step === "form" && !leadData && onboardingParam === "true") {
            setStep("premium-onboarding");
        }
    }, [authStatus, session, step, leadData, searchParams]);

    // 1. Detect Stripe Session or Developer Bypass and Recover Data
    useEffect(() => {
        const queryCode = searchParams.get("code");
        const savedData = localStorage.getItem("pendingReportData");
        
        // Developer Bypass: ?code=DEBUG_PRO
        if (queryCode === "DEBUG_PRO") {
            setLeadData(DUMMY_LEAD_DATA);
            setCvText(DUMMY_CV_TEXT);
            setAccessCode("PREMIUM");
            setStep("strategy"); // JUMP STRAIGHT TO DASHBOARD
            if (onDashboardEnter) onDashboardEnter();
            return;
        }

        if (sessionId && savedData) {
            try {
                const { result, cvText: savedText, leadId: savedId } = JSON.parse(savedData);
                setLeadData(result);
                setCvText(savedText);
                setLeadId(savedId);
                setAccessCode("PREMIUM");
                
                // 🚀 JUMP STRAIGHT TO TACTICAL CENTER FOR PAID USERS
                setStep("strategy"); 
                if (onDashboardEnter) onDashboardEnter();

                // Clear the temporary storage after recovery
                localStorage.removeItem("pendingReportData");
            } catch (e) {
                console.error("Error recovering report data:", e);
            }
        }
    }, [sessionId, searchParams, onDashboardEnter]);

    const handleResult = (data: any, text: string, lang: string, code: string, id?: string) => {
        setLeadData(data);
        setCvText(text);
        setAccessCode(code);
        setLeadId(id);
        
        // 🔒 PRO/MASTER BYPASS: Si el usuario es PRO, forzamos acceso al Centro Táctico de inmediato
        const isUserPro = (session?.user as any)?.isPro;
        
        if (code === "PREMIUM" || isUserPro) {
            setStep("strategy");
            if (onDashboardEnter) onDashboardEnter();
        } else {
            setStep("analysis");
        }
        
        // Save for potential recovery after Stripe redirect
        localStorage.setItem("pendingReportData", JSON.stringify({
            result: data,
            cvText: text,
            leadId: id
        }));

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={step === "strategy" ? "h-screen w-full overflow-hidden" : "flex-1 container mx-auto px-4 py-12"}>
            {step === "form" && (
                <LeadCaptureForm onResult={handleResult} />
            )}

            {step === "premium-onboarding" && (
                <PremiumWelcome onResult={handleResult} />
            )}
            
            {step === "analysis" && leadData && (
                <div className="max-w-4xl mx-auto">
                    <CvAnalysis 
                        cvText={cvText} 
                        leadData={leadData} 
                        leadId={leadId}
                        accessCode={accessCode}
                        onAnalysisComplete={() => {
                            setStep("strategy");
                            // Auto-scroll to top to ensure clean transition
                            window.scrollTo({ top: 0, behavior: 'instant' });
                        }} 
                        onUnlockPremium={(code) => setAccessCode(code)}
                    />
                </div>
            )}

            {step === "strategy" && (
                <StrategyResources cvText={cvText} resultData={leadData} />
            )}
        </div>
    );
}

export default function CvToolPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Cargando Pierre...</div>}>
            <CvToolPageWrapper />
        </Suspense>
    );
}

function CvToolPageWrapper() {
    const [isDashboard, setIsDashboard] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("code") === "DEBUG_PRO") {
            setIsDashboard(true);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleDashboardEnter = () => setIsDashboard(true);
        window.addEventListener("pierre-dashboard-enter", handleDashboardEnter);
        return () => window.removeEventListener("pierre-dashboard-enter", handleDashboardEnter);
    }, []);

    return (
        <main className={`min-h-screen bg-background flex flex-col ${isDashboard ? "h-screen overflow-hidden" : ""}`}>
            {!isDashboard && <Navbar />}
            <CvToolContent onDashboardEnter={() => setIsDashboard(true)} />
            {!isDashboard && <Footer />}
        </main>
    );
}
