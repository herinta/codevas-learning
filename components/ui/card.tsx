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
    white: "bg-surface-container-lowest",
    lemon: "bg-[#FEF08A]",
    pink: "bg-[#ffd6ee]",
    blue: "bg-[#c8eaff]",
    purple: "bg-[#eedcff]",
  }[bgVariant];

  const shadowStyles = {
    sm: "shadow-[0_4px_0_#2e1a28]",
    md: "shadow-[0_8px_0_#2e1a28]",
    lg: "shadow-[0_12px_0_#2e1a28]",
  }[shadowSize];

  return (
    <div
      className={`rounded-2xl border-4 border-on-surface ${bgStyles} ${shadowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
