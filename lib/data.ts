import { addDays } from "./date";

export type Category = "企画" | "地域連携" | "チラシ" | "LP" | "SNS" | "備品";
export const CATEGORIES: Category[] = ["企画", "地域連携", "チラシ", "LP", "SNS", "備品"];
export const CATEGORY_COLOR: Record<Category, string> = {
  企画: "var(--c-plan)",
  地域連携: "var(--c-local)",
  チラシ: "var(--c-flyer)",
  LP: "var(--c-lp)",
  SNS: "var(--c-sns)",
  備品: "var(--c-supply)",
};

export type TaskStatus = "todo" | "doing" | "review" | "done";
export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "未着手",
  doing: "作業中",
  review: "確認待ち",
  done: "完了",
};

export type Role = "leader" | "student" | "local";
export const ROLE_LABEL: Record<Role, string> = {
  leader: "リーダー・事務局",
  student: "学生メンバー",
  local: "地域の方",
};

export interface Member {
  id: string;
  name: string;
  part: string;
  org: string;
  role: Role | "partner";
  color: string;
  channel: "Discord" | "LINE" | "メール";
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  due: string;
  time?: string;
  category: Category;
  status: TaskStatus;
  related?: string;
}

export type CalKind = "meeting" | "local" | "deadline" | "prep" | "event";
export const CAL_KIND_LABEL: Record<CalKind, string> = {
  meeting: "会議",
  local: "地域調整",
  deadline: "締切",
  prep: "準備",
  event: "本番",
};

export interface CalEvent {
  id: string;
  date: string;
  start?: string;
  end?: string;
  title: string;
  place?: string;
  kind: CalKind;
  discord?: string;
  doc?: string;
}

export type Platform = "Instagram" | "X" | "Facebook" | "LINE";
export interface SnsPost {
  id: string;
  date: string;
  time: string;
  platform: Platform;
  title: string;
  assignee: string;
  status: "draft" | "scheduled" | "posted";
  design?: string;
}

export interface Supply {
  id: string;
  name: string;
  unit: string;
  need: number;
  have: number;
  owner: string;
  source: string;
}

export type DesignStatus = "未着手" | "作成中" | "修正中" | "確認待ち" | "完成";
export interface Design {
  id: string;
  kind: "チラシ" | "LP" | "SNS画像" | "説明会資料" | "ポスター";
  title: string;
  version: number;
  owner: string;
  status: DesignStatus;
  due?: string;
  url: string;
}

export interface DocFile {
  id: string;
  name: string;
  type: "pdf" | "doc" | "img" | "sheet";
  folder: string;
  updated: string;
}

export interface Notice {
  id: string;
  date: string;
  time: string;
  author: string;
  kind: "decision" | "notice";
  text: string;
  source?: string;
  sentTo: ("Discord" | "LINE")[];
  acks: string[];
}

export interface EventInfo {
  id: string;
  name: string;
  date: string;
  start: string;
  end: string;
  place: string;
  status: "active" | "planning" | "archived";
  summary?: string;
  template?: string[];
}

export interface Resources {
  calendarUrl: string;
  discordUrl: string;
  discordOnline: number;
  canvaUrl: string;
  driveUrl: string;
  instagramUrl: string;
  lineUrl: string;
}

export type WidgetKey =
  | "today"
  | "schedule"
  | "discord"
  | "canva"
  | "drive"
  | "sns"
  | "tasks"
  | "supplies"
  | "board"
  | "status"
  | "decisions";

export const WIDGET_LABEL: Record<WidgetKey, string> = {
  today: "今日のあなた",
  schedule: "これからの予定",
  discord: "Discord",
  canva: "Canva 制作物",
  drive: "Google Drive",
  sns: "SNS投稿スケジュール",
  tasks: "タスク",
  supplies: "備品・物品",
  board: "お知らせボード",
  status: "進捗状況",
  decisions: "最近の決定事項",
};

export const DEFAULT_WIDGETS: Record<Role, WidgetKey[]> = {
  leader: ["today", "schedule", "discord", "canva", "drive", "sns", "tasks", "supplies", "board", "status", "decisions"],
  student: ["today", "schedule", "discord", "canva", "sns", "tasks", "board", "status", "decisions"],
  local: ["schedule", "canva", "drive", "board", "decisions"],
};

export const DISCORD_CHANNELS = ["企画会議", "大学生チーム", "地域連携", "広報", "当日運営"];

