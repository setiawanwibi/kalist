import { createContext, useContext, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

const WATCHLIST_STORAGE_KEY = 'watchlist'
const WatchlistContext = createContext(null)

function createMediaId(media) {
  return `${media.mediaType || 'movie'}-${media.id}`
}

function normalizeMedia(media) {
  return {
    id: media.id,
    mediaType: media.mediaType || 'movie',
    title: media.title || media.name || 'Untitled',
    posterPath: media.posterPath || media.poster_path || '',
    backdropPath: media.backdropPath || media.backdrop_path || '',
    releaseDate: media.releaseDate || media.release_date || media.first_air_date || '',
    voteAverage: Number(media.voteAverage ?? media.vote_average ?? 0),
    watched: Boolean(media.watched),
    personalRating: media.personalRating ? Number(media.personalRating) : null,
    addedAt: media.addedAt || new Date().toISOString(),
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const storedItems = readStorage(WATCHLIST_STORAGE_KEY, [])
    return Array.isArray(storedItems) ? storedItems.map(normalizeMedia) : []
  })

  useEffect(() => {
    writeStorage(WATCHLIST_STORAGE_KEY, watchlist)
  }, [watchlist])

  function addToWatchlist(media) {
    const normalizedMedia = normalizeMedia(media)
    setWatchlist((currentItems) => currentItems.some((item) => createMediaId(item) === createMediaId(normalizedMedia))
      ? currentItems
      : [{ ...normalizedMedia, addedAt: new Date().toISOString() }, ...currentItems])
  }

  function removeFromWatchlist(mediaId, mediaType) {
    setWatchlist((currentItems) => currentItems.filter((item) => createMediaId(item) !== `${mediaType || 'movie'}-${mediaId}`))
  }

  function toggleWatched(mediaId, mediaType) {
    setWatchlist((currentItems) => currentItems.map((item) => (
      createMediaId(item) === `${mediaType || 'movie'}-${mediaId}` ? { ...item, watched: !item.watched } : item
    )))
  }

  function isInWatchlist(mediaId, mediaType) {
    return watchlist.some((item) => createMediaId(item) === `${mediaType || 'movie'}-${mediaId}`)
  }

  function clearWatchlist() {
    setWatchlist([])
  }

  function setPersonalRating(mediaId, mediaType, rating) {
    setWatchlist((currentItems) => currentItems.map((item) => (
      createMediaId(item) === `${mediaType || 'movie'}-${mediaId}`
        ? { ...item, personalRating: rating ? Number(rating) : null }
        : item
    )))
  }

  return <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, toggleWatched, isInWatchlist, clearWatchlist, setPersonalRating }}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider')
  return context
}
