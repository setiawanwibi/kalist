import { useState } from 'react'

export default function ImageWithFallback({ src, alt, className = '', fallback = 'K' }) {
  const [hasError, setHasError] = useState(!src)

  if (hasError) return <span className={`image-fallback ${className}`} aria-label={alt}>{fallback}</span>

  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} />
}
