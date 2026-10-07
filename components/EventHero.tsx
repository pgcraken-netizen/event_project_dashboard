"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORY_COLOR } from "@/lib/data";
import { fullDate } from "@/lib/date";
import { FestivalArt } from "./art";
import { Bar, SignalDot } from "./ui";

export default function EventHero() {
  const { state, overall, daysLeft, stats } = useStore();
  const ev = state.events.find((e) => e.id === state.activeEventId)!;
  return (
    <section className="hero" aria-label="開催中のイベント">
      <FestivalArt />
      <div className="hero-card">
        <span className="hero-tag">開催中のイベント</span>
        <h1>{ev.name}</h1>
        <p className="hero-meta">
          <span>
            <CalendarDays size={15} aria-hidden /> {fullDate(ev.date)} {ev.start}–{ev.end}
          </span>
          <span>
            <MapPin size={15} aria-hidden /> {ev.place}
          </span>
        </p>
      </div>
      <div className="hero-progress">
        <div className="hero-progress-top">
          <span>イベント進捗</span>
          <b>{overall}%</b>
        </div>
        <Bar pct={overall} color="var(--brand)" />
        <ul className="hero-signals" aria-label="分野別の状態">
          {stats.map((s) => (
            <li key={s.category} style={{ ["--chip" as string]: CATEGORY_COLOR[s.category] }}>
              <SignalDot s={s.signal} />
              {s.category}
            </li>
          ))}
        </ul>
      </div>
      <div className="hero-count">
        {daysLeft > 0 ? (
          <>
            <small>開催まであと</small>
            <b>
              {daysLeft}
              <span>日</span>
            </b>
          </>
        ) : daysLeft === 0 ? (
          <b className="today-badge">本日開催！</b>
        ) : (
          <small>開催済み</small>
        )}
      </div>
    </section>
  );
}
