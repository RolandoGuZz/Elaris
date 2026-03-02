import type {
  FieldError,
  UseFormRegister,
  FieldValues,
  Control,
} from "react-hook-form";

export interface PropsInput {
  control: Control<any>;
  rules: object;
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}
