import { z } from "zod";
import { birthDateSchema } from "./utils/birthDate";
import { curpSchema, validateCurpStructure } from "./utils/curp";
import { restrictedEmailSchema } from "./utils/email";

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

const mapGenderToCurpCode = (value: string) => {
  if (value === "Masculino") return "H" as const;
  if (value === "Femenino") return "M" as const;
  return null;
};

/* ---------------- IDENTIFICACIÓN ---------------- */

const identificationUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "No se permiten números"),

  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "No se permiten números"),

  birthDate: birthDateSchema,

  curp: curpSchema,

  gender: z.string().min(1, "Debes seleccionar un género"),

  maritalStatus: z.string().min(1, "Debes seleccionar un estado civil"),

  address: coordinatesSchema,

  phone: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),

  email: restrictedEmailSchema,

  career: z.string().min(1, "Selecciona una carrera"),
  campus: z.string().min(1, "Selecciona un campus"),
}).superRefine((data, ctx) => {
  const curpResult = validateCurpStructure(data.curp);
  if (!curpResult.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["curp"],
      message: curpResult.message,
    });
    return;
  }

  if (curpResult.birthDate !== data.birthDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["curp"],
      message: "La fecha de nacimiento no coincide con la CURP",
    });
  }

  const genderCode = mapGenderToCurpCode(data.gender);
  if (!genderCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["gender"],
      message: "Selecciona un sexo compatible con la CURP (Masculino o Femenino)",
    });
    return;
  }

  if (genderCode !== curpResult.gender) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["curp"],
      message: "El sexo seleccionado no coincide con la CURP",
    });
  }
});

/* ---------------- DOCUMENTOS ---------------- */

const fileOrUrlSchema = z.union([z.instanceof(File), z.string().url()]);

const personalDocumentationSchema = z.object({
  birthCertificate: fileOrUrlSchema,
  highSchoolProof: fileOrUrlSchema,
  curp: fileOrUrlSchema,
  photos: fileOrUrlSchema,
});

/* ---------------- ESCUELA ---------------- */

const schoolSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/, "Solo se permiten letras y números"),
    location: coordinatesSchema,
    knowledgeArea: z
      .string()
      .trim()
      .min(1, "Selecciona un área de conocimiento")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
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

    schoolType: z.string().min(1, "Selecciona un tipo de escuela"),
  })
  .superRefine((data, ctx) => {
    const { enrollmentYear, graduationYear } = data;
    if (graduationYear - enrollmentYear < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["graduationYear"],
        message: "El año de egreso debe ser al menos 3 años posterior al de ingreso",
      });
    }
  });

/* ---------------- ASPIRANTE ---------------- */

const applicantSchema = z.object({
  bloodType: z.string().min(1, "Selecciona un tipo de sangre"),

  hasDiseases: z.boolean().default(false),
  diseases: z.array(z.string()).min(0).optional(),

  hasAllergies: z.boolean().default(false),
  allergies: z.array(z.string()).min(0).optional(),

  takesSpecialMedications: z.boolean().default(false),
  medicationsDetails: z.array(z.string()).min(0).optional(),

  hasDisability: z.boolean().default(false),
  disability: z.array(z.string()).min(0).optional(),

  isIndigenous: z.boolean().default(false),
  indigenous: z.array(z.string()).min(0).optional(),

  speaksIndigenousLanguage: z.boolean().default(false),
  languageDetails: z.array(z.string()).min(0).optional(),

  afrodescendant: z.string().min(1, "Debes seleccionar una opción"),
});

/* ---------------- RESPONSABLE ---------------- */

const responsibleSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre es obligatorio")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "No se permiten números"),

  lastName: z
    .string()
    .min(2, "El apellido es obligatorio")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "No se permiten números"),

  birthDate: birthDateSchema,

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
