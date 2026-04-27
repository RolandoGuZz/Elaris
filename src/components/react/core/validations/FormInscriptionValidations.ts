import { z } from "zod";
import { optionalRestrictedEmailSchema } from "./utils/email";
import { curpSchema } from "./utils/curp";

const averagePattern = /^(?:[0-9]\.[0-9]|10\.0)$/;

/* ---------------- INFORMACIÓN PERSONAL ---------------- */

const personalInfoSchema = z.object({
  birthCertificate: z.string().min(1, "El acta de nacimiento es obligatoria"),
  curp: curpSchema,
});

/* ---------------- INFORMACIÓN ESCOLAR ---------------- */

const schoolInfoSchema = z.object({
  name: z.string().min(2, "El nombre de la escuela es obligatorio"),

  placeExpedition: z.string().min(1, "El lugar de expedición es obligatorio"),

  averageFinal: z
    .string({
      required_error: "El promedio es obligatorio",
      invalid_type_error: "Ingresa el promedio en formato 9.0",
    })
    .trim()
    .regex(averagePattern, "Ingresa el promedio en formato 9.0")
    .refine((value) => {
      const numeric = Number(value);
      return !Number.isNaN(numeric) && numeric >= 0 && numeric <= 10;
    }, "El promedio debe estar entre 0.0 y 10.0"),

  certificate: z.string().min(1, "El certificado es obligatorio"),

  certificateFile: z
    .union([z.instanceof(File), z.string().url()])
    .optional(),

  typeInstitution: z.enum(["privada", "publica"], {
    message: "Selecciona el tipo de institución",
  }),
});

/* ---------------- RESPONSABLE ---------------- */

const responsibleValidationSchema = z.object({
  hasDifferentResponsible: z.boolean().optional(),

  name: z.string().min(2, "El nombre es obligatorio").optional(),

  lastName: z.string().min(2, "El apellido es obligatorio").optional(),

  birthDate: z.string().min(1, "Ingresa la fecha de nacimiento").optional(),

  relationShip: z.string().min(1, "Selecciona el parentesco").optional(),

  address: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),

  email: optionalRestrictedEmailSchema,

  occupation: z.string().min(2, "La ocupación es obligatoria").optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos")
    .optional(),
});

/* ---------------- FORMULARIO COMPLETO ---------------- */

export const formInscriptionSchema = z.object({
  personalInfo: personalInfoSchema,
  schoolInfo: z.array(schoolInfoSchema),
  responsible: responsibleValidationSchema.optional(),
});

export type FormInscriptionSchemaType = z.infer<typeof formInscriptionSchema>;
