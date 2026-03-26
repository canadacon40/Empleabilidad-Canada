"use client"

import { useState, Suspense } from "react";
import LeadCaptureForm from "@/components/cv-tool/CvUploadForm";
import CvAnalysis from "@/components/cv-tool/CvAnalysis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CvToolPage() {
    const [step, setStep] = useState<"form" | "analysis">("form");
    const [cvText, setCvText] = useState("");
    const [leadData, setLeadData] = useState<any>(null);
    const [leadId, setLeadId] = useState<string | undefined>();
    const [accessCode, setAccessCode] = useState("LEAD_MAGNET");

    const handleResult = (data: any, text: string, lang: string, code: string, id?: string) => {
        setLeadData(data);
        setCvText(text);
        setAccessCode(code);
        setLeadId(id);
        setStep("analysis");
        
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <div className="flex-1 container mx-auto px-4 py-12">
                <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Iniciando Pierre...</div>}>
                    {step === "form" ? (
                        <LeadCaptureForm onResult={handleResult} />
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <CvAnalysis 
                                cvText={cvText} 
                                leadData={leadData} 
                                leadId={leadId}
                                accessCode={accessCode}
                                onAnalysisComplete={() => {}} 
                            />
                        </div>
                    )}
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
