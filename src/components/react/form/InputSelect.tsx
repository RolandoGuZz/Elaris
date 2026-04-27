import { useFormContext } from "react-hook-form";
import type { Path } from "react-hook-form";
import type { FormGetToken } from "../core/types/IFormGetToken";

interface PropsInputSelect {
  name: Path<FormGetToken>;
  label?: string;
  options?: string[];
  normalize?: (value: string) => string;
}

export const InputSelect = ({
  name,
  label,
  options,
  normalize,
}: PropsInputSelect) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormGetToken>();

  const selectedValue = watch(name);
  const error = errors[name];

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-semibold text-left text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-3">
        {options?.map((option) => {
          const isSelected = selectedValue === option;
          const registerReturn = register(name);

          return (
            <label
              key={option}
              className={`
                relative flex items-center justify-center px-6 py-2.5 rounded-xl border-2
                cursor-pointer transition-all
                ${
                  error
                    ? "border-red-500"
                    : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                }
              `}
            >
              <input
                type="radio"
                value={option}
                {...registerReturn}
                onChange={(event) => {
                  const value = normalize ? normalize(event.target.value) : event.target.value;
                  event.target.value = value;
                  registerReturn.onChange(event);
                }}
                className="sr-only"
              />

              <span className={`text-sm font-bold transition-colors ${
                isSelected ? "text-primary" : "text-slate-600 dark:text-slate-400"
              }`}>
                {option}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium">
          {(error as any)?.message}
        </span>
      )}
    </div>
  );
};
