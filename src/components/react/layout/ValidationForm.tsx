import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";
import { FaSheetPlastic } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import { SheetSchema } from "../core/validations/ValidationSheet";
import type { ISheet } from "../core/types/ISheet.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const ValidationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISheet>({
    resolver: zodResolver(SheetSchema),
  });

  const onSubmit = (data: ISheet) => {
    console.log(data);
  };

  return (
    <div className="p-8 w-full flex items-center flex-col">
      <div className="w-[50%] border border-slate-200 p-5 rounded-lg">
        <div className="mb-10 text-left w-full">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Ingrese su Folio de Ficha
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Este folio se le fue enviado por correo
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <FaSheetPlastic fontSize={21} />
              </div>

              <input
                {...register("sheet")}
                placeholder="Ej: ABC-123456"
                className={`block w-full pl-15 py-4 dark:bg-slate-800 border rounded-lg text-lg transition-all dark:text-white ${
                  errors.sheet
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                }`}
              />
            </div>

            {errors.sheet && (
              <span className="text-red-500 text-sm">
                {errors.sheet.message}
              </span>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500">
              Asegúrese de ingresar los caracteres exactamente como aparecen.
            </p>
          </div>

          <button
            type="submit"
            className=" bg-green-600 text-[#fff] p-4 font-bold gap-3 rounded-xl flex items-center"
          >
            Continuar al Siguiente paso
            <GoArrowRight fontSize={30} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-primary/5 p-4 rounded-lg">
          <FaCircleInfo fontSize={30} />
          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>¿Necesita ayuda?</strong> Si no cuenta con su folio o tiene
            problemas para ingresar, contacte al departamento de servicios
            escolares o envíe un correo a{" "}
            <strong>escolaresnova@gmail.com</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
