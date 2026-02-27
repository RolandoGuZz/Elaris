import { Control } from "react-hook-form";
interface PropsInputText {
  control: Control<any>;
  rules: Object<any>;
  name: string;
}

export const InputText = ({}: PropsInputText) => {
  return <div>Componente para input</div>;
};
