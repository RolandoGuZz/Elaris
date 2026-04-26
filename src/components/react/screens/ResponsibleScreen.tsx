import { OCUPATIONS } from "../core/const/infoStadistic";
import { getBirthDateBounds } from "../core/validations/utils/birthDate";
import { InputSelect } from "../form/InputSelect";
import { InputText } from "../form/InputText";
import { MapComponent } from "../layout/MapComponent";

export const ResponsibleScreen = () => {
  const { max, min } = getBirthDateBounds();

  return (
    <div className="flex flex-col gap-10">
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          name="responsible.name"
          label="Nombre completo"
          placeholder="Ingrese nombre completo"
        />

        <InputText
          name="responsible.lastName"
          label="Apellidos"
          placeholder="Ingrese sus apellidos"
        />

        <InputText
          name="responsible.birthDate"
          label="Fecha de nacimiento"
          type="date"
          max={max}
          min={min}
        />
      </div>
      <InputSelect
        name="responsible.relationShip"
        label="Parentesco"
        options={["Padre", "Madre", "Tutor", "Abuelo/a", "Hermano/a", "Otro"]}
      />

      <MapComponent
        name="responsible.address"
        title="Seleccione ubicación en el mapa"
      />

      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 ">
        <InputSelect
          name="responsible.occupation"
          label="Ocupación"
          options={OCUPATIONS}
        />

        <InputText
          name="responsible.phone"
          label="Teléfono"
          type="number"
          placeholder="Ej. 5512345678"
        />
      </div>
    </div>
  );
};
