import { Contact, Report, ReportDraft } from '../types';
import { seedReports, zones } from '../data/sample';

/**
 * Single seam between the UI and data. Every screen goes through this object,
 * so a real backend can replace `localApi` without touching any component.
 */
export interface ResQApi {
  signUp(input: { name: string; phone: string; email: string }): Promise<{ ok: true }>;
  verifyCode(code: string): Promise<boolean>;
  logIn(identifier: string, password: string): Promise<boolean>;
  saveContact(contact: Omit<Contact, 'id'>): Promise<Contact>;
  submitReport(draft: ReportDraft): Promise<Report>;
  listReports(): Promise<Report[]>;
  listZones(): Promise<typeof zones>;
  startSos(): Promise<{ ref: string; startedAt: number }>;
  resolveSos(ref: string): Promise<void>;
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
let counter = 4092;

export const localApi: ResQApi = {
  async signUp() { await wait(650); return { ok: true }; },
  async verifyCode(code) { await wait(600); return /^\d{6}$/.test(code); },
  async logIn() { await wait(650); return true; },
  async saveContact(c) { await wait(250); return { ...c, id: `c-${Date.now()}` }; },
  async submitReport(d) {
    await wait(900);
    counter += 1;
    return {
      id: `r-${Date.now()}`, ref: `RQ-REP-${counter}`, type: d.type ?? 'other', landmark: d.landmark,
      description: d.description, urgency: d.urgency, createdAt: Date.now(), status: 'Pending review', own: true,
    };
  },
  async listReports() { await wait(150); return seedReports; },
  async listZones() { await wait(150); return zones; },
  async startSos() { await wait(100); return { ref: `RQ-SOS-${8800 + (counter % 100)}`, startedAt: Date.now() }; },
  async resolveSos() { await wait(200); },
};

export const api: ResQApi = localApi;
