import { OPTIONS_TYPE_FILES } from "../core/const/options";
import { InputFiles } from "../form/InputFiles";

export const PersonalDocumentationScreen = () => {
  return (
    <div className="flex flex-col gap-8 mb-5">
      <h2 className="text-xl text-left font-bold text-slate-800 dark:text-slate-200">
        Documentación Personal
      </h2>
      <InputFiles
        name="personalDocumentation.birthCertificate"
        label="Acta de Nacimiento"
        typeFiles={OPTIONS_TYPE_FILES.FILES}
        acceptedTypes={OPTIONS_TYPE_FILES.FILES}
        rules={{ required: "El acta de nacimiento es obligatoria" }}
      />{" "}
      <InputFiles
        name="personalDocumentation.highSchoolProof"
        label="Constancia de Bachillerato"
        typeFiles={OPTIONS_TYPE_FILES.FILES}
        acceptedTypes={OPTIONS_TYPE_FILES.FILES}
      />
      <InputFiles
        typeFiles={OPTIONS_TYPE_FILES.FILES}
        acceptedTypes={OPTIONS_TYPE_FILES.FILES}
        name="personalDocumentation.curp"
        label="Clave Única de Registro de Población (CURP)"
        rules={{ required: "La CURP es obligatoria" }}
      />
      <InputFiles
        typeFiles={OPTIONS_TYPE_FILES.IMAGES}
        acceptedTypes={OPTIONS_TYPE_FILES.IMAGES}
        name="personalDocumentation.photos"
        label="Fotografía"
        rules={{ required: "Las fotografías son obligatorias" }}
      />
    </div>
  );
};
