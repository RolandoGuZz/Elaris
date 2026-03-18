import z from "zod";

export const SheetSchema = z.object({
  sheet: z
    .string({ message: "El folio es obligatorio" })
    .min(10, "El folio es incorrecto")
    .max(20, "El folio es incorrecto"),
});
