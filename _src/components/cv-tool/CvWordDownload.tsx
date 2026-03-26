"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CvData } from "@/lib/cv-types"
import {
    Document, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Packer, BorderStyle, TabStopPosition, TabStopType
} from "docx"
import { saveAs } from "file-saver"

interface Props {
    cvData: CvData
    jobTitle?: string
}

export default function CvWordDownload({ cvData, jobTitle }: Props) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        setIsGenerating(true)
        try {
            const { contactInfo, professionalSummary, experience, education, skills } = cvData

            const children: Paragraph[] = []

            // Name
            children.push(
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: contactInfo.fullName, bold: true, size: 32, font: "Calibri" }),
                    ],
                })
            )

            // Contact info line
            const contactParts = [contactInfo.city, contactInfo.email, contactInfo.phone, contactInfo.linkedIn].filter(Boolean)
            children.push(
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" } },
                    children: [
                        new TextRun({ text: contactParts.join("  |  "), size: 18, color: "555555", font: "Calibri" }),
                    ],
                })
            )

            // Professional Summary
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                    children: [
                        new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 22, font: "Calibri", allCaps: true }),
                    ],
                })
            )
            children.push(
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({ text: professionalSummary, size: 20, font: "Calibri", color: "333333" }),
                    ],
                })
            )

            // Experience
            if (experience?.length > 0) {
                children.push(
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 },
                        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                        children: [
                            new TextRun({ text: "PROFESSIONAL EXPERIENCE", bold: true, size: 22, font: "Calibri", allCaps: true }),
                        ],
                    })
                )

                for (const exp of experience) {
                    // Title + dates
                    children.push(
                        new Paragraph({
                            spacing: { before: 150 },
                            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                            children: [
                                new TextRun({ text: exp.title, bold: true, size: 21, font: "Calibri" }),
                                new TextRun({ text: "\t" }),
                                new TextRun({ text: `${exp.startDate} – ${exp.endDate}`, size: 18, color: "666666", font: "Calibri" }),
                            ],
                        })
                    )
                    // Company
                    children.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [
                                new TextRun({ text: `${exp.company}${exp.location ? `, ${exp.location}` : ""}`, size: 18, color: "555555", font: "Calibri", italics: true }),
                            ],
                        })
                    )
                    // Achievements
                    for (const ach of (exp.achievements || [])) {
                        children.push(
                            new Paragraph({
                                spacing: { after: 40 },
                                bullet: { level: 0 },
                                children: [
                                    new TextRun({ text: ach, size: 19, font: "Calibri", color: "333333" }),
                                ],
                            })
                        )
                    }
                }
            }

            // Education
            if (education?.length > 0) {
                children.push(
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 },
                        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                        children: [
                            new TextRun({ text: "EDUCATION", bold: true, size: 22, font: "Calibri", allCaps: true }),
                        ],
                    })
                )

                for (const edu of education) {
                    children.push(
                        new Paragraph({
                            spacing: { after: 40 },
                            children: [
                                new TextRun({ text: edu.degree, bold: true, size: 20, font: "Calibri" }),
                            ],
                        })
                    )
                    children.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [
                                new TextRun({
                                    text: `${edu.institution}${edu.location ? `, ${edu.location}` : ""} — ${edu.year}`,
                                    size: 18, color: "555555", font: "Calibri",
                                }),
                            ],
                        })
                    )
                }
            }

            // Skills
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                    children: [
                        new TextRun({ text: "SKILLS", bold: true, size: 22, font: "Calibri", allCaps: true }),
                    ],
                })
            )

            if (skills?.technical?.length > 0) {
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: "Technical: ", bold: true, size: 19, font: "Calibri" }),
                        new TextRun({ text: skills.technical.join(" • "), size: 19, font: "Calibri", color: "333333" }),
                    ],
                }))
            }
            if (skills?.soft?.length > 0) {
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: "Soft Skills: ", bold: true, size: 19, font: "Calibri" }),
                        new TextRun({ text: skills.soft.join(" • "), size: 19, font: "Calibri", color: "333333" }),
                    ],
                }))
            }
            if (skills?.languages?.length > 0) {
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: "Languages: ", bold: true, size: 19, font: "Calibri" }),
                        new TextRun({ text: skills.languages.join(" • "), size: 19, font: "Calibri", color: "333333" }),
                    ],
                }))
            }
            if (skills?.certifications?.length > 0) {
                children.push(new Paragraph({
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: "Certifications: ", bold: true, size: 19, font: "Calibri" }),
                        new TextRun({ text: skills.certifications.join(" • "), size: 19, font: "Calibri", color: "333333" }),
                    ],
                }))
            }

            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: { top: 720, bottom: 720, left: 720, right: 720 },
                        },
                    },
                    children,
                }],
            })

            const blob = await Packer.toBlob(doc)
            const safeName = contactInfo.fullName
                .replace(/[^a-zA-Z0-9\s]/g, "")
                .replace(/\s+/g, "_")
            const safeTitle = jobTitle
                ? "_" + jobTitle.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")
                : ""
            saveAs(blob, `${safeName}${safeTitle}.docx`)
        } catch (err) {
            console.error("Word generation error:", err)
            alert("Error generando el Word. Intenta de nuevo.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            size="lg"
            variant="outline"
            className="w-full gap-3 py-5"
            onClick={handleDownload}
            disabled={isGenerating}
        >
            <FileDown className="w-5 h-5" />
            {isGenerating ? "Generando Word..." : "Descargar CV en Word (.docx)"}
        </Button>
    )
}
