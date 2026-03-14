import { useFormContext, Controller } from "react-hook-form";
import type { FormInscriptionSchemaType } from "../../core/validations/FormInscriptionValidations";
import { InputText } from "../../form/InputText";
import { InputSelect } from "../../form/InputSelect";
import { MapComponent } from "../../layout/MapComponent";
import { STEPS_INSCRIPTIONS } from "../../core/const/steps";

export const ResponsibleInfoScreen = () => {
  const { control, watch } = useFormContext<FormInscriptionSchemaType>();

  const hasDifferentResponsible =
    watch("responsible.hasDifferentResponsible") ?? false;

  return (
    <div className="flex flex-col gap-6 w-full">
      <Controller
        name="responsible.hasDifferentResponsible"
        control={control}
        defaultValue={false}
        render={({ field: { value, onChange } }) => (
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
              <div
                className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] 
                after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 
                after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"
              ></div>
            </label>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              ¿Deseas registrar un responsable diferente?
            </span>
          </div>
        )}
      />

      {hasDifferentResponsible && (
        <div className="flex flex-col gap-6 p-6 dark:bg-slate-800/50 rounded-xl dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Datos del responsable
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS_INSCRIPTIONS.map((field) =>
              field.component === "InputText" ? (
                <InputText
                  key={String(field.name)}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                />
              ) : (
                <InputSelect
                  key={String(field.name)}
                  name={field.name}
                  label={field.label}
                  options={field.options}
                />
              ),
            )}
          </div>
          <MapComponent
            name="responsible.address"
            title="Seleccione la ubicación en el mapa"
          />
        </div>
      )}
    </div>
  );
};
