import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export const ScoreCircle = ({ score, size = "md", label, className }: ScoreCircleProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  const sizes = {
    sm: { radius: 35, stroke: 6, fontSize: "text-lg" },
    md: { radius: 50, stroke: 8, fontSize: "text-2xl" },
    lg: { radius: 70, stroke: 10, fontSize: "text-4xl" },
  };

  const { radius, stroke, fontSize } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "stroke-neon-green";
    if (score >= 50) return "stroke-yellow-400";
    return "stroke-destructive";
  };

  const getGlowColor = (score: number) => {
    if (score >= 75) return "var(--shadow-glow-green)";
    if (score >= 50) return "0 0 30px hsl(45 100% 50% / 0.4)";
    return "0 0 30px hsl(0 84% 60% / 0.4)";
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: radius * 2 + 40, height: radius * 2 + 40 }}>
        <svg
          className="transform -rotate-90"
          width={radius * 2 + 40}
          height={radius * 2 + 40}
        >
          {/* Background circle */}
          <circle
            cx={(radius * 2 + 40) / 2}
            cy={(radius * 2 + 40) / 2}
            r={radius}
            stroke="hsl(var(--tech-gray))"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={(radius * 2 + 40) / 2}
            cy={(radius * 2 + 40) / 2}
            r={radius}
            className={cn(getScoreColor(score), "transition-all duration-1000")}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(${getGlowColor(score)})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", fontSize, "text-foreground")}>
            {Math.round(displayScore)}
          </span>
        </div>
      </div>
      {label && (
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      )}
    </div>
  );
};
