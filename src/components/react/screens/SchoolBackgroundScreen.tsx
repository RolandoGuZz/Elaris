import { useFormContext } from "react-hook-form";
import { OPTIONS_TYPE_SCHOOL } from "../core/const/options";
import { InputFiles } from "../form/InputFiles";
import { InputSelect } from "../form/InputSelect";
import { InputText } from "../form/InputText";
import { MapComponent } from "../layout/MapComponent";
import type { FormGetToken } from "../core/types/IFormGetToken";

const AVERAGE_PATTERN = /^(?:[0-9]\.[0-9]|10\.0)$/;

export const SchoolBackgroundScreen = () => {
  const { getValues } = useFormContext<FormGetToken>();

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h2 className="text-xl text-left font-semibold pb-2">
          Informacion Escolar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            name="school.name"
            label="Nombre del instituto"
            placeholder="CBTIS 150"
            rules={{ required: "Required field" }}
          />

          <InputText
            name="school.knowledgeArea"
            label="Area de conocimiento"
            placeholder="Informatica"
          />

          <InputText
            name="school.enrollmentYear"
            label="Anio de Ingreso"
            type="number"
            inputMode="numeric"
            rules={{
              valueAsNumber: true,
              validate: (value) => {
                if (typeof value !== "number" || Number.isNaN(value)) {
                  return "Ingresa el año de ingreso";
                }
                const graduationYear = getValues("school.graduationYear");
                if (
                  typeof graduationYear === "number" &&
                  !Number.isNaN(graduationYear) &&
                  graduationYear - value < 3
                ) {
                  return "El año de ingreso debe ser al menos 3 años anterior al de egreso";
                }
                return true;
              },
            }}
          />

          <InputText
            name="school.graduationYear"
            label="Anio de Graduacion"
            type="number"
            inputMode="numeric"
            rules={{
              valueAsNumber: true,
              validate: (value) => {
                if (typeof value !== "number" || Number.isNaN(value)) {
                  return "Ingresa el año de egreso";
                }
                const enrollmentYear = getValues("school.enrollmentYear");
                if (typeof enrollmentYear !== "number" || Number.isNaN(enrollmentYear)) {
                  return "Ingresa primero el año de ingreso";
                }
                if (value - enrollmentYear < 3) {
                  return "El año de egreso debe ser al menos 3 años posterior al de ingreso";
                }
                return true;
              },
            }}
          />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-xl text-left font-semibold pb-2">
          Hitorial Academico
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            name="school.finalAverage"
            label="Promedio Final"
            placeholder="e.g. 9.0"
            inputMode="decimal"
            rules={{
              required: "Ingresa el promedio",
              setValueAs: (value: string) => value?.trim?.() ?? value,
              validate: (value: string) => {
                const trimmed = value?.trim?.() ?? "";
                if (!AVERAGE_PATTERN.test(trimmed)) {
                  return "Usá el formato 9.0";
                }
                const numeric = Number(trimmed);
                if (Number.isNaN(numeric) || numeric < 0 || numeric > 10) {
                  return "El promedio debe estar entre 0.0 y 10.0";
                }
                return true;
              },
            }}
          />

          <InputSelect
            options={OPTIONS_TYPE_SCHOOL}
            name="school.schoolType"
            label="Tipo de escuela"
          />
        </div>
      </section>
      <MapComponent
        name="school.location"
        title="Ubicacion de tu institucion"
      />
    </div>
  );
};
