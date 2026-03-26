/* eslint-disable @typescript-eslint/no-explicit-any */
export function generateReportHTML(result: any): string {
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte de Empleabilidad Canadiense</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; font-size: 13px; }
        h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; }
        h2 { color: #1e40af; margin-top: 24px; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 12px; }
        th, td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; }
        .alta { background: #dcfce7; color: #166534; } .media { background: #fef3c7; color: #92400e; } .baja { background: #fee2e2; color: #991b1b; }
        .disclaimer { background: #fffbeb; border: 1px solid #fcd34d; padding: 10px; border-radius: 8px; margin: 12px 0; font-size: 12px; }
        .lmia-disclaimer { background: #eff6ff; border: 1px solid #93c5fd; padding: 10px; border-radius: 8px; margin: 12px 0; font-size: 12px; }
        @media print { body { font-size: 11px; } h1 { font-size: 18px; } h2 { font-size: 14px; } }
    </style></head><body>`

    html += `<h1>📊 Reporte de Empleabilidad Canadiense</h1>`
    html += `<p style="color:#666;font-size:11px;">Generado el ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</p>`
    html += `<div class="disclaimer"><strong>Nota:</strong> Esta información es referencial. Los precios, disponibilidad y rangos salariales pueden variar. Verifica siempre en los sitios web oficiales.</div>`

    // Diagnóstico
    if (result.diagnostico?.length) {
        html += `<h2>❌ Diagnóstico del CV Actual</h2><table><tr><th>Problema</th><th>¿Por qué?</th><th>Cambio</th></tr>`
        result.diagnostico.forEach((d: any) => { html += `<tr><td>${d.problema}</td><td>${d.porque}</td><td>${d.cambio}</td></tr>` })
        html += `</table>`
    }

    // Regulación
    if (result.regulacion) {
        html += `<h2>🛡️ Regulación Profesional — ${result.regulacion.profesion}</h2>`
        html += `<p><strong>${result.regulacion.esRegulada ? "⚠️ Profesión Regulada" : "✅ Profesión No Regulada"}</strong></p>`
        html += `<p>${result.regulacion.detalle}</p>`
        if (result.regulacion.reguladoresPorProvincia?.length) {
            html += `<table><tr><th>Provincia</th><th>Ente Regulador</th><th>Sitio Web</th></tr>`
            result.regulacion.reguladoresPorProvincia.forEach((r: any) => {
                html += `<tr><td>${r.provincia}</td><td>${r.entidad}</td><td><a href="${r.url}">${r.url}</a></td></tr>`
            })
            html += `</table>`
        }
        if (result.regulacion.procesoGeneral) html += `<p><strong>Proceso:</strong> ${result.regulacion.procesoGeneral}</p>`
    }

    // Idiomas
    if (result.idiomas) {
        html += `<h2>🌐 Idiomas y Realidad del Mercado</h2>`
        html += `<p><strong>Inglés:</strong> ${result.idiomas.mensajeIngles || result.idiomas.nivelInglesTexto}</p>`
        html += `<p><strong>Francés:</strong> ${result.idiomas.nivelFrancesTexto || "Nulo / Básico"}</p>`
        if (result.idiomas.aplicaMovilidadFrancofona) {
            html += `<p style="color:#1d4ed8;">🚀 <strong>Movilidad Francófona:</strong> Perfil elegible para contratación directa fuera de Quebec sin LMIA.</p>`
        }
    }

    // Certificaciones
    if (result.certificaciones?.length) {
        html += `<h2>🏆 Certificaciones Recomendadas</h2><table><tr><th>Nombre</th><th>Tipo</th><th>Costo</th><th>URL</th></tr>`
        result.certificaciones.forEach((c: any) => {
            html += `<tr><td>${c.nombre}</td><td>${c.tipo}</td><td>${c.costoCAD}</td><td><a href="${c.url}">${c.url}</a></td></tr>`
        })
        html += `</table>`
    }

    // Roles Puente
    if (result.rolesPuente?.length) {
        html += `<h2>🔀 Roles Puente (Bridge Roles)</h2><table><tr><th>Título</th><th>Equivalencia</th><th>Salario Estimado</th></tr>`
        result.rolesPuente.forEach((r: any) => {
            html += `<tr><td>${r.titulo}</td><td>${r.tituloEspanol}</td><td>${r.salarioPromedio} CAD/año</td></tr>`
        })
        html += `</table>`
    }

    // Demanda
    if (result.demandaProvincia?.length) {
        html += `<h2>📍 Demanda por Provincia</h2><table><tr><th>Provincia</th><th>Demanda</th><th>Puntos Clave</th></tr>`
        result.demandaProvincia.forEach((p: any) => {
            html += `<tr><td>${p.provincia}</td><td>${p.demanda}</td><td>${p.nota}</td></tr>`
        })
        html += `</table>`
    }

    // Salarios
    if (result.salarios) {
        html += `<h2>💰 Rangos Salariales (CAD/año)</h2><table><tr><th>Entry Level</th><th>Mid Level</th><th>Senior</th></tr>`
        html += `<tr><td>${result.salarios.entry}</td><td>${result.salarios.mid}</td><td>${result.salarios.senior}</td></tr></table>`
        if (result.salarios.promedioCanada) html += `<p><strong>Promedio Nacional:</strong> ${result.salarios.promedioCanada}</p>`
    }

    // Empresas LMIA
    if (result.empresasLMIA?.length) {
        html += `<h2>🏗️ Empresas con Historial de Patrocinio (LMIA)</h2>`
        html += `<div class="lmia-disclaimer">Estas empresas han gestionado patrocinios recientemente. Se recomienda contactar directamente.</div>`
        html += `<table><tr><th>Empresa</th><th>Provincia</th><th>Industria</th><th>Web</th></tr>`
        result.empresasLMIA.forEach((e: any) => {
            html += `<tr><td>${e.nombre}</td><td>${e.provincia}</td><td>${e.industria}</td><td><a href="${e.website}">${e.website}</a></td></tr>`
        })
        html += `</table>`
    }

    html += `</body></html>`
    return html
}

export function downloadFullReportPDF(result: any) {
    const printContent = generateReportHTML(result)
    const printWindow = window.open("", "_blank")
    if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print()
        }, 500)
    }
}

export async function downloadLMIAExcel(result: any) {
    if (!result?.empresasLMIA?.length) return
    const XLSX = await import("xlsx")
    const data = result.empresasLMIA.map((e: any, i: number) => ({
        "#": i + 1,
        "Empresa": e.nombre,
        "Provincia": e.provincia,
        "Industria": e.industria,
        "Sitio Web": e.website,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Empresas LMIA")
    // Set column widths
    ws["!cols"] = [{ wch: 4 }, { wch: 35 }, { wch: 15 }, { wch: 25 }, { wch: 40 }]
    XLSX.writeFile(wb, "Empresas_LMIA_Canada.xlsx")
}
