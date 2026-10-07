"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Info } from "lucide-react";
import { useStore } from "@/lib/store";
import { parseISO, toISO, WEEK_LABELS } from "@/lib/date";
import { ScheduleWidget } from "@/components/widgets";

export default function CalendarPage() {
  const { state, today } = useStore();
  const t = parseISO(today);
  const [ym, setYm] = useState({ y: t.getFullYear(), m: t.getMonth() });
  const [show, setShow] = useState({ sns: true, task: false });

  const cells = useMemo(() => {
    const first = new Date(ym.y, ym.m, 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [ym]);

  const items = (iso: string) => {
    const out: { label: string; cls: string }[] = [];
    state.cal.filter((c) => c.date === iso).forEach((c) => out.push({ label: `${c.start ?? ""} ${c.title}`, cls: `k-${c.kind}` }));
    if (show.sns) state.sns.filter((p) => p.date === iso).forEach((p) => out.push({ label: `${p.platform} ${p.title}`, cls: "k-sns" }));
    if (show.task)
      state.tasks
        .filter((x) => x.due === iso && x.status !== "done")
        .forEach((x) => out.push({ label: `□ ${x.title}`, cls: "k-task" }));
    return out;
  };

  const move = (n: number) => setYm(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <CalendarDays color="var(--cal)" /> カレンダー
          </h1>
          <p>予定の正本はGoogleカレンダー（イベント専用の共有カレンダー）。ここでは関連するSNS投稿・タスク締切と重ねて見られます。</p>
        </div>
        <a className="btn btn-ghost" href={state.resources.calendarUrl} target="_blank" rel="noreferrer">
          Googleカレンダーで開く <ExternalLink size={14} />
        </a>
      </div>

      <div className="cal-layout">
        <div>
          <div className="toolbar">
            <button className="icon-btn" onClick={() => move(-1)} aria-label="前の月">
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontSize: 18 }}>
              {ym.y}年{ym.m + 1}月
            </h2>
            <button className="icon-btn" onClick={() => move(1)} aria-label="次の月">
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-ghost small" onClick={() => setYm({ y: t.getFullYear(), m: t.getMonth() })}>
              今日
            </button>
            <span className="spacer" />
            <label className="small" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <input type="checkbox" checked={show.sns} onChange={(e) => setShow({ ...show, sns: e.target.checked })} /> SNS投稿
            </label>
            <label className="small" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <input type="checkbox" checked={show.task} onChange={(e) => setShow({ ...show, task: e.target.checked })} /> タスク締切
            </label>
          </div>
          <div className="month" role="grid" aria-label="月表示">
            {WEEK_LABELS.map((w, i) => (
              <div key={w} className={`month-hd ${i === 0 ? "sun" : i === 6 ? "sat" : ""}`} role="columnheader">
                {w}
              </div>
            ))}
            {cells.map((d) => {
              const iso = toISO(d);
              const its = items(iso);
              return (
                <div
                  key={iso}
                  role="gridcell"
                  className={`day ${d.getMonth() !== ym.m ? "out" : ""} ${iso === today ? "today" : ""} ${d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : ""}`}
                >
                  <span className="day-num">{d.getDate()}</span>
                  {its.slice(0, 3).map((x, i) => (
                    <span key={i} className={`ev ${x.cls}`} title={x.label}>
                      {x.label}
                    </span>
                  ))}
                  {its.length > 3 && <span className="tiny muted">+{its.length - 3}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <ScheduleWidget days={14} />
          <p className="callout">
            <Info size={16} style={{ flex: "none", marginTop: 2 }} />
            本番環境では Google Calendar API で予定を読み取って表示します。iframe埋め込みは、権限のない地域の方には空白になるため使いません。
          </p>
        </div>
      </div>
    </div>
  );
}
