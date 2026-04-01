const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

async function verifyStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        console.error("❌ ERROR: La variable STRIPE_SECRET_KEY no está definida en .env.local");
        process.exit(1);
    }

    console.log("🔍 Iniciando verificación de Stripe...");
    console.log(`Llave detectada (inicia con): ${key.substring(0, 7)}...`);

    const stripe = new Stripe(key);

    try {
        // Intentamos listar los últimos 3 productos para ver si la llave tiene permisos
        const products = await stripe.products.list({ limit: 1 });
        console.log("✅ CONEXIÓN EXITOSA: Stripe respondió correctamente.");
        console.log(`Tu cuenta de Stripe está vinculada y Pierre puede generar cobros.`);
    } catch (error) {
        if (error.type === 'StripeAuthenticationError') {
            console.error("❌ ERROR DE AUTENTICACIÓN: La llave es inválida o ha expirado.");
        } else {
            console.error("❌ ERROR TÉCNICO:", error.message);
        }
        process.exit(1);
    }
}

verifyStripe();
