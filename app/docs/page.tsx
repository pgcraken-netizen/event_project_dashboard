"use client";

import { ExternalLink, FileText, FolderOpen, TriangleAlert } from "lucide-react";
import { useStore } from "@/lib/store";
import { DocRow } from "@/components/widgets";

export default function DocsPage() {
  const { state } = useStore();
  const folders = Array.from(new Set(state.docs.map((d) => d.folder))).sort();
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            <FileText color="var(--drive)" /> 資料・ドキュメント
          </h1>
          <p>ファイルの正本はGoogle Driveの共有ドライブ。ここではフォルダ別に最新の資料を一覧できます。</p>
        </div>
        <a className="btn btn-ghost" href={state.resources.driveUrl} target="_blank" rel="noreferrer">
          <FolderOpen size={15} /> Driveで開く <ExternalLink size={13} />
        </a>
      </div>
      <p className="callout warn" style={{ marginBottom: 16 }}>
        <TriangleAlert size={16} style={{ flex: "none", marginTop: 2 }} />
        資料は学生個人のマイドライブではなく、団体の共有ドライブに置いてください。卒業してもファイルが消えず、翌年に引き継げます。
      </p>
      <div className="page-grid">
        {folders.map((f) => (
          <section key={f} className="card">
            <h3 style={{ fontSize: 15, display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <FolderOpen size={17} color="var(--drive)" /> {f}
            </h3>
            <ul className="doc-list">
              {state.docs
                .filter((d) => d.folder === f)
                .map((d) => (
                  <DocRow key={d.id} f={d} />
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
