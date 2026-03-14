import { useFormContext } from "react-hook-form";
import type { Path, RegisterOptions, FieldError, FieldValues } from "react-hook-form";

interface InputTextProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
}

export function InputText<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  rules,
}: InputTextProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const getError = (obj: unknown, path: string): FieldError | undefined => {
    return path.split(".").reduce((acc: unknown, key) => (acc as Record<string, unknown>)?.[key], obj) as FieldError | undefined;
  };

  const error = getError(errors, name as string);

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
    </div>
  );
}
