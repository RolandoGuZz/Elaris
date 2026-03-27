import { z } from "zod";

/* ---------------- INFORMACIÓN PERSONAL ---------------- */

const personalInfoSchema = z.object({
  curp: z.string().min(1, "El CURP es obligatorio"),

  birthCertificate: z.string().min(1, "El acta de nacimiento es obligatoria"),
});

/* ---------------- INFORMACIÓN ESCOLAR ---------------- */

const schoolInfoSchema = z.object({
  name: z.string().min(2, "El nombre de la escuela es obligatorio"),

  placeExpedition: z.string().min(1, "El lugar de expedición es obligatorio"),

  averageFinal: z
    .number({
      required_error: "El promedio es obligatorio",
      invalid_type_error: "Solo se aceptan números",
    })
    .min(0, "El promedio mínimo es 0")
    .max(10, "El promedio máximo es 10"),

  certificate: z.string().min(1, "El certificado es obligatorio"),

  certificateFile: z.array(z.instanceof(File)).optional(),

  typeInstitution: z.enum(["public", "private"], {
    message: "Selecciona el tipo de institución",
  }),
});

/* ---------------- RESPONSABLE ---------------- */

const responsibleValidationSchema = z.object({
  hasDifferentResponsible: z.boolean().optional(),

  name: z.string().min(2, "El nombre es obligatorio").optional(),

  lastName: z.string().min(2, "El apellido es obligatorio").optional(),

  relationShip: z.string().min(1, "Selecciona el parentesco").optional(),

  address: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),

  email: z.string().email("Ingresa un correo válido").optional(),

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
