import { useState } from "react";
import { TitleSection } from "../ui/headers/TitleSection.tsx";
import FormWizard, { TabContent } from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { STEPS } from "../core/const/steps.ts";
import { useFormWizard } from "../hooks/useFormWizard.ts";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formGetTokenSchema } from "../core/validations/FormGetTokenValidations.ts";
import { Modal } from "../ui/Modal";

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

  const methods = useForm({
    resolver: zodResolver(formGetTokenSchema),
    mode: "onChange",
  });

  const handleSubmit = async () => {
    const isValid = await methods.trigger();
    const errors = methods.formState.errors;
    console.log(errors);

    const formData = methods.getValues();
    console.log("Form data:", formData);

    if (!isValid) {
      const errors = methods.formState.errors;
      const hasErrors = Object.keys(errors).length > 0;

      setModalState({
        isOpen: true,
        type: "error",
        title: "Formulario incompleto",
        message: hasErrors
          ? "Por favor, completa todos los campos requeridos antes de enviar el formulario. Los campos con errores están marcados en rojo."
          : "Por favor, completa todos los campos del formulario antes de enviarlo.",
      });
      return;
    }

    setModalState({
      isOpen: true,
      type: "success",
      title: "Formulario enviado",
      message:
        "¡El formulario ha sido enviado correctamente! Gracias por tu registro.",
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <FormWizard
            finishButtonText="Enviar"
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
                <TabContent
                  key={index}
                  title={step.title}
                  icon={step.icon}
                >
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
