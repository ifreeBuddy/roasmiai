# RoasmiAI — Agent Guidelines & Architecture

RoasmiAI is a focused, minimal, production-grade mobile application built with React Native and Expo (SDK 57) that provides brutally honest, constructive AI criticism for user ideas.

## Project Overview

- **Concept**: A user describes an idea (startup, product, feature, hardware, project), taps "Roast it", and receives 3–4 punchy, substantive, constructive critique points highlighting what's weak, what's missing, and how to fix it.
- **Design Philosophy**: Strict single-screen MVP. Top section displays the AI roast reply; bottom section hosts the idea input and roast trigger. Toggleable Obsidian Dark (`#0D0E13`) and Crisp Light themes with fiery roast ember accents (`#FF5A26`).
- **AI Engine**: Pure client-to-API Google Gemini integration reading `EXPO_PUBLIC_GEMINI_API_KEY` from `.env`.
- **Model Fallback**: Automatically cascades across `gemini-flash-latest`, `gemini-3.8-flash`, `gemini-3.5-flash`, and `gemini-flash-lite-latest` to gracefully handle free-tier 503 load spikes or 429 rate limits.
- **Resilience**: The parser never crashes on malformed LLM responses; it falls back cleanly to formatted raw text if parsing structured bullet tokens fails.

---

## Architecture & Code Guidelines

### Navigation & Routing
- Use **Expo Router** with **folder-based routes** (not flat file-based routes).
- The main interface resides at `src/app/(roast)/index.tsx`.
- `src/app/_layout.tsx` defines the root navigation container, `AppThemeProvider`, and reactive `StatusBar`.
- Keep all non-route logic (components, hooks, services, constants, context, types) outside `src/app/`.

### Directory Structure
```
src/
├── app/                  # Routes only (folder-based)
│   ├── _layout.tsx       # Root layout with ThemeProvider
│   └── (roast)/
│       └── index.tsx     # Main single-screen roast interface (top output, bottom input)
├── components/           # Reusable UI components
│   ├── idea-input.tsx    # Multiline input, starter chips, roast button
│   ├── roast-header.tsx  # Header with flame emblem and theme switch button
│   ├── roast-output.tsx  # 3-4 bulleted critique cards with copy & error handling
│   ├── roast-placeholder.tsx # Welcome card shown when empty
│   ├── themed-text.tsx   # Themed typography
│   └── themed-view.tsx   # Themed surface
├── constants/            # Theme, color tokens, typography, spacing
├── context/              # AppThemeProvider for dynamic theme toggling
├── hooks/                # useTheme hook
├── services/             # Gemini API client with automated model fallback
└── types/                # TypeScript type definitions and declarations
```

### Scope Boundaries (Strict MVP)
- Maintain the single-screen architecture.
- Do NOT add: multi-screen navigation tabs, complex idea history databases, social feeds, user auth, or gamification/scoring systems.
- Every change should uphold the sleek, fast, single-screen roast experience.

---

## Expo Development Standards

Expo ships breaking changes across SDK releases. Before writing code that touches Expo or React Native APIs:
1. Verify the `expo` major version in `package.json` (currently **SDK 57**).
2. Fetch versioned documentation at `https://docs.expo.dev/versions/v57.0.0/`.
3. Reference `https://docs.expo.dev/llms.txt` for the latest API conventions.

### Commands

```bash
npx expo install <package>  # ALWAYS use to install SDK-compatible dependencies
npx expo start              # Start the Metro development server
npm run lint                # Lint with ESLint (0 errors required)
npm run typecheck           # Typecheck TypeScript (0 errors required)
npx expo-doctor             # Diagnose dependency and config issues
```

### Verification Requirement
Before completing any task, ensure that:
1. `npm run typecheck` exits with **0 errors**.
2. `npm run lint` exits with **0 errors**.
