import { z } from "zod";

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MIN_AGE_YEARS = 18;
export const MAX_AGE_YEARS = 100;

export const toInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const subtractYears = (reference: Date, years: number) =>
  new Date(reference.getFullYear() - years, reference.getMonth(), reference.getDate());

export const calculateAge = (birthDate: Date, reference: Date) => {
  let age = reference.getFullYear() - birthDate.getFullYear();
  const monthDiff = reference.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

export const getBirthDateBounds = () => {
  const today = new Date();
  const max = subtractYears(today, MIN_AGE_YEARS);
  const min = subtractYears(today, MAX_AGE_YEARS);

  return {
    max: toInputDate(max),
    min: toInputDate(min),
  };
};

export const birthDateSchema = z
  .string()
  .trim()
  .min(1, "La fecha de nacimiento es obligatoria")
  .superRefine((value, ctx) => {
    if (!DATE_PATTERN.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Formato de fecha inválido",
      });
      return;
    }

    const [rawYear, rawMonth, rawDay] = value.split("-");
    const year = Number(rawYear);
    const month = Number(rawMonth);
    const day = Number(rawDay);

    const parsedUtc = new Date(Date.UTC(year, month - 1, day));
    if (
      Number.isNaN(parsedUtc.getTime()) ||
      parsedUtc.getUTCFullYear() !== year ||
      parsedUtc.getUTCMonth() + 1 !== month ||
      parsedUtc.getUTCDate() !== day
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha proporcionada no es válida",
      });
      return;
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    if (birthDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de nacimiento no puede ser futura",
      });
      return;
    }

    const age = calculateAge(birthDate, today);

    if (age < MIN_AGE_YEARS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes tener al menos 18 años",
      });
      return;
    }

    if (age > MAX_AGE_YEARS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La edad no puede ser mayor a 100 años",
      });
    }
  });
