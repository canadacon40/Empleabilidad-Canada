async function testWebhook() {
    const data = {
        name: "<< ARRASTRA ESTO A NOMBRE >>",
        email: "<< ARRASTRA ESTO A EMAIL >>",
        status: "<< ARRASTRA ESTO A ESTATUS >>",
        urgency: "<< ARRASTRA ESTO A URGENCIA >>",
        budget: "<< ARRASTRA ESTO A PRESUPUESTO >>",
        language: "es",
        source: "Next.js App / CV Tool"
    };
    
    try {
        const response = await fetch("https://hook.us2.make.com/j11kjuq2imrd8lik7f6ksuuo13ycgvnj", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const text = await response.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

testWebhook();
