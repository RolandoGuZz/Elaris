import { z } from "zod";

const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com"] as const;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const extractDomain = (email: string) => {
  const [, domain] = normalizeEmail(email).split("@");
  return domain ?? "";
};

const EMAIL_DOMAIN_ERROR = `Solo se aceptan correos de los dominios: ${ALLOWED_EMAIL_DOMAINS.join(", ")}`;

export const restrictedEmailSchema = z
  .string()
  .trim()
  .min(1, "El correo electrónico es obligatorio")
  .email("Correo electrónico inválido")
  .superRefine((value, ctx) => {
    const domain = extractDomain(value);
    const isAllowed = ALLOWED_EMAIL_DOMAINS.some((allowedDomain) => allowedDomain === domain);
    if (!isAllowed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: EMAIL_DOMAIN_ERROR,
      });
    }
  });

export const optionalRestrictedEmailSchema = restrictedEmailSchema.optional().or(z.literal(""));

export const EMAIL_RULE_DESCRIPTION = EMAIL_DOMAIN_ERROR;
