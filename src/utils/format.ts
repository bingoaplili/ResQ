export const pad = (n: number) => String(n).padStart(2, '0');

export const clock = (totalSeconds: number) => {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};

export const timeOfDay = (ms: number) => {
  const d = new Date(ms);
  const h = d.getHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(d.getMinutes())} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const firstName = (full: string) => full.trim().split(/\s+/)[0] || '';

export const initials = (full: string) =>
  full
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isPhone = (v: string) => /^[0-9+\-\s]{7,16}$/.test(v.trim());
