import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Programa Ambassador — Empleabilidad Canadá",
    description: "Gana $15 USD por cada referido que compre. Comparte tu código único y ayuda a más latinos a conseguir empleo en Canadá.",
}

export default function AmbassadorPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-3xl">🤝</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        Programa Ambassador
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Gana dinero ayudando a otros latinos a conseguir empleo en Canadá.
                        Comparte tu código, ellos ahorran, tú ganas.
                    </p>
                </div>

                {/* How it works */}
                <div className="space-y-8">
                    <section className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-foreground mb-6">📋 ¿Cómo funciona?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl font-bold text-primary">1</span>
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Recibe tu código</h3>
                                <p className="text-sm text-muted-foreground">Te damos un código único (ej: TUNOMBRE10) para compartir con tu audiencia.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl font-bold text-primary">2</span>
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Tu referido ahorra</h3>
                                <p className="text-sm text-muted-foreground">Cuando alguien usa tu código al comprar, recibe un <strong>10% de descuento</strong> ($51 → $45.90 USD).</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl font-bold text-primary">3</span>
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Tú ganas $15 USD</h3>
                                <p className="text-sm text-muted-foreground">Por cada venta con tu código, recibes <strong>$15 USD</strong> de comisión. Sin límite.</p>
                            </div>
                        </div>
                    </section>

                    {/* Numbers breakdown */}
                    <section className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-foreground mb-4">💰 Los números</h2>
                        <div className="rounded-xl border border-border overflow-hidden">
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr className="border-b border-border/50">
                                        <td className="p-3 text-muted-foreground">Precio normal</td>
                                        <td className="p-3 text-right font-semibold text-foreground">$51.00 USD</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="p-3 text-muted-foreground">Descuento para tu referido (10%)</td>
                                        <td className="p-3 text-right font-semibold text-green-600">-$5.10</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="p-3 text-muted-foreground">Precio que paga tu referido</td>
                                        <td className="p-3 text-right font-bold text-foreground">$45.90 USD</td>
                                    </tr>
                                    <tr className="bg-primary/5">
                                        <td className="p-3 font-semibold text-primary">Tu comisión por cada venta</td>
                                        <td className="p-3 text-right font-bold text-primary text-lg">$15.00 USD</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            Ejemplo: Si refieres 10 personas al mes = <strong>$150 USD</strong> en comisiones.
                            Si refieres 50 = <strong>$750 USD</strong>. Sin límite.
                        </p>
                    </section>

                    {/* Who is it for */}
                    <section className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-foreground mb-4">🎯 ¿Para quién es ideal?</h2>
                        <div className="space-y-3">
                            {[
                                { emoji: "📱", text: "Creadores de contenido sobre inmigración a Canadá" },
                                { emoji: "🎓", text: "Consultores de inmigración con clientes que buscan empleo" },
                                { emoji: "👥", text: "Líderes de comunidades latinas en Canadá" },
                                { emoji: "📣", text: "Cualquier persona con audiencia de latinos interesados en Canadá" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                                    <span className="text-xl">{item.emoji}</span>
                                    <p className="text-sm text-foreground">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-primary/5 rounded-2xl border border-primary/20 p-6 sm:p-8 text-center">
                        <h2 className="text-xl font-bold text-foreground mb-3">¿Quieres ser Ambassador?</h2>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                            Escríbenos por Instagram o email para recibir tu código personalizado y empezar a ganar.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <a
                                href="https://www.instagram.com/canadacon40/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                            >
                                📩 Escribir por Instagram
                            </a>
                            <a
                                href="mailto:canadacon40@gmail.com?subject=Quiero ser Ambassador"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
                            >
                                ✉️ Enviar email
                            </a>
                        </div>
                    </section>
                </div>

                {/* Back home */}
                <div className="text-center mt-12">
                    <a href="/" className="text-sm text-muted-foreground hover:text-foreground underline">
                        ← Volver a la página principal
                    </a>
                </div>
            </div>
        </main>
    )
}
