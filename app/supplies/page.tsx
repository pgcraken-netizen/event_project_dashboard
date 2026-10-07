"use client";

import { Minus, Package, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui";
import { SupplyBadge, supplyState } from "@/components/widgets";

export default function SuppliesPage() {
  const { state, member, canEdit, update } = useStore();
  const setHave = (id: string, delta: number) =>
    update((s) => ({
      ...s,
      supplies: s.supplies.map((x) => (x.id === id ? { ...x, have: Math.max(0, x.have + delta) } : x)),
    }));
  const short = state.supplies.filter((s) => supplyState(s).key !== "ok");
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <Package color="var(--supply)" /> 備品・物品
          </h1>
          <p>
            状態は「必要数」と「確保数」から自動で決まります。不足 {short.length}件
            {short.length > 0 && `（${short.map((s) => s.name).join("・")}）`}
          </p>
        </div>
      </div>
      <div className="card table-wrap" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>品名</th>
              <th>必要数</th>
              <th>確保数</th>
              <th>状態</th>
              <th>担当</th>
              <th>入手先</th>
            </tr>
          </thead>
          <tbody>
            {state.supplies.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700 }}>{s.name}</td>
                <td className="num">
                  {s.need}
                  {s.unit}
                </td>
                <td>
                  {canEdit ? (
                    <span className="stepper">
                      <button onClick={() => setHave(s.id, -1)} aria-label={`${s.name}を1減らす`}>
                        <Minus size={14} />
                      </button>
                      <span>{s.have}</span>
                      <button onClick={() => setHave(s.id, 1)} aria-label={`${s.name}を1増やす`}>
                        <Plus size={14} />
                      </button>
                    </span>
                  ) : (
                    s.have
                  )}
                </td>
                <td>
                  <SupplyBadge s={s} />
                </td>
                <td>
                  <span className="cell-user">
                    <Avatar m={member(s.owner)} size={22} />
                    {member(s.owner)?.name}
                  </span>
                </td>
                <td className="small">{s.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
