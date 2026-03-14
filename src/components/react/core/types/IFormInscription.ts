import type { Responsible } from "./IFormGetToken";

interface PersonalInfo {
  curp: string;
  birthCertificate: string;
}

interface SchoolInfo {
  name: string;
  placeExpedition: string;
  averageFinal: number;
  certificate: string;
  certificateFile?: File[];
  typeInstitution: "public" | "private";
}

export interface IFormInscription {
  personalInfo: PersonalInfo;
  schoolInfo: SchoolInfo[];
  responsible?: {
    hasDifferentResponsible?: boolean;
    name?: string;
    lastName?: string;
    relationShip?: string;
    address?: { lat: number; lng: number };
    email?: string;
    occupation?: string;
    phone?: string;
  };
}
