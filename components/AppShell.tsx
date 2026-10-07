"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  ChartGantt,
  ChevronDown,
  FileText,
  House,
  ListChecks,
  Megaphone,
  Menu,
  Package,
  Palette,
  Pin,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
  Archive,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ROLE_LABEL, type Role } from "@/lib/data";
import { diffDays, md } from "@/lib/date";
import { Avatar } from "./ui";
import { Sprout, TownArt } from "./art";

const NAV = [
  { href: "/", label: "ホーム", icon: House },
  { href: "/events", label: "イベント", icon: Sparkles },
  { href: "/tasks", label: "タスク", icon: ListChecks },
  { href: "/calendar", label: "カレンダー", icon: CalendarDays },
  { href: "/production", label: "制作物", icon: Palette },
  { href: "/sns", label: "SNS", icon: Megaphone },
  { href: "/supplies", label: "備品・物品", icon: Package },
  { href: "/docs", label: "資料・ドキュメント", icon: FileText },
  { href: "/decisions", label: "決定事項", icon: Pin },
  { href: "/gantt", label: "ガントチャート", icon: ChartGantt },
  { href: "/members", label: "メンバー", icon: Users },
  { href: "/settings", label: "設定・連携", icon: Settings },
];

const TABS = [
  { href: "/", label: "ホーム", icon: House },
  { href: "/calendar", label: "予定", icon: CalendarDays },
  { href: "/tasks", label: "タスク", icon: ListChecks },
  { href: "/production", label: "制作", icon: Palette },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const { state } = useStore();
  const hidden: Record<Role, string[]> = {
    leader: [],
    student: [],
    local: ["/gantt", "/supplies", "/settings"],
  };
  return (
    <>
      <nav className="side-nav" aria-label="メインメニュー">
        {NAV.filter((n) => !hidden[state.role].includes(n.href)).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`side-link ${isActive(path, href) ? "is-active" : ""}`}
            onClick={onNavigate}
            aria-current={isActive(path, href) ? "page" : undefined}
          >
            <Icon size={18} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
      <div className="side-events">
        <p className="side-caption">すべてのイベント</p>
        {state.events.map((e) => (
          <Link
            key={e.id}
            href={e.id === state.activeEventId ? "/" : `/events#${e.id}`}
            className={`side-event ${e.id === state.activeEventId ? "is-active" : ""}`}
            onClick={onNavigate}
          >
            <span className={`side-event-dot st-${e.status}`} aria-hidden>
              {e.status === "archived" ? <Archive size={12} /> : null}
            </span>
            <span className="side-event-name">{e.name}</span>
          </Link>
        ))}
        {state.role !== "local" && (
          <Link href="/events?new=1" className="side-event add" onClick={onNavigate}>
            <Plus size={14} aria-hidden /> イベントを作成
          </Link>
        )}
      </div>
      <div className="side-art">
        <p className="hand">つながる、ひろがる<br />地域の輪</p>
        <TownArt />
      </div>
    </>
  );
}

