import { Check } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Ícone do Logotipo - Clipboard com Checkmark */}
      <div className={`${sizeClasses[size]} bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 relative`}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Contorno branco do clipboard */}
          <div className="absolute inset-1 border-2 border-white rounded-md">
            {/* Clips do clipboard no topo */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-white rounded-full"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-purple-600 rounded-full"></div>
          </div>
          {/* Check mark central */}
          <Check className="w-3/5 h-3/5 text-white stroke-[3]" />
        </div>
      </div>
      
      {/* Texto do Logotipo */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold ${textSizes[size]} text-foreground`}>
            TrickTime
          </h1>
          <p className="text-xs text-muted-foreground">
            Sistema de Agendamentos
          </p>
        </div>
      )}
    </div>
  );
}
