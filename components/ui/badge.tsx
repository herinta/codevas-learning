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
    ? "border-2 border-on-surface shadow-[0_2px_0_#2e1a28]"
    : "";

  const variantStyles = {
    pink: "bg-primary-fixed text-on-primary-fixed",
    purple: "bg-secondary-container text-on-secondary-container",
    blue: "bg-tertiary-fixed text-on-tertiary-container",
    yellow: "bg-[#FEF08A] text-[#713f12]",
    green: "bg-emerald-100 text-emerald-800 border-emerald-500",
    surface: "bg-surface-container-lowest text-on-surface",
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
