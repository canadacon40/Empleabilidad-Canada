const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function printResults() {
  const latestPlan = await prisma.personalizedPlan.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!latestPlan) {
    console.log("No se encontró ningún plan.");
    return;
  }

  const m0 = latestPlan.modules.m0;
  const m1 = latestPlan.modules.m1;

  console.log("--- M0: DIAGNÓSTICO DE BRECHA ---");
  console.log("DIAGNÓSTICO PIERRE:");
  console.log(m0.diagnostic);
  console.log("\nESTRATEGIA TÁCTICA:");
  console.log(m0.strategy);

  console.log("\n--- M1: FUNDAMENTOS ESTRATÉGICOS ---");
  console.log("DIAGNÓSTICO PIERRE:");
  console.log(m1.diagnostic);
  console.log("\nPASOS A SEGUIR:");
  console.log(m1.steps.join("\n"));

  process.exit(0);
}

printResults().catch(err => {
  console.error(err);
  process.exit(1);
});
