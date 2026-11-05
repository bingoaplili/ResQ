import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Contact, Journey, Report, ReportDraft, Settings, SosState, UserProfile } from '../types';
import { seedContacts, seedReports, seedUser } from '../data/sample';

export type AppState = {
  signedIn: boolean;
  user: UserProfile;
  contacts: Contact[];
  settings: Settings;
  sos: SosState;
  draft: ReportDraft;
  reports: Report[];
  journey: Journey;
  savedZones: string[];
};

export const emptyDraft: ReportDraft = {
  type: undefined, locationMode: 'current', landmark: '', description: '', timeOption: 'Just now', photoCount: 0, urgency: 'Moderate',
};

const initial: AppState = {
  signedIn: false,
  user: seedUser,
  contacts: seedContacts,
  settings: { shakeToSos: true, discreetMode: false, shareLocationOnJourney: true, priorityAlerts: true, locationAccess: false },
  sos: { status: 'idle' },
  draft: emptyDraft,
  reports: seedReports,
  journey: { status: 'idle' },
  savedZones: [],
};

export type Action =
  | { type: 'signIn' }
  | { type: 'signOut' }
  | { type: 'updateUser'; patch: Partial<UserProfile> }
  | { type: 'addContact'; contact: Contact }
  | { type: 'updateContact'; contact: Contact }
  | { type: 'removeContact'; id: string }
  | { type: 'setSettings'; patch: Partial<Settings> }
  | { type: 'startSos'; ref: string; startedAt: number }
  | { type: 'endSos' }
  | { type: 'resetSos' }
  | { type: 'patchDraft'; patch: Partial<ReportDraft> }
  | { type: 'resetDraft' }
  | { type: 'addReport'; report: Report }
  | { type: 'startJourney'; journey: Journey }
  | { type: 'extendCheckIn'; minutes: number }
  | { type: 'endJourney' }
  | { type: 'toggleZone'; id: string };

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'signIn': return { ...s, signedIn: true };
    case 'signOut': return { ...initial, reports: s.reports };
    case 'updateUser': return { ...s, user: { ...s.user, ...a.patch } };
    case 'addContact': return { ...s, contacts: [...s.contacts, a.contact] };
    case 'updateContact': return { ...s, contacts: s.contacts.map((c) => (c.id === a.contact.id ? a.contact : c)) };
    case 'removeContact': return { ...s, contacts: s.contacts.filter((c) => c.id !== a.id) };
    case 'setSettings': return { ...s, settings: { ...s.settings, ...a.patch } };
    case 'startSos': return { ...s, sos: { status: 'active', startedAt: a.startedAt, ref: a.ref } };
    case 'endSos': return { ...s, sos: { ...s.sos, status: 'resolved', endedAt: Date.now() } };
    case 'resetSos': return { ...s, sos: { status: 'idle' } };
    case 'patchDraft': return { ...s, draft: { ...s.draft, ...a.patch } };
    case 'resetDraft': return { ...s, draft: emptyDraft };
    case 'addReport': return { ...s, reports: [a.report, ...s.reports] };
    case 'startJourney': return { ...s, journey: a.journey };
    case 'extendCheckIn':
      return { ...s, journey: { ...s.journey, checkInDueAt: (s.journey.checkInDueAt ?? Date.now()) + a.minutes * 60000 } };
    case 'endJourney': return { ...s, journey: { status: 'idle' } };
    case 'toggleZone':
      return { ...s, savedZones: s.savedZones.includes(a.id) ? s.savedZones.filter((z) => z !== a.id) : [...s.savedZones, a.id] };
  }
}

const Ctx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
