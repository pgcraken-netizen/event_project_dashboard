"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Archive, MapPin, Plus, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { SUMMER_TEMPLATE, type EventInfo } from "@/lib/data";
import { addDays, diffDays, fullDate } from "@/lib/date";

const STATUS: Record<EventInfo["status"], string> = { active: "開催準備中", planning: "企画中", archived: "アーカイブ" };

export default function EventsPage() {
  const { state, update, today, overall, canEdit } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", date: addDays(today, 60), place: "", tpl: "summer" });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") === "1" && canEdit) setOpen(true);
  }, [canEdit]);

  const create = () => {
    if (!form.name.trim()) return;
    const template = form.tpl === "summer" ? SUMMER_TEMPLATE : form.tpl === "copy" ? state.tasks.slice(0, 10).map((t) => t.title) : [];
    const ev: EventInfo = {
      id: Math.random().toString(36).slice(2, 8),
      name: form.name.trim(),
      date: form.date,
      start: "10:00",
      end: "16:00",
      place: form.place || "未定",
      status: "planning",
      template,
    };
    update((s) => ({ ...s, events: [...s.events.slice(0, -1), ev, s.events[s.events.length - 1]] }));
    setOpen(false);
    setForm({ ...form, name: "", place: "" });
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Sparkles color="var(--brand)" /> イベント
          </h1>
          <p>開催中・企画中・過去のイベント。終わったイベントは「翌年の教科書」として残ります。</p>
        </div>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={15} /> イベントを作成
          </button>
        )}
      </div>

      <div className="page-grid">
        {state.events.map((e) => {
          const n = diffDays(e.date, today);
          return (
            <article key={e.id} id={e.id} className="card event-card">
              <span className={`pill ${e.status === "active" ? "ds-完成" : e.status === "archived" ? "ds-未着手" : "ds-作成中"}`}>
                {e.status === "archived" && <Archive size={11} style={{ verticalAlign: -1, marginRight: 3 }} />}
                {STATUS[e.status]}
              </span>
              <h3>{e.name}</h3>
              <p className="small muted">
                {fullDate(e.date)} {e.start}–{e.end}
                <br />
                <MapPin size={12} style={{ verticalAlign: -2 }} /> {e.place}
              </p>
              {e.status === "active" && (
                <p className="small" style={{ marginTop: 8 }}>
                  進捗 <b>{overall}%</b>・開催まであと <b>{n}日</b>　<Link href="/" className="open-link">ダッシュボードへ →</Link>
                </p>
              )}
              {e.status === "planning" && e.template && (
                <>
                  <p className="small" style={{ marginTop: 8 }}>
                    開催まであと {n}日・テンプレートのタスク {e.template.length}件
                  </p>
                  <ul className="template-list">
                    {e.template.slice(0, 6).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                    {e.template.length > 6 && <li className="muted">ほか {e.template.length - 6}件</li>}
                  </ul>
                </>
              )}
              {e.status === "archived" && (
                <div className="related">
                  <b>振り返り</b>
                  <p style={{ color: "var(--ink-2)", fontSize: 13 }}>{e.summary}</p>
                  <Link href="/docs" className="open-link">
                    当時の資料を見る →
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {open && (
        <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="イベントを作成" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <form
            className="modal"
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
          >
            <h2 style={{ fontSize: 18 }}>イベントを作成</h2>
            <label className="field">
              イベント名
              <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="例：○○商店街 冬のあかり祭り" />
            </label>
            <label className="field">
              開催日
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <label className="field">
              場所
              <input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="例：○○商店街" />
            </label>
            <div className="field">
              はじめ方
              <div className="choice">
                {[
                  ["summer", "夏祭りテンプレート"],
                  ["copy", "秋まつりから複製"],
                  ["blank", "空から作る"],
                ].map(([v, l]) => (
                  <label key={v}>
                    <input type="radio" name="tpl" value={v} checked={form.tpl === v} onChange={() => setForm({ ...form, tpl: v })} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                キャンセル
              </button>
              <button type="submit" className="btn btn-primary" disabled={!form.name.trim()}>
                作成
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
