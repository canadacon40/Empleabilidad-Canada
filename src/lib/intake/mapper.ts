import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TallySubmission {
  fields: Array<{
    id: string;
    label: string;
    type: string;
    value: any;
  }>;
}

export class IntakeMapper {
  static mapTallyToLeadData(submission: TallySubmission) {
    const data: any = {};
    
    submission.fields.forEach(field => {
      const label = field.label.toLowerCase();
      if (label.includes('nombre') || label.includes('first name')) data.firstName = field.value;
      if (label.includes('apellido') || label.includes('last name')) data.lastName = field.value;
      if (label.includes('email')) data.email = field.value;
      if (label.includes('teléfono') || label.includes('phone')) data.phone = field.value;
      if (label.includes('noc') || label.includes('cargo')) data.noc = field.value;
      if (label.includes('linkedin')) data.linkedinUrl = field.value;
      if (label.includes('objetivo') || label.includes('goals')) data.goals = field.value;
    });

    return data;
  }

  static async processIntake(submission: TallySubmission, userId: string) {
    const leadData = this.mapTallyToLeadData(submission);
    
    // 1. Create the Lead
    const lead = await prisma.lead.create({
      data: {
        userId: userId,
        formData: leadData,
        status: 'INTAKE_RECEIVED',
      }
    });

    // 2. Create the Intake record
    const intake = await prisma.intake.create({
      data: {
        leadId: lead.id,
        rawTallyData: submission as any,
        linkedinUrl: leadData.linkedinUrl,
        goals: leadData.goals,
      }
    });

    return { lead, intake };
  }
}
