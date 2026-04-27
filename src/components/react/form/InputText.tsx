import { useId } from "react";
import { useFormContext } from "react-hook-form";
import type { Path, RegisterOptions, FieldError, FieldValues } from "react-hook-form";

interface InputTextProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  max?: string;
  min?: string;
  maxLength?: number;
  transformUppercase?: boolean;
  step?: number | string;
  inputMode?: "decimal" | "numeric";
  allowDecimal?: boolean;
  autoCompleteOptions?: string[];
  sanitizeInput?: (value: string) => string;
}

export function InputText<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  rules,
  max,
  min,
  maxLength,
  transformUppercase = false,
  step,
  inputMode,
  allowDecimal = false,
  autoCompleteOptions,
  sanitizeInput,
}: InputTextProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const uniqueId = useId();
  const dataListId = autoCompleteOptions && autoCompleteOptions.length > 0 ? `${uniqueId}-options` : undefined;

  const getError = (obj: unknown, path: string): FieldError | undefined => {
    return path.split(".").reduce((acc: unknown, key) => (acc as Record<string, unknown>)?.[key], obj) as FieldError | undefined;
  };

  const error = getError(errors, name as string);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      const allowedKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

      if (allowDecimal && e.key === ".") {
        if (e.currentTarget.value.includes(".")) {
          e.preventDefault();
        }
        return;
      }

      if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    if (type === "number") {
      if (allowDecimal) {
        let sanitized = value.replace(/[^0-9.]/g, "");
        const dotIndex = sanitized.indexOf(".");
        if (dotIndex !== -1) {
          const intPartRaw = sanitized.slice(0, dotIndex).replace(/\./g, "");
          const decimalRaw = sanitized.slice(dotIndex + 1).replace(/\./g, "");

          const intPart = intPartRaw.length > 0 ? intPartRaw : "0";
          const decimalPart = decimalRaw.slice(0, 1);

          sanitized = decimalPart.length > 0 ? `${intPart}.${decimalPart}` : intPart;
        } else {
          sanitized = sanitized.replace(/\./g, "");
        }

        value = sanitized;
      } else {
        value = value.replace(/[^0-9]/g, "");
      }
    }

    if (transformUppercase) {
      const upperSanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      value = typeof maxLength === "number" ? upperSanitized.slice(0, maxLength) : upperSanitized;
    }

    if (typeof maxLength === "number" && type !== "number" && !transformUppercase) {
      value = value.slice(0, maxLength);
    }

    if (sanitizeInput) {
      const sanitized = sanitizeInput(value);
      value = sanitized;
    }

    if (value !== e.currentTarget.value) {
      e.currentTarget.value = value;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={name as string}
          className="text-sm text-left font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <input
        id={name as string}
        type={type}
        placeholder={placeholder}
        {...register(name as Path<T>, rules)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        max={max}
        min={min}
        maxLength={type === "number" ? undefined : maxLength}
        step={type === "number" ? step : undefined}
        inputMode={inputMode}
        list={dataListId}
        className={` text-left
          w-full px-4 py-2.5 rounded-lg border
          bg-white text-slate-900 placeholder-slate-400 shadow-sm
          dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500
          transition-all duration-200
          focus:outline-none focus:ring-2
          ${
            error
              ? "text-left border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary"
          }
        `}
      />

      {error && (
        <span className="text-xs text-left text-red-500 font-medium">
          {error.message as string}
        </span>
      )}

      {dataListId && (
        <datalist id={dataListId}>
          {autoCompleteOptions?.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </div>
  );
}
