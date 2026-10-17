import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      pill = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-label font-bold transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none select-none";

    const shape = pill ? "rounded-full" : "rounded-xl";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    }[size];

    const variantStyles = {
      primary:
        "bg-primary text-white border-2 border-on-surface candy-btn-shadow hover:scale-[1.02] active:scale-95",
      secondary:
        "bg-secondary text-white border-2 border-on-surface candy-btn-shadow hover:scale-[1.02] active:scale-95",
      outline:
        "bg-surface-container-lowest text-on-surface border-2 border-on-surface candy-btn-shadow hover:bg-surface-container",
      ghost:
        "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
      dark:
        "bg-inverse-surface text-inverse-on-surface border-2 border-on-surface neo-shadow-button hover:bg-[#1a0f17]",
    }[variant];

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${shape} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
