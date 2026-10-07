const DAY = 86_400_000;
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number): string {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

/** a - b in whole days */
export function diffDays(a: string, b: string): number {
  return Math.round((parseISO(a).getTime() - parseISO(b).getTime()) / DAY);
}

export function md(s: string): string {
  const d = parseISO(s);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function weekday(s: string): string {
  return WEEK[parseISO(s).getDay()];
}

export function mdw(s: string): string {
  return `${md(s)}(${weekday(s)})`;
}

export function fullDate(s: string): string {
  const d = parseISO(s);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（${weekday(s)}）`;
}

/** "今日 17:00" / "明日" / "10/14" / "2日超過" */
export function dueLabel(due: string, today: string, time?: string): string {
  const n = diffDays(due, today);
  if (n < 0) return `${-n}日超過`;
  if (n === 0) return time ? `今日 ${time}` : "今日";
  if (n === 1) return time ? `明日 ${time}` : "明日";
  return md(due);
}

export const WEEK_LABELS = WEEK;
