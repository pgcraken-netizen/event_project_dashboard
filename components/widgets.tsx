"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CircleCheck,
  CircleX,
  ExternalLink,
  FileImage,
  FileSpreadsheet,
  FileText,
  Hash,
  MapPin,
  MessagesSquare,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
  CAL_KIND_LABEL,
  CATEGORIES,
  CATEGORY_COLOR,
  DISCORD_CHANNELS,
  type Category,
  type DocFile,
  type Notice,
  type SnsPost,
  type Supply,
  type Task,
} from "@/lib/data";
import { addDays, diffDays, dueLabel, md, mdw, parseISO } from "@/lib/date";
import { Avatar, Bar, Empty, OpenLink, Panel, PlatformMark, SignalDot } from "./ui";
import DesignThumb from "./DesignThumb";

/* ---------- shared bits ---------- */

export function TaskRow({ t, showAssignee }: { t: Task; showAssignee?: boolean }) {
  const { today, toggleTask, member, canEdit } = useStore();
  const n = diffDays(t.due, today);
  const done = t.status === "done";
  return (
    <li className={`task-row ${done ? "is-done" : ""}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={done}
          disabled={!canEdit}
          onChange={() => toggleTask(t.id)}
          aria-label={`${t.title}を${done ? "未完了に戻す" : "完了にする"}`}
        />
        <span className="check-box" aria-hidden>
          <Check size={13} strokeWidth={3} />
        </span>
      </label>
      <span className="task-title">{t.title}</span>
      <span className="cat-chip" style={{ ["--chip" as string]: CATEGORY_COLOR[t.category] }}>
        {t.category}
      </span>
      {showAssignee && <Avatar m={member(t.assignee)} size={22} />}
      <span className={`due ${!done && n < 0 ? "is-over" : !done && n <= 1 ? "is-soon" : ""}`}>
        {done ? md(t.due) : dueLabel(t.due, today, t.time)}
      </span>
    </li>
  );
}

export function supplyState(s: Supply): { key: "ok" | "part" | "none"; label: string } {
  if (s.have >= s.need) return { key: "ok", label: "確保済" };
  if (s.have > 0) return { key: "part", label: "一部不足" };
  return { key: "none", label: "未確保" };
}

export function SupplyBadge({ s }: { s: Supply }) {
  const st = supplyState(s);
  const Icon = st.key === "ok" ? CircleCheck : st.key === "part" ? AlertTriangle : CircleX;
  return (
    <span className={`supply-badge sb-${st.key}`}>
      <Icon size={14} aria-hidden />
      {st.label}
    </span>
  );
}

const SNS_STATUS = { draft: "下書き", scheduled: "予約済", posted: "投稿済" } as const;
export function SnsRow({ p }: { p: SnsPost }) {
  const { member, today } = useStore();
  const soon = p.status !== "posted" && diffDays(p.date, today) <= 1;
  return (
    <li className="sns-row">
      <span className={`sns-date ${soon ? "is-soon" : ""}`}>{md(p.date)}</span>
      <PlatformMark p={p.platform} />
      <span className="sns-main">
        <b>{p.title}</b>
        <small>
          {p.platform}・{p.time}・担当 {member(p.assignee)?.name}
        </small>
      </span>
      <span className={`pill pill-${p.status}`}>{SNS_STATUS[p.status]}</span>
    </li>
  );
}

const FILE_ICON = {
  pdf: { icon: FileText, cls: "fi-pdf" },
  doc: { icon: FileText, cls: "fi-doc" },
  img: { icon: FileImage, cls: "fi-img" },
  sheet: { icon: FileSpreadsheet, cls: "fi-sheet" },
};
export function DocRow({ f }: { f: DocFile }) {
  const { icon: Icon, cls } = FILE_ICON[f.type];
  const { state } = useStore();
  return (
    <li>
      <a className="doc-row" href={state.resources.driveUrl} target="_blank" rel="noreferrer">
        <span className={`file-icon ${cls}`}>
          <Icon size={16} aria-hidden />
        </span>
        <span className="doc-name">
          {f.name}
          <small>{f.folder}</small>
        </span>
        <span className="doc-date">{md(f.updated)}</span>
      </a>
    </li>
  );
}

export function NoticeItem({ n, compact, asDiv }: { n: Notice; compact?: boolean; asDiv?: boolean }) {
  const Tag = asDiv ? "div" : "li";
  const { member, me, ackNotice, state } = useStore();
  const a = member(n.author);
  const acked = n.acks.includes(me.id);
  const locals = state.members.filter((m) => m.role === "local" || m.role === "partner");
  return (
    <Tag className={`notice ${n.kind === "decision" ? "is-decision" : ""} ${compact ? "is-compact" : ""}`}>
      <Avatar m={a} size={compact ? 26 : 32} />
      <div className="notice-body">
        <p className="notice-meta">
          <b>{a?.name}</b>
          <span>
            {md(n.date)} {n.time}
          </span>
          {n.kind === "decision" && <span className="tag-decision">決定事項</span>}
        </p>
        <p className="notice-text">{n.text}</p>
        {!compact && (
          <p className="notice-foot">
            {n.source && <span>出典：{n.source}</span>}
            {n.sentTo.length > 0 && <span>→ {n.sentTo.join("・")}にも配信</span>}
            {n.kind === "decision" && (
              <span>
                地域側の確認 {n.acks.filter((x) => locals.some((l) => l.id === x)).length}/{locals.length}
              </span>
            )}
          </p>
        )}
      </div>
      {n.kind === "decision" && (
        <button className={`ack ${acked ? "is-on" : ""}`} onClick={() => ackNotice(n.id)} aria-pressed={acked}>
          <Check size={14} aria-hidden />
          {acked ? "確認済" : "確認しました"}
        </button>
      )}
    </Tag>
  );
}

/* ---------- widgets ---------- */

export function TodayWidget() {
  const { state, today, me } = useStore();
  const mine = state.tasks
    .filter((t) => t.assignee === me.id && t.status !== "done")
    .sort((a, b) => a.due.localeCompare(b.due));
  const overdue = mine.filter((t) => diffDays(t.due, today) < 0);
  const upcoming = mine.filter((t) => diffDays(t.due, today) >= 0 && diffDays(t.due, today) <= 3);
  const later = mine.filter((t) => diffDays(t.due, today) > 3).length;
  return (
    <Panel
      tone="today"
      title="今日のあなた"
      className="w-today"
      badge={<span className="count-badge">{overdue.length + upcoming.length}件</span>}
      footer={<OpenLink href="/tasks">すべてのタスクを見る</OpenLink>}
    >
      {overdue.length > 0 && (
        <div className="overdue-box" role="alert">
          <p>
            <AlertTriangle size={15} aria-hidden /> 期限超過 {overdue.length}件
          </p>
          <ul className="task-list">
            {overdue.map((t) => (
              <TaskRow key={t.id} t={t} />
            ))}
          </ul>
        </div>
      )}
      {upcoming.length > 0 ? (
        <ul className="task-list">
          {upcoming.map((t) => (
            <TaskRow key={t.id} t={t} />
          ))}
        </ul>
      ) : (
        overdue.length === 0 && <Empty>3日以内にやることはありません。おつかれさまです！</Empty>
      )}
      {later > 0 && <p className="muted small">ほかに {later}件（4日以降）</p>}
    </Panel>
  );
}

export function ScheduleWidget({ days = 7 }: { days?: number }) {
  const { state, today } = useStore();
  const until = addDays(today, days);
  const items = state.cal
    .filter((c) => c.date >= today && c.date <= until)
    .sort((a, b) => (a.date + (a.start ?? "")).localeCompare(b.date + (b.start ?? "")));
  const nextAfter = state.cal.filter((c) => c.date > until).sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <Panel
      tone="cal"
      title="これからの予定"
      className="w-schedule"
      badge={<span className="muted small">{days}日間</span>}
      action={
        <a className="mini-link" href={state.resources.calendarUrl} target="_blank" rel="noreferrer">
          開く <ExternalLink size={12} />
        </a>
      }
      footer={
        <>
          <OpenLink href="/calendar">月表示で見る</OpenLink>
          <OpenLink href={state.resources.calendarUrl} external>
            Googleカレンダー
          </OpenLink>
        </>
      }
    >
      {items.length === 0 && <Empty>この{days}日間の予定はありません</Empty>}
      <ul className="agenda">
        {items.map((c) => {
          const d = parseISO(c.date);
          const isToday = c.date === today;
          return (
            <li key={c.id} className={`agenda-item kind-${c.kind}`}>
              <span className={`agenda-day ${isToday ? "is-today" : ""}`}>
                <b>{d.getDate()}</b>
                <small>{isToday ? "今日" : mdw(c.date).slice(-3)}</small>
              </span>
              <span className="agenda-main">
                <b>{c.title}</b>
                <small>
                  {c.start}
                  {c.end ? `–${c.end}` : ""}
                  {c.place && (
                    <>
                      {" "}
                      <MapPin size={11} aria-hidden /> {c.place}
                    </>
                  )}
                </small>
                <span className="agenda-links">
                  <span className="kind-chip">{CAL_KIND_LABEL[c.kind]}</span>
                  {c.discord && (
                    <a href={state.resources.discordUrl} target="_blank" rel="noreferrer" className="ch-link">
                      #{c.discord}
                    </a>
                  )}
                  {c.doc && (
                    <Link href="/docs" className="ch-link doc">
                      資料
                    </Link>
                  )}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      {nextAfter && (
        <p className="muted small next-after">
          その後：{md(nextAfter.date)} {nextAfter.title}
        </p>
      )}
    </Panel>
  );
}

export function DiscordWidget() {
  const { state, today } = useStore();
  const ev = state.events.find((e) => e.id === state.activeEventId)!;
  const nextMeeting = state.cal
    .filter((c) => c.date >= today && c.discord)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <Panel
      tone="discord"
      title="Discord"
      className="w-discord"
      action={
        <a className="mini-link" href={state.resources.discordUrl} target="_blank" rel="noreferrer">
          開く <ExternalLink size={12} />
        </a>
      }
    >
      <div className="discord-server">
        <span className="server-icon" aria-hidden>
          <MessagesSquare size={18} />
        </span>
        <span>
          <b>{ev.name}</b>
          <small>
            <span className="online-dot" aria-hidden /> オンライン {state.resources.discordOnline}人
          </small>
        </span>
      </div>
      <ul className="channel-list">
        {DISCORD_CHANNELS.map((c) => (
          <li key={c}>
            <a href={state.resources.discordUrl} target="_blank" rel="noreferrer">
              <Hash size={15} aria-hidden />
              {c}
              {nextMeeting?.discord === c && <span className="ch-next">次の予定 {md(nextMeeting.date)}</span>}
            </a>
          </li>
        ))}
      </ul>
      <a className="btn btn-discord btn-block" href={state.resources.discordUrl} target="_blank" rel="noreferrer">
        Discordで話す <ExternalLink size={14} />
      </a>
      <p className="muted tiny">会話はDiscordで。全員に届けたい決定事項はポータルから自動投稿されます。</p>
    </Panel>
  );
}

export function CanvaWidget() {
  const { state, member, today, canEdit } = useStore();
  const active = state.designs
    .filter((d) => d.status !== "完成" && d.status !== "未着手")
    .sort((a, b) => Number(b.status === "修正中") - Number(a.status === "修正中") || (a.due ?? "9").localeCompare(b.due ?? "9"));
  const main = active[0] ?? state.designs[0];
  const rest = state.designs.filter((d) => d.id !== main.id).slice(0, 3);
  return (
    <Panel
      tone="canva"
      title="Canva 制作物"
      className="w-canva"
      action={
        <a className="mini-link" href={state.resources.canvaUrl} target="_blank" rel="noreferrer">
          開く <ExternalLink size={12} />
        </a>
      }
      footer={<OpenLink href="/production">すべての制作物を見る</OpenLink>}
    >
      <p className="sub-caption">いま制作中</p>
      <div className="design-main">
        <DesignThumb d={main} size={96} />
        <div className="design-info">
          <b>
            {main.title} <span className="ver">v{main.version}</span>
          </b>
          <small>担当：{member(main.owner)?.name}</small>
          {main.due && (
            <small className={diffDays(main.due, today) <= 2 ? "warn-text" : ""}>締切：{dueLabel(main.due, today)}</small>
          )}
          <span className={`pill ds-${main.status}`}>{main.status}</span>
        </div>
      </div>
      <div className="btn-row">
        <Link href={`/production#${main.id}`} className="btn btn-ghost">
          デザインを見る
        </Link>
        {canEdit && (
          <a href={main.url} target="_blank" rel="noreferrer" className="btn btn-canva">
            Canvaで編集 <ExternalLink size={13} />
          </a>
        )}
      </div>
      <p className="sub-caption">ほかの制作物</p>
      <ul className="thumb-strip">
        {rest.map((d) => (
          <li key={d.id}>
            <Link href={`/production#${d.id}`}>
              <DesignThumb d={d} size={54} />
              <small>{d.kind}</small>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function DriveWidget() {
  const { state } = useStore();
  const docs = [...state.docs].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5);
  return (
    <Panel
      tone="drive"
      title="Google Drive"
      className="w-drive"
      action={
        <a className="mini-link" href={state.resources.driveUrl} target="_blank" rel="noreferrer">
          開く <ExternalLink size={12} />
        </a>
      }
      footer={
        <OpenLink href={state.resources.driveUrl} external>
          フォルダを開く
        </OpenLink>
      }
    >
      <p className="sub-caption">最新の資料</p>
      <ul className="doc-list">
        {docs.map((f) => (
          <DocRow key={f.id} f={f} />
        ))}
      </ul>
    </Panel>
  );
}

export function SnsWidget() {
  const { state, today } = useStore();
  const posts = state.sns
    .filter((p) => p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  return (
    <Panel tone="sns" title="SNS投稿スケジュール" className="w-sns" footer={<OpenLink href="/sns">すべての投稿を見る</OpenLink>}>
      {posts.length === 0 && <Empty>予定している投稿はありません</Empty>}
      <ul className="sns-list">
        {posts.map((p) => (
          <SnsRow key={p.id} p={p} />
        ))}
      </ul>
    </Panel>
  );
}

export function TasksWidget() {
  const { state, me, canEdit, addTask, today } = useStore();
  const [tab, setTab] = useState<"mine" | "team">("mine");
  const [title, setTitle] = useState("");
  const open = state.tasks
    .filter((t) => t.status !== "done" && (tab === "team" || t.assignee === me.id))
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 6);
  return (
    <Panel tone="task" title="タスク" className="w-tasks" footer={<OpenLink href="/tasks">すべてのタスクを見る</OpenLink>}>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={tab === "mine"} className={tab === "mine" ? "is-on" : ""} onClick={() => setTab("mine")}>
          自分のタスク
        </button>
        <button role="tab" aria-selected={tab === "team"} className={tab === "team" ? "is-on" : ""} onClick={() => setTab("team")}>
          チームのタスク
        </button>
      </div>
      {open.length === 0 && <Empty>未完了のタスクはありません</Empty>}
      <ul className="task-list">
        {open.map((t) => (
          <TaskRow key={t.id} t={t} showAssignee={tab === "team"} />
        ))}
      </ul>
      {canEdit && (
        <form
          className="quick-add"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            addTask({ title: title.trim(), assignee: me.id, due: addDays(today, 3), category: "企画", status: "todo" });
            setTitle("");
          }}
        >
          <Plus size={15} aria-hidden />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タスクを追加（期限は3日後）" aria-label="タスク名" />
        </form>
      )}
    </Panel>
  );
}

export function SuppliesWidget() {
  const { state } = useStore();
  return (
    <Panel tone="supply" title="備品・物品" className="w-supplies" footer={<OpenLink href="/supplies">すべての備品を見る</OpenLink>}>
      <table className="supply-table">
        <thead>
          <tr>
            <th>品名</th>
            <th>必要</th>
            <th>確保</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody>
          {state.supplies.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td className="num">{s.need}</td>
              <td className="num">{s.have}</td>
              <td>
                <SupplyBadge s={s} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function StatusWidget() {
  const { stats, overall, state } = useStore();
  return (
    <Panel
      tone="status"
      title="進捗状況"
      className="w-status"
      footer={state.role !== "local" ? <OpenLink href="/gantt">ガントチャートで見る</OpenLink> : undefined}
    >
      <div className="overall">
        <span>全体（完了タスクの割合）</span>
        <b>{overall}%</b>
      </div>
      <Bar pct={overall} color="var(--brand)" />
      <ul className="stat-list">
        {stats.map((s) => (
          <li key={s.category}>
            <SignalDot s={s.signal} />
            <span className="stat-name">{s.category}</span>
            <Bar pct={s.pct} color={CATEGORY_COLOR[s.category]} />
            <span className="stat-pct">
              {s.done}/{s.total}
            </span>
          </li>
        ))}
      </ul>
      <p className="legend tiny">
        <SignalDot s="red" withLabel /> 期限超過あり　<SignalDot s="yellow" withLabel /> 3日以内に期限　<SignalDot s="green" withLabel />
      </p>
    </Panel>
  );
}

export function DecisionsWidget() {
  const { state } = useStore();
  const ds = state.notices.filter((n) => n.kind === "decision").slice(0, 3);
  return (
    <Panel tone="board" title="最近の決定事項" className="w-decisions" footer={<OpenLink href="/decisions">すべて見る</OpenLink>}>
      <ul className="notice-list">
        {ds.map((n) => (
          <NoticeItem key={n.id} n={n} compact />
        ))}
      </ul>
    </Panel>
  );
}

export function BoardWidget() {
  const { state, addNotice, canEdit, me } = useStore();
  const [filter, setFilter] = useState<"all" | "decision" | "notice">("all");
  const [text, setText] = useState("");
  const [kind, setKind] = useState<"notice" | "decision">("notice");
  const [discord, setDiscord] = useState(true);
  const [line, setLine] = useState(false);
  const list = state.notices.filter((n) => filter === "all" || n.kind === filter).slice(0, 6);
  return (
    <Panel
      tone="board"
      title="お知らせボード"
      className="w-board"
      badge={<span className="muted small">全員に届けたいことだけ。雑談はDiscordで</span>}
    >
      <div className="board-grid">
        {canEdit ? (
          <form
            className="board-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              const sentTo: ("Discord" | "LINE")[] = [];
              if (discord) sentTo.push("Discord");
              if (line) sentTo.push("LINE");
              addNotice({ author: me.id, kind, text: text.trim(), sentTo });
              setText("");
            }}
          >
            <div className="seg small" role="radiogroup" aria-label="種類">
              <button type="button" className={kind === "notice" ? "is-on" : ""} onClick={() => setKind("notice")} aria-pressed={kind === "notice"}>
                お知らせ
              </button>
              <button type="button" className={kind === "decision" ? "is-on" : ""} onClick={() => setKind("decision")} aria-pressed={kind === "decision"}>
                決定事項
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={kind === "decision" ? "例：雨天時は自治会館で開催" : "例：明日の会議は14時からです"}
              rows={3}
              aria-label="本文"
            />
            <div className="board-send">
              <label>
                <input type="checkbox" checked={discord} onChange={(e) => setDiscord(e.target.checked)} /> Discordにも投稿
              </label>
              <label>
                <input type="checkbox" checked={line} onChange={(e) => setLine(e.target.checked)} /> 地域LINEにも送る
              </label>
              <button className="btn btn-primary" type="submit" disabled={!text.trim()}>
                <Send size={14} /> 投稿
              </button>
            </div>
          </form>
        ) : (
          <div className="board-form readonly">
            <Users size={20} aria-hidden />
            <p>
              地域の方は閲覧と「確認しました」ボタンが使えます。
              <br />
              ご質問はLINEで事務局へどうぞ。
            </p>
            <a className="btn btn-line" href={state.resources.lineUrl} target="_blank" rel="noreferrer">
              LINEで連絡 <ExternalLink size={13} />
            </a>
          </div>
        )}
        <div className="board-list">
          <div className="seg small" role="tablist">
            {(["all", "decision", "notice"] as const).map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? "is-on" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? "すべて" : f === "decision" ? "決定事項" : "お知らせ"}
              </button>
            ))}
          </div>
          <ul className="notice-grid">
            {list.map((n) => (
              <NoticeItem key={n.id} n={n} compact />
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

export function CategoryFilter({ value, onChange }: { value: Category | "all"; onChange: (c: Category | "all") => void }) {
  return (
    <div className="seg wrap" role="tablist" aria-label="分野">
      {(["all", ...CATEGORIES] as const).map((c) => (
        <button key={c} role="tab" aria-selected={value === c} className={value === c ? "is-on" : ""} onClick={() => onChange(c)}>
          {c === "all" ? "すべて" : c}
        </button>
      ))}
    </div>
  );
}

