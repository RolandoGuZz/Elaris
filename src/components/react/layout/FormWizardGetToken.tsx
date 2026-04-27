import { useState } from "react";
import { TitleSection } from "../ui/headers/TitleSection.tsx";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { STEPS } from "../core/const/steps.ts";
import { useFormWizard } from "../hooks/useFormWizard.ts";
import { FormProvider, type FieldErrors, type Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formGetTokenSchema } from "../core/validations/FormGetTokenValidations.ts";
import { Modal } from "../ui/Modal";
import type { FormGetToken } from "../core/types/IFormGetToken.ts";
import { uploadFile, saveApplicant, assertCurpNotRegistered } from "../../../lib/supabaseClient";

const { TabContent } = FormWizard;

type PersonalDocumentKey = keyof FormGetToken["personalDocumentation"];

const FIELD_LABELS: Record<string, string> = {
  "identification.firstName": "Nombre(s)",
  "identification.lastName": "Apellidos",
  "identification.birthDate": "Fecha de nacimiento",
  "identification.curp": "CURP",
  "identification.gender": "Género",
  "identification.maritalStatus": "Estado civil",
  "identification.address.lat": "Latitud del domicilio",
  "identification.address.lng": "Longitud del domicilio",
  "identification.phone": "Teléfono",
  "identification.email": "Correo electrónico",
  "identification.career": "Carrera",
  "identification.campus": "Campus",
  "school.name": "Nombre de la institución",
  "school.knowledgeArea": "Área de conocimiento",
  "school.enrollmentYear": "Año de ingreso",
  "school.graduationYear": "Año de egreso",
  "school.finalAverage": "Promedio final",
  "school.schoolType": "Tipo de escuela",
  "school.location.lat": "Latitud de la escuela",
  "school.location.lng": "Longitud de la escuela",
  "personalDocumentation.birthCertificate": "Acta de nacimiento",
  "personalDocumentation.highSchoolProof": "Constancia de bachillerato",
  "personalDocumentation.curp": "Documento CURP",
  "personalDocumentation.photos": "Fotografías",
  "applicant.bloodType": "Tipo de sangre",
  "applicant.diseases": "Enfermedades",
  "applicant.allergies": "Alergias",
  "applicant.medicationsDetails": "Medicamentos especiales",
  "applicant.disability": "Discapacidad",
  "applicant.indigenous": "Identidad indígena",
  "applicant.languageDetails": "Lenguas habladas",
  "applicant.afrodescendant": "¿Se considera afrodescendiente?",
  "responsible.name": "Nombre del responsable",
  "responsible.lastName": "Apellidos del responsable",
  "responsible.birthDate": "Fecha de nacimiento del responsable",
  "responsible.relationShip": "Parentesco del responsable",
  "responsible.address.lat": "Latitud del responsable",
  "responsible.address.lng": "Longitud del responsable",
  "responsible.occupation": "Ocupación del responsable",
  "responsible.phone": "Teléfono del responsable",
};

const formatSegment = (segment: string) => {
  if (/^\d+$/.test(segment)) {
    return `Registro ${Number(segment) + 1}`;
  }
  const label = FIELD_LABELS[segment];
  if (label) return label;
  return segment
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

const getFieldLabel = (path: string[]) => {
  const fullPath = path.join(".");
  if (FIELD_LABELS[fullPath]) {
    return FIELD_LABELS[fullPath];
  }

  return path
    .map((segment, idx) => {
      const accumulated = path.slice(0, idx + 1).join(".");
      return FIELD_LABELS[accumulated] ?? formatSegment(segment);
    })
    .join(" > ");
};

const collectErrorMessages = (
  errors: FieldErrors<FormGetToken>,
  parentPath: string[] = [],
): string[] => {
  if (!errors) {
    return [];
  }

  const messages: string[] = [];

  Object.entries(errors).forEach(([key, value]) => {
    if (!value) return;

    const currentPath = [...parentPath, key];

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        messages.push(...collectErrorMessages(item as FieldErrors<FormGetToken>, [...currentPath, String(index)]));
      });
      return;
    }

    if (typeof value === "object") {
      const fieldError = value as { message?: string };
      if (fieldError.message) {
        messages.push(`${getFieldLabel(currentPath)}: ${fieldError.message}`);
      }

      Object.entries(value).forEach(([childKey, childValue]) => {
        if (["message", "type", "ref", "types"].includes(childKey)) return;
        if (childValue && typeof childValue === "object") {
          messages.push(
            ...collectErrorMessages(childValue as FieldErrors<FormGetToken>, [...currentPath, childKey]),
          );
        }
      });
    }
  });

  return Array.from(new Set(messages));
};

export default function FormWizardGetToken() {
  const { tabChanged } = useFormWizard();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "error" | "success";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<FormGetToken>({
    resolver: zodResolver(formGetTokenSchema),
    mode: "onChange",
  });

  const handleSubmit = async () => {
    if (isUploading) return;

    const isValid = await methods.trigger();
    const errors = methods.formState.errors;
    console.log(errors);

    if (!isValid) {
      const errors = methods.formState.errors;
      const formattedErrors = collectErrorMessages(errors);

      setModalState({
        isOpen: true,
        type: "error",
        title: "Formulario incompleto",
        message:
          formattedErrors.length > 0
            ? `Por favor revisá los siguientes campos: ${formattedErrors.join("; ")}`
            : "Por favor, completa todos los campos del formulario antes de enviarlo.",
      });
      return;
    }

    const formData = methods.getValues();

    const documentationEntries = Object.entries(formData.personalDocumentation) as [
      PersonalDocumentKey,
      FormGetToken["personalDocumentation"][PersonalDocumentKey],
    ][];

    try {
      await assertCurpNotRegistered(formData.identification.curp);

      setIsUploading(true);

      await Promise.all(
        documentationEntries.map(async ([key, value]) => {
          if (value instanceof File) {
            const fieldPath = `personalDocumentation.${key}` as Path<FormGetToken>;
            const url = await uploadFile(value, key);
            methods.setValue(fieldPath, url, {
              shouldDirty: true,
            });
            formData.personalDocumentation[key] = url;
            return;
          }

          if (typeof value === "string" && value.length > 0) {
            return;
          }

          throw new Error(
            `No se pudo procesar el archivo para "${key}". Seleccioná un documento válido.`,
          );
        }),
      );

      await saveApplicant(formData);

      console.log("Payload listo para almacenar:", formData);

      setModalState({
        isOpen: true,
        type: "success",
        title: "Formulario enviado",
        message:
          "¡El formulario ha sido enviado correctamente! Los documentos fueron almacenados y el registro se guardó en la base de datos.",
      });

      setTimeout(() => {
        window.location.assign("/");
      }, 1500);
    } catch (error) {
      console.error("Error al subir documentos", error);

      setModalState({
        isOpen: true,
        type: "error",
        title: "Error al subir documentos",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado al subir los documentos.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <FormWizard
            finishButtonText={isUploading ? "Procesando..." : "Enviar"}
            disableBackOnClickStep={true}
            color="#1d7b43"
            nextButtonText="Siguiente"
            backButtonText="Atras"
            onComplete={handleSubmit}
            onTabChange={tabChanged}
          >
            {STEPS.map((step, index) => {
              const StepComponent = step.component;

              return (
                <TabContent key={index} title={step.title} icon={step.icon}>
                  <div className="p-10 w-full rounded-xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <TitleSection title={step.title} subtitle={step.subtitle} />
                    <StepComponent />
                  </div>
                </TabContent>
              );
            })}
          </FormWizard>
          <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
        </form>
      </FormProvider>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </>
  );
}
