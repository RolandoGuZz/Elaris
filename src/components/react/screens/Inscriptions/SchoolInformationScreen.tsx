import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
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
  const { control } = useFormContext<FormInscriptionSchemaType>();
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
            <div className="w-full px-20 flex flex-col gap-6  pb-12items-center">
              <h1 className="w-full p-0 text-left text-3xl font-bold">
                {level.label}
              </h1>
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
                  />

                  <InputText
                    name={`schoolInfo.${index}.placeExpedition` as const}
                    label="Lugar de expedición *"
                    placeholder="Ciudad de México"
                  />

                  <InputText
                    name={`schoolInfo.${index}.averageFinal` as const}
                    label="Promedio final *"
                    placeholder="9.5"
                    type="number"
                  />

                  <InputText
                    name={`schoolInfo.${index}.certificate` as const}
                    label="Folio del certificado *"
                    placeholder="ABC123456"
                  />
                </div>
              </div>
              <div className="h-auto pb-7 flex flex-col gap-2">
                <InputFiles
                  name={`schoolInfo.${index}.certificateFile` as const}
                  label="Archivo del certificado *"
                  acceptedTypes=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={5}
                />

                <InputSelect
                  options={OPTIONS_TYPE_SCHOOL}
                  name={`schoolInfo.${index}.typeInstitution` as const}
                  label="Tipo de institución *"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
