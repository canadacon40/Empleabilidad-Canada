const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runAudit() {
  console.log('\x1b[35m%s\x1b[0m', '🔍 Iniciando Auditoría de Seguridad Pierre (Anti-Abuse)...');
  console.log('------------------------------------------------------------');

  try {
    // 1. Get all users with registrationIp
    const users = await prisma.user.findMany({
      where: {
        registrationIp: { not: null }
      },
      select: {
        email: true,
        registrationIp: true,
        createdAt: true,
        isTrial: true
      }
    });

    // 2. Group by IP
    const ipGroups = {};
    users.forEach(user => {
      if (!ipGroups[user.registrationIp]) {
        ipGroups[user.registrationIp] = [];
      }
      ipGroups[user.registrationIp].push(user);
    });

    // 3. Report
    let totalSuspicious = 0;
    
    Object.keys(ipGroups).forEach(ip => {
      const group = ipGroups[ip];
      if (group.length > 1) {
        totalSuspicious++;
        console.log('\x1b[31m%s\x1b[0m', `🚩 SOSPECHOSO: IP ${ip} tiene ${group.length} cuentas registradas:`);
        group.forEach(u => {
          console.log(`   - ${u.email} (${u.isTrial ? 'Trial' : 'PRO'}) - Registrado: ${u.createdAt.toLocaleString()}`);
        });
        console.log('------------------------------------------------------------');
      }
    });

    if (totalSuspicious === 0) {
      console.log('\x1b[32m%s\x1b[0m', '✅ No se detectaron patrones de abuso significativos hasta ahora.');
    } else {
      console.log('\x1b[33m%s\x1b[0m', `⚠️  Se encontraron ${totalSuspicious} direcciones IP con múltiples registros.`);
    }

    console.log(`Total usuarios auditados: ${users.length}`);

  } catch (e) {
    console.error('❌ Error en la auditoría:', e);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
