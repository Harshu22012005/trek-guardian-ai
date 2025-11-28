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
        "rounded-xl p-6 bg-card backdrop-blur-sm",
        "border border-border/50",
        "shadow-lg",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
        glow && "animate-glow-pulse",
        className
      )}
      style={{
        boxShadow: glow
          ? "var(--shadow-neu-light), var(--shadow-glow-blue)"
          : "var(--shadow-neu-light)",
      }}
    >
      {children}
    </div>
  );
};
