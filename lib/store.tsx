"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toISO, diffDays } from "./date";
import {
  CATEGORIES,
  DEFAULT_WIDGETS,
  STATE_VERSION,
  seed,
  type AppState,
  type Category,
  type Member,
  type Notice,
  type Role,
  type Task,
  type WidgetKey,
} from "./data";

const KEY = "event-portal-state";

export type Signal = "green" | "yellow" | "red";
export interface CategoryStat {
  category: Category;
  total: number;
  done: number;
  pct: number;
  signal: Signal;
}

interface Store {
  state: AppState;
  today: string;
  me: Member;
  member: (id: string) => Member | undefined;
  update: (fn: (s: AppState) => AppState) => void;
  toggleTask: (id: string) => void;
  patchTask: (id: string, patch: Partial<Task>) => void;
  addTask: (t: Omit<Task, "id">) => void;
  addNotice: (n: Omit<Notice, "id" | "date" | "time" | "acks">) => void;
  ackNotice: (id: string) => void;
  setRole: (r: Role) => void;
  toggleWidget: (k: WidgetKey) => void;
  resetWidgets: () => void;
  reset: () => void;
  stats: CategoryStat[];
  overall: number;
  daysLeft: number;
  canEdit: boolean;
}

const Ctx = createContext<Store | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function computeStats(tasks: Task[], today: string): CategoryStat[] {
  return CATEGORIES.map((category) => {
    const ts = tasks.filter((t) => t.category === category);
    const done = ts.filter((t) => t.status === "done").length;
    const open = ts.filter((t) => t.status !== "done");
    const overdue = open.some((t) => diffDays(t.due, today) < 0);
    const soon = open.some((t) => diffDays(t.due, today) <= 3);
    return {
      category,
      total: ts.length,
      done,
      pct: ts.length ? Math.round((done * 100) / ts.length) : 100,
      signal: overdue ? "red" : soon ? "yellow" : "green",
    };
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const t = toISO(new Date());
    let s: AppState | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed.version === STATE_VERSION) s = parsed;
      }
    } catch {
      /* storage unavailable */
    }
    setToday(t);
    setState(s ?? seed(t));
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((s) => (s ? fn(s) : s));
  }, []);

  const value = useMemo<Store | null>(() => {
    if (!state || !today) return null;
    const member = (id: string) => state.members.find((m) => m.id === id);
    const stats = computeStats(state.tasks, today);
    const done = state.tasks.filter((t) => t.status === "done").length;
    const active = state.events.find((e) => e.id === state.activeEventId) ?? state.events[0];
    return {
      state,
      today,
      me: member(state.meId)!,
      member,
      update,
      toggleTask: (id) =>
        update((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t)),
        })),
      patchTask: (id, patch) =>
        update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      addTask: (t) => update((s) => ({ ...s, tasks: [{ ...t, id: uid() }, ...s.tasks] })),
      addNotice: (n) =>
        update((s) => ({
          ...s,
          notices: [{ ...n, id: uid(), date: today, time: nowTime(), acks: [] }, ...s.notices],
        })),
      ackNotice: (id) =>
        update((s) => ({
          ...s,
          notices: s.notices.map((n) =>
            n.id === id
              ? { ...n, acks: n.acks.includes(s.meId) ? n.acks.filter((a) => a !== s.meId) : [...n.acks, s.meId] }
              : n,
          ),
        })),
      setRole: (r) =>
        update((s) => ({ ...s, role: r, meId: r === "local" ? "takahashi" : r === "student" ? "tanaka" : "me" })),
      toggleWidget: (k) =>
        update((s) => {
          const cur = s.widgets[s.role];
          const next = cur.includes(k) ? cur.filter((w) => w !== k) : [...cur, k];
          return { ...s, widgets: { ...s.widgets, [s.role]: next } };
        }),
      resetWidgets: () =>
        update((s) => ({ ...s, widgets: { ...s.widgets, [s.role]: DEFAULT_WIDGETS[s.role] } })),
      reset: () => {
        const t = toISO(new Date());
        setToday(t);
        setState(seed(t));
      },
      stats,
      overall: state.tasks.length ? Math.round((done * 100) / state.tasks.length) : 0,
      daysLeft: diffDays(active.date, today),
      canEdit: state.role !== "local",
    };
  }, [state, today, update]);

  if (!value) {
    return (
      <div className="boot" aria-busy="true">
        <div className="boot-mark">🌱</div>
        <p>イベント司令室を準備しています…</p>
      </div>
    );
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}
