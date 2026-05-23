export default function Logo() {
  return (
    <a href="/" aria-label="Ettalibi" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
      <svg width="28" height="30" viewBox="0 0 28 30" fill="none" aria-hidden="true">
        <path d="M2.5 2.5 V27.5" stroke="#7ea8ff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M2.5 2.5 H25.5" stroke="#7ea8ff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M2.5 15 H17" stroke="#7ea8ff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="17" cy="15" r="2.8" fill="#7ea8ff" fillOpacity="0.55" />
        <path d="M2.5 27.5 H25.5" stroke="#7ea8ff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="25.5" cy="2.5" r="2.2" fill="#7ea8ff" fillOpacity="0.35" />
        <circle cx="25.5" cy="27.5" r="2.2" fill="#7ea8ff" fillOpacity="0.35" />
      </svg>
      <span className="text-[14px] font-black tracking-[0.3em] text-white">ET-TALIBI</span>
    </a>
  )
}
