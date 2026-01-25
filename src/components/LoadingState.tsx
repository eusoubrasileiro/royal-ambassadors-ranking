import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Carregando...' }: LoadingStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
