import { InputText } from "../form/InputText";
import { InputSelect } from "../form/InputSelect";
import { SelectSex } from "../form/SelectSex";
import { SelectState } from "../form/SelectState";
import { MapComponent } from "../layout/MapComponent";

const CAREER_OPTIONS = ["Ingeniería de Software", "Administración", "Agronomía"];
const CAMPUS_OPTIONS = ["Nopala", "Juxtlahuaca", "San Jacinto"];

export const IdentificationUserScreen = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Nombre"
          name="identification.firstName"
          placeholder="Ingresa tu nombre"
        />

        <InputText
          label="Apellidos"
          name="identification.lastName"
          placeholder="Ingresa tus apellidos"
        />

        <InputText
          label="Edad"
          name="identification.age"
          type="number"
          placeholder="e.g. 18"
        />

        <InputText
          label="Fecha de Nacimiento"
          name="identification.birthDate"
          type="date"
        />
      </div>

      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
        <InputText
          label="Telefono"
          name="identification.phone"
          type="number"
          placeholder="e.g. 5551234567"
        />
        <InputText
          label="Correo electronico"
          name="identification.email"
          type="email"
          placeholder="ejemplo@email.com"
        />
        <InputSelect
          label="Selecciona la carrera a la que quieres entrar"
          name="identification.career"
          options={CAREER_OPTIONS}
        />
        <InputSelect
          label="Campus"
          name="identification.campus"
          options={CAMPUS_OPTIONS}
        />
        <SelectSex label="Sexo" name="identification.gender" />
        <SelectState label="Estado Civil" name="identification.maritalStatus" />
      </div>
      <MapComponent
        title="Indica tu domicilio en el mapa"
        name="identification.address"
      />
    </>
  );
};
