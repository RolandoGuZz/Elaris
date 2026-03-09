import { OPTIONS_TYPE_SCHOOL } from "../core/const/options";
import { InputFiles } from "../form/InputFiles";
import { InputSelect } from "../form/InputSelect";
import { InputText } from "../form/InputText";
import { MapComponent } from "../layout/MapComponent";

export const SchoolBackgroundScreen = () => {
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
            rules={{ valueAsNumber: true }}
          />

          <InputText
            name="school.graduationYear"
            label="Anio de Graduacion"
            type="number"
            rules={{ valueAsNumber: true }}
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
            type="number"
            placeholder="e.g. 9.5"
            rules={{ valueAsNumber: true }}
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
