import { useController, useFormContext, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";
import type { FormGetToken } from "../core/types/FormGetToken";
import { InputMultiSelect } from "./InputMultiSelect";

interface ConditionalMultiSelectProps {
  nameBoolean: Path<FormGetToken>; // campo Sí/No
  nameOptions: Path<FormGetToken>; // campo array
  label: string;
  options: string[];
}

export const ConditionalMultiSelect = ({
  nameBoolean,
  nameOptions,
  label,
  options,
}: ConditionalMultiSelectProps) => {
  const { control } = useFormContext<FormGetToken>();

  // Campo booleano
  const { field: booleanField } = useController({
    name: nameBoolean,
    control,
    defaultValue: false,
  });

  // Campo array
  const { field: optionsField } = useController({
    name: nameOptions,
    control,
    defaultValue: [],
  });

  // Observamos valor actual
  const selectedBoolean = useWatch({
    control,
    name: nameBoolean,
  });

  const handleBooleanChange = (value: boolean) => {
    booleanField.onChange(value);

    // Si elige NO → limpiar array
    if (!value) {
      optionsField.onChange([]);
    }
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
        <InputMultiSelect
          name={nameOptions}
          label="Seleccione una o más opciones"
          options={options}
        />
      )}
    </div>
  );
};
