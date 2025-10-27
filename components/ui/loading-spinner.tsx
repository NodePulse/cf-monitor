import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoadingSpinner = ({
  className,
  ...props
}: React.HTMLAttributes<SVGSVGElement>) => {
  return <RefreshCw className={cn("animate-spin", className)} {...props} />;
};
