/**
 * PIERRE ENGINE: TEST GENERATION (M0-M3)
 * Este script simula la entrada de un Lead y genera los primeros 4 módulos profundos.
 */
const fetch = require('node-fetch');

async function pierreTest() {
    console.log("🛠️ --- INICIANDO SIMULACIÓN DE PIERRE --- 🛠️\n");

    const email = `test_pierre_${Date.now()}@example.com`;
    const payload = {
        data: {
            fields: [
                { key: "email", label: "Email", value: email },
                { key: "name", label: "Nombre", value: "Jorge Pierre Test" },
                { key: "status", label: "Ubicación", value: "Fuera de Canadá (México)" },
                { key: "noc", label: "Cargo actual", value: "IT Project Manager" },
                { key: "cv", label: "Resumen CV", value: "10 años en gestión de proyectos IT, PMP, Scrum Master, Inglés C1." }
            ]
        }
    };

    try {
        // 1. Enviar a Tally Webhook para crear el Lead
        console.log("📡 1. Creando Lead via Tally Webhook...");
        const webhookRes = await fetch('http://localhost:3000/api/webhooks/tally', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const webhookData = await webhookRes.json();
        
        if (!webhookData.success) throw new Error(webhookData.error);
        const leadId = webhookData.leadId;
        console.log(`✅ Lead Creado: ${leadId}\n`);

        // 2. Generar Módulos M0, M1, M2, M3
        const modules = ["m0", "m1", "m2", "m3"];
        for (const mId of modules) {
            console.log(`🤖 2. Generando ${mId.toUpperCase()} (Tono Pierre)...`);
            const genRes = await fetch('http://localhost:3000/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, moduleId: mId })
            });
            const genData = await genRes.json();
            
            if (genRes.ok) {
                console.log(`   ✨ ${mId.toUpperCase()} LISTO.`);
                console.log(`   Estrategia: ${genData.data?.strategy?.substring(0, 150)}...\n`);
            } else {
                console.error(`   ❌ Error en ${mId}:`, genData.error);
            }
        }

        console.log("🏆 --- PIERRE HA FINALIZADO LA MISIÓN --- 🏆");
        console.log(`Email del perfil de prueba: ${email}`);
        console.log("Ya puedes entrar como este usuario en el dashboard para ver el contenido real.");

    } catch (e) {
        console.error("🚨 Error crítico:", e.message);
    }
}

pierreTest();
