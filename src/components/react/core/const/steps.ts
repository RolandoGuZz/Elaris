import {
  ApplicantScreen,
  IdentificationUserScreen,
  PersonalDocumentationScreen,
  ResponsibleScreen,
  SchoolBackgroundScreen,
} from "../../screens/index.ts";

export const STEPS = [
  {
    title: "Datos de Identificacion",
    icon: "ti-id-badge",
    component: IdentificationUserScreen,
  },
  {
    title: "Datos de procedencia",
    icon: "ti-blackboard",
    component: SchoolBackgroundScreen,
  },
  {
    title: "Documentacion",
    icon: "ti-files",
    component: PersonalDocumentationScreen,
  },
  {
    title: "Datos de aspirante",
    icon: "ti-user",
    component: ApplicantScreen,
  },
  {
    title: "Datos del responsable",
    icon: "ti-user",
    component: ResponsibleScreen,
  },
];
