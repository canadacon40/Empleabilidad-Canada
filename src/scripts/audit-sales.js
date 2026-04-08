const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function auditSales() {
  console.log("\n📊 GENERANDO REPORTE DE INTELIGENCIA DE VENTAS - PIERRE PRO\n");
  console.log("------------------------------------------------------------");

  try {
    const allProUsers = await prisma.user.findMany({
      where: { isPro: true },
      orderBy: { createdAt: "desc" },
    });

    const masterEmail = (process.env.MASTER_EMAIL || "pierre-master@canadacontrabajo.com").toLowerCase().trim();
    
    const paidUsers = allProUsers.filter(u => !u.isTrial && u.email.toLowerCase().trim() !== masterEmail);
    const scholarshipUsers = allProUsers.filter(u => u.isTrial);
    const masterAccount = allProUsers.filter(u => u.email.toLowerCase().trim() === masterEmail);

    console.log(`💰 VENTAS REALES ($29):      ${paidUsers.length}`);
    console.log(`🎓 BECAS / SAMPLING (10u):   ${scholarshipUsers.length}`);
    console.log(`👑 CUENTAS MASTER:           ${masterAccount.length}`);
    console.log("------------------------------------------------------------");

    if (paidUsers.length > 0) {
      console.log("\n✅ ÚLTIMOS CLIENTES DE PAGO:");
      paidUsers.slice(0, 10).forEach((u, i) => {
        console.log(`${i + 1}. ${u.email.padEnd(30)} | ${u.name || "Sin nombre"} | ${u.createdAt.toLocaleDateString()}`);
      });
    } else {
      console.log("\nAún no se registran ventas directas de $29.");
    }

    if (scholarshipUsers.length > 0) {
      console.log("\n📋 ÚLTIMOS USUARIOS DE BECA:");
      scholarshipUsers.slice(0, 5).forEach((u, i) => {
        console.log(`${i + 1}. ${u.email.padEnd(30)} | ${u.createdAt.toLocaleDateString()}`);
      });
    }

    const totalRevenue = paidUsers.length * 29;
    console.log("\n------------------------------------------------------------");
    console.log(`💵 FACTURACIÓN ESTIMADA: $${totalRevenue} USD`);
    console.log("------------------------------------------------------------\n");

  } catch (error) {
    console.error("❌ Error al auditar ventas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

auditSales();
