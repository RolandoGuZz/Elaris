import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { FormInscriptionSchemaType } from "../../core/validations/FormInscriptionValidations";
import { OPTIONS_TYPE_SCHOOL } from "../../core/const/options";
import { InputSelect } from "../../form/InputSelect";
import { InputText } from "../../form/InputText";
import { InputFiles } from "../../form/InputFiles";

import imgSecundaria from "../../../../assets/images/Mathematics-bro.svg";
import imgPrimaria from "../../../../assets/images/Exams-bro.svg";
import imgBachillerato from "../../../../assets/images/Online learning-bro.svg";

interface SchoolLevel {
  label: string;
  image: string;
}

const SCHOOL_LEVELS: SchoolLevel[] = [
  {
    label: "Primaria",
    image: imgPrimaria,
  },
  {
    label: "Secundaria",
    image: imgSecundaria,
  },
  {
    label: "Bachillerato",
    image: imgBachillerato,
  },
] as const;

export const SchoolInformationScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    console.log(SCHOOL_LEVELS[0].image);
  }, []);

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        mousewheel={true}
        keyboard={true}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        className="school-swiper pb-12"
      >
        {SCHOOL_LEVELS.map((level, index) => (
          <SwiperSlide key={index}>
            <SchoolSlide level={level} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

interface SchoolSlideProps {
  level: SchoolLevel;
  index: number;
}

const CERTIFICATE_PATTERN =
  /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/;
const CERTIFICATE_GROUPS = [8, 4, 4, 4, 12];
const AVERAGE_PATTERN = /^(?:[0-9]\.[0-9]|10\.0)$/;

const formatCertificateFolio = (value: string) => {
  const cleaned = value
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 32);
  let formatted = "";
  let cursor = 0;

  CERTIFICATE_GROUPS.forEach((groupLength, idx) => {
    const part = cleaned.slice(cursor, cursor + groupLength);
    if (!part) {
      return;
    }
    formatted += part;
    cursor += part.length;
    if (
      part.length === groupLength &&
      idx < CERTIFICATE_GROUPS.length - 1 &&
      cursor < cleaned.length
    ) {
      formatted += "-";
    }
  });

  return formatted;
};

const SchoolSlide = ({ level, index }: SchoolSlideProps) => {
  const { control, setValue } = useFormContext<FormInscriptionSchemaType>();

  const certificateName = `schoolInfo.${index}.certificate` as const;
  const certificateValue = useWatch({
    control,
    name: certificateName,
  });

  useEffect(() => {
    if (typeof certificateValue !== "string") {
      return;
    }

    const formatted = formatCertificateFolio(certificateValue);
    if (formatted !== certificateValue) {
      setValue(certificateName, formatted, { shouldDirty: true });
    }
  }, [certificateValue, certificateName, setValue]);

  return (
    <div className="w-full px-20 flex flex-col gap-6  pb-12items-center">
      <h1 className="w-full p-0 text-left text-3xl font-bold">{level.label}</h1>
      <div className="w-full flex gap-4">
        <img
          src={level.image.src}
          alt={level.label}
          className="max-h-80 object-contain"
        />
        <div className="w-full flex flex-col gap-2">
          <InputText
            name={`schoolInfo.${index}.name` as const}
            label="Nombre de la institución *"
            placeholder="Ingresa el nombre de tu escuela"
            rules={{
              required: "Ingresa el nombre de la institución",
              validate: (value: string) => {
                if (!value) {
                  return "Ingresa el nombre de la institución";
                }

                if (/^[\s]/.test(value)) {
                  return "El nombre no puede comenzar con espacios";
                }

                if (/^[0-9]/.test(value.trim())) {
                  return "El nombre no puede iniciar con un número";
                }

                if (!/[A-Za-zÁÉÍÓÚáéíóúñÑ]/.test(value)) {
                  return "El nombre debe contener al menos una letra";
                }

                if (
                  !/^(?!\s)(?!.*\s$)[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]+$/.test(value)
                ) {
                  return "El nombre solo puede incluir letras y números, sin espacios al inicio o final.";
                }

                return true;
              },
            }}
          />

          <InputText
            name={`schoolInfo.${index}.placeExpedition` as const}
            label="Lugar de expedición *"
            placeholder="Ciudad de México"
            rules={{
              required: "Ingresa el lugar de expedición",
              pattern: {
                value: /^(?!\s)(?!\d)(?!.*\s$)[A-Za-zÁÉÍÓÚáéíóúñÑ0-9,.\s]+$/,
                message:
                  "Solo se permiten letras, números, comas y puntos; no debe iniciar con espacios o número ni terminar con espacio.",
              },
            }}
          />

          <InputText
            name={`schoolInfo.${index}.averageFinal` as const}
            label="Promedio final *"
            placeholder="9.0"
            inputMode="decimal"
            rules={{
              required: "Ingresa el promedio",
              setValueAs: (value: string) => value?.trim?.() ?? value,
              validate: (value: string) => {
                const trimmed = value?.trim?.() ?? "";
                if (!AVERAGE_PATTERN.test(trimmed)) {
                  return "Ingresa un promedio en formato 9.0";
                }
                const numeric = Number(trimmed);
                if (Number.isNaN(numeric) || numeric < 0 || numeric > 10) {
                  return "El promedio debe ser entre 0.0 y 10.0";
                }
                return true;
              },
            }}
          />

          <InputText
            name={`schoolInfo.${index}.certificate` as const}
            label="Folio del certificado *"
            placeholder="550E8400-E29B-41D4-A716-446655440000"
            transformUppercase
            rules={{
              required: "Ingresa el folio del certificado",
              pattern: {
                value: CERTIFICATE_PATTERN,
                message:
                  "El folio debe tener formato 8-4-4-4-12 con letras mayúsculas y números.",
              },
            }}
          />
        </div>
      </div>
      <div className="h-auto pb-7 flex flex-col gap-2">
        <InputFiles
          name={`schoolInfo.${index}.certificateFile` as const}
          label="Archivo del certificado *"
          acceptedTypes="application/pdf"
          maxSizeMB={5}
          rules={{
            required: "Sube el archivo del certificado",
            validate: (file: File | string) => {
              if (typeof file === "string" && file.length > 0) {
                return file.toLowerCase().endsWith(".pdf")
                  ? true
                  : "Solo se aceptan archivos PDF";
              }
              if (file instanceof File) {
                return file.type === "application/pdf"
                  ? true
                  : "Solo se aceptan archivos PDF";
              }
              return "Sube un archivo PDF";
            },
          }}
        />

        <InputSelect
          options={OPTIONS_TYPE_SCHOOL}
          name={`schoolInfo.${index}.typeInstitution` as const}
          label="Tipo de institución *"
        />
      </div>
    </div>
  );
};
