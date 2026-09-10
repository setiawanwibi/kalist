import { useMemo, useState } from 'react'
import { Clapperboard, Film, Plus, Star, Tv } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import MediaGrid from '../components/media/MediaGrid'
import { useLanguage } from '../context/LanguageContext'
import MetricCard from '../components/common/MetricCard'

export default function Watchlist() {
  const { watchlist, removeFromWatchlist, toggleWatched } = useWatchlist()
  const { t } = useLanguage()
  const FILTERS = [{ value: 'all', label: t('media.all') }, { value: 'movie', label: t('media.movies') }, { value: 'tv', label: t('media.tvShows') }, { value: 'watched', label: t('media.watched') }, { value: 'unwatched', label: t('media.unwatched') }]
  const [filter, setFilter] = useState('all')
  const filteredItems = useMemo(() => watchlist.filter((item) => {
    if (filter === 'movie' || filter === 'tv') return item.mediaType === filter
    if (filter === 'watched') return item.watched
    if (filter === 'unwatched') return !item.watched
    return true
  }), [watchlist, filter])

  return (
    <div className="productivity-page watchlist-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">{t('media.savedLater')}</p>
          <h1>{t('media.watchlist')}</h1>
          <p className="page-subtitle">{t('media.watchlistSub')}</p>
        </div>
        <Link className="button button-secondary" to="/search"><Plus size={17} /> {t('media.find')}</Link>
      </header>
      <div className="media-toolbar" aria-label="Watchlist filters">
        <span className="toolbar-count">{watchlist.length} {t('media.titles')}</span>
        <div className="media-filters">
          {FILTERS.map((item) => <button className={`filter-button${filter === item.value ? ' selected' : ''}`} type="button" key={item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}
        </div>
      </div>
      <div className="media-metrics">
        <MetricCard icon={Clapperboard} label={t('media.saved')} value={watchlist.length} />
        <MetricCard icon={Film} label={t('media.movies')} value={watchlist.filter((item) => item.mediaType === 'movie').length} />
        <MetricCard icon={Tv} label={t('media.tvShows')} value={watchlist.filter((item) => item.mediaType === 'tv').length} />
        <MetricCard icon={Star} label={t('media.rated')} value={watchlist.filter((item) => item.personalRating).length} accent />
      </div>
      {filteredItems.length ? <MediaGrid items={filteredItems} onRemove={removeFromWatchlist} onToggleWatched={toggleWatched} /> : (
        <div className="watchlist-empty">
          <div className="placeholder-mark" aria-hidden="true"><Clapperboard size={21} /></div>
          <h2>{watchlist.length ? t('media.noView') : t('media.emptyWatchlist')}</h2>
          <p>{watchlist.length ? t('media.tryView') : t('media.emptyWatchlistHint')}</p>
          {!watchlist.length && <Link className="primary-link" to="/search">{t('media.find')} <span aria-hidden="true">&#8594;</span></Link>}
        </div>
      )}
    </div>
  )
}
