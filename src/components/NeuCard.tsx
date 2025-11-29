import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeuCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const NeuCard = ({ children, className, hover = false, glow = false }: NeuCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-card",
        "border border-border",
        hover && "transition-all duration-300 hover:shadow-xl",
        className
      )}
      style={{
        boxShadow: "var(--shadow-card)",
      }}
    >
      {children}
    </div>
  );
};
