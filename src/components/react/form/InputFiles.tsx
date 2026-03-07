import { useForm, useController, useFormContext } from "react-hook-form";
import type { Path, RegisterOptions } from "react-hook-form";
import type { FormGetToken } from "../core/types/FormGetToken";

interface PropsInput {
  label?: string;
  name: Path<FormGetToken>;
  rules?: RegisterOptions;
  typeFiles?: string;
}

export const InputFiles = ({ label, name, rules, typeFiles }: PropsInput) => {
  const { control } = useFormContext<FormGetToken>();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm text-left font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="flex items-center justify-center w-full">
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
          transition-all
          ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <span className="material-symbols-outlined text-slate-400 mb-2">
              Subir archivo
            </span>

            <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              Click para subir archivo
            </p>

            <p className="text-xs text-slate-400">{typeFiles}</p>
          </div>

          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
            }}
            onBlur={field.onBlur}
            name={field.name}
          />
        </label>
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
};
