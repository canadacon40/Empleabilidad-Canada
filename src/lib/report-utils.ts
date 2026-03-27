import { sendGTMEvent } from "@next/third-parties/google";

export function generateReportHTML(result: any): string {
    return `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <title>Reporte de Empleabilidad Pierre 2.5 - CanadaConTrabajo</title>
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
            <div class="logo">CanadaConTrabajo.com</div>
            <div class="title">Estrategia Táctica de Empleabilidad</div>
            <div class="version">Diagnostic Engine Pierre v2.5</div>
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
            <div class="seal">Verified by Pierre</div>
            <p style="margin-top: 15px;">Este reporte es un activo estratégico propiedad de CanadaConTrabajo.com</p>
            <p>Generado electrónicamente bajo estándares ESDC / Job Bank Canada 2026.</p>
        </div>
    </body>
    </html>`;
}

export function downloadFullReportPDF(result: any) {
    const printContent = generateReportHTML(result)
    const printWindow = window.open("", "_blank")
    if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        setTimeout(() => {
            printWindow.print()
        }, 500)
    }
}

export async function downloadLMIAExcel(result: any) {
    const empresas = result.empresasLMIA?.lista || result.empresasLMIA || [];
    if (!empresas.length) return
    const XLSX = await import("xlsx")
    const data = empresas.map((e: any, i: number) => ({
        "#": i + 1,
        "Empresa": e.nombre,
        "Provincia": e.provincia,
        "Industria": e.industria,
        "Sitio Web": e.website,
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
            <div style="font-size: 12px; color: #64748b; margin-top: 5px; font-weight: 600;">Optimized for Canadian Professional Standards</div>
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
        <div class="pierre-badge">
            <div class="badge-text">Verified by Pierre Strategy Engine</div>
            <div class="match-text">ATS Compatibility Score: ${data.matchScore || 'N/A'}%</div>
        </div>
    </body>
    </html>`;
}

export function downloadCustomizedCVPDF(data: any) {
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
