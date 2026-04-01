// Test script API
async function testApi() {
  const cvText = "Soy Soldador profesional experto en tuberías (TIG/MIG) con 12 años de experiencia. Mi nivel de inglés es sumamente básico (CLB 3 máximo). Solo tengo certificaciones técnicas, sin título universitario. Quiero emigrar a Canadá.";
  
  console.log("Iniciando test de API de Empleabilidad (Perfil Soldador Básico)...");
  
  try {
    const res = await fetch("http://localhost:3000/api/cv-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText })
    });
    
    const data = await res.json();
    
    if (res.ok) {
        console.log("✅ API respondió con Éxito!");
        console.log(`NOC Asignado: ${data.result.analisisNOC.codigo} - ${data.result.analisisNOC.titulo}`);
        console.log(`Provincias listadas: ${data.result.mercado.provincias.length}`);
        
        console.log("\nProvincias encontradas:");
        data.result.mercado.provincias.forEach((p, i) => {
           console.log(`${i+1}. ${p.provincia} (${p.nivel})`); 
        });
        
        console.log(`\nScore: ${data.result.puntaje.base} - Nivel: ${data.result.puntaje.level}`);
        console.log(`Penalización estructural: ${data.result.puntaje.penalizacionIdioma}`);
        console.log(`Score Final: ${data.result.puntaje.final}`);
        console.log("\nVeredicto:");
        console.log(data.result.conclusionEjecutiva.recomendacionMaestra);
        console.log("¿Es empleable ahora?:", data.result.conclusionEjecutiva.esEmpleableAhora);
    } else {
        console.error("❌ Error de API:", data);
    }
  } catch(e) {
      console.error("❌ Error de red:", e.message);
  }
}

testApi();
