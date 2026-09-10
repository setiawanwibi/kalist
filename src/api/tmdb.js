const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

export class TmdbError extends Error {
  constructor(message, code = 'TMDB_ERROR') {
    super(message)
    this.name = 'TmdbError'
    this.code = code
  }
}

function requireApiKey() {
  if (!TMDB_API_KEY) {
    throw new TmdbError('Add VITE_TMDB_API_KEY to your .env file to search TMDB.', 'MISSING_API_KEY')
  }
}

async function tmdbRequest(path, params = {}, signal) {
  requireApiKey()
  const searchParams = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'en-US', ...params })
  let response
  try {
    response = await fetch(`${TMDB_BASE_URL}${path}?${searchParams}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new TmdbError('TMDB could not be reached. Check your connection and try again.', 'NETWORK_ERROR')
  }
  if (!response.ok) {
    if (response.status === 401) throw new TmdbError('TMDB rejected the API key. Check your .env configuration.', 'INVALID_API_KEY')
    if (response.status === 404) throw new TmdbError('That title could not be found.', 'NOT_FOUND')
    throw new TmdbError('TMDB returned an error. Please try again.', 'API_ERROR')
  }
  return response.json()
}

export function searchMulti(query, signal) {
  return tmdbRequest('/search/multi', { query, include_adult: 'false', page: '1' }, signal)
}

export function searchMovies(query, signal) {
  return tmdbRequest('/search/movie', { query, include_adult: 'false', page: '1' }, signal)
}

export function searchTV(query, signal) {
  return tmdbRequest('/search/tv', { query, page: '1' }, signal)
}

export function getMovieDetails(id, signal) {
  return tmdbRequest(`/movie/${id}`, {}, signal)
}

export function getTVDetails(id, signal) {
  return tmdbRequest(`/tv/${id}`, {}, signal)
}

export function getCredits(mediaType, id, signal) {
  return tmdbRequest(`/${mediaType}/${id}/credits`, {}, signal)
}

export function getVideos(mediaType, id, signal) {
  return tmdbRequest(`/${mediaType}/${id}/videos`, {}, signal)
}
