export default function Logo({ inverted = false }: { inverted?: boolean }) {
  const bg   = inverted ? '#fff' : '#000'
  const fg   = inverted ? '#000' : '#fff'
  const fgSub = inverted ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)'

  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <rect width="120" height="120" rx="18" fill={bg}/>
      {/* Airplane */}
      <g fill={fg} opacity="0.9">
        <path d="M60 10 L67 19 L63 19 L63 27 L57 27 L57 19 L53 19 Z"/>
        <path d="M55 21 L39 29 L39 32 L55 26 Z"/>
        <path d="M65 21 L81 29 L81 32 L65 26 Z"/>
        <path d="M58 26 L49 33 L49 35 L58 29 Z"/>
        <path d="M62 26 L71 33 L71 35 L62 29 Z"/>
      </g>
      {/* Castle body */}
      <g fill={fg}>
        <rect x="29" y="60" width="62" height="30" rx="1"/>
        {/* Left tower */}
        <rect x="25" y="45" width="15" height="45" rx="1"/>
        <rect x="25" y="41" width="4" height="5" rx="1"/>
        <rect x="31" y="41" width="4" height="5" rx="1"/>
        <rect x="36" y="41" width="4" height="5" rx="1"/>
        {/* Right tower */}
        <rect x="80" y="45" width="15" height="45" rx="1"/>
        <rect x="80" y="41" width="4" height="5" rx="1"/>
        <rect x="86" y="41" width="4" height="5" rx="1"/>
        <rect x="92" y="41" width="4" height="5" rx="1"/>
        {/* Center tower */}
        <rect x="51" y="51" width="18" height="39" rx="1"/>
        <rect x="51" y="47" width="4" height="5" rx="1"/>
        <rect x="57" y="47" width="4" height="5" rx="1"/>
        <rect x="65" y="47" width="4" height="5" rx="1"/>
        {/* Gate */}
        <rect x="55" y="73" width="10" height="17" rx="4" fill={inverted ? '#fff' : bg}/>
        {/* Windows */}
        <rect x="33" y="65" width="5" height="7" rx="1" fill={inverted ? '#fff' : bg}/>
        <rect x="82" y="65" width="5" height="7" rx="1" fill={inverted ? '#fff' : bg}/>
      </g>
      <text x="60" y="101" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="21" fill={fg} letterSpacing="3">ČAU</text>
      <text x="60" y="113" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="8.5" fill={fgSub} letterSpacing="3">BRATISLAVA</text>
    </svg>
  )
}
