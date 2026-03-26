"use client"

import { useState } from "react"
import { CvData } from "@/lib/cv-types"
import { Check, Briefcase, GraduationCap, Wrench, User, Palette } from "lucide-react"
import CvPdfDownload from "./CvPdfDownload"
import CvWordDownload from "./CvWordDownload"
import { CvDesign } from "./CvPdfDocument"

interface CvResultProps {
    cvData: CvData
}

const designs: { id: CvDesign; name: string; desc: string; color: string }[] = [
    { id: "classic", name: "Clásico", desc: "Limpio, Calibri, blanco y negro — ideal para roles corporativos y financieros", color: "border-gray-400 bg-gray-50" },
    { id: "modern", name: "Moderno", desc: "Acentos azules, secciones con barra lateral — ideal para tech y startups", color: "border-blue-400 bg-blue-50" },
    { id: "executive", name: "Ejecutivo", desc: "Elegante, espacioso, nombre en mayúsculas — ideal para directivos y senior", color: "border-amber-400 bg-amber-50" },
]

export default function CvResult({ cvData }: CvResultProps) {
    const { contactInfo, professionalSummary, experience, education, skills } = cvData
    const [selectedDesign, setSelectedDesign] = useState<CvDesign>("classic")
    const [jobTitle, setJobTitle] = useState(experience?.[0]?.title || "")

    return (
        <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">¡Tu CV canadiense está listo!</h3>
                <p className="text-sm text-muted-foreground">
                    Elige tu diseño, ajusta el nombre del puesto, y descarga en PDF o Word editable.
                </p>
            </div>

            {/* Design Picker */}
            <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-primary" />
                    Elige tu diseño de CV
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {designs.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setSelectedDesign(d.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedDesign === d.id
                                ? `${d.color} ring-2 ring-primary shadow-sm`
                                : "border-border bg-background hover:border-primary/30"
                                }`}
                        >
                            <p className="font-bold text-foreground text-sm">{d.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{d.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Title for filename */}
            <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                    📄 Título del puesto (para el nombre del archivo)
                </label>
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ej: Project Manager, Software Engineer, Marketing Director..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                    Tu archivo se llamará: <strong>{contactInfo.fullName.replace(/\s+/g, "_")}_{jobTitle.replace(/\s+/g, "_") || "CV"}.pdf</strong>
                </p>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CvPdfDownload cvData={cvData} design={selectedDesign} jobTitle={jobTitle || undefined} />
                <CvWordDownload cvData={cvData} jobTitle={jobTitle || undefined} />
            </div>

            {/* CV Preview */}
            <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6">
                {/* Contact */}
                <div className="text-center pb-6 border-b border-border/50">
                    <h2 className="text-2xl font-bold text-foreground">{contactInfo.fullName}</h2>
                    <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-muted-foreground">
                        {contactInfo.city && <span>{contactInfo.city}</span>}
                        {contactInfo.email && <span>• {contactInfo.email}</span>}
                        {contactInfo.phone && <span>• {contactInfo.phone}</span>}
                        {contactInfo.linkedIn && <span>• {contactInfo.linkedIn}</span>}
                    </div>
                </div>

                {/* Professional Summary */}
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                        <User className="w-4 h-4" />
                        Professional Summary
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">{professionalSummary}</p>
                </div>

                {/* Experience */}
                {experience?.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                            <Briefcase className="w-4 h-4" />
                            Professional Experience
                        </h3>
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i} className="pl-4 border-l-2 border-primary/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                        <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {exp.startDate} — {exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {exp.company}{exp.location ? `, ${exp.location}` : ""}
                                    </p>
                                    <ul className="space-y-1">
                                        {exp.achievements?.map((ach, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                                                <span className="text-primary mt-1 flex-shrink-0">•</span>
                                                {ach}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                            <GraduationCap className="w-4 h-4" />
                            Education
                        </h3>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i} className="pl-4 border-l-2 border-primary/20">
                                    <h4 className="font-semibold text-foreground text-sm">{edu.degree}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {edu.institution}{edu.location ? `, ${edu.location}` : ""} — {edu.year}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                        <Wrench className="w-4 h-4" />
                        Skills
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {skills?.technical?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Technical</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.technical.map((s, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {skills?.soft?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Soft Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.soft.map((s, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {skills?.languages?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.languages.map((s, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {skills?.certifications?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Certifications</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.certifications.map((s, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Download */}
            <CvPdfDownload cvData={cvData} design={selectedDesign} jobTitle={jobTitle || undefined} />
        </div>
    )
}
