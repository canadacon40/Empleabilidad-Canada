import { BookOpen, Download } from "lucide-react";
import { downloadUserManualPDF } from "@/lib/report-utils";
import { Button } from "@/components/ui/button";

export default function UserManual() {
  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-12 text-white overflow-hidden relative shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h4 className="text-2xl font-black tracking-tight mb-2">Manual de Usuario PRO</h4>
                <p className="text-sm font-medium text-slate-400 max-w-lg">
                    Descarga tu guía táctica. Aprende a iterar tu CV con el Job Description Matcher, interpretar tus scores de Gap Analysis y usar las múltiples versiones.
                </p>
            </div>
        </div>
        
        <div className="relative z-10 shrink-0">
            <Button onClick={downloadUserManualPDF} size="lg" className="h-14 px-8 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                <Download className="w-5 h-5 mr-3" />
                Descargar Guía PDF
            </Button>
        </div>
    </div>
  );
}
