import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "pink"
    | "purple"
    | "blue"
    | "yellow"
    | "green"
    | "surface";
  size?: "sm" | "md";
  bordered?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "pink",
  size = "sm",
  bordered = true,
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center gap-1.5 rounded-full font-label font-bold tracking-wide select-none";

  const sizeStyle =
    size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm";

  const borderStyle = bordered
    ? "border-2 border-slate-900 shadow-[0_2px_0_#0f172a]"
    : "";

  const variantStyles = {
    pink: "bg-[#ffd6ee] text-slate-900",
    purple: "bg-[#eedcff] text-slate-900",
    blue: "bg-[#c8eaff] text-slate-900",
    yellow: "bg-[#FEF08A] text-slate-900",
    green: "bg-emerald-100 text-emerald-950 border-emerald-500",
    surface: "bg-white text-slate-900",
  }[variant];

  return (
    <span
      className={`${base} ${sizeStyle} ${variantStyles} ${borderStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
