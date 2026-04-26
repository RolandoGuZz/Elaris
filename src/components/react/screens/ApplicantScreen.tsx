import {
  ALLERGIES_DETAILS,
  BLOOD_TYPES,
  DISABILITY_DETAILS,
  DISEASES_DETAILS,
  ETHNI_GROUP,
  LANGUAGES_DETAILS,
  MEDICATION_DETAILS,
  OPTIONS_DEFAULT,
} from "../core/const/infoStadistic";
import { ConditionalMultiSelect } from "../form/ConditionalMultiSelect";
import { InputSelect } from "../form/InputSelect";

const sanitizeLetters = (value: string) =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

export const ApplicantScreen = () => {
  return (
    <>
      <h2 className="text-xl font-bold text-left text-xl text-slate-800 dark:text-slate-200">
        Información del Aspirante
      </h2>
      <div className="flex flex-col gap-3 pt-4 text-left mb-3">
        <InputSelect
          name="applicant.bloodType"
          label="Tipo de sangre"
          options={BLOOD_TYPES}
        />

        <ConditionalMultiSelect
          nameBoolean="applicant.hasDiseases"
          nameOptions="applicant.diseases"
          label="¿Padece alguna enfermedad?"
          options={DISEASES_DETAILS}
          sanitize={sanitizeLetters}
        />

        <ConditionalMultiSelect
          nameBoolean="applicant.hasAllergies"
          nameOptions="applicant.allergies"
          label="¿Tienes alguna alergia?"
          options={ALLERGIES_DETAILS}
          sanitize={sanitizeLetters}
        />
        <ConditionalMultiSelect
          nameBoolean="applicant.takesSpecialMedications"
          nameOptions="applicant.medicationsDetails"
          label="¿Toma medicamentos especiales?"
          options={MEDICATION_DETAILS}
          sanitize={sanitizeLetters}
        />

        <ConditionalMultiSelect
          nameBoolean="applicant.hasDisability"
          nameOptions="applicant.disability"
          label="¿Toma medicamentos especiales?"
          options={DISABILITY_DETAILS}
          sanitize={sanitizeLetters}
        />

        <ConditionalMultiSelect
          nameBoolean="applicant.isIndigenous"
          nameOptions="applicant.indigenous"
          label="¿Se considera persona indigena?"
          options={ETHNI_GROUP}
          sanitize={sanitizeLetters}
        />

        <ConditionalMultiSelect
          nameBoolean="applicant.speaksIndigenousLanguage"
          nameOptions="applicant.languageDetails"
          label="¿Hablas alguna lengua indigena?"
          options={LANGUAGES_DETAILS}
          sanitize={sanitizeLetters}
        />
        <InputSelect
          name="applicant.afrodescendant"
          label="¿Se considera persona afrodescendiente?"
          options={OPTIONS_DEFAULT}
          normalize={sanitizeLetters}
        />
      </div>
    </>
  );
};
