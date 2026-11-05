# ResQ – Frontend

Personal and community safety app built with Expo and React Native (TypeScript).
This is the complete front end: every screen, navigation, and local interactions. Data is held in local state, and all data access goes through one service layer so a real backend can be added later without touching the UI.

## Run it

```bash
npm install
npx expo install --fix     # aligns package versions with your installed Expo SDK
npx expo start             # then press i (iOS), a (Android) or scan the QR code in Expo Go
```

Useful checks:

```bash
npm run typecheck          # TypeScript
npm run lint:copy          # scans UI text for banned prototype wording, lorem ipsum and emoji
```

## Structure

```
App.tsx                     fonts, providers, navigation container
src/theme/                  colours, fonts, spacing, shadows, config flags
src/components/             reusable UI (Background, Screen, Card, Button, Input, SOSButton, MapCanvas, TabBar …)
src/navigation/             root stack + bottom tabs
src/screens/                onboarding, auth, setup, tabs, emergency, report, zones, contacts
src/state/store.tsx         global state (useReducer + context)
src/services/api.ts         the single seam to replace with real API calls
src/data/sample.ts          sample content, kept out of the UI components
```

## Connecting a backend later

Every screen calls `api` from `src/services/api.ts` (`signUp`, `verifyCode`, `logIn`, `saveContact`,
`submitReport`, `startSos`, `resolveSos`, `listZones`…). Replace `localApi` with an implementation
that calls your server. The screens do not change.

## Safety switches

`config.enableDeviceDialer` in `src/theme/index.ts` is `false`. While it is off, call buttons show an in-app call screen and
never dial a real number, including 999. Turn it on only when you are ready to test real calls.
