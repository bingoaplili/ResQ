export type Contact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  role: 'Primary' | 'Co-responder' | 'Guardian';
  verified: boolean;
};

export type UserProfile = {
  name: string;
  phone: string;
  email: string;
  identityMode: 'firstName' | 'anonymous';
  anonymousId: string;
};

export type Settings = {
  shakeToSos: boolean;
  discreetMode: boolean;
  shareLocationOnJourney: boolean;
  priorityAlerts: boolean;
  locationAccess: boolean;
};

export type IncidentTypeId =
  | 'harassment'
  | 'suspicious'
  | 'unsafe'
  | 'accident'
  | 'theft'
  | 'road'
  | 'other';

export type Urgency = 'Low' | 'Moderate' | 'High';

export type ReportDraft = {
  type?: IncidentTypeId;
  locationMode: 'current' | 'map';
  landmark: string;
  description: string;
  timeOption: string;
  photoCount: number;
  urgency: Urgency;
};

export type Report = {
  id: string;
  ref: string;
  type: IncidentTypeId;
  landmark: string;
  description: string;
  urgency: Urgency;
  createdAt: number;
  status: 'Pending review' | 'Live';
  own: boolean;
};

export type SosState = {
  status: 'idle' | 'active' | 'resolved';
  startedAt?: number;
  endedAt?: number;
  ref?: string;
};

export type ZoneKind = 'police' | 'hospital' | 'safe';

export type HelpZone = {
  id: string;
  name: string;
  kind: ZoneKind;
  label: string;
  distanceKm: number;
  address: string;
  open: string;
  phone: string;
  x: number;
  y: number;
  highlights: string[];
  services: { title: string; text: string; icon: string }[];
  safeguards: string[];
  walkMins: number;
  driveMins: number;
};

export type Journey = {
  status: 'idle' | 'active';
  destination?: string;
  routeId?: 'lit' | 'fast';
  startedAt?: number;
  checkInDueAt?: number;
};
