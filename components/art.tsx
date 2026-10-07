/* Hand-drawn style illustrations, kept as inline SVG so the page has no image assets to manage. */

export function FestivalArt() {
  const lanterns = Array.from({ length: 22 }, (_, i) => i);
  const flags = Array.from({ length: 30 }, (_, i) => i);
  return (
    <svg className="festival-art" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe3f6" />
          <stop offset="0.6" stopColor="#e9f5ec" />
          <stop offset="1" stopColor="#fbefd9" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
      </defs>
      <rect width="1200" height="220" fill="url(#sky)" />
      {/* distant trees */}
      <g fill="#a9d3a1" opacity="0.75" filter="url(#soft)">
        <ellipse cx="80" cy="120" rx="90" ry="45" />
        <ellipse cx="1120" cy="110" rx="110" ry="55" />
        <ellipse cx="640" cy="118" rx="70" ry="30" />
      </g>
      {/* shop houses */}
      <g filter="url(#soft)">
        {[
          [20, 92, "#f3d9b4"],
          [150, 80, "#e8c7a0"],
          [880, 86, "#f1dcc0"],
          [1010, 76, "#e6c39b"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <rect x={x as number} y={y as number} width="120" height={220 - (y as number)} fill={c as string} />
            <polygon
              points={`${(x as number) - 8},${y} ${(x as number) + 60},${(y as number) - 28} ${(x as number) + 128},${y}`}
              fill="#8a6a55"
            />
            <rect x={(x as number) + 18} y={(y as number) + 22} width="26" height="22" fill="#fff8e8" />
            <rect x={(x as number) + 74} y={(y as number) + 22} width="26" height="22" fill="#fff8e8" />
          </g>
        ))}
      </g>
      {/* stalls */}
      <g filter="url(#soft)">
        {[300, 430, 560, 690].map((x, i) => (
          <g key={x}>
            <rect x={x} y="150" width="110" height="70" fill="#fff6e6" />
            {Array.from({ length: 6 }, (_, k) => (
              <rect
                key={k}
                x={x - 6 + k * 20.3}
                y="132"
                width="20.3"
                height="22"
                fill={k % 2 ? "#fff" : ["#e85d5d", "#2f9e6e", "#3b82f6", "#f08a24"][i]}
              />
            ))}
            <path d={`M${x - 6} 154 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q10 10 20 0 q11 10 22 0`} fill="none" stroke="#c9a77f" strokeWidth="2" />
          </g>
        ))}
      </g>
      {/* string of lanterns */}
      <path d="M0 40 Q300 95 600 40 T1200 40" fill="none" stroke="#6b4d3a" strokeWidth="1.6" />
      {lanterns.map((i) => {
        const x = 20 + i * 55;
        const y = 40 + Math.sin((Math.PI * x) / 600) * 27 + 13;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="22" fill="url(#glow)" />
            <rect x="-9" y="-12" width="18" height="24" rx="8" fill={i % 3 === 0 ? "#f7d27a" : "#e85d5d"} />
            <rect x="-6" y="-14" width="12" height="3" fill="#3d2a20" />
            <rect x="-6" y="11" width="12" height="3" fill="#3d2a20" />
          </g>
        );
      })}
      {/* bunting */}
      <path d="M0 14 Q600 46 1200 14" fill="none" stroke="#9b7a62" strokeWidth="1" />
      {flags.map((i) => {
        const x = 10 + i * 40;
        const y = 14 + Math.sin((Math.PI * x) / 1200) * 16;
        const c = ["#3b82f6", "#f5a524", "#2f9e6e", "#e5508a", "#7c5cd6"][i % 5];
        return <polygon key={i} points={`${x - 9},${y} ${x + 9},${y} ${x},${y + 16}`} fill={c} opacity="0.85" />;
      })}
      {/* people */}
      <g opacity="0.85">
        {[250, 270, 340, 380, 470, 500, 620, 650, 740, 790, 820, 860].map((x, i) => (
          <g key={x} transform={`translate(${x} ${196 - (i % 3) * 3})`}>
            <circle r="5" cy="-14" fill="#4a3a33" />
            <rect x="-6" y="-9" width="12" height="18" rx="5" fill={["#5b8fd6", "#e5508a", "#f08a24", "#2f9e6e", "#7c5cd6"][i % 5]} />
          </g>
        ))}
      </g>
      <rect y="206" width="1200" height="14" fill="#e9d9bf" />
    </svg>
  );
}

export function TownArt() {
  return (
    <svg className="town-art" viewBox="0 0 240 150" aria-hidden>
      <defs>
        <filter id="soft2">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" />
        </filter>
      </defs>
      <g filter="url(#soft2)">
        <ellipse cx="40" cy="110" rx="50" ry="26" fill="#cfe7c6" />
        <ellipse cx="200" cy="112" rx="56" ry="28" fill="#cfe7c6" />
        <rect x="30" y="78" width="46" height="60" fill="#f6e3c8" />
        <polygon points="24,80 53,56 82,80" fill="#c97b5d" />
        <rect x="88" y="62" width="34" height="76" fill="#eadcf1" />
        <polygon points="84,64 105,30 126,64" fill="#8b7bb5" />
        <rect x="100" y="40" width="10" height="12" fill="#fff" />
        <rect x="132" y="84" width="54" height="54" fill="#dceaf6" />
        <polygon points="126,86 159,62 192,86" fill="#5b7fa6" />
        <rect x="196" y="96" width="34" height="42" fill="#fbe7d2" />
        <polygon points="192,98 213,80 234,98" fill="#d4945e" />
        <rect y="136" width="240" height="14" fill="#e8dcc4" />
      </g>
      <g fill="#fff8e0">
        <rect x="40" y="92" width="10" height="10" />
        <rect x="58" y="92" width="10" height="10" />
        <rect x="142" y="98" width="10" height="10" />
        <rect x="164" y="98" width="10" height="10" />
      </g>
    </svg>
  );
}

export function Sprout({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path d="M24 44 V22" stroke="#2f7d55" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M24 26 C10 26 6 14 8 8 C18 8 24 14 24 26Z" fill="#5cc28a" />
      <path d="M24 22 C36 22 42 12 40 5 C28 5 24 12 24 22Z" fill="#2f9e6e" />
      <rect x="12" y="36" width="24" height="9" rx="3" fill="#3f8f6a" />
    </svg>
  );
}
