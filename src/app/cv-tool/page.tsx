"use client"

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LeadCaptureForm from "@/components/cv-tool/CvUploadForm";
import CvAnalysis from "@/components/cv-tool/CvAnalysis";
import StrategyResources from "@/components/cv-tool/StrategyResources";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function CvToolContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    
    const [step, setStep] = useState<"form" | "analysis" | "strategy">("form");
    const [cvText, setCvText] = useState("");
    const [leadData, setLeadData] = useState<any>(null);
    const [leadId, setLeadId] = useState<string | undefined>();
    const [accessCode, setAccessCode] = useState("LEAD_MAGNET");

    // 1. Detect Stripe Session or Developer Bypass and Recover Data
    useEffect(() => {
        const queryCode = searchParams.get("code");
        const savedData = localStorage.getItem("pendingReportData");
        
        // Developer Bypass: ?code=DEBUG_PRO
        if (queryCode === "DEBUG_PRO") {
            setAccessCode("PREMIUM");
            if (step === "form") setStep("analysis");
            return;
        }

        if (sessionId && savedData) {
            try {
                const { result, cvText: savedText, leadId: savedId } = JSON.parse(savedData);
                setLeadData(result);
                setCvText(savedText);
                setLeadId(savedId);
                setAccessCode("PREMIUM");
                setStep("analysis"); // Start at analysis so they see the unlocked report
                // Clear the temporary storage after recovery
                localStorage.removeItem("pendingReportData");
            } catch (e) {
                console.error("Error recovering report data:", e);
            }
        }
    }, [sessionId, searchParams, step]);

    const handleResult = (data: any, text: string, lang: string, code: string, id?: string) => {
        setLeadData(data);
        setCvText(text);
        setAccessCode(code);
        setLeadId(id);
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
        <div className="flex-1 container mx-auto px-4 py-12">
            {step === "form" && (
                <LeadCaptureForm onResult={handleResult} />
            )}
            
            {step === "analysis" && leadData && (
                <div className="max-w-4xl mx-auto">
                    <CvAnalysis 
                        cvText={cvText} 
                        leadData={leadData} 
                        leadId={leadId}
                        accessCode={accessCode}
                        onAnalysisComplete={() => setStep("strategy")} 
                    />
                </div>
            )}

            {step === "strategy" && (
                <div className="max-w-5xl mx-auto">
                    <StrategyResources cvText={cvText} resultData={leadData} />
                </div>
            )}
        </div>
    );
}

export default function CvToolPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Cargando Pierre...</div>}>
                <CvToolContent />
            </Suspense>
            <Footer />
        </main>
    );
}
