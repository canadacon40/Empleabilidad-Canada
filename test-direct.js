async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/cv-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText: "Test CV content" })
    });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Body starts with:", text.substring(0, 200));
    try {
      const json = JSON.parse(text);
      console.log("JSON:", json);
    } catch(e) {
      console.log("Not JSON");
    }
  } catch(e) {
    console.error("Fetch failed:", e.message);
  }
}
test();
