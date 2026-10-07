"use client";

import { useState } from "react";
import { ChartGantt } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_COLOR } from "@/lib/data";
import { addDays, diffDays, md } from "@/lib/date";
import { SignalDot } from "@/components/ui";

export default function GanttPage() {
  const { state, today, me, stats } = useStore();
  const [mine, setMine] = useState(false);
  const ev = state.events.find((e) => e.id === state.activeEventId)!;
  const tasks = state.tasks.filter((t) => !mine || t.assignee === me.id);
  const allDates = tasks.map((t) => t.due).concat(ev.date, today);
  const start = addDays(allDates.reduce((a, b) => (a < b ? a : b)), -4);
  const end = addDays(ev.date, 5);
  const span = diffDays(end, start);
  const x = (iso: string) => `${(diffDays(iso, start) / span) * 100}%`;

  const rows = CATEGORIES.map((c) => {
    const ts = tasks.filter((t) => t.category === c);
    if (!ts.length) return null;
    const first = ts.reduce((a, b) => (a.due < b.due ? a : b)).due;
    const last = ts.reduce((a, b) => (a.due > b.due ? a : b)).due;
    const from = addDays(first, -4);
    const done = ts.filter((t) => t.status === "done").length / ts.length;
    return { c, from, to: last, done, stat: stats.find((s) => s.category === c)! };
  }).filter(Boolean) as { c: (typeof CATEGORIES)[number]; from: string; to: string; done: number; stat: (typeof stats)[number] }[];

  const prep = state.cal.filter((c) => c.kind === "prep");
  const ticks: string[] = [];
  for (let i = 0; i <= span; i += 7) ticks.push(addDays(start, i));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <ChartGantt color="var(--cal)" /> ガントチャート
          </h1>
          <p>分野ごとのタスクの期間と進み具合。濃い部分が完了済み、赤い線が今日です。</p>
        </div>
        <div className="seg">
          <button className={!mine ? "is-on" : ""} onClick={() => setMine(false)}>
            全体
          </button>
          <button className={mine ? "is-on" : ""} onClick={() => setMine(true)}>
            自分の担当
          </button>
        </div>
      </div>
      <div className="card gantt">
        <div className="gantt-grid">
          <div />
          <div className="gantt-axis">
            {ticks.filter((t) => Math.abs(diffDays(t, today)) > 2).map((t) => (
              <span key={t} style={{ left: x(t) }}>
                {md(t)}
              </span>
            ))}
            <span style={{ left: x(today), color: "var(--red)", fontWeight: 800 }}>今日</span>
          </div>
          {rows.map((r) => (
            <div key={r.c} style={{ display: "contents" }}>
              <div className="gantt-label">
                <SignalDot s={r.stat.signal} /> {r.c}
              </div>
              <div className="gantt-track">
                <div className="gantt-today" style={{ left: x(today) }} />
                <div
                  className="gantt-bar"
                  style={{ left: x(r.from), width: `calc(${x(r.to)} - ${x(r.from)} + 6px)`, background: CATEGORY_COLOR[r.c] }}
                  title={`${r.c}：${md(r.from)}〜${md(r.to)}（完了 ${Math.round(r.done * 100)}%）`}
                >
                  <span className="done" style={{ width: `${r.done * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
          {!mine && (
            <>
              <div className="gantt-label">当日準備</div>
              <div className="gantt-track">
                <div className="gantt-today" style={{ left: x(today) }} />
                {prep.length > 0 && (
                  <div
                    className="gantt-bar"
                    style={{ left: x(prep[0].date), width: `calc(${x(ev.date)} - ${x(prep[0].date)})`, background: "#8a99ad" }}
                  />
                )}
              </div>
              <div className="gantt-label">イベント開催</div>
              <div className="gantt-track">
                <div className="gantt-today" style={{ left: x(today) }} />
                <span className="gantt-star" style={{ left: x(ev.date) }} aria-label={`開催日 ${md(ev.date)}`}>
                  ★
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
