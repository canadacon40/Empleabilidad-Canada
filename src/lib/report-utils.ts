import { sendGTMEvent } from "@next/third-parties/google";

export function generateReportHTML(result: any): string {
    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <title>Reporte de Empleabilidad - Sistema de Acceso al Mercado Oculto</title>
        <style>
            body { font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 40px; background: #fff; }
            .header { text-align: center; border-bottom: 3px solid #0f172a; padding-bottom: 30px; margin-bottom: 40px; }
            .logo { font-size: 14px; font-weight: 900; color: #2563eb; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 10px; }
            .title { font-size: 32px; font-weight: 900; margin: 5px 0; color: #0f172a; letter-spacing: -1.5px; }
            .version { font-size: 10px; font-weight: 900; background: #0f172a; color: #2563eb; padding: 4px 12px; border-radius: 99px; display: inline-block; margin-top: 10px; }
            
            .section { margin-bottom: 40px; page-break-inside: avoid; }
            .section-header { background: #0f172a; color: white; padding: 12px 20px; font-weight: 900; font-size: 14px; border-radius: 8px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
            
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 15px; }
            .error-card { border-left: 5px solid #ef4444; }
            .card-title { font-weight: 900; font-size: 14px; margin-bottom: 8px; color: #0f172a; }
            .card-desc { font-size: 11px; color: #64748b; margin-bottom: 10px; line-height: 1.6; }
            .card-action { font-size: 11px; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 8px 12px; border-radius: 6px; border: 1px solid #dbeafe; }
            
            .noc-box { background: #eff6ff; border: 2px solid #2563eb; border-radius: 20px; padding: 25px; margin-bottom: 20px; }
            .noc-code { font-size: 10px; font-weight: 900; color: #2563eb; text-transform: uppercase; }
            .noc-title { font-size: 20px; font-weight: 900; margin: 5px 0; color: #0f172a; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .stat-box { text-align: center; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .stat-value { font-size: 18px; font-weight: 900; color: #0f172a; }
            .stat-label { font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; }
            
            .highlight { background: #fff7ed; border: 1px solid #ffedd5; padding: 15px; border-radius: 12px; font-size: 12px; font-style: italic; color: #9a3412; }
            
            .verdict-box { background: #0f172a; color: white; border-radius: 30px; padding: 40px; text-align: center; margin-top: 40px; }
            .verdict-title { font-size: 24px; font-weight: 900; margin-bottom: 20px; color: #2563eb; }
            .verdict-text { font-size: 16px; font-weight: 700; line-height: 1.6; }

            .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 60px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
            .seal { font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 2px; border: 2px solid #0f172a; padding: 5px 15px; display: inline-block; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">Estrategia de Acceso al Mercado Oculto</div>
        </div>

        <div class="section">
            <div class="section-header">1. Auditoría ATS: 5 Errores Críticos</div>
            ${result.diagnostico?.slice(0, 5).map((d: any, i: number) => `
                <div class="card error-card">
                    <div class="card-title">${i + 1}. ${d.problema}</div>
                    <div class="card-desc">${d.porque}</div>
                    <div class="card-action">ACCIÓN PIERRE: ${d.cambio}</div>
                </div>
            `).join('') || '<p>Análisis de estructura completado.</p>'}
        </div>

        <div class="section">
            <div class="section-header">2. Identidad Profesional: NOC 2021</div>
            <div class="noc-box">
                <div class="noc-code">CÓDIGO NOC ${result.analisisNOC?.codigo || 'N/A'}</div>
                <div class="noc-title">${result.analisisNOC?.titulo || 'Análisis de Perfil'}</div>
                <p style="font-size: 12px; color: #475569;">${result.analisisNOC?.descripcionQueEsNOC}</p>
                <div style="margin-top: 15px;">
                    <div style="font-size: 10px; font-weight: 900; color: #ef4444; text-transform: uppercase; margin-bottom: 5px;">Brechas de Perfil Detectadas:</div>
                    <ul style="font-size: 11px; margin: 0; padding-left: 20px;">
                        ${result.analisisNOC?.requisitosNoCumplidos?.map((r: string) => `<li>${r}</li>`).join('') || '<li>Sin brechas críticas detectadas.</li>'}
                    </ul>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="section">
                <div class="section-header">3. Academia de Idiomas</div>
                <div class="card">
                    <div class="card-title">Nivel: ${result.idiomas?.nivelActualEstimado}</div>
                    <p class="card-desc">${result.idiomas?.evaluacion}</p>
                    <div class="highlight">Estrategia: ${result.idiomas?.cronogramaMejora?.horizonteTiempo} - ${result.idiomas?.cronogramaMejora?.estrategia}</div>
                </div>
            </div>
            <div class="section">
                <div class="section-header">4. Tickets de Éxito</div>
                <div class="card">
                    <div style="font-size: 11px; font-weight: 800;">Certificaciones Mandatorias:</div>
                    <ul style="font-size: 10px; margin-top: 5px;">
                        ${result.certificaciones?.mandatory?.map((c: any) => `<li>${c.nombre} (${c.costo})</li>`).join('') || '<li>Sin requerimientos mandatorios inmediatos.</li>'}
                    </ul>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">5. Regulación y Legalidad</div>
            <div class="card">
                <div class="card-title">Estatus: ${result.regulacion?.esRegulada ? 'PROFESIÓN REGULADA' : 'PROFESIÓN NO REGULADA'}</div>
                <p class="card-desc"><strong>Permitido:</strong> ${result.regulacion?.quePuedesHacer}</p>
                <p class="card-desc"><strong>Restricciones:</strong> ${result.regulacion?.queNoPuedesHacer}</p>
                <div class="card-action">RUTA: ${result.regulacion?.comoRegularizarse}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">6. Roles Puente Estratégicos</div>
            <div class="grid">
                ${result.rolesPuente?.slice(0, 2).map((r: any) => `
                    <div class="stat-box">
                        <div class="stat-value">${r.titulo}</div>
                        <div class="stat-label">Salario: ${r.salarioAnual}</div>
                        <div style="font-size: 10px; margin-top: 8px; color: #64748b;">NOC: ${r.descripcionNOC}</div>
                    </div>
                `).join('') || '<div class="stat-box">Consolidando perfiles de entrada...</div>'}
            </div>
        </div>

        <div class="grid">
            <div class="section">
                <div class="section-header">7. Demanda Geográfica</div>
                <div class="card">
                    ${result.demandaLaboral?.slice(0, 3).map((p: any) => `
                        <div style="display:flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
                            <span>${p.provincia}</span>
                            <span style="font-weight:900; color: ${p.nivel === 'Muy Alta' ? '#10b981' : '#f59e0b'}">${p.nivel}</span>
                        </div>
                    `).join('') || '<p>Analizando mercados provinciales...</p>'}
                </div>
            </div>
            <div class="section">
                <div class="section-header">8. Inteligencia Salarial</div>
                <div class="card">
                    <div style="display:flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
                        <span>Junior:</span> <span style="font-weight:900;">${result.salarios?.entry}</span>
                    </div>
                    <div style="display:flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
                        <span>Median (Target):</span> <span style="font-weight:900; color: #2563eb;">${result.salarios?.mid}</span>
                    </div>
                    <div style="display:flex; justify-content: space-between; font-size: 11px;">
                        <span>Senior:</span> <span style="font-weight:900;">${result.salarios?.senior}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="verdict-box">
            <div class="verdict-title">9. El Veredicto Final de Pierre</div>
            <div class="verdict-text">"${result.conclusionEjecutiva?.recomendacionMaestra}"</div>
            <p style="font-size: 14px; margin-top: 20px; opacity: 0.8;">${result.conclusionEjecutiva?.detalleEmpleabilidad}</p>
        </div>

        <div class="section" style="margin-top: 40px; border: 2px dashed #e2e8f0; padding: 25px; border-radius: 20px;">
            <div style="font-weight: 900; font-size: 14px; margin-bottom: 10px;">10. Bonus: Arquitectura de CV Canadience</div>
            <div style="font-size: 11px;">
                <strong>Orden de Secciones:</strong> ${result.bonus?.estructuraCVRecomendada?.orden?.join(' > ')}
            </div>
            <ul style="font-size: 10px; margin-top: 10px;">
                ${result.bonus?.estructuraCVRecomendada?.tipsVisuales?.map((t: string) => `<li>${t}</li>`).join('') || '<li>Standard Canadian Format applied.</li>'}
            </ul>
        </div>

        <div class="footer">
            <p>Generado electrónicamente bajo estándares ESDC / Job Bank Canada 2026.</p>            
        </div>
    </body>
    </html>`;
}

export function downloadFullReportPDF(result: any) {
    const html = generateReportHTML(result);
    
    // ASYNC PRINTING ENGINE - FIXES THE FREEZE
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // 🚀 ACTIVATE PRINT DIALOG
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    }
}

export async function downloadLMIAExcel(result: any) {
    const empresas = result.empresasLMIA?.lista || result.empresasLMIA || [];
    if (!empresas.length) {
        alert("En este momento no se encontraron empresas con patrocinios activos para tu sector específico. Pierre recomienda ampliar la búsqueda a roles puente.");
        return;
    }
    const XLSX = await import("xlsx")
    const data = empresas.map((e: any, i: number) => ({
        "#": i + 1,
        "Empresa": e.nombre || "Empresa por Contactar",
        "Provincia": e.provincia || "Diversas",
        "Industria": e.industria || "Sector Relacionado",
        "Sitio Web": e.website || "Consultar en Google",
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Empresas LMIA")
    ws["!cols"] = [{ wch: 4 }, { wch: 35 }, { wch: 15 }, { wch: 25 }, { wch: 40 }]
    XLSX.writeFile(wb, "Empresas_LMIA_Canada.xlsx")
}

export function generateCustomizedCVHTML(data: any) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 40px; background: #fff; max-width: 850px; margin: 0 auto; }
            .header { text-align: left; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 25px; }
            .name { font-size: 28px; font-weight: 900; margin: 0; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
            .summary { font-size: 13px; font-weight: 500; color: #475569; margin-top: 20px; text-align: justify; line-height: 1.7; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-size: 14px; font-weight: 900; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 15px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
            .exp-item { margin-bottom: 20px; }
            .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
            .exp-title { font-size: 14px; font-weight: 800; color: #1e293b; }
            .exp-company { font-size: 13px; font-weight: 700; color: #475569; }
            .exp-date { font-size: 11px; font-weight: 600; color: #64748b; }
            .achievement-list { margin: 5px 0 0 15px; padding: 0; }
            .achievement-item { font-size: 12px; color: #334155; margin-bottom: 5px; list-style-type: square; }
            .keywords-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
            .kw-pill { font-size: 10px; font-weight: 700; background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 4px; border: 1px solid #e2e8f0; }
            .pierre-badge { margin-top: 40px; text-align: right; border-top: 1px solid #f1f5f9; padding-top: 20px; }
            .badge-text { font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
            .match-text { font-size: 12px; font-weight: 800; color: #2563eb; margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">${data.name || 'Professional Candidate'}</div>
        </div>
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${data.customizedSummary}</div>
        </div>
        <div class="section">
            <div class="section-title">Professional Experience</div>
            ${data.customizedExperience?.map((exp: any) => `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-title">${exp.title}</span>
                        <span class="exp-date">${exp.period}</span>
                    </div>
                    <div class="exp-company">${exp.company}</div>
                    <ul class="achievement-list">
                        ${exp.achievements?.map((a: string) => `<li class="achievement-item">${a}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        ${data.addedKeywords?.length > 0 ? `
            <div class="section">
                <div class="section-title">Core Competencies & ATS Keywords</div>
                <div class="keywords-container">
                    ${data.addedKeywords.map((kw: string) => `<span class="kw-pill">${kw}</span>`).join('')}
                </div>
            </div>
        ` : ''}
    </body>
    </html>`;
}

export function downloadCustomizedCVPDF(data: any) {
    if (!data || !data.customizedExperience || data.customizedExperience.length === 0) {
        alert("Información insuficiente para generar el PDF. Por favor, asegúrate de haber completado el análisis.");
        return;
    }
    const printContent = generateCustomizedCVHTML(data);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}

export async function downloadCustomizedCVWord(cvData: any) {
    if (!cvData) {
        alert("Información insuficiente para generar el CV.");
        return;
    }

    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType, TabStopPosition } = await import("docx");

    // Standardize data access
    const cv = cvData.redesignedCv || cvData;
    const info = cv.personalInfo || {};
    const contact = info.contactDetails || {};

    const contactStr = [
        contact.email,
        contact.phone,
        contact.location,
        contact.linkedin ? `linkedin.com/in/${contact.linkedin.replace(/.*\//, '')}` : null
    ].filter(Boolean).join(" | ");

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header: Name & Headline
                new Paragraph({
                    text: info.fullName || "Professional Candidate",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: info.headline || "",
                            bold: true,
                            color: "2563eb",
                            size: 28, // 14pt
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    children: [new TextRun({ text: contactStr, size: 18 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                }),

                // Summary
                new Paragraph({
                    text: "PROFESSIONAL SUMMARY",
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                }),
                new Paragraph({
                    children: [new TextRun({ text: cv.professionalSummary, italics: true })],
                    spacing: { before: 120, after: 250 },
                }),

                // Core Competencies
                new Paragraph({
                    text: "CORE COMPETENCIES",
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                }),
                new Paragraph({
                    text: (cv.coreCompetencies || []).join(" • "),
                    spacing: { before: 120, after: 250 },
                }),

                // Work Experience
                new Paragraph({
                    text: "PROFESSIONAL EXPERIENCE",
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                }),
                ...(cv.workExperience || []).map((exp: any) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.jobTitle, bold: true, size: 22 }),
                            new TextRun({ text: `\t${exp.period}`, bold: true, size: 20 }),
                        ],
                        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                        spacing: { before: 200 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: `${exp.company} | ${exp.location}`, italics: true, color: "666666" })],
                        spacing: { after: 120 },
                    }),
                    ...(exp.achievements || []).map((a: string) => 
                        new Paragraph({
                            text: a,
                            bullet: { level: 0 },
                        })
                    ),
                ]).flat(),

                // Education
                ...(cv.education?.length ? [
                    new Paragraph({
                        text: "EDUCATION",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300 },
                        border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    }),
                    ...cv.education.map((edu: any) => 
                        new Paragraph({
                            children: [
                                new TextRun({ text: edu.degree, bold: true }),
                                new TextRun({ text: `\t${edu.year}` }),
                            ],
                            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                            spacing: { before: 120 },
                        })
                    ),
                ] : []),

                // Extra Sections
                ...(cv.certifications?.length || cv.languages?.length ? [
                    new Paragraph({
                        text: "ADDITIONAL INFORMATION",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300 },
                        border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    }),
                    ...(cv.certifications?.length ? [
                        new Paragraph({ children: [new TextRun({ text: "CERTIFICATIONS: ", bold: true }), new TextRun(cv.certifications.join(", "))], spacing: { before: 120 } })
                    ] : []),
                    ...(cv.languages?.length ? [
                        new Paragraph({ children: [new TextRun({ text: "LANGUAGES: ", bold: true }), new TextRun(cv.languages.join(", "))], spacing: { before: 60 } })
                    ] : [])
                ] : [])
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    const filename = `CV_${info.fullName?.replace(/\s+/g, '_') || 'Professional'}.docx`;

    const url = window.URL.createObjectURL(blob);
    const link = document.body.appendChild(document.createElement("a"));
    link.href = url;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export function generateInterviewHTML(result: any) {
    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 40px; background: #fff; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #64748b; font-weight: 600; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section-title { font-size: 16px; font-weight: 900; background: #f8fafc; padding: 10px; border-left: 5px solid #2563eb; margin-bottom: 15px; text-transform: uppercase; }
            .q-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 15px; }
            .q-text { font-weight: 800; font-size: 14px; color: #0f172a; margin-bottom: 10px; }
            .a-label { font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; display: block; margin-top: 8px; }
            .a-text { font-size: 12px; color: #334155; }
            .star-grid { display: grid; grid-template-columns: 100px 1fr; gap: 10px; margin-top: 10px; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">Predicción Estratégica de Entrevista</div>
        </div>

        ${result.technicalQuestions?.length > 0 ? `
            <div class="section">
                <div class="section-title">Preguntas Técnicas Detectadas</div>
                ${result.technicalQuestions.map((q: any, i: number) => `
                    <div class="q-card">
                        <div class="q-text">${i + 1}. ${q.question}</div>
                        <span class="a-label">Estrategia de Respuesta:</span>
                        <div class="a-text">${q.howToAnswer}</div>
                        <span class="a-label">Respuesta Modelo:</span>
                        <div class="a-text" style="background: #f8fafc; padding: 10px; border-radius: 6px; margin-top: 5px; font-style: italic;">"${q.sampleAnswer}"</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${result.behavioralQuestions?.length > 0 ? `
            <div class="section">
                <div class="section-title">Preguntas de Comportamiento (Método STAR)</div>
                ${result.behavioralQuestions.map((q: any, i: number) => `
                    <div class="q-card">
                        <div class="q-text">${i + 1}. ${q.question}</div>
                        <span class="a-label">Competencia Evaluada: ${q.competency}</span>
                        <div class="star-grid">
                            <span class="a-label">Situación:</span> <div class="a-text">${q.starTemplate?.situation}</div>
                            <span class="a-label">Tarea:</span> <div class="a-text">${q.starTemplate?.task}</div>
                            <span class="a-label">Acción:</span> <div class="a-text">${q.starTemplate?.action}</div>
                            <span class="a-label">Resultado:</span> <div class="a-text">${q.starTemplate?.result}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

    </body>
    </html>`;
}

export function downloadInterviewPDF(result: any) {
    if (!result || (!result.technicalQuestions?.length && !result.behavioralQuestions?.length)) {
        alert("No hay preguntas generadas para descargar.");
        return;
    }
    const html = generateInterviewHTML(result);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 5000); 
    }
}

export function generateManualHTML() {
    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; background: #fff; max-width: 850px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 32px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 5px; }
            .subtitle { font-size: 14px; font-weight: 600; color: #2563eb; letter-spacing: 2px; text-transform: uppercase; }
            .intro { font-size: 14px; color: #475569; text-align: center; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }
            .step { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 40px; padding: 25px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; }
            .step-number { background: #2563eb; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; flex-shrink: 0; margin-top: 5px; }
            .step-content h3 { margin: 0 0 10px 0; font-size: 18px; font-weight: 900; color: #0f172a; }
            .step-content p { margin: 0 0 10px 0; font-size: 13px; color: #475569; }
            .highlight-box { background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; font-size: 12px; margin-top: 15px; }
            .highlight-box strong { color: #1e40af; }
            .score-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            .score-table th, .score-table td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            .score-table th { background: #f1f5f9; font-weight: 800; color: #0f172a; }
            .score-table .t-90 { color: #16a34a; font-weight: 800; }
            .score-table .t-80 { color: #ca8a04; font-weight: 800; }
            .score-table .t-75 { color: #ea580c; font-weight: 800; }
            .score-table .t-low { color: #dc2626; font-weight: 800; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">Manual de Uso PRO</div>
        </div>
        
        <p class="intro">Este manual explica cómo operar correctamente la sección PRO de Plataforma Pierre para estructurar tu CV, iterar con ofertas laborales (JD) y aumentar tus métricas de empleabilidad exponencialmente.</p>

        <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
                <h3>Cómo interpretar tu Salida de CV Canadiense</h3>
                <p>La herramienta <strong>Transformar CV a formato canadiense</strong> produce un documento en un formato ATS optimizado. Esto significa que tu perfil se ha ajustado para el sistema norteamericano identificando tu Primary NOC (National Occupational Classification) y proponiendo posibles Roles.</p>
                <p>Al leer tu nuevo CV, notarás la falta de información irrelevante (edad, foto, lugar de nacimiento) y observarás cómo tus funciones pasaron a ser "Logros medibles". Úsalo como tu "CV Base". Puedes elegir si deseas este documento original en Inglés o Francés de acuerdo a tu provincia destino.</p>
            </div>
        </div>

        <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
                <h3>El Motor de JD Matching (Iteración Constante)</h3>
                <p>Una vez que tienes tu CV Base, no apliques todavía a ningún trabajo. Para cada postulacion que quieras hacer, copia la publicación de LinkedIn, Indeed o JobBank y utilízala en la herramienta <strong>JD Matcher</strong>.</p>
                <p>Esta herramienta compara microscópicamente tu currículum contra los requisitos exactos de la posición en tres ejes: <strong>Skills, Experiencia y Keywords ATS</strong>.</p>
            </div>
        </div>

        <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
                <h3>Cómo Leer tu Match Score</h3>
                <p>El porcentaje final te otorga una visión matemática de tu potencial frente al ATS. Si tu porcentaje es bajo, no desperdicies la oportunidad enviando un CV ciego. Usa la siguiente métrica para tu toma de decisión:</p>
                <table class="score-table">
                    <tr><th>Score Promedio</th><th>Significado</th><th>Acción a tomar</th></tr>
                    <tr><td class="t-90">90% o más</td><td>Strong alignment (Alineación fuerte)</td><td><strong>APPLY:</strong> Envía tu solicitud de la forma más prioritaria.</td></tr>
                    <tr><td class="t-80">80% - 89%</td><td>Competitive (Competitivo)</td><td><strong>APPLY WITH IMPROVEMENTS:</strong> Ajusta un par de palabras clave con Pierre y aplica.</td></tr>
                    <tr><td class="t-75">75% - 79%</td><td>Partial (Alineación parcial)</td><td><strong>PRECAUCIÓN:</strong> Tu experiencia puede no ser vista. Hay varias brechas técnicas.</td></tr>
                    <tr><td class="t-low">Menor al 75%</td><td>Weak (Débil)</td><td><strong>DO NOT APPLY:</strong> Tu CV será bloqueado instantáneamente por el algoritmo.</td></tr>
                </table>
            </div>
        </div>

        <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
                <h3>Gap Analysis y Múltiples Versiones de CV</h3>
                <p>Cuando la herramienta señale qué Gaps o carencias tienes, éstas se desglosarán meticulosamente en: Experiencia, Habilidades, Certificaciones o nivel de CLB (idioma). Tu trabajo es actuar sobre esta data. Pierre te da un botón especial para "Generar CV Ajustado a este JD".</p>
                <p><strong>El Manejo de Versiones:</strong> Gracias a esto, podrás mantener un registro en pantalla de tu "CV Base" (el que generaste en el nivel 1) junto a distintos "CVs Personalizados" por JD. Nunca sobre-escribiremos tu trabajo. Así puedes exportar un CV único para cada postulación puntual.</p>
                <div class="highlight-box">
                    <strong>🎯 CONSEJO PRO:</strong> Repite el JD Matcher varias veces. No pares de iterar hasta alcanzar 90%+
                </div>
            </div>
        </div>

    </body>
    </html>`;
}

export function downloadUserManualPDF() {
    const html = generateManualHTML();
    
    // ASYNC PRINTING ENGINE - FIXES THE FREEZE
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // 🚀 ACTIVATE PRINT DIALOG
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500);
    }
}

/**
 * 📄 PREMIUM PDF ENGINE - SURGICAL CANADIAN STANDARD
 * This engine handles the 3 distinct visual styles and eliminates the UI freeze.
 */
export function downloadStyledCVPdf(cvData: any, style: 'Classic' | 'Elegant' | 'Modern', language: string = 'En') {
    // If we received a string (old format), we try to parse it or wrap it
    let data = cvData;
    if (typeof cvData === 'string') {
        try {
            data = JSON.parse(cvData);
        } catch (e) {
            // Fallback for raw text - not ideal but prevents crash
            data = { redesignedCv: { personalInfo: { fullName: 'Professional Candidate' }, professionalSummary: cvData } };
        }
    }

    const cv = data.redesignedCv || data;
    const info = cv.personalInfo || {};
    const contact = info.contactDetails || {};

    // 1. SELECT STYLE TOKENS
    let styles = {
        font: "'Inter', -apple-system, sans-serif",
        headerBg: "transparent",
        headerText: "#0f172a",
        accent: "#2563eb",
        titleSize: "28pt",
        sectionBorder: "1px solid #e2e8f0",
        containerPadding: "40pt",
        alignment: "left"
    };

    if (style === 'Classic') {
        styles = {
            font: "'Times New Roman', Times, serif",
            headerBg: "transparent",
            headerText: "#000",
            accent: "#000",
            titleSize: "22pt",
            sectionBorder: "1px solid #000",
            containerPadding: "50pt",
            alignment: "center"
        };
    } else if (style === 'Elegant') {
        styles = {
            font: "'Playfair Display', serif",
            headerBg: "transparent", 
            headerText: "#0f172a",
            accent: "#0f172a",
            titleSize: "32pt",
            sectionBorder: "0.5pt solid #0f172a",
            containerPadding: "50pt",
            alignment: "center"
        };
    } else if (style === 'Modern') {
        styles = {
            font: "'Inter', sans-serif",
            headerBg: "transparent",
            headerText: "#0f172a",
            accent: "#f59e0b", // Amber accent
            titleSize: "30pt",
            sectionBorder: "none",
            containerPadding: "40pt",
            alignment: "left"
        };
    }

    // 2. GENERATE PREMIUM HTML
    const html = `
    <!DOCTYPE html>
    <html lang="${language === 'Fr' ? 'fr' : 'en'}">
    <head>
        <meta charset="utf-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
            @page { size: letter; margin: 0; }
            body { 
                font-family: ${styles.font}; 
                color: #1e293b; 
                line-height: 1.45; 
                font-size: 10pt; 
                margin: 0; 
                padding: 0;
            }
            .page { 
                padding: ${styles.containerPadding};
                min-height: 100vh;
                box-sizing: border-box;
            }
            
            /* HEADER */
            .header { 
                background: ${styles.headerBg}; 
                color: ${styles.headerText};
                text-align: ${styles.alignment};
                padding: ${style === 'Executive' ? '40pt' : '0 0 20pt 0'};
                margin: ${style === 'Executive' ? '-40pt -40pt 20pt -40pt' : '0'};
            }
            .name { 
                font-size: ${styles.titleSize}; 
                font-weight: 900; 
                text-transform: uppercase; 
                letter-spacing: -0.05em;
                margin-bottom: 5pt;
            }
            .headline {
                font-size: 13pt;
                font-weight: 700;
                color: ${style === 'Classic' ? '#444' : styles.accent};
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 10pt;
            }
            .contact-info {
                display: flex;
                flex-wrap: wrap;
                justify-content: ${styles.alignment === 'center' ? 'center' : 'flex-start'};
                gap: 15pt;
                font-size: 9pt;
                font-weight: 600;
                color: ${style === 'Executive' ? 'rgba(255,255,255,0.8)' : '#64748b'};
            }

            /* SECTIONS */
            .section { margin-top: 20pt; }
            .section-title {
                font-size: 11pt;
                font-weight: 900;
                color: ${styles.accent};
                text-transform: uppercase;
                letter-spacing: 0.15em;
                border-bottom: ${styles.sectionBorder};
                padding-bottom: 4pt;
                margin-bottom: 10pt;
            }
            
            .summary { text-align: justify; font-style: italic; color: #334155; }
            
            /* EXPERIENCE */
            .exp-item { margin-bottom: 15pt; }
            .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
            .job-title { font-weight: 900; font-size: 11pt; color: #0f172a; }
            .dates { font-weight: 700; font-size: 9pt; color: #64748b; }
            .company { font-weight: 700; font-size: 10pt; color: #475569; margin-bottom: 4pt; }
            
            .achievements { 
                margin: 5pt 0 0 15pt; 
                padding: 0; 
                list-style-type: ${style === 'Modern' ? 'circle' : 'square'}; 
            }
            .achievement-item { margin-bottom: 3pt; color: #1e293b; }

            /* SKILLS MATRIX */
            .skills-grid { 
                display: grid; 
                grid-template-columns: repeat(3, 1fr); 
                gap: 5pt; 
            }
            .skill-item { 
                font-weight: 700; 
                font-size: 9pt; 
                padding: 4pt 8pt;
                background: ${style === 'Modern' ? '#f8fafc' : 'transparent'};
                border: ${style === 'Modern' ? '1px solid #e2e8f0' : 'none'};
                border-radius: 4pt;
            }

            .edu-item { margin-bottom: 8pt; }
            .edu-degree { font-weight: 800; font-size: 10pt; }
            
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body onload="window.print()">
        <div class="page">
            <div class="header">
                <div class="name">${info.fullName || 'Professional Candidate'}</div>
                <div class="headline">${info.headline || 'Impact-Driven Professional'}</div>
                <div class="contact-info">
                    ${contact.email ? `<span>${contact.email}</span>` : ''}
                    ${contact.phone ? `<span>${contact.phone}</span>` : ''}
                    ${contact.location ? `<span>${contact.location}</span>` : ''}
                    ${contact.linkedin ? `<span>LinkedIn.com/in/${contact.linkedin.replace(/.*\//, '')}</span>` : ''}
                </div>
            </div>

            <div class="section">
                <div class="section-title">Professional Profile</div>
                <div class="summary">${cv.professionalSummary}</div>
            </div>

            <div class="section">
                <div class="section-title">Core Competencies</div>
                <div class="skills-grid">
                    ${(cv.coreCompetencies || []).map((s: string) => `<div class="skill-item">• ${s}</div>`).join('')}
                </div>
            </div>

            <div class="section">
                <div class="section-title">Professional Experience</div>
                ${(cv.workExperience || []).map((exp: any) => `
                    <div class="exp-item">
                        <div class="exp-header">
                            <span class="job-title">${exp.jobTitle}</span>
                            <span class="dates">${exp.period}</span>
                        </div>
                        <div class="company">${exp.company} | ${exp.location}</div>
                        <ul class="achievements">
                            ${(exp.achievements || []).map((a: string) => `<li class="achievement-item">${a}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            ${cv.education?.length ? `
                <div class="section">
                    <div class="section-title">Academic Background</div>
                    ${cv.education.map((edu: any) => `
                        <div class="edu-item">
                            <div class="edu-degree">${edu.degree}</div>
                            <div class="company">${edu.institution} | ${edu.year}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${cv.certifications?.length || cv.languages?.length ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30pt;">
                    ${cv.certifications?.length ? `
                        <div class="section">
                            <div class="section-title">Certifications</div>
                            <ul style="padding-left: 15pt; margin: 0;">
                                ${cv.certifications.map((c: string) => `<li style="font-size: 9pt; font-weight:600;">${c}</li>`).join('')}
                            </ul>
                        </div>
                    ` : '<div></div>'}
                    ${cv.languages?.length ? `
                        <div class="section">
                            <div class="section-title">Languages</div>
                            <ul style="padding-left: 15pt; margin: 0;">
                                ${cv.languages.map((l: string) => `<li style="font-size: 9pt; font-weight:600;">${l}</li>`).join('')}
                            </ul>
                        </div>
                    ` : '<div></div>'}
                </div>
            ` : ''}

            {/* NO BRANDING - CLEAN EXPORT */}
        </div>
    </body>
    </html>`;

    // 3. ASYNC PRINTING ENGINE - FIXES THE FREEZE
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Give the browser time to render and open the print dialog
        // Using an iframe prevents the main window from freezing or losing focus
        setTimeout(() => {
            // Remove iframe after print dialog is closed (or approximately enough time)
            // Note: window.print() is blocking within the iframe, so this is safe
            document.body.removeChild(iframe);
        }, 3000); 
    }
}
export function generateCoverLetterHTML(data: any) {
    const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Default values for smart completion if AI didn't provide them
    const contact = data.finalContactName || 'Hiring Manager';
    const company = data.finalCompanyName || '[Company Name]';
    const role = data.finalTargetRole || 'Professional Position';

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
        <style>
            @page { size: letter; margin: 0.75in; }
            body { 
                font-family: 'Inter', -apple-system, sans-serif; 
                color: #1e293b; 
                line-height: 1.5; 
                font-size: 10.5pt; 
                margin: 0; 
                padding: 0; 
                background: #fff;
                overflow: hidden; /* Force 1 page */
                height: 100vh;
            }
            .page-container {
                padding: 20pt 40pt;
                max-height: 100%;
                display: flex;
                flex-direction: column;
            }
            .header-line { border-bottom: 1px solid #e2e8f0; margin-bottom: 20pt; padding-bottom: 10pt; display: flex; justify-content: space-between; align-items: baseline; }
            .header-title { font-weight: 900; font-size: 12pt; letter-spacing: 2px; color: #0f172a; text-transform: uppercase; }
            
            .date { margin-bottom: 20pt; font-weight: 700; color: #0f172a; }
            
            .recipient-block { margin-bottom: 20pt; line-height: 1.3; }
            .recipient-name { font-weight: 700; }
            .recipient-company { color: #64748b; font-weight: 500; }
            
            .subject-line { margin-bottom: 25pt; font-weight: 900; text-transform: uppercase; border-left: 4px solid #0f172a; padding-left: 12pt; }
            
            .salutation { margin-bottom: 15pt; font-weight: 700; }
            
            .content { text-align: justify; margin-bottom: 30pt; white-space: pre-wrap; font-size: 10.5pt; }
            
            .signature-block { margin-top: auto; padding-top: 20pt; page-break-inside: avoid; position: relative; }
            .regards { margin-bottom: 35pt; font-weight: 700; }
            
            .signature-wrapper { position: relative; height: 50pt; margin-top: -30pt; }
            .signature-handwriting { 
                font-family: 'Dancing Script', cursive; 
                font-size: 26pt; 
                color: #2563eb; 
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                transform: rotate(-2deg);
            }
            .signature-typed { 
                font-weight: 900; 
                text-transform: uppercase; 
                font-size: 9pt; 
                letter-spacing: 1px; 
                color: #0f172a; 
                position: absolute;
                bottom: 0;
                left: 0;
                border-top: 1px solid #f1f5f9;
                width: 200pt;
                padding-top: 4pt;
            }
            
            .footer-info { font-size: 7.5pt; color: #cbd5e1; text-align: center; margin-top: 40pt; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; border-top: 1px solid #f8fafc; padding-top: 20pt; }
        </style>
    </head>
    <body>
        <div class="page-container">
            <div class="header-line">
                <div class="header-title">Cover Letter</div>
                <div style="font-size: 8pt; color: #94a3b8; font-weight: 700;">PRO STRATEGY ENGINE</div>
            </div>

            <div class="date">${today}</div>
            
            <div class="recipient-block">
                <div class="recipient-name">${contact}</div>
                <div class="recipient-company">${company}</div>
            </div>

            <div class="subject-line">
                RE: ${role} APPLICATION
            </div>
            
            <div class="salutation">Dear ${contact},</div>
            
            <div class="content">${data.coverLetter}</div>
            
            <div class="signature-block">
                <div class="regards">Sincerely,</div>
                <div class="signature-wrapper">
                    <div class="signature-handwriting">${data.userName || 'Professional Candidate'}</div>
                    <div class="signature-typed">${data.userName || 'Professional Candidate'}</div>
                </div>
            </div>

            <div class="footer-info">Canadian Market Access 2026</div>
        </div>
    </body>
    </html>`;
}

export function downloadCoverLetterPDF(data: any) {
    if (!data || !data.coverLetter) return;
    const html = generateCoverLetterHTML(data);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Give fonts time to load
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 1000);
    }
}
