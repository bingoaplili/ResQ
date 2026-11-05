import { Contact, HelpZone, IncidentTypeId, Report, UserProfile } from '../types';
import { IconName } from '../components/Icon';
import { BadgeTone } from '../components/IconBadge';

export const seedUser: UserProfile = {
  name: '',
  phone: '',
  email: '',
  identityMode: 'anonymous',
  anonymousId: 'Commuter #4092',
};

export const seedContacts: Contact[] = [];

export const phoneBook: Omit<Contact, 'id' | 'role' | 'verified'>[] = [
  { name: 'Rahim Siddique', relation: 'Father', phone: '+880 1819-234567' },
  { name: 'Farhana Islam', relation: 'Sister', phone: '+880 1912-987654' },
  { name: 'Nusrat Jahan', relation: 'Roommate', phone: '+880 1711-448820' },
  { name: 'Tanvir Ahmed', relation: 'Friend', phone: '+880 1601-552390' },
];

export const incidentTypes: { id: IncidentTypeId; title: string; text: string; icon: IconName }[] = [
  { id: 'harassment', title: 'Harassment / Threat', text: 'Verbal harassment, stalking, intimidation', icon: 'shield' },
  { id: 'suspicious', title: 'Suspicious Activity', text: 'Unusual loitering, scouting, suspicious vehicles', icon: 'eye' },
  { id: 'unsafe', title: 'Unsafe Area', text: 'Poor lighting, broken street lights, isolated paths', icon: 'moon' },
  { id: 'accident', title: 'Accident', text: 'Traffic collision, pedestrian incident, trip hazard', icon: 'alert-octagon' },
  { id: 'theft', title: 'Theft', text: 'Pickpocketing, snatching, personal property loss', icon: 'lock' },
  { id: 'road', title: 'Road Safety Issue', text: 'Damaged road, open manhole, reckless driving', icon: 'alert-triangle' },
  { id: 'other', title: 'Other', text: 'General community safety concern', icon: 'more-horizontal' },
];

export const incidentLabel = (id?: IncidentTypeId) => incidentTypes.find((t) => t.id === id)?.title ?? 'Incident';

export const vicinityPoints = ['Bridge 2 Promenade', 'Sector 4 Playground', 'Lake Road Crossing', 'Satmasjid Road Gate'];

export const timeOptions = ['Just now', 'Today, about 30 mins ago', 'Today, earlier', 'Yesterday'];

export const communityAlerts: { id: string; title: string; place: string; when: string; distance: string; icon: IconName; tone: BadgeTone }[] = [
  { id: 'a1', title: 'Street lights out on walkway', place: 'Dhanmondi Lake, Bridge 2', when: '18 min ago', distance: '0.4 km', icon: 'moon', tone: 'horizon' },
  { id: 'a2', title: 'Suspicious vehicle reported', place: 'Road 7A, Dhanmondi', when: '1 hr ago', distance: '0.9 km', icon: 'eye', tone: 'pink' },
  { id: 'a3', title: 'Open manhole near crossing', place: 'Satmasjid Road', when: '3 hrs ago', distance: '1.6 km', icon: 'alert-triangle', tone: 'ivory' },
];

export const seedReports: Report[] = [
  {
    id: 'r-seed-1', ref: 'RQ-REP-3871', type: 'unsafe', landmark: 'Lake Road Crossing',
    description: 'Two streetlights have been out for a week near the crossing.',
    urgency: 'Moderate', createdAt: Date.now() - 1000 * 60 * 60 * 26, status: 'Live', own: false,
  },
  {
    id: 'r-seed-2', ref: 'RQ-REP-3902', type: 'road', landmark: 'Satmasjid Road',
    description: 'Open manhole cover on the left lane, no markers.',
    urgency: 'High', createdAt: Date.now() - 1000 * 60 * 60 * 3, status: 'Live', own: false,
  },
];

export const responders = [
  { id: 'rs1', name: 'Arif Rahman', tag: 'ResQ Pro', eta: 4, distance: '450 m northeast', icon: 'message-square' as IconName },
  { id: 'rs2', name: 'Community Safe Haven', tag: 'Verified', eta: 7, distance: '600 m away', icon: 'user' as IconName },
];

