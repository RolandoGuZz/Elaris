import React from "react";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { STEPS } from "../core/const/steps.ts";
import { useFormWizard } from "../hooks/useFormWizard.ts";
import {
  ApplicantScreen,
  IdentificationUserScreen,
  PersonalDocumentationScreen,
  ResponsibleScreen,
  SchoolBackgroundScreen,
} from "../screens/index.ts";

export default function FormWizardGetToken() {
  const { tabChanged, handleComplete } = useFormWizard();
  return (
    <>
      <FormWizard onComplete={handleComplete} onTabChange={tabChanged}>
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
    </>
  );
}
