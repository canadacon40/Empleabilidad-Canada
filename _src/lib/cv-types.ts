export interface CvContactInfo {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    linkedIn: string;
}

export interface CvExperience {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
}

export interface CvEducation {
    degree: string;
    institution: string;
    location: string;
    year: string;
}

export interface CvSkills {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
}

export interface CvData {
    contactInfo: CvContactInfo;
    professionalSummary: string;
    experience: CvExperience[];
    education: CvEducation[];
    skills: CvSkills;
}
