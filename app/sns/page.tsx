"use client";

import { Info, Megaphone } from "lucide-react";
import { useStore } from "@/lib/store";
import type { SnsPost } from "@/lib/data";
import { diffDays, mdw } from "@/lib/date";
import { Avatar, PlatformMark } from "@/components/ui";

const ST: Record<SnsPost["status"], string> = { draft: "下書き", scheduled: "予約済", posted: "投稿済" };

export default function SnsPage() {
  const { state, today, member, canEdit, update } = useStore();
  const posts = [...state.sns].sort((a, b) => a.date.localeCompare(b.date));
  const design = (id?: string) => state.designs.find((d) => d.id === id);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Megaphone color="var(--sns)" /> SNS投稿スケジュール
          </h1>
          <p>投稿そのものは各アプリで。ここでは「いつ・どこに・誰が・どの画像で」を管理し、前日にリマインドします。</p>
        </div>
      </div>
      <p className="callout" style={{ marginBottom: 16 }}>
        <Info size={16} style={{ flex: "none", marginTop: 2 }} />
        自動投稿は初期版の対象外です（InstagramはAPI審査、Xは有料APIが必要なため）。
      </p>
      <div className="card table-wrap" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>日時</th>
              <th>媒体</th>
              <th>内容</th>
              <th>使う画像</th>
              <th>担当</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const n = diffDays(p.date, today);
              return (
                <tr key={p.id} className={p.status === "posted" ? "is-done" : ""}>
                  <td style={{ whiteSpace: "nowrap", fontWeight: 700, color: n <= 1 && p.status !== "posted" ? "var(--sns)" : undefined }}>
                    {mdw(p.date)} {p.time}
                  </td>
                  <td>
                    <span className="cell-user">
                      <PlatformMark p={p.platform} /> {p.platform}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td className="small">{design(p.design)?.title ?? <span className="muted">未設定</span>}</td>
                  <td>
                    <span className="cell-user">
                      <Avatar m={member(p.assignee)} size={22} />
                      {member(p.assignee)?.name}
                    </span>
                  </td>
                  <td>
                    <select
                      value={p.status}
                      disabled={!canEdit}
                      aria-label={`${p.title}の状態`}
                      onChange={(e) =>
                        update((s) => ({
                          ...s,
                          sns: s.sns.map((x) => (x.id === p.id ? { ...x, status: e.target.value as SnsPost["status"] } : x)),
                        }))
                      }
                    >
                      {(Object.keys(ST) as SnsPost["status"][]).map((k) => (
                        <option key={k} value={k}>
                          {ST[k]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
