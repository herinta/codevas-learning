import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadowSize?: "sm" | "md" | "lg";
  bgVariant?: "white" | "lemon" | "pink" | "blue" | "purple";
}

export const Card: React.FC<CardProps> = ({
  className = "",
  shadowSize = "md",
  bgVariant = "white",
  children,
  ...props
}) => {
  const bgStyles = {
    white: "bg-white",
    lemon: "bg-[#FEF08A]",
    pink: "bg-[#ffd6ee]",
    blue: "bg-[#c8eaff]",
    purple: "bg-[#eedcff]",
  }[bgVariant];

  const shadowStyles = {
    sm: "shadow-[0_4px_0_#0f172a]",
    md: "shadow-[0_6px_0_#0f172a]",
    lg: "shadow-[0_8px_0_#0f172a]",
  }[shadowSize];

  return (
    <div
      className={`rounded-2xl border-3 sm:border-4 border-slate-900 ${bgStyles} ${shadowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
