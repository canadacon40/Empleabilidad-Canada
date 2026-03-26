"use client"

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer"
import { CvData } from "@/lib/cv-types"

export type CvDesign = "classic" | "modern" | "executive"

// Register fonts
Font.register({
    family: "Helvetica",
    fonts: [
        { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf", fontWeight: "normal" },
        { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf", fontWeight: "bold" },
    ],
})

// ============= CLASSIC DESIGN =============
const classicStyles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", lineHeight: 1.4 },
    header: { textAlign: "center", marginBottom: 16, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: "#222222", borderBottomStyle: "solid" },
    name: { fontSize: 22, fontWeight: "bold", marginBottom: 6, letterSpacing: 0.5 },
    contactRow: { flexDirection: "row", justifyContent: "center", gap: 8, fontSize: 9, color: "#555555" },
    contactItem: { fontSize: 9 },
    sectionTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, marginTop: 14, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#cccccc", borderBottomStyle: "solid", color: "#222222" },
    summary: { fontSize: 10, color: "#333333", lineHeight: 1.5, marginBottom: 4 },
    expBlock: { marginBottom: 10 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    expTitle: { fontSize: 11, fontWeight: "bold" },
    expDate: { fontSize: 9, color: "#666666" },
    expCompany: { fontSize: 9, color: "#555555", marginBottom: 4 },
    bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 8 },
    bulletDot: { width: 10, fontSize: 10, color: "#333333" },
    bulletText: { flex: 1, fontSize: 9.5, color: "#333333", lineHeight: 1.4 },
    eduBlock: { marginBottom: 6 },
    eduDegree: { fontSize: 10, fontWeight: "bold" },
    eduInst: { fontSize: 9, color: "#555555" },
    skillCategory: { marginBottom: 6 },
    skillLabel: { fontSize: 9, fontWeight: "bold", color: "#444444", marginBottom: 3 },
    skillItem: { fontSize: 9, color: "#333333" },
})

// ============= MODERN DESIGN =============
const modernStyles = StyleSheet.create({
    page: { padding: 36, fontFamily: "Helvetica", fontSize: 10, color: "#2d2d2d", lineHeight: 1.4 },
    header: { marginBottom: 18, paddingBottom: 14, borderBottomWidth: 3, borderBottomColor: "#2563eb", borderBottomStyle: "solid" },
    name: { fontSize: 24, fontWeight: "bold", marginBottom: 4, color: "#1e40af", letterSpacing: 0.3 },
    contactRow: { flexDirection: "row", gap: 10, fontSize: 9, color: "#6b7280" },
    contactItem: { fontSize: 9 },
    sectionTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, marginTop: 16, paddingBottom: 3, paddingLeft: 8, borderLeftWidth: 3, borderLeftColor: "#2563eb", borderLeftStyle: "solid", color: "#1e40af" },
    summary: { fontSize: 10, color: "#374151", lineHeight: 1.6, marginBottom: 4, paddingLeft: 8 },
    expBlock: { marginBottom: 10 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    expTitle: { fontSize: 11, fontWeight: "bold", color: "#111827" },
    expDate: { fontSize: 9, color: "#2563eb", fontWeight: "bold" },
    expCompany: { fontSize: 9, color: "#6b7280", marginBottom: 4 },
    bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 8 },
    bulletDot: { width: 10, fontSize: 10, color: "#2563eb" },
    bulletText: { flex: 1, fontSize: 9.5, color: "#374151", lineHeight: 1.4 },
    eduBlock: { marginBottom: 6 },
    eduDegree: { fontSize: 10, fontWeight: "bold", color: "#111827" },
    eduInst: { fontSize: 9, color: "#6b7280" },
    skillCategory: { marginBottom: 6 },
    skillLabel: { fontSize: 9, fontWeight: "bold", color: "#1e40af", marginBottom: 3 },
    skillItem: { fontSize: 9, color: "#374151" },
})

