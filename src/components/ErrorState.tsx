import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message = 'Ocorreu um erro' }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="card-royal p-6 max-w-md text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Erro ao carregar</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
