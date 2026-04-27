import { useState } from "react";
import { TitleSection } from "../ui/headers/TitleSection.tsx";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { useFormWizard } from "../hooks/useFormWizard.ts";
import { FormProvider, type FieldErrors, type Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import { STEPS_INSCRIPTIONS } from "../core/const/stepsInscriptions.ts";
import { formInscriptionSchema } from "../core/validations/FormInscriptionValidations.ts";
import type { FormInscriptionSchemaType } from "../core/validations/FormInscriptionValidations.ts";
import { uploadFile, saveInscription } from "../../../lib/supabaseClient";

export const FormInscriptions = (props: {}) => {
  const { tabChanged } = useFormWizard();
  //TODO: separar la logica en un customHook
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormInscriptionSchemaType>({
    resolver: zodResolver(formInscriptionSchema),
    mode: "onChange",
  });

  const FIELD_LABELS: Record<string, string> = {
    "personalInfo.curp": "CURP",
    "personalInfo.birthCertificate": "Acta de nacimiento",
    "schoolInfo.name": "Nombre de la institución",
    "schoolInfo.placeExpedition": "Lugar de expedición",
    "schoolInfo.averageFinal": "Promedio final",
    "schoolInfo.certificate": "Folio del certificado",
    "schoolInfo.certificateFile": "Archivo del certificado",
    "schoolInfo.typeInstitution": "Tipo de institución",
    "responsible.hasDifferentResponsible": "¿Registrar responsable diferente?",
    "responsible.name": "Nombre del responsable",
    "responsible.lastName": "Apellidos del responsable",
    "responsible.birthDate": "Fecha de nacimiento del responsable",
    "responsible.relationShip": "Parentesco del responsable",
    "responsible.phone": "Teléfono del responsable",
    "responsible.email": "Correo electrónico del responsable",
    "responsible.occupation": "Ocupación del responsable",
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
    errors: FieldErrors<FormInscriptionSchemaType>,
    parentPath: string[] = [],
  ): string[] => {
    if (!errors) return [];

    const messages: string[] = [];

    Object.entries(errors).forEach(([key, value]) => {
      if (!value) return;

      const currentPath = [...parentPath, key];

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          messages.push(
            ...collectErrorMessages(
              item as FieldErrors<FormInscriptionSchemaType>,
              [...currentPath, String(index)],
            ),
          );
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
              ...collectErrorMessages(
                childValue as FieldErrors<FormInscriptionSchemaType>,
                [...currentPath, childKey],
              ),
            );
          }
        });
      }
    });

    return Array.from(new Set(messages));
  };
  //TODO: separa la logica en un customHook
  const handleSubmit = async () => {
    if (isSubmitting) return;

    const isValid = await methods.trigger();
    const errors = methods.formState.errors;
    console.log(errors);

    const formData = methods.getValues();
    console.log("Form data:", formData);

    if (!isValid) {
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

    try {
      setIsSubmitting(true);

      await Promise.all(
        formData.schoolInfo.map(async (info, index) => {
          const fieldPath = `schoolInfo.${index}.certificateFile` as Path<FormInscriptionSchemaType>;

          if (info.certificateFile instanceof File) {
            const url = await uploadFile(
              info.certificateFile,
              `inscription_certificate_${index + 1}`,
            );
            methods.setValue(fieldPath, url, { shouldDirty: true });
            formData.schoolInfo[index].certificateFile = url;
            return;
          }

          if (typeof info.certificateFile === "string" && info.certificateFile.length > 0) {
            return;
          }

          throw new Error(
            `Sube el archivo del certificado para el registro ${index + 1}.`,
          );
        }),
      );

      await saveInscription(formData);

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
      console.error("Error al procesar la inscripción", error);

      setModalState({
        isOpen: true,
        type: "error",
        title: "Error al enviar",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado al enviar la inscripción.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <FormProvider {...methods}>
        <div role="presentation">
          <FormWizard
            finishButtonText={isSubmitting ? "Procesando..." : "Enviar"}
            disableBackOnClickStep={true}
            color="#1d7b43"
            nextButtonText="Siguiente"
            backButtonText="Atras"
            onComplete={handleSubmit}
            onTabChange={tabChanged}
          >
            {STEPS_INSCRIPTIONS.map((step, index) => {
              const StepComponent = step.componente!;

              return (
                <FormWizard.TabContent
                  key={index}
                  title={step.title}
                  icon={step.icon}
                >
                  <div className="p-10 w-full rounded-xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <TitleSection title={step.title} subtitle={step.subtitle} />
                    <StepComponent />
                  </div>
                </FormWizard.TabContent>
              );
            })}
          </FormWizard>
        </div>
        <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
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
};
