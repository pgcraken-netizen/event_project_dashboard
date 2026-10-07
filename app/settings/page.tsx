"use client";

import { useState } from "react";
import { RotateCcw, Settings, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Resources } from "@/lib/data";

const FIELDS: { key: keyof Resources; label: string; hint: string }[] = [
  { key: "calendarUrl", label: "Googleカレンダー", hint: "イベント専用の共有カレンダーのURL" },
  { key: "discordUrl", label: "Discord招待リンク", hint: "サーバーまたはチャンネルの招待URL" },
  { key: "canvaUrl", label: "Canvaチーム", hint: "団体のCanvaチーム／フォルダのURL" },
  { key: "driveUrl", label: "Google Drive", hint: "団体の共有ドライブのフォルダURL" },
  { key: "instagramUrl", label: "Instagram", hint: "イベント告知アカウント" },
  { key: "lineUrl", label: "LINE公式アカウント", hint: "地域の方への連絡窓口" },
];

const INTEGRATIONS = [
  { name: "Google Calendar", now: "リンク", next: "Calendar APIで予定を読み取り表示", lv: 2 },
  { name: "Discord", now: "リンク", next: "Webhookで決定事項・毎朝のまとめを自動投稿", lv: 2 },
  { name: "Canva", now: "リンク", next: "Connect APIでサムネイル・書き出し", lv: 2 },
  { name: "Google Drive", now: "リンク", next: "Drive APIで最新資料5件を表示", lv: 2 },
  { name: "LINE", now: "リンク", next: "Messaging APIで地域向け通知／LINEログイン", lv: 2 },
  { name: "Discord Bot", now: "未着手", next: "📌リアクションで決定事項に取り込み（常駐環境が必要）", lv: 3 },
];

const OWNERSHIP = [
  "Googleカレンダー・Driveは団体の共有カレンダー／共有ドライブにある",
  "Canvaのデザインは団体のCanvaチームで作っている",
  "Discordサーバーの管理者が2人以上いる",
  "卒業する人のオーナー権限を移す担当を決めた",
];

export default function SettingsPage() {
  const { state, update, reset } = useStore();
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Settings color="var(--muted)" /> 設定・連携
          </h1>
          <p>既存サービスは置き換えず、入口として登録します。</p>
        </div>
      </div>
      <div className="page-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))" }}>
        <section className="card settings-list">
          <h3 style={{ fontSize: 16 }}>サービスの入口（URL）</h3>
          {FIELDS.map((f) => (
            <label key={f.key} className="setting-row">
              <span>
                <b style={{ fontSize: 13.5 }}>{f.label}</b>
                <br />
                <small className="muted">{f.hint}</small>
              </span>
              <input
                className="input"
                value={String(state.resources[f.key])}
                onChange={(e) => update((s) => ({ ...s, resources: { ...s.resources, [f.key]: e.target.value } }))}
              />
            </label>
          ))}
        </section>

        <section className="card">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>連携の段階</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>サービス</th>
                  <th>現在</th>
                  <th>次の段階</th>
                </tr>
              </thead>
              <tbody>
                {INTEGRATIONS.map((i) => (
                  <tr key={i.name}>
                    <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{i.name}</td>
                    <td>
                      <span className="level lv1">Lv1 {i.now}</span>
                    </td>
                    <td className="small">
                      <span className={`level lv${i.lv}`}>Lv{i.lv}</span> {i.next}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny muted" style={{ marginTop: 8 }}>
            Lv1＝リンク　Lv2＝読み取り・一方向の配信　Lv3＝双方向
          </p>
        </section>

        <section className="card">
          <h3 style={{ fontSize: 16, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <ShieldCheck size={18} color="var(--brand)" /> データの持ち主チェック
          </h3>
          <p className="small muted" style={{ marginBottom: 10 }}>
            卒業や代替わりで資料が消えないよう、すべて団体の所有にしておきます。
          </p>
          <ul style={{ display: "grid", gap: 8 }}>
            {OWNERSHIP.map((o, i) => (
              <li key={o}>
                <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5 }}>
                  <input
                    type="checkbox"
                    checked={checked.includes(i)}
                    onChange={() => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                    style={{ marginTop: 4, accentColor: "var(--brand)" }}
                  />
                  {o}
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>デモデータ</h3>
          <p className="small muted" style={{ marginBottom: 12 }}>
            このページのデータはブラウザ内だけに保存されています。今日の日付を基準に、初期状態へ戻せます。
          </p>
          <button className="btn btn-ghost" onClick={reset}>
            <RotateCcw size={14} /> 初期状態に戻す
          </button>
        </section>
      </div>
    </div>
  );
}
