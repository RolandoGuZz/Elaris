import { InputText } from "../../form/InputText";
import imgPersonal from "../../../../assets/images/Personal data-bro.svg";
import { normalizeCurp } from "../../core/validations/utils/curp";
import { CURP_REGEX } from "../../core/validations/utils/curp";

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
              name="personalInfo.birthCertificate"
              label="Folio del acta de nacimiento *"
              placeholder="Ej. 123456789"
              transformUppercase
              maxLength={20}
              rules={{
                required: "Ingresa el folio del acta",
                validate: (value: string) => {
                  const normalized = value.trim().toUpperCase();
                  return /^[A-Z0-9]{8,20}$/.test(normalized)
                    ? true
                    : "El folio de acta de nacimiento no es válido. Debe contener solo letras mayúsculas y números, con 8 a 20 caracteres.";
                },
              }}
            />

            <InputText
              name="personalInfo.curp"
              label="CURP *"
              placeholder="Ingresa tu CURP"
              maxLength={18}
              transformUppercase
              rules={{
                required: "Ingresa tu CURP",
                validate: (value: string) => {
                  const normalized = normalizeCurp(value ?? "");
                  return CURP_REGEX.test(normalized)
                    ? true
                    : "La CURP no es válida.";
                },
              }}
            />
            <p className="text-sm text-left text-slate-600 dark:text-slate-300">
              ¿No conoces tu CURP?{" "}
              <a
                href="https://www.gob.mx/curp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold underline"
              >
                Puedes consultarla aquí.
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