export const SUMMER_TEMPLATE = [
  "企画会議",
  "会場確保",
  "地域説明会",
  "チラシ制作",
  "LP制作",
  "SNS告知",
  "出店者募集",
  "備品準備",
  "前日準備",
  "当日運営",
  "振り返り",
];

export interface AppState {
  version: number;
  seededOn: string;
  meId: string;
  role: Role;
  events: EventInfo[];
  activeEventId: string;
  resources: Resources;
  members: Member[];
  tasks: Task[];
  cal: CalEvent[];
  sns: SnsPost[];
  supplies: Supply[];
  designs: Design[];
  docs: DocFile[];
  notices: Notice[];
  widgets: Record<Role, WidgetKey[]>;
}

export const STATE_VERSION = 3;

/** Demo data is laid out relative to the day it is first opened, so the board always looks "in progress". */
export function seed(today: string): AppState {
  const d = (n: number) => addDays(today, n);
  const eventDay = d(18);

  const members: Member[] = [
    { id: "me", name: "大倉 健二郎", part: "全体統括", org: "事務局", role: "leader", color: "#2f9e6e", channel: "Discord" },
    { id: "tanaka", name: "たなか", part: "制作（大学生A）", org: "○○大学 地域創生ゼミ", role: "student", color: "#12a4b8", channel: "Discord" },
    { id: "yamada", name: "やまだ", part: "広報（大学生B）", org: "○○大学 地域創生ゼミ", role: "student", color: "#e5508a", channel: "Discord" },
    { id: "sato", name: "さとう", part: "備品（大学生C）", org: "○○大学 地域創生ゼミ", role: "student", color: "#f08a24", channel: "Discord" },
    { id: "takahashi", name: "たかはし", part: "商店街との窓口", org: "○○商店街振興組合", role: "local", color: "#7c5cd6", channel: "LINE" },
    { id: "suzuki", name: "すずき", part: "自治会との窓口", org: "○○町自治会", role: "local", color: "#5b7fa6", channel: "LINE" },
    { id: "kobayashi", name: "こばやし", part: "ボランティア調整", org: "NPO法人 まちつなぎ", role: "partner", color: "#c08a2b", channel: "メール" },
  ];

  const T = (
    id: string,
    title: string,
    assignee: string,
    due: number,
    category: Category,
    status: TaskStatus,
    extra: Partial<Task> = {},
  ): Task => ({ id, title, assignee, due: d(due), category, status, ...extra });

  const tasks: Task[] = [
    T("t1", "チラシ修正（開催時間を反映）", "me", 0, "チラシ", "doing", { time: "17:00", related: "d1" }),
    T("t2", "商店街担当者へ出店数を確認", "me", 1, "地域連携", "todo"),
    T("t3", "Instagram投稿を予約", "me", 3, "SNS", "todo", { related: "s1" }),
    T("t4", "テント数の確認", "me", -1, "備品", "todo"),
    T("t5", "自治会へ最終版チラシを送付", "tanaka", 8, "地域連携", "todo"),
    T("t6", "LPに駐車場案内を追加", "yamada", 9, "LP", "doing"),
    T("t7", "延長コードの手配", "sato", 13, "備品", "todo"),
    T("t8", "企画書の作成", "me", -30, "企画", "done"),
    T("t9", "予算案の作成", "me", -26, "企画", "done"),
    T("t10", "会場使用の申請", "sato", -24, "企画", "done"),
    T("t11", "キックオフ会議", "me", -21, "企画", "done"),
    T("t12", "商店街への趣旨説明", "takahashi", -18, "地域連携", "done"),
    T("t13", "自治会長へ挨拶", "suzuki", -15, "地域連携", "done"),
    T("t14", "地域説明会の資料作成", "tanaka", -3, "地域連携", "done"),
    T("t15", "チラシ ラフ案", "tanaka", -14, "チラシ", "done"),
    T("t16", "チラシ v2 レビュー", "me", -10, "チラシ", "done"),
    T("t17", "チラシ写真の撮影", "yamada", -8, "チラシ", "done"),
    T("t18", "QRコードの作成", "tanaka", -4, "チラシ", "done"),
    T("t19", "LP構成案", "yamada", -12, "LP", "done"),
    T("t20", "LPデザイン", "tanaka", -6, "LP", "done"),
    T("t21", "LP公開", "yamada", -2, "LP", "done"),
    T("t22", "SNS投稿計画の作成", "yamada", -9, "SNS", "done"),
    T("t23", "Instagramアカウント準備", "yamada", -7, "SNS", "done"),
    T("t24", "備品リストの作成", "sato", -11, "備品", "done"),
    T("t25", "机・椅子の借用申請", "sato", -5, "備品", "done"),
  ];

  const cal: CalEvent[] = [
    { id: "c0", date: d(-21), start: "18:00", end: "19:30", title: "キックオフ会議", place: "大学 3号館", kind: "meeting", discord: "企画会議" },
    { id: "c00", date: d(-2), start: "13:00", end: "15:00", title: "地域説明会（第1回）", place: "○○自治会館", kind: "local", discord: "地域連携", doc: "f2" },
    { id: "c1", date: d(1), start: "14:00", end: "16:00", title: "デザイン打ち合わせ", place: "オンライン", kind: "meeting", discord: "企画会議", doc: "f1" },
    { id: "c2", date: d(3), start: "10:00", end: "12:00", title: "学生ミーティング", place: "○○商店街", kind: "meeting", discord: "大学生チーム" },
    { id: "c3", date: d(5), start: "13:00", end: "15:00", title: "地域説明会（第2回）", place: "○○自治会館", kind: "local", discord: "地域連携", doc: "f2" },
    { id: "c4", date: d(8), start: "17:00", title: "チラシデザイン締切", kind: "deadline", discord: "広報" },
    { id: "c5", date: d(13), start: "09:00", end: "11:00", title: "会場確認・レイアウト決定", place: "○○商店街", kind: "prep", discord: "当日運営" },
    { id: "c6", date: d(17), start: "15:00", end: "18:00", title: "前日準備・テント設営", place: "○○商店街", kind: "prep", discord: "当日運営" },
    { id: "c7", date: eventDay, start: "10:00", end: "16:00", title: "○○商店街 秋まつり 本番", place: "○○商店街", kind: "event", discord: "当日運営" },
    { id: "c8", date: d(22), start: "18:00", end: "19:30", title: "振り返り会", place: "大学 3号館", kind: "meeting", discord: "企画会議" },
  ];

  const sns: SnsPost[] = [
    { id: "s1", date: d(3), time: "19:00", platform: "Instagram", title: "チラシ公開", assignee: "tanaka", status: "draft", design: "d1" },
    { id: "s2", date: d(6), time: "12:00", platform: "X", title: "イベント紹介", assignee: "yamada", status: "scheduled", design: "d3" },
    { id: "s3", date: d(8), time: "19:00", platform: "Instagram", title: "出店者紹介①", assignee: "sato", status: "draft", design: "d3" },
    { id: "s4", date: d(11), time: "10:00", platform: "Facebook", title: "地域向け告知", assignee: "takahashi", status: "draft" },
    { id: "s5", date: d(14), time: "08:00", platform: "LINE", title: "自治会LINEで開催案内", assignee: "suzuki", status: "draft", design: "d1" },
    { id: "s6", date: d(15), time: "19:00", platform: "Instagram", title: "開催まであと3日", assignee: "yamada", status: "draft", design: "d3" },
  ];

  const supplies: Supply[] = [
    { id: "p1", name: "テント", unit: "張", need: 3, have: 3, owner: "sato", source: "商店街振興組合" },
    { id: "p2", name: "椅子", unit: "脚", need: 50, have: 45, owner: "sato", source: "自治会館" },
    { id: "p3", name: "机", unit: "台", need: 8, have: 8, owner: "sato", source: "自治会館" },
    { id: "p4", name: "延長コード", unit: "本", need: 5, have: 0, owner: "sato", source: "大学（要申請）" },
    { id: "p5", name: "名札", unit: "枚", need: 30, have: 30, owner: "tanaka", source: "事務局で作成" },
    { id: "p6", name: "ゴミ袋", unit: "枚", need: 100, have: 80, owner: "kobayashi", source: "NPOの在庫" },
  ];

  const designs: Design[] = [
    { id: "d1", kind: "チラシ", title: "秋まつり チラシデザイン", version: 4, owner: "tanaka", status: "修正中", due: d(8), url: "https://www.canva.com/" },
    { id: "d2", kind: "LP", title: "秋まつり 特設LP", version: 2, owner: "yamada", status: "確認待ち", due: d(9), url: "https://www.canva.com/" },
    { id: "d3", kind: "SNS画像", title: "Instagram投稿セット", version: 1, owner: "yamada", status: "作成中", due: d(3), url: "https://www.canva.com/" },
    { id: "d4", kind: "説明会資料", title: "地域説明会 資料", version: 3, owner: "tanaka", status: "完成", url: "https://www.canva.com/" },
    { id: "d5", kind: "ポスター", title: "商店街掲示用ポスター", version: 1, owner: "tanaka", status: "未着手", due: d(11), url: "https://www.canva.com/" },
  ];

  const docs: DocFile[] = [
    { id: "f1", name: "秋まつり_チラシv4.pdf", type: "pdf", folder: "01_デザイン", updated: d(0) },
    { id: "f2", name: "地域説明会_資料.pdf", type: "pdf", folder: "02_議事録", updated: d(-1) },
    { id: "f3", name: "イベント運営マニュアル.docx", type: "doc", folder: "03_資料", updated: d(-2) },
    { id: "f4", name: "駐車場案内_地図.png", type: "img", folder: "03_資料", updated: d(-3) },
    { id: "f5", name: "出店者リスト.xlsx", type: "sheet", folder: "03_資料", updated: d(-4) },
    { id: "f6", name: "昨年の振り返り.pdf", type: "pdf", folder: "99_アーカイブ", updated: d(-60) },
  ];

  const notices: Notice[] = [
    { id: "n1", date: d(-2), time: "15:10", author: "me", kind: "decision", text: "開催時間を 10:00〜16:00 に変更", source: "地域説明会（第1回）", sentTo: ["Discord", "LINE"], acks: ["takahashi"] },
    { id: "n2", date: d(-2), time: "15:12", author: "me", kind: "decision", text: "臨時駐車場を1か所追加（○○小学校 校庭）", source: "地域説明会（第1回）", sentTo: ["Discord", "LINE"], acks: [] },
    { id: "n3", date: d(-2), time: "15:15", author: "me", kind: "decision", text: "ゴミ箱を4か所から6か所に増設", source: "地域説明会（第1回）", sentTo: ["Discord", "LINE"], acks: ["suzuki", "takahashi"] },
    { id: "n4", date: d(0), time: "10:24", author: "tanaka", kind: "notice", text: "チラシのデザイン案 v4 を共有しました。開催時間の反映をお願いします", sentTo: ["Discord"], acks: [] },
    { id: "n5", date: d(0), time: "10:12", author: "sato", kind: "notice", text: "明日の会議は14時からです。オンライン参加の方はDiscordの #企画会議 へ", sentTo: ["Discord"], acks: [] },
    { id: "n6", date: d(-1), time: "09:58", author: "takahashi", kind: "notice", text: "テントは組合の倉庫に3張あります。前日の15時から出せます", sentTo: ["LINE"], acks: [] },
  ];

  return {
    version: STATE_VERSION,
    seededOn: today,
    meId: "me",
    role: "leader",
    activeEventId: "aki",
    events: [
      { id: "aki", name: "○○商店街 秋まつり", date: eventDay, start: "10:00", end: "16:00", place: "○○商店街（東京都○○区）", status: "active" },
      { id: "seiso", name: "地域清掃活動", date: d(40), start: "09:00", end: "11:00", place: "○○川河川敷", status: "planning", template: ["日程調整", "自治会へ連絡", "清掃用具の手配", "参加者募集", "当日運営", "振り返り"] },
      { id: "halloween", name: "ハロウィンイベント", date: d(24), start: "15:00", end: "18:00", place: "○○商店街", status: "planning", template: ["企画会議", "仮装コンテスト準備", "お菓子の手配", "SNS告知", "当日運営"] },
      { id: "natsu", name: "夏祭り（昨年）", date: d(-430), start: "16:00", end: "21:00", place: "○○商店街", status: "archived", summary: "来場者 約1,200人／出店 18店舗／学生ボランティア 24人。雨天時の動線とゴミ箱の数が課題。チラシの配布開始が遅れたため、今年は締切を2週間前倒し。" },
    ],
    resources: {
      calendarUrl: "https://calendar.google.com/",
      discordUrl: "https://discord.com/",
      discordOnline: 24,
      canvaUrl: "https://www.canva.com/",
      driveUrl: "https://drive.google.com/",
      instagramUrl: "https://www.instagram.com/",
      lineUrl: "https://line.me/",
    },
    members,
    tasks,
    cal,
    sns,
    supplies,
    designs,
    docs,
    notices,
    widgets: { ...DEFAULT_WIDGETS },
  };
}
