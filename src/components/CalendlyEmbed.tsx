"use client"
import { useEffect } from "react"

export default function CalendlyEmbed() {
    useEffect(() => {
        const head = document.querySelector("head")
        const script = document.createElement("script")
        script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js")
        head?.appendChild(script)
    }, [])

    return (
        <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/canadacon40-2023/cafe-con-metas"
            style={{ minWidth: "320px", height: "700px" }}
        />
    )
}
