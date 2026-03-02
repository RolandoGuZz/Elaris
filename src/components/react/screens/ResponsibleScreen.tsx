import { OCUPATIONS } from "../core/const/infoStadistic";
import { InputSelect } from "../form/InputSelect";
import { InputText } from "../form/InputText";
import { MapComponent } from "../layout/MapComponent";

export const ResponsibleScreen = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          name="responsible.fullName"
          label="Nombre completo"
          placeholder="Ingrese nombre completo"
        />

        <InputText
          name="responsible.lastName"
          label="Apellidos"
          placeholder="Ingrese sus apellidos"
        />
      </div>
      <InputSelect
        name="responsible.relationship"
        label="Parentesco"
        options={["Padre", "Madre", "Tutor", "Abuelo/a", "Hermano/a", "Otro"]}
      />

      <MapComponent
        nameLat="responsible.address.lat"
        nameLng="responsible.address.lng"
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
          type="tel"
          placeholder="Ej. 55 1234 5678"
        />
      </div>
    </div>
  );
};
