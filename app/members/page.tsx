"use client";

import { Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { diffDays } from "@/lib/date";
import { Avatar } from "@/components/ui";

const ROLE: Record<string, string> = { leader: "リーダー", student: "学生", local: "地域", partner: "協力団体" };

export default function MembersPage() {
  const { state, today } = useStore();
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Users color="var(--brand)" /> メンバー
          </h1>
          <p>学生・地域の方・協力団体。連絡手段は人に合わせて Discord／LINE／メール を使い分けます。</p>
        </div>
      </div>
      <div className="page-grid">
        {state.members.map((m) => {
          const open = state.tasks.filter((t) => t.assignee === m.id && t.status !== "done");
          const over = open.filter((t) => diffDays(t.due, today) < 0).length;
          return (
            <article key={m.id} className="card">
              <div className="member-card">
                <Avatar m={m} size={44} />
                <div>
                  <b>{m.name}</b>
                  <small>{m.part}</small>
                  <small>{m.org}</small>
                </div>
                <span className="role-tag">{ROLE[m.role]}</span>
              </div>
              <p className="small muted" style={{ marginTop: 10 }}>
                連絡：{m.channel}　／　未完了タスク {open.length}件
                {over > 0 && <span className="warn-text">（超過 {over}）</span>}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
