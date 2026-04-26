import { z } from "zod";
import { calculateAge, MIN_AGE_YEARS, toInputDate } from "./birthDate";

export const CURP_STATE_CODES = [
  "AS",
  "BC",
  "BS",
  "CC",
  "CL",
  "CM",
  "CS",
  "CH",
  "DF",
  "DG",
  "GT",
  "GR",
  "HG",
  "JC",
  "MC",
  "MN",
  "MS",
  "NT",
  "NL",
  "OC",
  "PL",
  "QT",
  "QR",
  "SP",
  "SL",
  "SR",
  "TC",
  "TS",
  "TL",
  "VZ",
  "YN",
  "ZS",
] as const;

export type CurpStateCode = (typeof CURP_STATE_CODES)[number];

export interface ParsedCurp {
  normalized: string;
  birthDate: string;
  gender: "H" | "M";
  state: CurpStateCode;
  age: number;
}

export interface CurpValidationError {
  success: false;
  message: string;
}

export interface CurpValidationSuccess extends ParsedCurp {
  success: true;
}

export type CurpValidationResult = CurpValidationError | CurpValidationSuccess;

export const CURP_REGEX = /^[A-Z]{4}\d{6}[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]{2}$/;

export const normalizeCurp = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 18);

const computeFullYear = (twoDigitYear: number) => {
  const current = new Date();
  const currentYear = current.getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const currentYearTwoDigits = currentYear % 100;

  if (twoDigitYear <= currentYearTwoDigits) {
    return currentCentury + twoDigitYear;
  }

  return currentCentury - 100 + twoDigitYear;
};

export const validateCurpStructure = (value: string): CurpValidationResult => {
  const normalized = normalizeCurp(value);

  if (normalized.length !== 18) {
    return {
      success: false,
      message: "La CURP debe contener exactamente 18 caracteres",
    };
  }

  if (!/^[A-Z0-9]+$/.test(normalized)) {
    return {
      success: false,
      message: "La CURP solo puede contener letras mayúsculas y números",
    };
  }

  if (!CURP_REGEX.test(normalized)) {
    return {
      success: false,
      message: "La CURP no cumple con el formato oficial",
    };
  }

  const stateCode = normalized.substring(11, 13) as CurpStateCode;
  if (!CURP_STATE_CODES.includes(stateCode)) {
    return {
      success: false,
      message: "El código de estado en la CURP no es válido",
    };
  }

  const genderChar = normalized.charAt(10);
  if (genderChar !== "H" && genderChar !== "M") {
    return {
      success: false,
      message: "El carácter de sexo en la CURP debe ser H o M",
    };
  }

  const yearPart = normalized.substring(4, 6);
  const monthPart = normalized.substring(6, 8);
  const dayPart = normalized.substring(8, 10);

  const birthYear = computeFullYear(Number(yearPart));
  const birthMonth = Number(monthPart) - 1;
  const birthDay = Number(dayPart);

  const birthDate = new Date(birthYear, birthMonth, birthDay);
  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== birthYear ||
    birthDate.getMonth() !== birthMonth ||
    birthDate.getDate() !== birthDay
  ) {
    return {
      success: false,
      message: "La fecha contenida en la CURP no es válida",
    };
  }

  const today = new Date();

  if (birthDate > today) {
    return {
      success: false,
      message: "La fecha de la CURP no puede ser futura",
    };
  }

  const age = calculateAge(birthDate, today);

  if (age < MIN_AGE_YEARS) {
    return {
      success: false,
      message: "La CURP pertenece a una persona menor de edad",
    };
  }

  return {
    success: true,
    normalized,
    birthDate: toInputDate(birthDate),
    gender: genderChar as "H" | "M",
    state: stateCode,
    age,
  };
};

export const curpSchema = z
  .string()
  .trim()
  .length(18, "La CURP debe contener exactamente 18 caracteres")
  .regex(/^[A-Za-z0-9]+$/, "La CURP solo puede contener letras y números")
  .transform((value) => normalizeCurp(value))
  .refine((value) => CURP_REGEX.test(value), {
    message: "La CURP no cumple con el formato oficial",
  })
  .superRefine((value, ctx) => {
    const result = validateCurpStructure(value);

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message,
      });
      return;
    }
  });
