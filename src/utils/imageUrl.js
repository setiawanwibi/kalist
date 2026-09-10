const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/'

export function getImageUrl(path, size = 'w500') {
  return path ? `${TMDB_IMAGE_BASE}${size}${path}` : ''
}
