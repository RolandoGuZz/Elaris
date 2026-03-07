import { useFormContext } from "react-hook-form";
import type { Path } from "react-hook-form";
import type { FormGetToken } from "../core/types/FormGetToken";

interface PropsInput {
  name: Path<FormGetToken>;
  label?: string;
}

export const SelectSex = ({ name, label }: PropsInput) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormGetToken>();

  const options = ["Masculino", "Femenino", "Otro"] as const;

  const error = errors[name];

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-semibold text-left text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={`
              relative flex items-center justify-center px-6 py-2.5 rounded-xl border-2
              cursor-pointer transition-all
              ${
                error
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
              }
              has-[:checked]:border-primary
              has-[:checked]:bg-primary/5
            `}
          >
            <input
              type="radio"
              value={option}
              {...register(name)}
              className="sr-only"
            />

            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {option}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium">
          {(error as any)?.message}
        </span>
      )}
    </div>
  );
};
