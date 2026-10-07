"use client";

import { useState } from "react";
import { LayoutGrid, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { ROLE_LABEL, WIDGET_LABEL, type WidgetKey } from "@/lib/data";
import EventHero from "@/components/EventHero";
import {
  BoardWidget,
  CanvaWidget,
  DecisionsWidget,
  DiscordWidget,
  DriveWidget,
  ScheduleWidget,
  SnsWidget,
  StatusWidget,
  SuppliesWidget,
  TasksWidget,
  TodayWidget,
} from "@/components/widgets";

const MAIN: { key: WidgetKey; el: () => React.ReactElement }[] = [
  { key: "today", el: TodayWidget },
  { key: "schedule", el: () => <ScheduleWidget /> },
  { key: "discord", el: DiscordWidget },
  { key: "canva", el: CanvaWidget },
  { key: "drive", el: DriveWidget },
  { key: "sns", el: SnsWidget },
  { key: "tasks", el: TasksWidget },
  { key: "supplies", el: SuppliesWidget },
  { key: "board", el: BoardWidget },
];
const SIDE: { key: WidgetKey; el: () => React.ReactElement }[] = [
  { key: "status", el: StatusWidget },
  { key: "decisions", el: DecisionsWidget },
];

export default function Home() {
  const { state, toggleWidget, resetWidgets } = useStore();
  const [editing, setEditing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const on = state.widgets[state.role];
  const main = MAIN.filter((w) => on.includes(w.key));
  const side = SIDE.filter((w) => on.includes(w.key));

  return (
    <div className="home">
      <EventHero />

      <div className="home-toolbar">
        <p className="muted small">
          {ROLE_LABEL[state.role]}向けの表示（右上のアカウントから切り替え）
        </p>
        <button className="btn btn-ghost small" onClick={() => setEditing((e) => !e)} aria-expanded={editing}>
          <LayoutGrid size={15} /> ウィンドウを編集
        </button>
      </div>

      {editing && (
        <div className="widget-editor" role="group" aria-label="表示するウィンドウ">
          {(Object.keys(WIDGET_LABEL) as WidgetKey[]).map((k) => (
            <label key={k} className={on.includes(k) ? "is-on" : ""}>
              <input type="checkbox" checked={on.includes(k)} onChange={() => toggleWidget(k)} />
              {WIDGET_LABEL[k]}
            </label>
          ))}
          <button className="btn btn-ghost small" onClick={resetWidgets}>
            <RotateCcw size={14} /> 役割の初期設定に戻す
          </button>
        </div>
      )}

      <div className={`dash ${side.length ? "" : "no-side"} ${showAll ? "show-all" : ""}`}>
        <div className="dash-main">
          {main.map(({ key, el: El }) => (
            <El key={key} />
          ))}
        </div>
        {side.length > 0 && (
          <div className="dash-side">
            {side.map(({ key, el: El }) => (
              <El key={key} />
            ))}
          </div>
        )}
      </div>
      <button className="btn btn-ghost more-btn" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
        {showAll ? "表示を減らす" : "ほかのウィンドウも表示（タスク・SNS・資料・備品・進捗）"}
      </button>
    </div>
  );
}
