import type { Responsible } from "./IFormGetToken";

interface PersonalInfo {
  birthCertificate: string;
  curp: string;
}

interface SchoolInfo {
  name: string;
  placeExpedition: string;
  averageFinal: string;
  certificate: string;
  certificateFile?: File | string;
  typeInstitution: "privada" | "publica";
}

export interface IFormInscription {
  personalInfo: PersonalInfo;
  schoolInfo: SchoolInfo[];
  responsible?: {
    hasDifferentResponsible?: boolean;
    name?: string;
    lastName?: string;
     birthDate?: string;
    relationShip?: string;
    address?: { lat: number; lng: number };
    email?: string;
    occupation?: string;
    phone?: string;
  };
}
