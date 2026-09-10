export default function KalistLogo({ compact = false }) {
  return (
    <span className={`kalist-lockup${compact ? ' kalist-lockup-compact' : ''}`}>
      <svg className="kalist-mark" viewBox="0 0 32 32" role="img" aria-labelledby="kalist-logo-title">
        <title id="kalist-logo-title">KALIST mark</title>
        <path d="M7 5v22M7 16 24 5M13 16l11 11" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M18 16h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      </svg>
      <span className="kalist-wordmark"><span>KALIST</span><small>by kajoe</small></span>
    </span>
  )
}
