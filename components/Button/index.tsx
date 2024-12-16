export enum butonTypes {
  button = "button",
  submit = "submit",
  reset = "reset",
}

export enum variantTypes {
  primary = "primary",
  secondary = "secondary",
  outline = "outline",
  challenge = "challenge",
  full = "full",
}

export enum volumeTypes {
  sm = "sm",
  md = "md",
  lg = "lg",
}

interface IPNSButton {
  text: string;
  variant?: variantTypes | string;
  type?: butonTypes;
  onClick?: () => void;
  disabled?: boolean;
  px?: string;
  py?: string;
  textVol?: volumeTypes;
  isFull?: boolean;
  isW80?: boolean;
}
const Button = ({
  text,
  variant = variantTypes.primary,
  type = butonTypes.button,
  onClick,
  disabled,
  px = "px-6",
  textVol = volumeTypes.md,
  isFull,
  isW80,
  py = "py-2.5",
}: IPNSButton) => {
  return (
    <>
      <button
        disabled={disabled}
        type={type}
        className={`flex rounded justify-center hover:opacity-70 duration-500 items-center ${
          isFull && "w-full"
        } ${px} ${py} ${textVol === "sm" && "h-10 rounded-sm py-0"} ${
          variant === "primary"
            ? "bg-secondary-50 border-secondary-50"
            : variant === "secondary"
            ? "bg-secondary-150 border-secondary-150"
            : variant === "outline"
            ? "bg-transparent border border-secondary-50"
            : variant === "challenge"
            ? "bg-challenge-100 border-secondary-100"
            : variant === "full"
            ? "bg-secondary-100 border-secondary-100"
            : ""
        }`}
        onClick={onClick}
      >
        <div
          className={`text-white font-semibold ${
            textVol === "sm"
              ? "xl:text-xl text-xs font-bold"
              : textVol === "md"
              ? "xl:text-lg text-sm"
              : "text-3xl"
          }`}
        >
          {text}
        </div>
      </button>
    </>
  );
};

export default Button;
