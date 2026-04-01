import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY || "";
    return new Stripe(key, {
        typescript: true,
        httpClient: Stripe.createFetchHttpClient(),
    });
};

const AMBASSADOR_CODES = (process.env.AMBASSADOR_CODES || "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);

const BASE_PRICE = 5100; // $51.00 USD in cents
const AMBASSADOR_DISCOUNT = 0.10; // 10% off

export async function POST(request: NextRequest) {
    try {
        const { priceOverride, ambassadorCode, successPath, productNameOverride } = await request.json().catch(() => ({}));
        
        const key = process.env.STRIPE_SECRET_KEY || "";

        // Robust appUrl resolution ensuring protocol (https for Vercel)
        let appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
        if (appUrl && !appUrl.startsWith('http')) {
            appUrl = `https://${appUrl}`;
        }
        appUrl = appUrl.replace(/\/$/, "");

        const normalizedCode = ambassadorCode?.trim().toUpperCase() || "";
        const isAmbassador = normalizedCode && AMBASSADOR_CODES.includes(normalizedCode);
        const finalPrice = isAmbassador
            ? Math.round(BASE_PRICE * (1 - AMBASSADOR_DISCOUNT))
            : priceOverride || BASE_PRICE;

        const productName = productNameOverride || (isAmbassador
            ? `Radar de Empleo PRO (${Math.round(AMBASSADOR_DISCOUNT * 100)}% descuento con código ${normalizedCode})`
            : "Radar de Empleo PRO (Herramientas)");

        // 🚀 DIRECT FETCH TO STRIPE API (BYPASSING THE LIBRARY STACK)
        const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "mode": "payment",
                "payment_method_types[0]": "card",
                "line_items[0][price_data][currency]": "usd",
                "line_items[0][price_data][product_data][name]": productName,
                "line_items[0][price_data][unit_amount]": String(finalPrice),
                "line_items[0][quantity]": "1",
                "success_url": `${appUrl}${successPath || "/cv-tool"}?session_id={CHECKOUT_SESSION_ID}`,
                "cancel_url": `${appUrl}${successPath || "/#pricing"}`,
                "metadata[product]": "cv-tool",
            }).toString(),
        });

        const session = await stripeResponse.json();

        if (!stripeResponse.ok) {
            throw new Error(session.error?.message || "Error desconocido en Stripe API.");
        }

        return NextResponse.json({
            url: session.url,
            discountApplied: isAmbassador,
            finalPrice: finalPrice / 100,
            ambassadorCode: isAmbassador ? normalizedCode : null,
        });
    } catch (error: any) {
        console.error("STRIIPE_ERROR_LOG:", {
            message: error.message,
            stack: error.stack,
            env: { hasStripeKey: !!process.env.STRIPE_SECRET_KEY }
        });
        
        return NextResponse.json({ 
            error: "Error en el servidor de pagos",
            details: error.message || "Error interno de red en Vercel."
        }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const priceOverride = parseInt(searchParams.get("price") || "0");
        const ambassadorCode = searchParams.get("code") || "";
        const successPath = searchParams.get("success") || "/cv-tool";
        
        const key = process.env.STRIPE_SECRET_KEY || "";

        let appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
        if (appUrl && !appUrl.startsWith('http')) {
            appUrl = `https://${appUrl}`;
        }
        appUrl = appUrl.replace(/\/$/, "");

        const normalizedCode = ambassadorCode?.trim().toUpperCase() || "";
        const isAmbassador = normalizedCode && AMBASSADOR_CODES.includes(normalizedCode);
        const finalPrice = isAmbassador
            ? Math.round(BASE_PRICE * (1 - AMBASSADOR_DISCOUNT))
            : priceOverride || BASE_PRICE;

        const productName = isAmbassador
            ? `Radar de Empleo PRO (${Math.round(AMBASSADOR_DISCOUNT * 100)}% descuento)`
            : "Radar de Empleo PRO (Herramientas)";

        const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "mode": "payment",
                "payment_method_types[0]": "card",
                "line_items[0][price_data][currency]": "usd",
                "line_items[0][price_data][product_data][name]": productName,
                "line_items[0][price_data][unit_amount]": String(finalPrice),
                "line_items[0][quantity]": "1",
                "success_url": `${appUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
                "cancel_url": `${appUrl}${successPath}`,
                "metadata[product]": "cv-tool-chat",
            }).toString(),
        });

        const session = await stripeResponse.json();

        if (!stripeResponse.ok || !session.url) {
            throw new Error(session.error?.message || "Error al generar link de pago.");
        }

        // 🚀 Redirect directly to Stripe
        return NextResponse.redirect(session.url);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
