"use client";

import { useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_COLOR, STATUS_LABEL, type Category, type TaskStatus } from "@/lib/data";
import { addDays, diffDays, dueLabel, md } from "@/lib/date";
import { Avatar } from "@/components/ui";
import { CategoryFilter } from "@/components/widgets";

export default function TasksPage() {
  const { state, me, today, member, patchTask, addTask, canEdit } = useStore();
  const [scope, setScope] = useState<"mine" | "all">(state.role === "leader" ? "all" : "mine");
  const [cat, setCat] = useState<Category | "all">("all");
  const [showDone, setShowDone] = useState(false);
  const [form, setForm] = useState({ title: "", assignee: me.id, due: addDays(today, 3), category: "企画" as Category });

  const list = state.tasks
    .filter((t) => (scope === "all" || t.assignee === me.id) && (cat === "all" || t.category === cat) && (showDone || t.status !== "done"))
    .sort((a, b) => (a.status === "done" ? 1 : 0) - (b.status === "done" ? 1 : 0) || a.due.localeCompare(b.due));
  const overdue = state.tasks.filter((t) => t.status !== "done" && diffDays(t.due, today) < 0).length;
  const assignable = state.members;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <ListChecks color="var(--task)" /> タスク
          </h1>
          <p>
            タイトル・担当・期限だけで登録できます。「遅延」は期限から自動で判定します（現在 {overdue}件）。
          </p>
        </div>
      </div>

      {canEdit && (
        <form
          className="card form-row"
          style={{ marginBottom: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.title.trim()) return;
            addTask({ ...form, title: form.title.trim(), status: "todo" });
            setForm((f) => ({ ...f, title: "" }));
          }}
        >
          <label className="field grow">
            タスク
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：駐車場案内をチラシに追加" />
          </label>
          <label className="field">
            担当
            <select value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
              {assignable.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            期限
            <input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </label>
          <label className="field">
            分野
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit" disabled={!form.title.trim()}>
            <Plus size={15} /> 追加
          </button>
        </form>
      )}

      <div className="toolbar">
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={scope === "mine"} className={scope === "mine" ? "is-on" : ""} onClick={() => setScope("mine")}>
            自分
          </button>
          <button role="tab" aria-selected={scope === "all"} className={scope === "all" ? "is-on" : ""} onClick={() => setScope("all")}>
            チーム全体
          </button>
        </div>
        <CategoryFilter value={cat} onChange={setCat} />
        <label className="small" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> 完了も表示
        </label>
      </div>

      <div className="card table-wrap" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>タスク</th>
              <th>分野</th>
              <th>担当</th>
              <th>期限</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const n = diffDays(t.due, today);
              const done = t.status === "done";
              return (
                <tr key={t.id} className={done ? "is-done" : ""}>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td>
                    <span className="cat-chip" style={{ ["--chip" as string]: CATEGORY_COLOR[t.category] }}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className="cell-user">
                      <Avatar m={member(t.assignee)} size={24} />
                      {member(t.assignee)?.name}
                    </span>
                  </td>
                  <td>
                    <span className={`due ${!done && n < 0 ? "is-over" : !done && n <= 1 ? "is-soon" : ""}`}>
                      {done ? md(t.due) : dueLabel(t.due, today, t.time)}
                    </span>
                  </td>
                  <td>
                    <select
                      value={t.status}
                      disabled={!canEdit}
                      onChange={(e) => patchTask(t.id, { status: e.target.value as TaskStatus })}
                      aria-label={`${t.title}の状態`}
                    >
                      {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="empty" style={{ textAlign: "center" }}>
                  該当するタスクはありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
