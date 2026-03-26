import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const getStripe = () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY!);
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

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const normalizedCode = ambassadorCode?.trim().toUpperCase() || "";
        const isAmbassador = normalizedCode && AMBASSADOR_CODES.includes(normalizedCode);
        const finalPrice = isAmbassador
            ? Math.round(BASE_PRICE * (1 - AMBASSADOR_DISCOUNT))
            : priceOverride || BASE_PRICE;

        const productName = productNameOverride || (isAmbassador
            ? `Canadian CV + Strategy Tool (${Math.round(AMBASSADOR_DISCOUNT * 100)}% descuento con código ${normalizedCode})`
            : "Canadian CV + Strategy Tool");

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: productName,
                            description:
                                "Transforma tu CV al formato canadiense + herramientas de estrategia",
                        },
                        unit_amount: finalPrice,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${appUrl}${successPath || "/cv-tool"}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}${successPath || "/#pricing"}`,
            metadata: {
                product: "cv-tool",
                ambassadorCode: isAmbassador ? normalizedCode : "",
                discountApplied: isAmbassador ? `${AMBASSADOR_DISCOUNT * 100}%` : "none",
                originalPrice: String(BASE_PRICE),
                finalPrice: String(finalPrice),
            },
        });

        return NextResponse.json({
            url: session.url,
            discountApplied: isAmbassador,
            finalPrice: finalPrice / 100,
            ambassadorCode: isAmbassador ? normalizedCode : null,
        });
    } catch (error: unknown) {
        console.error("Checkout error:", error);
        const message = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
