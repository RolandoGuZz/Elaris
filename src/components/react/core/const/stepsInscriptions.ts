import type React from "react";
import { PersonalInfo } from "../../screens/Inscriptions/PersonalInfoScreen";
import { SchoolInformationScreen } from "../../screens/Inscriptions/SchoolInformationScreen";
import { ResponsibleInfoScreen } from "../../screens/Inscriptions/ResponsibleInfoScreen";
import type { ComponentType } from "react";

interface PropsStepsInscriptions {
  title: string;
  subtitle: string;
  icon: string;
  componente?: ComponentType;
}

export const STEPS_INSCRIPTIONS: PropsStepsInscriptions[] = [
  {
    title: "Datos personales",
    subtitle:
      "Completa la información personal del aspirante para su correcta identificación dentro del sistema.",
    icon: "ti-id-badge",
    componente: PersonalInfo,
  },
  {
    title: "Antecedentes escolares",
    subtitle:
      "Proporciona la información de tu institución educativa anterior y tus calificaciones correspondientes.",
    icon: "ti-blackboard",
    componente: SchoolInformationScreen,
  },
  {
    title: "Datos del responsable",
    subtitle:
      "Ingresa la información de la persona responsable del estudiante para contacto y seguimiento.",
    icon: "ti-user",
    componente: ResponsibleInfoScreen,
  },
];