export const journeyRoutes = [
  { id: 'lit' as const, title: 'Lit corridor', mins: 14, km: 1.2, text: 'Well-lit streets, 3 help points on the way', icon: 'sun' as IconName, tone: 'safe' as const,
    path: [{ x: 18, y: 70 }, { x: 30, y: 52 }, { x: 46, y: 46 }, { x: 62, y: 36 }, { x: 80, y: 24 }] },
  { id: 'fast' as const, title: 'Fastest route', mins: 9, km: 0.9, text: 'Shorter, two unlit stretches near the lake', icon: 'zap' as IconName, tone: 'warn' as const,
    path: [{ x: 18, y: 70 }, { x: 40, y: 64 }, { x: 58, y: 48 }, { x: 80, y: 24 }] },
];

export const zones: HelpZone[] = [
  {
    id: 'z1', name: 'Dhanmondi Model Police Station', kind: 'police', label: 'Police Desk', distanceKm: 1.2,
    address: 'House 24, Road 7A, Dhanmondi, Dhaka 1209', open: 'Open 24/7', phone: '02-9664411', x: 34, y: 34,
    highlights: ['Armed security desk', 'Under 3 min response'], walkMins: 14, driveMins: 4,
    services: [
      { title: '24/7 Walk-in Desk', text: 'Immediate triage and a safe place to wait', icon: 'headphones' },
      { title: 'Women & Vulnerable Citizens Desk', text: 'Dedicated female officer on every shift', icon: 'users' },
      { title: 'Patrol Units', text: 'Three mobile units on active duty', icon: 'truck' },
      { title: 'Safe Waiting Lobby', text: 'Climate-controlled, staffed indoor space', icon: 'coffee' },
    ],
    safeguards: ['Perimeter lighting', 'CCTV coverage', 'Secure hotline'],
  },
  {
    id: 'z2', name: 'Ibn Sina Medical Center & ER', kind: 'hospital', label: 'Hospital ER', distanceKm: 1.8,
    address: 'House 48, Road 9A, Satmasjid Road, Dhaka', open: 'Open 24 hours', phone: '02-9126071', x: 74, y: 40,
    highlights: ['Emergency trauma unit', 'Ambulance bay open'], walkMins: 22, driveMins: 7,
    services: [
      { title: 'Emergency Trauma Unit', text: 'Doctors on duty around the clock', icon: 'activity' },
      { title: 'Ambulance Bay', text: 'Ambulances ready for dispatch', icon: 'truck' },
      { title: 'Triage Desk', text: 'Fast assessment on arrival', icon: 'clipboard' },
    ],
    safeguards: ['Guarded entrance', 'Active CCTV', 'Well-lit forecourt'],
  },
  {
    id: 'z3', name: 'City Care Safe Haven Pharmacy', kind: 'safe', label: 'Verified Safe Place', distanceKm: 0.7,
    address: 'Plot 12, Mirpur Road, Kalabagan', open: 'Open until 2:00 AM', phone: '01711-556622', x: 54, y: 62,
    highlights: ['Well-lit interior', 'Guard on duty until 2 AM'], walkMins: 9, driveMins: 3,
    services: [
      { title: 'Refuge Point', text: 'Staff trained to call for help and wait with you', icon: 'home' },
      { title: 'Phone Charging', text: 'Free charging while you wait', icon: 'battery-charging' },
      { title: 'First Aid', text: 'Basic first aid kit on site', icon: 'plus-square' },
    ],
    safeguards: ['Well-lit interior', 'CCTV monitored', 'Guard on duty'],
  },
  {
    id: 'z4', name: 'Lake View Safe Café', kind: 'safe', label: 'Verified Safe Place', distanceKm: 0.5,
    address: 'Road 8, Dhanmondi Lake, Dhaka', open: 'Open until midnight', phone: '01811-902233', x: 20, y: 56,
    highlights: ['Staffed late', 'Visible from the walkway'], walkMins: 6, driveMins: 2,
    services: [
      { title: 'Refuge Point', text: 'A calm place to wait for a ride or a friend', icon: 'coffee' },
      { title: 'Phone Charging', text: 'Free charging while you wait', icon: 'battery-charging' },
    ],
    safeguards: ['Well-lit entrance', 'Staff on duty'],
  },
  {
    id: 'z5', name: 'Square Hospital Emergency', kind: 'hospital', label: 'Hospital ER', distanceKm: 2.3,
    address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, Panthapath', open: 'Open 24 hours', phone: '02-8159457', x: 82, y: 68,
    highlights: ['Level 1 emergency', 'Fastest transit 4 min'], walkMins: 30, driveMins: 4,
    services: [
      { title: 'Emergency Department', text: 'Round-the-clock critical care', icon: 'activity' },
      { title: 'Ambulance Service', text: 'Rapid response vehicles', icon: 'truck' },
    ],
    safeguards: ['Guarded entrance', 'CCTV coverage'],
  },
];
