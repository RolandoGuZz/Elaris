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

export const ApplicantScreen = () => {
  return (
    <>
      <h2 className="text-xl font-bold text-left text-xl text-slate-800 dark:text-slate-200">
        Información del Aspirante
      </h2>
      <div className="pt-4 grid grid-cols-1 text-left md:grid-cols-2 gap-6 mb-3">
        <InputSelect
          name="applicant.bloodType"
          label="Tipo de sangre"
          options={BLOOD_TYPES}
        />

        <ConditionalMultiSelect
          nameBoolean="tieneEnfermedad"
          nameOptions="applicant.diseases"
          label="¿Padece alguna enfermedad?"
          options={DISEASES_DETAILS}
        />

        <ConditionalMultiSelect
          nameBoolean="tieneAlergia"
          nameOptions="applicant.allergies"
          label="¿Tienes alguna alergia?"
          options={ALLERGIES_DETAILS}
        />
        <ConditionalMultiSelect
          nameBoolean="tieneMedicamentos"
          nameOptions="applicant.medicationsDetails"
          label="¿Toma medicamentos especiales?"
          options={MEDICATION_DETAILS}
        />

        <ConditionalMultiSelect
          nameBoolean="tieneDiscapacidad"
          nameOptions="applicant.disability"
          label="¿Toma medicamentos especiales?"
          options={DISABILITY_DETAILS}
        />

        <ConditionalMultiSelect
          nameBoolean="eresIndigena"
          nameOptions="applicant.indigenous"
          label="¿Se considera persona indigena?"
          options={ETHNI_GROUP}
        />

        <ConditionalMultiSelect
          nameBoolean="algunaLengua"
          nameOptions="applicant.languageDetails"
          label="¿Hablas alguna lengua indigena?"
          options={LANGUAGES_DETAILS}
        />
        <InputSelect
          name="applicant.afrodescendant"
          label="¿Se considera persona afrodescendiente?"
          options={OPTIONS_DEFAULT}
        />
      </div>
    </>
  );
};
