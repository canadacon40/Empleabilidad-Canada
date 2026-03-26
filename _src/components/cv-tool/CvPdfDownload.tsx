"use client"

import { pdf } from "@react-pdf/renderer"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CvData } from "@/lib/cv-types"
import CvPdfDocument, { CvDesign } from "./CvPdfDocument"
import { useState } from "react"

interface Props {
    cvData: CvData
    design?: CvDesign
    jobTitle?: string
}

export default function CvPdfDownload({ cvData, design = "classic", jobTitle }: Props) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        setIsGenerating(true)
        try {
            const blob = await pdf(<CvPdfDocument cvData={cvData} design={design} />).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url

            // Build filename: Name_JobTitle.pdf
            const safeName = cvData.contactInfo.fullName
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .replace(/\s+/g, "_")
            const safeTitle = jobTitle
                ? "_" + jobTitle.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")
                : ""
            link.download = `${safeName}${safeTitle}.pdf`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error("PDF generation error:", err)
            alert("Error generando el PDF. Intenta de nuevo.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            size="lg"
            className="w-full text-lg py-6 gap-3"
            onClick={handleDownload}
            disabled={isGenerating}
        >
            <Download className="w-5 h-5" />
            {isGenerating ? "Generando PDF..." : "Descargar CV en PDF"}
        </Button>
    )
}
