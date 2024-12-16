import { UseFormRegisterReturn } from "react-hook-form";

interface IInput {
  label: string;
  placeholder: string;
  error?: any;
  type?: string;
  register: UseFormRegisterReturn;
  name: string;
  defaultValue: string;
}

const Input2 = ({
  label,
  placeholder,
  error,
  type = "text",
  register,
  name,
  defaultValue,
}: IInput) => {
  return (
    <div className="w-full flex flex-col mb-5">
      <label htmlFor={name} className="text-sm font-bold text-white mb-0.5">
        {label}
      </label>
      <input
        id={name}
        className={`border px-5 bg-transparent h-12 transition-all duration-300 text-white placeholder:text-primary-500 text-base rounded ${
          error ? "border-secondary-100" : "border-primary-750"
        }`}
        placeholder={placeholder}
        type={type}
        {...register}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="text-secondary-100 transition-all duration-300 text-base mt-1 h-3">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input2;
