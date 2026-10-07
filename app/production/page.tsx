"use client";

import { ExternalLink, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import type { DesignStatus } from "@/lib/data";
import { dueLabel, md } from "@/lib/date";
import DesignThumb from "@/components/DesignThumb";
import { Avatar } from "@/components/ui";

const STATUSES: DesignStatus[] = ["未着手", "作成中", "修正中", "確認待ち", "完成"];

export default function ProductionPage() {
  const { state, today, member, canEdit, update } = useStore();
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Palette color="var(--canva)" /> 制作物
          </h1>
          <p>制作はCanvaで。ここでは版・担当・締切・関連する予定やタスクをまとめて管理します。</p>
        </div>
        <a className="btn btn-canva" href={state.resources.canvaUrl} target="_blank" rel="noreferrer">
          Canvaチームを開く <ExternalLink size={14} />
        </a>
      </div>
      <div className="page-grid">
        {state.designs.map((d) => {
          const tasks = state.tasks.filter((t) => t.related === d.id || (t.category === "チラシ" && d.kind === "チラシ" && t.status !== "done"));
          const posts = state.sns.filter((p) => p.design === d.id);
          const owner = member(d.owner);
          return (
            <article key={d.id} id={d.id} className="card design-card">
              <DesignThumb d={d} size={110} />
              <div style={{ minWidth: 0 }}>
                <span className={`pill ds-${d.status}`}>{d.status}</span>
                <h3 style={{ marginTop: 6 }}>
                  {d.title} <span className="ver">v{d.version}</span>
                </h3>
                <div className="meta-list">
                  <span className="cell-user">
                    <Avatar m={owner} size={20} /> 担当：{owner?.name}
                  </span>
                  <span>種類：{d.kind}</span>
                  {d.due && <span>締切：{dueLabel(d.due, today)}</span>}
                </div>
                <div className="btn-row">
                  <a href={d.url} target="_blank" rel="noreferrer" className="btn btn-ghost small">
                    見る
                  </a>
                  {canEdit && (
                    <a href={d.url} target="_blank" rel="noreferrer" className="btn btn-canva small">
                      Canvaで編集 <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                {canEdit && (
                  <label className="field" style={{ marginTop: 10 }}>
                    状態
                    <select
                      value={d.status}
                      onChange={(e) =>
                        update((s) => ({
                          ...s,
                          designs: s.designs.map((x) => (x.id === d.id ? { ...x, status: e.target.value as DesignStatus } : x)),
                        }))
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                )}
                {(tasks.length > 0 || posts.length > 0) && (
                  <div className="related">
                    {tasks.length > 0 && (
                      <div>
                        <b>関連タスク</b>
                        {tasks.slice(0, 3).map((t) => (
                          <div key={t.id}>
                            {t.status === "done" ? "☑" : "□"} {t.title}
                          </div>
                        ))}
                      </div>
                    )}
                    {posts.length > 0 && (
                      <div>
                        <b>この画像を使うSNS投稿</b>
                        {posts.map((p) => (
                          <div key={p.id}>
                            {md(p.date)} {p.platform}「{p.title}」
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
