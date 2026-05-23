export function IllustrationDashboard() {
  return (
    <svg viewBox="0 0 260 196" fill="none" className="w-full h-full" aria-hidden="true">
      <rect x="0" y="0" width="260" height="30" fill="rgba(255,255,255,0.02)" />
      <circle cx="14" cy="15" r="4" fill="rgba(52,211,153,0.55)" />
      <rect x="24" y="11" width="52" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="192" y="11" width="56" height="4" rx="2" fill="rgba(126,168,255,0.28)" />
      <line x1="0" y1="30" x2="260" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <rect x="6" y="38" width="76" height="44" rx="7" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <rect x="16" y="46" width="36" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="16" y="55" width="54" height="8" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="16" y="68" width="24" height="3" rx="1.5" fill="rgba(52,211,153,0.42)" />
      <rect x="90" y="38" width="76" height="44" rx="7" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <rect x="100" y="46" width="36" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="100" y="55" width="46" height="8" rx="3" fill="rgba(126,168,255,0.42)" />
      <rect x="100" y="68" width="24" height="3" rx="1.5" fill="rgba(126,168,255,0.18)" />
      <rect x="174" y="38" width="80" height="44" rx="7" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <rect x="184" y="46" width="36" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="184" y="55" width="50" height="8" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="184" y="68" width="24" height="3" rx="1.5" fill="rgba(126,168,255,0.18)" />
      <rect x="6" y="92" width="164" height="96" rx="8" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="6" y1="124" x2="170" y2="124" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <line x1="6" y1="150" x2="170" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <path d="M18 178 L48 156 L78 144 L108 128 L138 116 L164 107 L164 180 L18 180 Z" fill="rgba(126,168,255,0.07)" />
      <path d="M18 178 L48 156 L78 144 L108 128 L138 116 L164 107" stroke="#7ea8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="108" cy="128" r="3" fill="#7ea8ff" fillOpacity="0.85" />
      <circle cx="164" cy="107" r="3" fill="#7ea8ff" fillOpacity="0.85" />
      <rect x="178" y="92" width="76" height="96" rx="8" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="187" y="158" width="9" height="22" rx="3" fill="#7ea8ff" fillOpacity="0.18" />
      <rect x="200" y="142" width="9" height="38" rx="3" fill="#7ea8ff" fillOpacity="0.32" />
      <rect x="213" y="126" width="9" height="54" rx="3" fill="#7ea8ff" fillOpacity="0.48" />
      <rect x="226" y="110" width="9" height="70" rx="3" fill="#7ea8ff" fillOpacity="0.65" />
      <rect x="239" y="98" width="9" height="82" rx="3" fill="#7ea8ff" fillOpacity="0.75" />
    </svg>
  )
}

export function IllustrationSaaS() {
  return (
    <svg viewBox="0 0 260 196" fill="none" className="w-full h-full" aria-hidden="true">
      {[78, 104, 130, 156, 182].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="20" r="9" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx={cx} cy="17" r="3.2" fill="rgba(255,255,255,0.18)" />
          <path d={`M${cx - 4.5} 24 Q${cx} 21.5 ${cx + 4.5} 24`} stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <line x1={cx} y1="29" x2={cx} y2="42" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
      <rect x="10" y="42" width="240" height="44" rx="10" fill="rgba(126,168,255,0.05)" stroke="rgba(126,168,255,0.18)" strokeWidth="1" />
      <rect x="22" y="53" width="64" height="5" rx="2.5" fill="rgba(126,168,255,0.38)" />
      <rect x="22" y="63" width="44" height="3.5" rx="1.75" fill="rgba(255,255,255,0.1)" />
      <line x1="108" y1="48" x2="108" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="118" y="53" width="48" height="5" rx="2.5" fill="rgba(255,255,255,0.13)" />
      <rect x="118" y="63" width="32" height="3.5" rx="1.75" fill="rgba(255,255,255,0.07)" />
      <line x1="186" y1="48" x2="186" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="196" y="53" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.13)" />
      <rect x="196" y="63" width="28" height="3.5" rx="1.75" fill="rgba(255,255,255,0.07)" />
      {[58, 130, 200].map((x) => (
        <line key={x} x1={x} y1="86" x2={x} y2="102" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 2" />
      ))}
      <rect x="10" y="102" width="240" height="38" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {[14, 62, 110, 158, 206].map((x, i) => (
        <g key={x}>
          <rect x={x} y="112" width="32" height="18" rx="5" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <rect x={x + 4} y="118" width={[20, 16, 18, 20, 14][i]} height="3.5" rx="1.75" fill="rgba(126,168,255,0.22)" />
        </g>
      ))}
      <line x1="130" y1="140" x2="130" y2="154" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="10" y="154" width="240" height="34" rx="10" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <ellipse cx="44" cy="166" rx="18" ry="6.5" fill="rgba(126,168,255,0.07)" stroke="rgba(126,168,255,0.15)" strokeWidth="1" />
      <rect x="26" y="166" width="36" height="12" fill="rgba(126,168,255,0.03)" />
      <line x1="26" y1="166" x2="26" y2="178" stroke="rgba(126,168,255,0.13)" strokeWidth="1" />
      <line x1="62" y1="166" x2="62" y2="178" stroke="rgba(126,168,255,0.13)" strokeWidth="1" />
      <ellipse cx="44" cy="178" rx="18" ry="6.5" fill="rgba(126,168,255,0.04)" stroke="rgba(126,168,255,0.12)" strokeWidth="1" />
      <rect x="88" y="161" width="60" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="88" y="170" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
      <rect x="164" y="161" width="72" height="4" rx="2" fill="rgba(255,255,255,0.07)" />
      <rect x="164" y="170" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />
    </svg>
  )
}
