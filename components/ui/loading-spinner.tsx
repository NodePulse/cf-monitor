import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<SVGSVGElement> {}

export const LoadingSpinner = ({ className, ...props }: LoadingSpinnerProps) => {
  return <RefreshCw className={cn("animate-spin", className)} {...props} />;
};
