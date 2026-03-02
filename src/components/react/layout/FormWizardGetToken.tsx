import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { STEPS } from "../core/const/steps.ts";
import { useFormWizard } from "../hooks/useFormWizard.ts";
import type { FormGetToken } from "../core/types/FormGetToken.ts";
import { FormProvider, useForm } from "react-hook-form";

export default function FormWizardGetToken() {
  const { tabChanged, handleComplete } = useFormWizard();
  const methods = useForm<FormGetToken>({
    mode: "onBlur",
  });
  const onSubmitForm = (data: any) => {
    console.log("Enviando formulario");
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
            onComplete={methods.handleSubmit(onSubmitForm)}
            onTabChange={tabChanged}
          >
            {STEPS.map((step, index) => {
              const StepComponent = step.component;

              return (
                <FormWizard.TabContent
                  key={index}
                  title={step.title}
                  icon={step.icon}
                >
                  <StepComponent />
                </FormWizard.TabContent>
              );
            })}
          </FormWizard>
          <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
        </form>
      </FormProvider>
    </>
  );
}
