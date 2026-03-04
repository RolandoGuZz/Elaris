interface IdentificationUser {
  firstName: string;
  lastName: string;
  age: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  address: string;
  phone: string;
  email: string;
  bloodType: string;
  medicalConditions: string;
  allergies: string;
  medications: string;
}

interface personalDocumentation: {
  birthCertificate: File | null;
  highSchoolCertificate: File | null;
  highSchoolProof: File | null;
  curp: File | null;
  photos: File | null;
}

interface School {
  name: string;
  location: string;
  knowledgeArea: string;
  enrollmentYear: number;
  graduationYear: number;
  finalAverage: number;
  certificateFolio: string;
  schoolType: string;
  certificate?: File;
}

interface Applicant {
  bloodType: string;
  diseases: string[];
  diseasesDetails: string;
  allergies: string[];
  allergiesDetails: string;
  specialMedications: string[];
  medicationsDetails: string;
  disability: string;
  disabilityDetails: string;
  indigenous: string;
  ethnicGroup: string;
  indigenousLanguage: string;
  languageDetails: string;
  afrodescendant: string;
}

export interface FormGetToken {
  identification: IdentificationUser;
  school: School;
  personalDocumentation:personalDocumentation
  applicant:Applicant
}
