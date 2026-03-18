import { z } from "zod";
import { required } from "zod/v4-mini";

/* ---------------- COORDENADAS ---------------- */

const coordinatesSchema = z.object({
  lat: z
    .number({
      required_error: "La latitud es obligatoria",
    })
    .min(-90, "Latitud inválida")
    .max(90, "Latitud inválida"),

  lng: z
    .number({
      required_error: "La longitud es obligatoria",
    })
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida"),
});

/* ---------------- IDENTIFICACIÓN ---------------- */

const identificationUserSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),

  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),

  age: z
    .number({
      required_error: "La edad es obligatoria",
      invalid_type_error: "Solo se aceptan numeros",
    })
    .min(17, "Debes tener almenos 17 años")
    .max(70, "Superas el limite de edad"),

  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),

  gender: z.string().min(1, "Debes seleccionar un género"),

  maritalStatus: z.string().min(1, "Debes seleccionar un estado civil"),

  address: coordinatesSchema,

  phone: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),

  email: z.string().email("Correo electrónico inválido"),

  //bloodType: z.string().min(1, "Selecciona un tipo de sangre"),

  medicalConditions: z.string().optional(),

  allergies: z.string().optional(),

  medications: z.string().optional(),
});

/* ---------------- DOCUMENTOS ---------------- */

const fileSchema = z
  .instanceof(File)
  .nullable()
  .refine((file) => file !== null, "El archivo es obligatorio");

const personalDocumentationSchema = z.object({
  birthCertificate: fileSchema,
  //highSchoolCertificate: fileSchema,
  highSchoolProof: fileSchema,
  curp: fileSchema,
  photos: fileSchema,
});

/* ---------------- ESCUELA ---------------- */

const schoolSchema = z.object({
  name: z.string().min(2, "El nombre de la escuela es obligatorio"),

  location: coordinatesSchema,

  knowledgeArea: z.string().min(1, "Selecciona un área de conocimiento"),

  enrollmentYear: z
    .number({
      required_error: "El año de ingreso es obligatorio",
      invalid_type_error: "Solo se aceptan numeros",
    })
    .min(1980, "Año inválido")
    .max(new Date().getFullYear()),

  graduationYear: z
    .number({
      required_error: "El año de egreso es obligatorio",
      invalid_type_error: "Solo se aceptan numeros",
    })
    .min(1980, "Año inválido")
    .max(new Date().getFullYear()),

  finalAverage: z
    .number({
      required_error: "El promedio es obligatorio",
      message: "Solo se aceptan numero",
    })
    .min(0, "Promedio inválido")
    .max(10, "El promedio máximo es 10"),

  certificateFolio: z
    .string()
    .min(1, "El folio del certificado es obligatorio")
    .optional(),

  schoolType: z.string().min(1, "Selecciona un tipo de escuela"),

  certificate: z.instanceof(File).optional(),
});

/* ---------------- ASPIRANTE ---------------- */

const applicantSchema = z.object({
  bloodType: z.string().min(1, "Selecciona un tipo de sangre"),

  diseases: z.array(z.string()).min(0).optional(),

  diseasesDetails: z.string().optional(),

  allergies: z.array(z.string()).min(0).optional(),

  allergiesDetails: z.string().optional(),

  specialMedications: z.array(z.string()).min(0).optional(),

  medicationsDetails: z.array(z.string()).min(0).optional(),

  disability: z.array(z.string()).min(0).optional(),

  disabilityDetails: z.string().optional(),

  indigenous: z.array(z.string()).min(0).optional(),

  ethnicGroup: z.string().optional(),

  indigenousLanguage: z.string().optional(),

  languageDetails: z.array(z.string()).min(0).optional(),

  afrodescendant: z.string().min(1, "Debes seleccionar una opción").optional(),
});

/* ---------------- RESPONSABLE ---------------- */

const responsibleSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),

  lastName: z.string().min(2, "El apellido es obligatorio"),

  relationShip: z.string().min(1, "Selecciona el parentesco"),

  address: coordinatesSchema,

  occupation: z.string().min(1, "La ocupación es obligatoria"),

  phone: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
});

/* ---------------- FORMULARIO COMPLETO ---------------- */

export const formGetTokenSchema = z.object({
  identification: identificationUserSchema,
  school: schoolSchema,
  personalDocumentation: personalDocumentationSchema,
  applicant: applicantSchema,
  responsible: responsibleSchema,
});