// ============= EXECUTIVE DESIGN =============
const executiveStyles = StyleSheet.create({
    page: { padding: 45, fontFamily: "Helvetica", fontSize: 10, color: "#1f2937", lineHeight: 1.45 },
    header: { textAlign: "center", marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#9ca3af", borderBottomStyle: "solid" },
    name: { fontSize: 26, fontWeight: "bold", marginBottom: 3, letterSpacing: 2, textTransform: "uppercase", color: "#111827" },
    contactRow: { flexDirection: "row", justifyContent: "center", gap: 12, fontSize: 8.5, color: "#6b7280", marginTop: 4 },
    contactItem: { fontSize: 8.5, letterSpacing: 0.3 },
    sectionTitle: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 16, paddingBottom: 5, borderBottomWidth: 0.5, borderBottomColor: "#d1d5db", borderBottomStyle: "solid", color: "#374151" },
    summary: { fontSize: 10, color: "#4b5563", lineHeight: 1.6, marginBottom: 6, fontStyle: "italic" },
    expBlock: { marginBottom: 12 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb", borderBottomStyle: "solid" },
    expTitle: { fontSize: 11, fontWeight: "bold", color: "#111827" },
    expDate: { fontSize: 9, color: "#6b7280" },
    expCompany: { fontSize: 9.5, color: "#4b5563", marginBottom: 4, letterSpacing: 0.2 },
    bullet: { flexDirection: "row", marginBottom: 2.5, paddingLeft: 10 },
    bulletDot: { width: 12, fontSize: 8, color: "#9ca3af" },
    bulletText: { flex: 1, fontSize: 9.5, color: "#374151", lineHeight: 1.45 },
    eduBlock: { marginBottom: 8 },
    eduDegree: { fontSize: 10, fontWeight: "bold", color: "#111827" },
    eduInst: { fontSize: 9, color: "#6b7280", letterSpacing: 0.2 },
    skillCategory: { marginBottom: 8 },
    skillLabel: { fontSize: 8.5, fontWeight: "bold", color: "#374151", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 },
    skillItem: { fontSize: 9, color: "#4b5563" },
})

const designMap = {
    classic: classicStyles,
    modern: modernStyles,
    executive: executiveStyles,
}

export default function CvPdfDocument({ cvData, design = "classic" }: { cvData: CvData; design?: CvDesign }) {
    const { contactInfo, professionalSummary, experience, education, skills } = cvData
    const s = designMap[design]

    return (
        <Document>
            <Page size="LETTER" style={s.page}>
                {/* Header */}
                <View style={s.header}>
                    <Text style={s.name}>{contactInfo.fullName}</Text>
                    <View style={s.contactRow}>
                        {contactInfo.city && <Text style={s.contactItem}>{contactInfo.city}</Text>}
                        {contactInfo.email && <Text style={s.contactItem}>| {contactInfo.email}</Text>}
                        {contactInfo.phone && <Text style={s.contactItem}>| {contactInfo.phone}</Text>}
                        {contactInfo.linkedIn && <Text style={s.contactItem}>| {contactInfo.linkedIn}</Text>}
                    </View>
                </View>

                {/* Summary */}
                {professionalSummary && (
                    <View>
                        <Text style={s.sectionTitle}>Professional Summary</Text>
                        <Text style={s.summary}>{professionalSummary}</Text>
                    </View>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Professional Experience</Text>
                        {experience.map((exp, i) => (
                            <View key={i} style={s.expBlock}>
                                <View style={s.expHeader}>
                                    <Text style={s.expTitle}>{exp.title}</Text>
                                    <Text style={s.expDate}>
                                        {exp.startDate} — {exp.endDate}
                                    </Text>
                                </View>
                                <Text style={s.expCompany}>
                                    {exp.company}
                                    {exp.location ? `, ${exp.location}` : ""}
                                </Text>
                                {exp.achievements?.map((ach, j) => (
                                    <View key={j} style={s.bullet}>
                                        <Text style={s.bulletDot}>{design === "executive" ? "–" : "•"}</Text>
                                        <Text style={s.bulletText}>{ach}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <View>
                        <Text style={s.sectionTitle}>Education</Text>
                        {education.map((edu, i) => (
                            <View key={i} style={s.eduBlock}>
                                <Text style={s.eduDegree}>{edu.degree}</Text>
                                <Text style={s.eduInst}>
                                    {edu.institution}
                                    {edu.location ? `, ${edu.location}` : ""} — {edu.year}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                <View>
                    <Text style={s.sectionTitle}>Skills</Text>

                    {skills?.technical?.length > 0 && (
                        <View style={s.skillCategory}>
                            <Text style={s.skillLabel}>Technical:</Text>
                            <Text style={s.skillItem}>{skills.technical.join(design === "executive" ? "  |  " : " • ")}</Text>
                        </View>
                    )}

                    {skills?.soft?.length > 0 && (
                        <View style={s.skillCategory}>
                            <Text style={s.skillLabel}>Soft Skills:</Text>
                            <Text style={s.skillItem}>{skills.soft.join(design === "executive" ? "  |  " : " • ")}</Text>
                        </View>
                    )}

                    {skills?.languages?.length > 0 && (
                        <View style={s.skillCategory}>
                            <Text style={s.skillLabel}>Languages:</Text>
                            <Text style={s.skillItem}>{skills.languages.join(design === "executive" ? "  |  " : " • ")}</Text>
                        </View>
                    )}

                    {skills?.certifications?.length > 0 && (
                        <View style={s.skillCategory}>
                            <Text style={s.skillLabel}>Certifications:</Text>
                            <Text style={s.skillItem}>{skills.certifications.join(design === "executive" ? "  |  " : " • ")}</Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    )
}
