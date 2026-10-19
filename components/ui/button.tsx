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
        "bg-[#EF4444] text-white border-2 border-slate-900 shadow-[0_3px_0_#991b1b] hover:bg-[#DC2626] active:translate-y-0.5 active:shadow-none cursor-pointer",
      secondary:
        "bg-[#FEF08A] text-slate-900 border-2 border-slate-900 shadow-[0_3px_0_#0f172a] hover:bg-[#fde047] active:translate-y-0.5 active:shadow-none cursor-pointer",
      outline:
        "bg-white text-slate-800 border-2 border-slate-900 shadow-[0_3px_0_#0f172a] hover:bg-slate-100 active:translate-y-0.5 active:shadow-none cursor-pointer",
      ghost:
        "bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer",
      dark:
        "bg-slate-900 text-white border-2 border-slate-900 shadow-[0_3px_0_#020617] hover:bg-slate-800 active:translate-y-0.5 active:shadow-none cursor-pointer",
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
