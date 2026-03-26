import { Suspense } from "react";
import CvAnalysis from "@/components/cv-tool/CvAnalysis";

export const dynamic = 'force-dynamic';

export default function CvToolPage() {
    return (
        <main className="min-h-screen bg-background">
            <Suspense fallback={<div className="p-8 text-center">Cargando herramienta...</div>}>
                <CvAnalysis />
            </Suspense>
        </main>
    );
}
