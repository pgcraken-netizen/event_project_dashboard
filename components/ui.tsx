"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Camera,
  ExternalLink,
  FolderOpen,
  MessagesSquare,
  Palette,
  Flame,
  Megaphone,
  Package,
  ListChecks,
  Activity,
  Pin,
  MessageCircle,
} from "lucide-react";
import type { Member, Platform } from "@/lib/data";
import type { Signal } from "@/lib/store";

export type Tone =
  | "cal"
  | "discord"
  | "canva"
  | "task"
  | "sns"
  | "drive"
  | "supply"
  | "today"
  | "status"
  | "board";

const TONE_ICON: Record<Tone, ReactNode> = {
  cal: <CalendarDays size={16} />,
  discord: <MessagesSquare size={16} />,
  canva: <Palette size={16} />,
  task: <ListChecks size={16} />,
  sns: <Megaphone size={16} />,
  drive: <FolderOpen size={16} />,
  supply: <Package size={16} />,
  today: <Flame size={16} />,
  status: <Activity size={16} />,
  board: <Pin size={16} />,
};

export function ToneMark({ tone, size = 28 }: { tone: Tone; size?: number }) {
  return (
    <span className={`tone-mark tone-${tone}`} style={{ width: size, height: size }} aria-hidden>
      {TONE_ICON[tone]}
    </span>
  );
}

export function Panel({
  tone,
  title,
  badge,
  action,
  footer,
  children,
  className = "",
  id,
}: {
  tone: Tone;
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`panel panel-${tone} ${className}`} id={id} aria-label={title}>
      <header className="panel-head">
        <ToneMark tone={tone} />
        <h2>{title}</h2>
        {badge}
        <span className="spacer" />
        {action}
      </header>
      <div className="panel-body">{children}</div>
      {footer && <footer className="panel-foot">{footer}</footer>}
    </section>
  );
}

export function OpenLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  if (external) {
    return (
      <a className="open-link" href={href} target="_blank" rel="noreferrer">
        {children}
        <ExternalLink size={13} aria-hidden />
      </a>
    );
  }
  return (
    <Link className="open-link" href={href}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

export function Avatar({ m, size = 28 }: { m?: Member; size?: number }) {
  if (!m) return null;
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.42 }}
      title={`${m.name}（${m.part}）`}
    >
      {m.name.replace(/\s/g, "").slice(0, 1)}
    </span>
  );
}

const SIGNAL_LABEL: Record<Signal, string> = { green: "順調", yellow: "注意", red: "要対応" };
export function SignalDot({ s, withLabel }: { s: Signal; withLabel?: boolean }) {
  return (
    <span className={`signal signal-${s}`}>
      <span className="signal-dot" aria-hidden />
      {withLabel ? SIGNAL_LABEL[s] : <span className="sr-only">{SIGNAL_LABEL[s]}</span>}
    </span>
  );
}

export function Bar({ pct, color }: { pct: number; color?: string }) {
  return (
    <span className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <span className="bar-fill" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}

const PLATFORM_STYLE: Record<Platform, { cls: string; glyph: ReactNode }> = {
  Instagram: { cls: "pf-ig", glyph: <Camera size={14} /> },
  X: { cls: "pf-x", glyph: <b>𝕏</b> },
  Facebook: { cls: "pf-fb", glyph: <b>f</b> },
  LINE: { cls: "pf-line", glyph: <MessageCircle size={14} /> },
};
export function PlatformMark({ p }: { p: Platform }) {
  const s = PLATFORM_STYLE[p];
  return (
    <span className={`pf ${s.cls}`} title={p} aria-label={p}>
      {s.glyph}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
