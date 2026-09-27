import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  dark: {
    text: '#F5F6FA',
    textSecondary: '#9CA0B0',
    textMuted: '#636779',
    background: '#0D0E13',
    backgroundElement: '#161822',
    backgroundSelected: '#232636',
    card: '#161822',
    cardBorder: '#272A3B',
    inputBackground: '#12131C',
    inputBorder: '#252838',
    inputBorderFocused: '#FF5A26',
    primary: '#FF5A26',
    primaryHover: '#FF7043',
    primaryGlow: 'rgba(255, 90, 38, 0.25)',
    primarySurface: 'rgba(255, 90, 38, 0.12)',
    error: '#FF4D4D',
    errorSurface: 'rgba(255, 77, 77, 0.12)',
    success: '#10B981',
    flame: '#FF8A00',
  },
  light: {
    text: '#111318',
    textSecondary: '#5A6072',
    textMuted: '#8E94A5',
    background: '#F7F8FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E9ECF2',
    card: '#FFFFFF',
    cardBorder: '#E2E5EC',
    inputBackground: '#F0F2F6',
    inputBorder: '#D8DDE6',
    inputBorderFocused: '#E64A19',
    primary: '#E64A19',
    primaryHover: '#D84315',
    primaryGlow: 'rgba(230, 74, 25, 0.2)',
    primarySurface: 'rgba(230, 74, 25, 0.08)',
    error: '#DC2626',
    errorSurface: 'rgba(220, 38, 38, 0.08)',
    success: '#059669',
    flame: '#F57C00',
  },
} as const;

export type ThemeColor = keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
} as const;

export const MaxContentWidth = 640;
