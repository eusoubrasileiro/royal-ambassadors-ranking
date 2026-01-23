import { Shield, Github, Star } from 'lucide-react';
import { useAppConfig } from '@/ConfigProvider';

export function Footer() {
  const config = useAppConfig();

  // Config-driven values with fallbacks
  const name = config?.name ?? 'Ranking';
  const description = config?.description ?? '';
  const organization = config?.organization ?? '';

  return (
    <footer className="py-8 px-4 bg-primary text-primary-foreground">
      <div className="container">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            {config?.logo?.src ? (
              <Shield className="w-5 h-5 text-accent" />
            ) : (
              <Star className="w-5 h-5 text-accent" />
            )}
            <span className="font-display font-semibold">{name}</span>
          </div>

          {(description || organization) && (
            <p className="text-sm text-primary-foreground/70">
              {description}{description && organization ? ' • ' : ''}{organization}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
            <Github className="w-3 h-3" />
            <span>Ranking alimentado por arquivo JSON no GitHub</span>
          </div>

          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} — Site Publico
          </p>
        </div>
      </div>
    </footer>
  );
}
