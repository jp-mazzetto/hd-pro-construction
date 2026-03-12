import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const baseStyles =
  "cursor-pointer flex items-center justify-center gap-2 rounded-md px-6 py-4 font-black uppercase tracking-tighter transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/40",
  secondary: "bg-white text-gray-900 hover:bg-gray-100 shadow-xl",
  outline:
    "border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white",
};

/**
 * Botao reutilizavel com variantes visuais para CTAs e acoes do site.
 */
export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
