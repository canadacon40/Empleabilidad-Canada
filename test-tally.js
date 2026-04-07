const fetch = require('node-fetch');

async function testTally() {
    const payload = {
        eventId: "test_event_123",
        eventType: "FORM_RESPONSE",
        data: {
            fields: [
                { key: "f1", label: "Tu email", type: "INPUT_EMAIL", value: "test_tally@example.com" },
                { key: "f2", label: "Tu nombre", type: "INPUT_TEXT", value: "Juan Tally" },
                { key: "f3", label: "Linkedin URL", type: "INPUT_URL", value: "https://linkedin.com/in/juantally" },
                { key: "f4", label: "En qué provincia?", type: "SELECT", value: ["Ontario"] }
            ]
        }
    };

    console.log("🚀 Enviando mock de Tally a /api/webhooks/tally...");
    
    try {
        const res = await fetch('http://localhost:3000/api/webhooks/tally', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("✅ Respuesta del servidor:", data);
        
        if (data.success) {
            console.log("✨ Prueba exitosa. Lead creado en la BD.");
        } else {
            console.error("❌ Fallo en la prueba:", data.error);
        }
    } catch (e) {
        console.error("❌ Error de conexión:", e.message);
    }
}

testTally();
