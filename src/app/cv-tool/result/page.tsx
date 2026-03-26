import { Suspense } from "react";
import CvAnalysis from "@/components/cv-tool/CvAnalysis";

export const dynamic = 'force-dynamic';

export default function CvResultPage() {
    return (
        <main className="min-h-screen bg-background">
            <Suspense fallback={<div className="p-8 text-center">Generando resultado...</div>}>
                <CvAnalysis />
            </Suspense>
        </main>
    );
}
