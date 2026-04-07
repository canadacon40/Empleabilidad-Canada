const fetch = require('node-fetch');

async function triggerFirst4() {
    // 1. First, ensure a lead exists (Mock or Real)
    // We'll use a leadId that likely exists or create one via the webhook
    const leadId = "test_lead_deep_gen_01"; // Or any valid ID from your DB
    
    const modules = ["m0", "m1", "m2", "m3"];
    
    console.log(`🚀 Iniciando generación de los primeros 4 módulos para Lead: ${leadId}`);
    
    for (const mId of modules) {
        console.log(`\n--- Generando ${mId.toUpperCase()}... ---`);
        try {
            const res = await fetch('http://localhost:3000/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, moduleId: mId })
            });
            
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ ${mId.toUpperCase()} completado con éxito.`);
                console.log(`   Diagnóstico: ${data.data.diagnostic?.substring(0, 100)}...`);
            } else {
                console.error(`❌ Error en ${mId}:`, data.error);
            }
        } catch (e) {
            console.error(`❌ Error de conexión en ${mId}:`, e.message);
        }
        
        // Wait a bit to avoid overwhelming (optional)
        await new Promise(r => setTimeout(r, 2000));
    }
    
    console.log("\n✨ Prueba finalizada. Revisa tu base de datos o el dashboard para ver el contenido profundo.");
}

triggerFirst4();
