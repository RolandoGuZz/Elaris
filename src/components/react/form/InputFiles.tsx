import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
  useFormContext,
  useWatch,
  useController,
} from "react-hook-form";
import type { FieldValues, Path, RegisterOptions } from "react-hook-form";

interface PropsInputFiles<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  typeFiles?: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

type FileStatus = "idle" | "success" | "error";

export const InputFiles = <T extends FieldValues>({
  label,
  name,
  rules,
  typeFiles,
  acceptedTypes,
  maxSizeMB = 10,
}: PropsInputFiles<T>) => {
  const { control } = useFormContext<T>();
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    if (formValue instanceof File) {
      setFileStatus("success");
      setFileName(formValue.name);
      setErrorMessage("");
      return;
    }

    if (typeof formValue === "string" && formValue.length > 0) {
      setFileStatus("success");
      const parts = formValue.split("/");
      setFileName(parts[parts.length - 1]);
      setErrorMessage("");
      return;
    }

    setFileStatus("idle");
    setFileName("");
    setErrorMessage("");
  }, [formValue]);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return `Archivo muy grande (máx. ${maxSizeMB}MB)`;
    }

    if (acceptedTypes && acceptedTypes.length > 0) {
      const allowedTypes = acceptedTypes
        .split(",")
        .map((type) => type.trim().toLowerCase())
        .filter((type) => type.length > 0);

      if (allowedTypes.length > 0) {
        const extension = file.name.includes(".")
          ? `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`
          : "";
        const mimeType = file.type.toLowerCase();

        const matchesAllowedType = allowedTypes.some((type) => {
          if (type.startsWith(".")) {
            return extension === type;
          }

          if (type.endsWith("/*")) {
            const baseType = type.slice(0, -2);
            return mimeType.startsWith(`${baseType}/`);
          }

          return mimeType === type;
        });

        if (!matchesAllowedType) {
          return "El formato del archivo no es el correcto";
        }
      }
    }

    return null;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFileStatus("idle");
      setFileName("");
      setErrorMessage("");
      field.onChange(null);
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setFileStatus("error");
      setFileName(file.name);
      setErrorMessage(validationError);
      field.onChange(null);
      return;
    }

    setFileStatus("success");
    setFileName(file.name);
    setErrorMessage("");
    field.onChange(file);
  };

  const getStatusColor = () => {
    if (error || fileStatus === "error") {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    if (fileStatus === "success") {
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    }
    return "border-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600";
  };

  const getIcon = () => {
    if (fileStatus === "success") {
      return (
        <svg
          className="w-8 h-8 text-green-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }
    if (fileStatus === "error") {
      return (
        <svg
          className="w-8 h-8 text-red-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }
    return (
      <span className="material-symbols-outlined text-slate-400 mb-2">
        Subir archivo
      </span>
    );
  };

  const getStatusText = () => {
    if (fileStatus === "success" && fileName) {
      return (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          {fileName}
        </p>
      );
    }
    if (fileStatus === "error") {
      return (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage || "No se pudo cargar el archivo"}
        </p>
      );
    }
    return (
      <>
        <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          Click para subir archivo
        </p>
        <p className="text-xs text-slate-400">{typeFiles}</p>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm text-left font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="flex items-center justify-center w-full">
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
          transition-all
          ${getStatusColor()}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {getIcon()}
            {getStatusText()}
          </div>

          <input
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleFileChange}
            onBlur={field.onBlur}
            name={field.name}
          />
        </label>
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
};
