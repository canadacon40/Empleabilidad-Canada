const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCode() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️  Uso: node src/scripts/create-code.js [CODIGO] [CREDITOS? (Def: 10)] [USOS_TOTALES? (Def: 1)]');
    return;
  }

  const code = args[0].toUpperCase();
  const credits = parseInt(args[1]) || 10;
  const maxUses = parseInt(args[2]) || 1;

  try {
    const existing = await prisma.promoCode.findUnique({ where: { code } });
    
    if (existing) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Error: El código "${code}" ya existe.`);
      return;
    }

    const newCode = await prisma.promoCode.create({
      data: {
        code: code,
        grantedCredits: credits,
        maxUses: maxUses,
        isActive: true,
        description: `Generado por script - ${credits} créditos p/u`
      }
    });

    console.log('\x1b[32m%s\x1b[0m', '✅ CÓDIGO GENERADO EXITOSAMENTE');
    console.log(`-----------------------------------`);
    console.log(`🔑 CÓDIGO:    ${newCode.code}`);
    console.log(`💎 CRÉDITOS:  ${newCode.grantedCredits}`);
    console.log(`👥 LÍMITE:    ${newCode.maxUses} usuarios`);
    console.log(`🔗 LINK:      http://localhost:3000/acceso?code=${newCode.code}`);
    console.log(`-----------------------------------`);

  } catch (e) {
    console.error('❌ Error al crear código:', e);
  } finally {
    await prisma.$disconnect();
  }
}

createCode();
