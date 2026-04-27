import { useController, useFormContext, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";
import type { FormGetToken } from "../core/types/IFormGetToken";
import { InputSearch } from "./InputSearch";

interface ConditionalMultiSelectProps {
  nameBoolean: Path<FormGetToken>;
  nameOptions: Path<FormGetToken>;
  label: string;
  options: string[];
  sanitize?: (value: string) => string;
}

export const ConditionalMultiSelect = ({
  nameBoolean,
  nameOptions,
  label,
  options,
  sanitize,
}: ConditionalMultiSelectProps) => {
  const { control } = useFormContext<FormGetToken>();

  const { field: booleanField } = useController({
    name: nameBoolean,
    control,
    defaultValue: false,
  });

  const { field: optionsField } = useController({
    name: nameOptions,
    control,
    defaultValue: [],
  });

  const selectedBoolean = useWatch({
    control,
    name: nameBoolean,
    defaultValue: false,
  });

  const handleBooleanChange = (value: boolean) => {
    booleanField.onChange(value);

    if (!value) {
      optionsField.onChange([]);
    }
  };

  const handleSearchChange = (selected: string[]) => {
    optionsField.onChange(selected);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </h3>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleBooleanChange(true)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedBoolean === true
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-slate-600 border-slate-300 dark:bg-slate-900 dark:border-slate-700"
          }`}
        >
          Sí
        </button>

        <button
          type="button"
          onClick={() => handleBooleanChange(false)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedBoolean === false
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-slate-600 border-slate-300 dark:bg-slate-900 dark:border-slate-700"
          }`}
        >
          No
        </button>
      </div>

      {selectedBoolean === true && (
        <InputSearch
          options={options}
          label="Ingrese el nombre"
          placeholder="Buscar opciones..."
          onChange={handleSearchChange}
          value={optionsField.value ?? []}
          sanitize={sanitize}
        />
      )}
    </div>
  );
};