function SearchBox() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    const k = q.trim();
    if (!k) return [];
    const out: { label: string; sub: string; href: string }[] = [];
    state.tasks.filter((t) => t.title.includes(k)).forEach((t) => out.push({ label: t.title, sub: `タスク・${md(t.due)}`, href: "/tasks" }));
    state.cal.filter((c) => c.title.includes(k)).forEach((c) => out.push({ label: c.title, sub: `予定・${md(c.date)}`, href: "/calendar" }));
    state.designs.filter((d) => d.title.includes(k) || d.kind.includes(k)).forEach((d) => out.push({ label: d.title, sub: `制作物・v${d.version}`, href: "/production" }));
    state.docs.filter((d) => d.name.includes(k)).forEach((d) => out.push({ label: d.name, sub: `資料・${d.folder}`, href: "/docs" }));
    state.members.filter((m) => m.name.includes(k) || m.org.includes(k)).forEach((m) => out.push({ label: m.name, sub: `メンバー・${m.org}`, href: "/members" }));
    state.notices.filter((n) => n.text.includes(k)).forEach((n) => out.push({ label: n.text, sub: n.kind === "decision" ? "決定事項" : "お知らせ", href: "/decisions" }));
    return out.slice(0, 8);
  }, [q, state]);

  return (
    <div className="search" onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <Search size={16} aria-hidden />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="イベント・タスク・メンバーを検索…"
        aria-label="検索"
      />
      {open && q && (
        <div className="popover search-results" role="listbox">
          {results.length === 0 && <p className="empty">「{q}」は見つかりませんでした</p>}
          {results.map((r, i) => (
            <Link key={i} href={r.href} className="pop-item" onClick={() => setQ("")}>
              <span>{r.label}</span>
              <small>{r.sub}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Bell_() {
  const { state, today, me } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const overdue = state.tasks.filter((t) => t.assignee === me.id && t.status !== "done" && diffDays(t.due, today) < 0);
  const fresh = state.notices.filter((n) => diffDays(today, n.date) <= 2 && !n.acks.includes(me.id)).slice(0, 4);
  const count = overdue.length + fresh.length;
  return (
    <div className="bell" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label={`通知 ${count}件`}>
        <Bell size={19} />
        {count > 0 && <span className="bell-badge">{count}</span>}
      </button>
      {open && (
        <div className="popover bell-pop">
          <p className="pop-title">通知</p>
          {overdue.map((t) => (
            <Link key={t.id} href="/tasks" className="pop-item warn" onClick={() => setOpen(false)}>
              <span>期限超過：{t.title}</span>
              <small>{md(t.due)} まで</small>
            </Link>
          ))}
          {fresh.map((n) => (
            <Link key={n.id} href="/decisions" className="pop-item" onClick={() => setOpen(false)}>
              <span>{n.text}</span>
              <small>
                {n.kind === "decision" ? "決定事項" : "お知らせ"}・{md(n.date)} {n.time}
              </small>
            </Link>
          ))}
          {count === 0 && <p className="empty">新しい通知はありません</p>}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { me, state, setRole } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="user" ref={ref}>
      <button className="user-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <Avatar m={me} size={34} />
        <span className="user-text">
          <b>{me.name}</b>
          <small>{ROLE_LABEL[state.role]}</small>
        </span>
        <ChevronDown size={16} aria-hidden />
      </button>
      {open && (
        <div className="popover user-pop" role="menu">
          <p className="pop-title">表示モードを切り替え（デモ）</p>
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <button
              key={r}
              role="menuitemradio"
              aria-checked={state.role === r}
              className={`pop-item role-item ${state.role === r ? "is-on" : ""}`}
              onClick={() => {
                setRole(r);
                setOpen(false);
              }}
            >
              <span>{ROLE_LABEL[r]}</span>
              <small>
                {r === "leader" && "全体を管理。すべて編集できます"}
                {r === "student" && "自分のタスク中心の表示"}
                {r === "local" && "閲覧と「確認しました」のみ"}
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [path]);

  return (
    <div className="shell">
      <header className="topbar">
        <button className="icon-btn only-mobile" onClick={() => setDrawer(true)} aria-label="メニューを開く">
          <Menu size={20} />
        </button>
        <Link href="/" className="brand">
          <Sprout />
          <span>
            <b>地域イベント共創ポータル</b>
            <small>地域イベントを、ひとつの場所から。</small>
          </span>
        </Link>
        <SearchBox />
        <div className="top-actions">
          <Bell_ />
          <UserMenu />
        </div>
      </header>

      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {drawer && (
        <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="メニュー">
          <button className="drawer-scrim" onClick={() => setDrawer(false)} aria-label="閉じる" />
          <div className="drawer">
            <button className="icon-btn drawer-close" onClick={() => setDrawer(false)} aria-label="閉じる">
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <main className="main">{children}</main>

      <nav className="tabbar" aria-label="下部メニュー">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(path, href) ? "is-active" : ""}>
            <Icon size={20} aria-hidden />
            <span>{label}</span>
          </Link>
        ))}
        <button onClick={() => setDrawer(true)}>
          <Menu size={20} aria-hidden />
          <span>その他</span>
        </button>
      </nav>
    </div>
  );
}
