export default function ContactSidebar() {
  return (
    <aside className="hidden lg:flex items-center justify-center">
      <svg viewBox="0 0 420 520" fill="none" className="w-full max-w-[380px]" aria-hidden="true">        {/* Ambient glow */}
        <ellipse cx="210" cy="260" rx="160" ry="200" fill="rgba(126,168,255,0.04)"/>

        {/* Central card */}
        <rect x="60" y="120" width="300" height="280" rx="24" fill="rgba(255,255,255,0.025)" stroke="rgba(126,168,255,0.14)" strokeWidth="1"/>
        <rect x="60" y="120" width="300" height="52" rx="24" fill="rgba(126,168,255,0.06)"/>
        <rect x="60" y="148" width="300" height="24" fill="rgba(126,168,255,0.06)"/>

        {/* Header dots */}
        <circle cx="88" cy="146" r="5" fill="rgba(255,255,255,0.12)"/>
        <circle cx="106" cy="146" r="5" fill="rgba(255,255,255,0.07)"/>
        <circle cx="124" cy="146" r="5" fill="rgba(255,255,255,0.07)"/>
        <rect x="170" y="140" width="80" height="12" rx="6" fill="rgba(126,168,255,0.22)"/>

        {/* Envelope icon area */}
        <rect x="160" y="188" width="100" height="72" rx="14" fill="rgba(126,168,255,0.07)" stroke="rgba(126,168,255,0.18)" strokeWidth="1"/>
        <rect x="172" y="200" width="76" height="48" rx="6" fill="none" stroke="rgba(126,168,255,0.5)" strokeWidth="1.4"/>
        <path d="M172 206 L210 228 L248 206" stroke="rgba(126,168,255,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Text lines */}
        <rect x="100" y="278" width="220" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>
        <rect x="120" y="296" width="180" height="8" rx="4" fill="rgba(255,255,255,0.06)"/>
        <rect x="130" y="312" width="160" height="8" rx="4" fill="rgba(255,255,255,0.04)"/>

        {/* Divider */}
        <line x1="80" y1="336" x2="340" y2="336" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>

        {/* CTA button shape */}
        <rect x="140" y="350" width="140" height="36" rx="18" fill="rgba(126,168,255,0.12)" stroke="rgba(126,168,255,0.25)" strokeWidth="1"/>
        <rect x="162" y="362" width="96" height="12" rx="6" fill="rgba(126,168,255,0.35)"/>

        {/* Floating node top-left */}
        <rect x="20" y="60" width="88" height="56" rx="14" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <circle cx="38" cy="78" r="8" fill="rgba(126,168,255,0.12)" stroke="rgba(126,168,255,0.2)" strokeWidth="1"/>
        <rect x="52" y="73" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.1)"/>
        <rect x="52" y="85" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.05)"/>
        <line x1="80" y1="116" x2="100" y2="130" stroke="rgba(126,168,255,0.12)" strokeWidth="1" strokeDasharray="3 3"/>

        {/* Floating node top-right */}
        <rect x="312" y="60" width="88" height="56" rx="14" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <circle cx="330" cy="78" r="8" fill="rgba(126,168,255,0.12)" stroke="rgba(126,168,255,0.2)" strokeWidth="1"/>
        <rect x="344" y="73" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.1)"/>
        <rect x="344" y="85" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.05)"/>
        <line x1="340" y1="116" x2="320" y2="130" stroke="rgba(126,168,255,0.12)" strokeWidth="1" strokeDasharray="3 3"/>

        {/* Floating node bottom-left */}
        <rect x="14" y="390" width="100" height="44" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <rect x="26" y="404" width="56" height="7" rx="3.5" fill="rgba(126,168,255,0.2)"/>
        <rect x="26" y="416" width="36" height="5" rx="2.5" fill="rgba(255,255,255,0.05)"/>
        <line x1="80" y1="390" x2="90" y2="400" stroke="rgba(126,168,255,0.1)" strokeWidth="1" strokeDasharray="3 3"/>

        {/* Floating node bottom-right */}
        <rect x="306" y="390" width="100" height="44" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <rect x="318" y="404" width="56" height="7" rx="3.5" fill="rgba(126,168,255,0.2)"/>
        <rect x="318" y="416" width="36" height="5" rx="2.5" fill="rgba(255,255,255,0.05)"/>
        <line x1="340" y1="390" x2="330" y2="400" stroke="rgba(126,168,255,0.1)" strokeWidth="1" strokeDasharray="3 3"/>

        {/* Orbit ring */}
        <circle cx="210" cy="260" r="175" stroke="rgba(126,168,255,0.04)" strokeWidth="1" strokeDasharray="4 8"/>

        {/* Accent dots */}
        <circle cx="210" cy="85" r="4" fill="rgba(126,168,255,0.3)"/>
        <circle cx="210" cy="85" r="8" fill="none" stroke="rgba(126,168,255,0.1)" strokeWidth="1"/>
        <circle cx="60" cy="260" r="3" fill="rgba(126,168,255,0.2)"/>
        <circle cx="360" cy="260" r="3" fill="rgba(126,168,255,0.2)"/>
      </svg>
    </aside>
  )
}
