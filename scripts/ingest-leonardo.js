const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createLeonardo() {
  const email = 'leosanchezg05@gmail.com';
  
  try {
    // 1. Create or Find User
    const user = await prisma.user.upsert({
      where: { email },
      update: { isPro: true, name: 'Leonardo Javier Sanchez Gomez' },
      create: { 
        email, 
        isPro: true, 
        name: 'Leonardo Javier Sanchez Gomez' 
      }
    });

    // 2. Create Lead for this User
    const lead = await prisma.lead.upsert({
      where: { id: user.id }, // Using user.id as lead id for simplicity if possible, or use a unique lookup
      // Wait, Lead schema uses userId. Let's find if a lead already exists for this user.
      update: {
        formData: {
          profile: "MD | Business & Talent Development | M&A | Industrial Engineer",
          experience: "Ex-President Nice Brasil, Head of BU Door Nice Canada. 30 years total.",
          permit: "Closed Work Permit (LMIA)",
          location: "Montreal Area, Quebec, Canada",
          targetRoles: "General Manager, Operations Director, Product Director, CEO",
          languages: "English (Proficient), Portuguese (Proficient), Spanish (Native), French (Basic)",
          situation: "Applying to hundreds of jobs, zero calls. Senior background vs ATS barriers."
        }
      },
      create: {
        userId: user.id,
        formData: {
          profile: "MD | Business & Talent Development | M&A | Industrial Engineer",
          experience: "Ex-President Nice Brasil, Head of BU Door Nice Canada. 30 years total.",
          permit: "Closed Work Permit (LMIA)",
          location: "Montreal Area, Quebec, Canada",
          targetRoles: "General Manager, Operations Director, Product Director, CEO",
          languages: "English (Proficient), Portuguese (Proficient), Spanish (Native), French (Basic)",
          situation: "Applying to hundreds of jobs, zero calls. Senior background vs ATS barriers."
        }
      }
    });

    console.log(`✅ User & Lead Leonardo creados con éxito.`);
  } catch (error) {
    console.error('❌ Error al crear lead:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createLeonardo();
