import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-slate-50 text-slate-500">
      <LoadingSpinner className="w-10 h-10 text-indigo-500" />
      <p className="text-lg font-medium tracking-wide animate-pulse text-slate-600">
        {message}
      </p>
    </div>
  );
};
