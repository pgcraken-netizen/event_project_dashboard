import type { Design } from "@/lib/data";

/** Stand-in thumbnails. With the Canva Connect API these would be the real design thumbnails. */
export default function DesignThumb({ d, size = 92 }: { d: Design; size?: number }) {
  const h = d.kind === "LP" || d.kind === "ポスター" ? size * 1.3 : d.kind === "説明会資料" ? size * 0.72 : size;
  return (
    <svg className="thumb" width={size} height={h} viewBox={`0 0 100 ${(h / size) * 100}`} role="img" aria-label={`${d.title}のサムネイル`}>
      {d.kind === "チラシ" && (
        <>
          <rect width="100" height="100" rx="4" fill="#fbe7b5" />
          <rect x="6" y="6" width="88" height="88" rx="3" fill="none" stroke="#2f9e6e" strokeWidth="2" strokeDasharray="4 3" />
          {[18, 36, 54, 72].map((x, i) => (
            <circle key={x} cx={x + 6} cy="18" r="5" fill={i % 2 ? "#f5a524" : "#e85d5d"} />
          ))}
          <text x="50" y="52" textAnchor="middle" fontSize="19" fontWeight="900" fill="#c2362f" fontFamily="'Zen Maru Gothic',sans-serif">
            秋まつり
          </text>
          <rect x="22" y="62" width="56" height="6" rx="3" fill="#2f9e6e" />
          <rect x="30" y="74" width="40" height="4" rx="2" fill="#c9a77f" />
          <rect x="72" y="76" width="14" height="14" fill="#3d2a20" />
        </>
      )}
      {d.kind === "LP" && (
        <>
          <rect width="100" height="130" rx="4" fill="#fff" stroke="#dbe5ee" />
          <rect x="0" y="0" width="100" height="44" rx="4" fill="#f4c56a" />
          <text x="50" y="28" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="'Zen Maru Gothic',sans-serif">
            秋まつり
          </text>
          {[54, 66, 78].map((y) => (
            <rect key={y} x="10" y={y} width={y === 54 ? 60 : 80} height="5" rx="2" fill="#dbe5ee" />
          ))}
          <rect x="10" y="92" width="36" height="26" rx="3" fill="#cfe7c6" />
          <rect x="54" y="92" width="36" height="26" rx="3" fill="#dceaf6" />
        </>
      )}
      {d.kind === "SNS画像" && (
        <>
          <defs>
            <linearGradient id={`g-${d.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd1e3" />
              <stop offset="1" stopColor="#c9e7ff" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="4" fill={`url(#g-${d.id})`} />
          <text x="50" y="44" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b8336a" fontFamily="'Zen Maru Gothic',sans-serif">
            開催まで
          </text>
          <text x="50" y="74" textAnchor="middle" fontSize="26" fontWeight="900" fill="#3b4a8a" fontFamily="'Zen Maru Gothic',sans-serif">
            あと3日
          </text>
        </>
      )}
      {d.kind === "説明会資料" && (
        <>
          <rect width="100" height="72" rx="4" fill="#eef6f1" stroke="#cfe2d6" />
          <rect x="8" y="8" width="50" height="7" rx="2" fill="#2f9e6e" />
          {[24, 34, 44].map((y) => (
            <rect key={y} x="8" y={y} width="44" height="4" rx="2" fill="#b9cfc2" />
          ))}
          {[30, 18, 38].map((h, i) => (
            <rect key={i} x={62 + i * 11} y={60 - h} width="8" height={h} fill="#7bc79c" />
          ))}
        </>
      )}
      {d.kind === "ポスター" && (
        <>
          <rect width="100" height="130" rx="4" fill="#dceaf6" />
          <circle cx="50" cy="50" r="26" fill="#fff" opacity="0.6" />
          <text x="50" y="56" textAnchor="middle" fontSize="15" fontWeight="900" fill="#3b5f8a" fontFamily="'Zen Maru Gothic',sans-serif">
            ポスター
          </text>
          <rect x="18" y="96" width="64" height="6" rx="3" fill="#9db7d4" />
          <rect x="28" y="108" width="44" height="5" rx="2" fill="#9db7d4" />
        </>
      )}
    </svg>
  );
}
