import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export type ThemeMode = 'dark' | 'light';

type ColorTheme = Record<keyof typeof Colors.dark, string>;

export interface ThemeContextValue extends ColorTheme {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [mode, setMode] = useState<ThemeMode>(
    systemScheme === 'light' ? 'light' : 'dark'
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => {
    const currentColors = Colors[mode];
    return {
      ...currentColors,
      mode,
      isDark: mode === 'dark',
      toggleTheme,
      setMode,
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      ...Colors.dark,
      mode: 'dark',
      isDark: true,
      toggleTheme: () => {},
      setMode: () => {},
    };
  }
  return context;
}
