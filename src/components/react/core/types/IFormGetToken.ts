interface Coordinates {
  lat: number;
  lng: number;
}

interface IdentificationInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  curp: string;
  gender: string;
  maritalStatus: string;
  address: Coordinates;
  phone: string;
  email: string;
  career: string;
  campus: string;
}

type UploadValue = File | string | null;

interface PersonalDocumentation {
  birthCertificate: UploadValue;
  highSchoolProof: UploadValue;
  curp: UploadValue;
  photos: UploadValue;
}

interface SchoolInfo {
  name: string;
  knowledgeArea: string;
  enrollmentYear: number | null;
  graduationYear: number | null;
  finalAverage: string | null;
  schoolType: string;
  location: Coordinates;
}

interface ApplicantInfo {
  bloodType: string;
  hasDiseases: boolean;
  diseases: string[];
  hasAllergies: boolean;
  allergies: string[];
  takesSpecialMedications: boolean;
  medicationsDetails: string[];
  hasDisability: boolean;
  disability: string[];
  isIndigenous: boolean;
  indigenous: string[];
  speaksIndigenousLanguage: boolean;
  languageDetails: string[];
  afrodescendant: string;
}

export interface Responsible {
  name: string;
  lastName: string;
  birthDate: string;
  relationShip: string;
  address: Coordinates;
  occupation: string;
  phone: string;
}

export interface IFormGetToken {
  identification: IdentificationInfo;
  school: SchoolInfo;
  personalDocumentation: PersonalDocumentation;
  applicant: ApplicantInfo;
  responsible: Responsible;
}

export type FormGetToken = IFormGetToken;
