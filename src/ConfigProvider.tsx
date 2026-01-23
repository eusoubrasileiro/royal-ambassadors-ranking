import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppConfig, ThemeConfig, FullConfig } from '@/types/config';

interface ConfigContextValue {
  config: FullConfig | null;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextValue>({
  config: null,
  loading: true,
  error: null
});

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FullConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Load app config and theme config in parallel
        const [appResponse, themeResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}config/app.config.json`),
          fetch(`${import.meta.env.BASE_URL}config/theme.config.json`)
        ]);

        if (!appResponse.ok || !themeResponse.ok) {
          throw new Error('Failed to load configuration');
        }

        const [appConfig, themeConfig]: [AppConfig, ThemeConfig] = await Promise.all([
          appResponse.json(),
          themeResponse.json()
        ]);

        setConfig({ app: appConfig, theme: themeConfig });

        // Apply theme CSS variables dynamically
        applyTheme(themeConfig);

        // Update document title
        document.title = appConfig.name;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading config');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Apply theme colors as CSS variables
 */
function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;

  if (theme.colors.primary) {
    root.style.setProperty('--primary', theme.colors.primary);
  }
  if (theme.colors.accent) {
    root.style.setProperty('--accent', theme.colors.accent);
  }
  if (theme.colors.background) {
    root.style.setProperty('--background', theme.colors.background);
  }
  if (theme.colors.foreground) {
    root.style.setProperty('--foreground', theme.colors.foreground);
  }
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

export function useAppConfig(): AppConfig | null {
  const { config } = useConfig();
  return config?.app ?? null;
}

export function useThemeConfig(): ThemeConfig | null {
  const { config } = useConfig();
  return config?.theme ?? null;
}
