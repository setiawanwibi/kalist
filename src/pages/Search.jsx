import { useEffect, useMemo, useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { searchMulti, TmdbError } from '../api/tmdb'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/media/MovieCard'
import { useLanguage } from '../context/LanguageContext'

const DEBOUNCE_MS = 450

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const { addToWatchlist, isInWatchlist } = useWatchlist()
  const { t } = useLanguage()

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const nextQuery = debouncedQuery.trim()
    if (nextQuery.length < 2) {
      setResults([])
      setStatus('idle')
      setError('')
      if (searchParams.get('q')) setSearchParams({}, { replace: true })
      return undefined
    }

    const controller = new AbortController()
    setStatus('loading')
    setError('')
    setSearchParams({ q: nextQuery }, { replace: true })
    searchMulti(nextQuery, controller.signal)
      .then((data) => {
        setResults((data.results || []).filter((item) => item.media_type === 'movie' || item.media_type === 'tv'))
        setStatus('success')
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setStatus('error')
        setError(requestError instanceof TmdbError ? requestError.message : 'Something went wrong while searching TMDB.')
      })
    return () => controller.abort()
  }, [debouncedQuery, searchParams, setSearchParams])

  const resultCountLabel = useMemo(() => `${results.length} ${t('media.titles')}`, [results.length, t])

  function clearSearch() {
    setQuery('')
    setDebouncedQuery('')
  }

  return (
    <div className="productivity-page search-page">
      <header className="page-heading search-heading">
        <div>
          <p className="eyebrow">{t('media.discover')}</p>
          <h1>{t('media.searchTitle')}</h1>
          <p className="page-subtitle">{t('media.searchSub')}</p>
        </div>
      </header>
      <form className="media-search-form" onSubmit={(event) => event.preventDefault()}>
        <SearchIcon size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="media-search">{t('media.searchPlaceholder')}</label>
        <input id="media-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('media.searchPlaceholder')} autoComplete="off" />
        {query && <button type="button" onClick={clearSearch} aria-label="Clear search" title="Clear search"><X size={17} /></button>}
      </form>

      {status === 'idle' && <div className="search-state"><p className="section-kicker">{t('media.start')}</p><h2>{t('media.question')}</h2><p>{t('media.searchHint')}</p></div>}
      {status === 'loading' && <div className="media-grid media-grid-skeleton" aria-label={t('media.start')}>{[1, 2, 3, 4].map((item) => <div className="media-skeleton" key={item}><span /><div /></div>)}</div>}
      {status === 'error' && <div className="search-state search-error" role="alert"><p className="section-kicker">{t('media.searchUnavailable')}</p><h2>{error}</h2><p>{t('media.configHint')}</p></div>}
      {status === 'success' && !results.length && <div className="search-state"><p className="section-kicker">{t('media.noResults')}</p><h2>{t('media.noResults')}</h2><p>{t('media.noResultsHint')}</p></div>}
      {status === 'success' && results.length > 0 && (
        <section className="search-results" aria-labelledby="search-results-title">
          <div className="section-heading"><div><p className="section-kicker">{t('media.results')}</p><h2 id="search-results-title">{resultCountLabel}</h2></div></div>
          <div className="media-grid">
            {results.map((item) => <MovieCard key={`${item.media_type}-${item.id}`} item={item} isSaved={isInWatchlist(item.id, item.media_type)} onAdd={addToWatchlist} />)}
          </div>
        </section>
      )}
    </div>
  )
}
