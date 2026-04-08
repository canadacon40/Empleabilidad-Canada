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
import { ShieldCheck } from "lucide-react";

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


function LoadingShield() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-1000 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                <ShieldCheck className="w-20 h-20 text-primary relative z-10 animate-bounce duration-[2000ms]" />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Validando Acceso Pierre PRO...</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                    Estamos verificando tus credenciales tácticas y sincronizando tu Centro de Estrategia.
                </p>
                <div className="w-48 h-1 bg-slate-200 mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-fast" />
                </div>
            </div>
        </div>
    );
}

function CvToolContent({ onDashboardEnter }: { onDashboardEnter?: () => void }) {
    const { data: session, status: authStatus } = useSession();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const savedData = typeof window !== 'undefined' ? localStorage.getItem("pendingReportData") : null;
    
    const [step, setStep] = useState<"form" | "analysis" | "strategy" | "premium-onboarding">("form");
    const [cvText, setCvText] = useState("");
    const [leadData, setLeadData] = useState<any>(null);
    const [leadId, setLeadId] = useState<string | undefined>();
    const [accessCode, setAccessCode] = useState("LEAD_MAGNET");

    // 🛡️ LOADING SHIELD: Prevent flash of free content while auth resolves
    if (authStatus === "loading") {
        return <LoadingShield />;
    }

    // 🛡️ ACCESSO DIRECTO PARA ASESORÍA (PRO)
    useEffect(() => {
        const onboardingParam = searchParams.get("onboarding");
        if (authStatus === "authenticated" && (session?.user as any)?.isPro && step === "form" && !leadData && onboardingParam === "true") {
            setStep("premium-onboarding");
        }
    }, [authStatus, session, step, leadData, searchParams]);

    // 🚀 PRO, MASTER & TRIAL AUTO-BYPASS: Direct entry to Strategy Center
    useEffect(() => {
        const isMaster = session?.user?.email?.toLowerCase().trim() === "pierre-master@canadacontrabajo.com";
        const isPro = (session?.user as any)?.isPro;
        const isTrial = (session?.user as any)?.isTrial;
        const forceForm = searchParams.get("force_form") === "true";
        
        if (authStatus === "authenticated" && (isMaster || isPro || isTrial) && step === "form" && !forceForm) {
            const lastResult = localStorage.getItem("last_report_result");
            const pendingData = localStorage.getItem("pendingReportData");
            
            console.log("[VIP_BYPASS] Jumping to Strategy Dashboard...");
            
            if (lastResult) {
                try {
                    const parsed = JSON.parse(lastResult);
                    setLeadData(parsed);
                    setCvText(localStorage.getItem("last_cv_text") || DUMMY_CV_TEXT);
                } catch (e) {
                    setLeadData(DUMMY_LEAD_DATA);
                    setCvText(DUMMY_CV_TEXT);
                }
            } else if (pendingData) {
                try {
                    const { result, cvText: savedText } = JSON.parse(pendingData);
                    setLeadData(result);
                    setCvText(savedText);
                } catch (e) {
                    setLeadData(DUMMY_LEAD_DATA);
                    setCvText(DUMMY_CV_TEXT);
                }
            } else {
                setLeadData(DUMMY_LEAD_DATA);
                setCvText(DUMMY_CV_TEXT);
            }
            
            setAccessCode("PREMIUM");
            setStep("strategy");
            if (onDashboardEnter) onDashboardEnter();
        }
    }, [authStatus, session, step, onDashboardEnter]);

    // 1. Detect Stripe Session or Developer Bypass and Recover Data
    useEffect(() => {
        // Removed Developer Bypass for Production Security

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
        
        // Revertimos el bypass forzado: Todos ven el análisis primero, pero PRO tiene opción de saltar dentro del componente
        setStep("analysis");
        
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
                <StrategyResources 
                    cvText={cvText} 
                    resultData={leadData} 
                    onBackToReport={() => {
                        setStep("analysis");
                    }} 
                />
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

    // Removed Developer Bypass for Production Security

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
