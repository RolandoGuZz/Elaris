import {
  ApplicantScreen,
  IdentificationUserScreen,
  PersonalDocumentationScreen,
  ResponsibleScreen,
  SchoolBackgroundScreen,
} from "../../screens/index.ts";
import { OPTIONS_RELATIONSHIP } from "./options.ts";

export const STEPS = [
  {
    subtitle:
      "Completa correctamente la información solicitada para la identificación del estudiante.",
    title: "Datos de Identificacion",
    icon: "ti-id-badge",
    component: IdentificationUserScreen,
  },
  {
    subtitle:
      "Proporciona la información de tu bachillerato o institución de procedencia.",
    title: "Datos de procedencia",
    icon: "ti-blackboard",
    component: SchoolBackgroundScreen,
  },
  {
    subtitle:
      "Sube los documentos requeridos asegurándote de que sean claros y legibles.",
    title: "Documentacion",
    icon: "ti-files",
    component: PersonalDocumentationScreen,
  },
  {
    subtitle:
      "Proporcione información sobre el estado de salud del estudiante. Estos datos permitirán a la institución brindar una mejor atención en caso de alguna situación médica durante sus actividades escolares.",
    title: "Datos de aspirante",
    icon: "ti-user",
    component: ApplicantScreen,
  },
  {
    title: "Datos del responsable",
    subtitle:
      "Ingrese los datos de la persona responsable del estudiante para contacto y seguimiento.",
    icon: "ti-user",
    component: ResponsibleScreen,
  },
];

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  component: "InputText" | "InputSelect";
  options?: string[];
}

export const STEPS_INSCRIPTIONS: FormField[] = [
  {
    name: "responsible.name",
    label: "Nombre(s) *",
    placeholder: "Juan",
    component: "InputText",
  },
  {
    name: "responsible.lastName",
    label: "Apellido(s) *",
    placeholder: "Pérez García",
    component: "InputText",
  },
  {
    name: "responsible.relationShip",
    label: "Parentesco *",
    component: "InputSelect",
    options: OPTIONS_RELATIONSHIP,
  },
  {
    name: "responsible.phone",
    label: "Teléfono (10 dígitos) *",
    placeholder: "5512345678",
    component: "InputText",
  },
  {
    name: "responsible.email",
    label: "Correo electrónico",
    placeholder: "correo@ejemplo.com",
    type: "email",
    component: "InputText",
  },
  {
    name: "responsible.occupation",
    label: "Ocupación *",
    placeholder: "Ingeniero",
    component: "InputText",
  },
];
