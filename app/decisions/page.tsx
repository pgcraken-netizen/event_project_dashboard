"use client";

import { useState } from "react";
import { ListPlus, Pin } from "lucide-react";
import { useStore } from "@/lib/store";
import { addDays } from "@/lib/date";
import { NoticeItem, BoardWidget } from "@/components/widgets";

export default function DecisionsPage() {
  const { state, addTask, canEdit, today, me } = useStore();
  const [made, setMade] = useState<string[]>([]);
  const decisions = state.notices.filter((n) => n.kind === "decision");
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Pin color="var(--board)" /> 決定事項
          </h1>
          <p>会議で決まったことを記録で終わらせず、タスクへつなげます。地域の方は「確認しました」で既読を返せます。</p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <ul className="notice-list">
          {decisions.map((n) => (
            <li key={n.id} style={{ display: "grid", gap: 6 }}>
              <NoticeItem n={n} asDiv />
              {canEdit && (
                <button
                  className="btn btn-ghost small"
                  style={{ justifySelf: "end" }}
                  disabled={made.includes(n.id)}
                  onClick={() => {
                    addTask({ title: `【決定事項】${n.text}`, assignee: me.id, due: addDays(today, 3), category: "地域連携", status: "todo" });
                    setMade((m) => [...m, n.id]);
                  }}
                >
                  <ListPlus size={14} /> {made.includes(n.id) ? "タスクに追加しました" : "タスクにする"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <BoardWidget />
    </div>
  );
}
