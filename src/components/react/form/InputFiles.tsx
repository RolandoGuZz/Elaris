import { useController, type Control } from "react-hook-form";

interface PropsInputFiles {
  control: Control<any>;
  name: string;
  placeholder?: string;
  rules?: object;
  label: string;
}

export const InputFiles = ({ control,label,name,placeholder,rules }: PropsInputFiles) => {
  const {field,
    fieldState:(invalid,isTouched,isDirty),
    formState:(touchFields,dirtyFields)} = useController({
    name,
    control,
    rules
  })

  return <div>
    <label>{label}</label>
  </div>;
};
