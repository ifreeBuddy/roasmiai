# 🔥 RoasmiAI — Roast My Idea

> **Brutally honest, constructive AI-powered feedback for your ideas.**

RoasmiAI is a sleek, minimal, production-grade mobile application built with React Native and Expo (SDK 57). Describe any concept — whether it's a startup, mobile app, hardware gadget, business plan, or weekend project — tap **Roast it**, and receive 3–4 direct, sharp, constructive critique points exposing what's weak, what's missing, and how to fix it.

---

## ✨ Features

- **🎯 Laser-Focused Single Screen**: Direct, distraction-free interface with thumb-friendly bottom input and instant AI roast display on top.
- **⚡ Constructive "Smart Friend" Persona**: Direct, blunt criticism targeting market viability, fatal flaws, and blindspots without being a troll.
- **🧠 Pure Google Gemini AI Engine**:
  - Automatically cascades across resilient free-tier models: `gemini-flash-latest`, `gemini-3.8-flash`, `gemini-3.5-flash`, and `gemini-flash-lite-latest`.
  - Automated fallback handling for temporary 503 high-demand spikes or 429 rate limits.
- **🛡️ Resilient Parser**: Wrapped in fallback logic — if JSON parsing or structured bullet tokens fail, raw text is formatted gracefully so the app never crashes.
- **🎨 Obsidian Dark & Crisp Light Themes**: Fast one-tap theme toggle in the header with persistent aesthetic styling.
- **📳 Tactile Feedback**: Integrated haptics and one-tap clipboard copying for critique points.

---

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 57](https://expo.dev) (Managed Workflow)
- **Runtime**: [React Native 0.86](https://reactnative.dev) & React 19
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) with **folder-based routes** (`src/app/(roast)/index.tsx`)
- **AI Engine**: Google Gemini API via `.env` (`EXPO_PUBLIC_GEMINI_API_KEY`)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla React Native StyleSheet with custom dark/light theme tokens

---

## 🚀 Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- [Expo Go](https://expo.dev/go) or an iOS / Android simulator

### 2. Clone & Install

```bash
git clone https://github.com/your-username/roasmiai.git
cd roasmiai
npm install
```

### 3. Configure API Key

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add your Google Gemini API key (free tier available at [Google AI Studio](https://aistudio.google.com/)):

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Application

```bash
# Start Metro bundler
npx expo start

# Or launch specific targets:
npm run android    # Android emulator / connected device
npm run ios        # iOS simulator
npm run web        # Web browser preview
```

---

## 📁 Project Structure

```
roasmiai/
├── assets/
│   └── images/                     # Custom app icon, splash, adaptive, and logo assets
├── src/
│   ├── app/
│   │   ├── _layout.tsx             # Root layout with ThemeProvider and Stack
│   │   └── (roast)/
│   │       └── index.tsx           # Main single-screen folder-based route
│   ├── components/
│   │   ├── idea-input.tsx          # Bottom multiline input, chips & Roast button
│   │   ├── roast-header.tsx        # Header with custom logo and theme toggle button
│   │   ├── roast-output.tsx        # Top bulleted critique cards with copy & error handling
│   │   ├── roast-placeholder.tsx   # Welcome prompt shown before first roast
│   │   ├── themed-text.tsx         # Themed typography system
│   │   └── themed-view.tsx         # Themed surface wrapper
│   ├── constants/
│   │   └── theme.ts                # Obsidian & flame color palette, spacing, fonts
│   ├── context/
│   │   └── theme-context.tsx       # Dynamic theme switching provider & hook
│   ├── hooks/
│   │   └── use-theme.ts            # Active theme resolver
│   ├── services/
│   │   └── roast-service.ts        # Gemini API client with automated model fallback
│   └── types/
│       └── declarations.d.ts       # Asset and CSS type definitions
├── app.json                        # Expo app manifest & configuration
├── eslint.config.js                # ESLint Flat Config
├── package.json
└── tsconfig.json
```

---

## 🧪 Quality & Verification

```bash
# Run TypeScript type check
npm run typecheck

# Run Expo / ESLint checks
npm run lint
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
