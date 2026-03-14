import { InputText } from "../../form/InputText";
import imgPersonal from "../../../../assets/images/Personal data-bro.svg";

export const PersonalInfo = () => {
  return (
    <div className="">
      <div className="p-0 md:flex">
        <div className="hidden md:block w-1/3 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800">
          <img
            src={imgPersonal.src}
            alt="imagen de datos personales"
            className="h-full rounded-lg w-full bg-cover bg-center opacity-80"
          />
        </div>
        <div className="flex-1 p-6 md:p-10">
          <form className="space-y-6">
            <InputText
              name="personalInfo.curp"
              label="CURP *"
              placeholder="Ingresa los 18 caracteres de la CURP"
            />
            <InputText
              name="personalInfo.birthCertificate"
              label="Folio del acta de nacimiento *"
              placeholder="Ej. 123456789"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
