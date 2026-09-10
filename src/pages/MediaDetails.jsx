import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, Clapperboard, Play, Plus, Star, X } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getCredits, getMovieDetails, getTVDetails, getVideos, TmdbError } from '../api/tmdb'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { useWatchlist } from '../context/WatchlistContext'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import { getImageUrl } from '../utils/imageUrl'
import PersonalRating from '../components/media/PersonalRating'

function pickTrailer(videos = []) {
  return videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) || videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
}

export default function MediaDetails({ mediaType }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const [cast, setCast] = useState([])
  const [trailer, setTrailer] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const { watchlist, addToWatchlist, removeFromWatchlist, toggleWatched, isInWatchlist, setPersonalRating } = useWatchlist()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const isTV = mediaType === 'tv'

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError('')
    setDetails(null)
    Promise.allSettled([
      isTV ? getTVDetails(id, controller.signal) : getMovieDetails(id, controller.signal),
      getCredits(mediaType, id, controller.signal),
      getVideos(mediaType, id, controller.signal),
    ]).then(([detailsResult, creditsResult, videosResult]) => {
      if (detailsResult.status === 'rejected') throw detailsResult.reason
      const mediaDetails = detailsResult.value
      const credits = creditsResult.status === 'fulfilled' ? creditsResult.value : { cast: [] }
      const videos = videosResult.status === 'fulfilled' ? videosResult.value : { results: [] }
      setDetails(mediaDetails)
      setCast((credits.cast || []).slice(0, 12))
      setTrailer(pickTrailer(videos.results || []))
      setStatus('success')
    }).catch((requestError) => {
      if (requestError.name === 'AbortError') return
      setStatus('error')
      setError(requestError instanceof TmdbError ? requestError.message : 'Something went wrong while loading this title.')
    })
    return () => controller.abort()
  }, [id, isTV, mediaType])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsTrailerOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const watchlistItem = useMemo(() => details && ({
    id: details.id,
    mediaType,
    title: details.title || details.name,
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    releaseDate: details.release_date || details.first_air_date,
    voteAverage: details.vote_average,
  }), [details, mediaType])
  const saved = details ? isInWatchlist(details.id, mediaType) : false
  const watched = saved && watchlist.find((item) => item.id === details.id && item.mediaType === mediaType)?.watched
  const personalRating = saved ? watchlist.find((item) => item.id === details.id && item.mediaType === mediaType)?.personalRating : null
  const title = details?.title || details?.name || ''
  const date = details?.release_date || details?.first_air_date

  function handleWatchlist() {
    if (!watchlistItem) return
    if (saved) { removeFromWatchlist(details.id, mediaType); showToast(t('common.remove'), title) }
    else { addToWatchlist(watchlistItem); showToast(t('common.saved'), title) }
  }

  function handleWatched() {
    if (!details) return
    if (!saved) addToWatchlist({ ...watchlistItem, watched: true })
    else toggleWatched(details.id, mediaType)
  }

  if (status === 'loading') return <div className="details-page"><div className="details-skeleton"><span /><div><i /><i /><i /></div></div></div>
  if (status === 'error' || !details) return <div className="details-page details-error"><div className="placeholder-mark"><Clapperboard size={21} /></div><p className="eyebrow">{t('media.detailsError')}</p><h1>{error || t('media.titleNotFound')}</h1><p>{t('media.detailsHint')}</p><div className="details-error-actions"><button className="button button-primary" type="button" onClick={() => navigate(0)}>{t('common.retry')}</button><Link className="button button-secondary" to="/search">{t('common.backSearch')}</Link></div></div>

  return (
    <div className="details-page">
      <div className="details-backdrop">
        <ImageWithFallback src={getImageUrl(details.backdrop_path, 'original')} alt="" fallback="" />
        <div />
      </div>
      <div className="details-content">
        <Link className="details-back-link" to={location.state?.from || '/search'}><ArrowLeft size={16} /> {t('media.back')}</Link>
        <section className="details-hero" aria-labelledby="details-title">
          <div className="details-poster"><ImageWithFallback src={getImageUrl(details.poster_path, 'w500')} alt={`${title} poster`} fallback={title.slice(0, 1)} /></div>
          <div className="details-summary">
            <p className="eyebrow">{isTV ? t('media.tv') : t('media.movie')}</p>
            <h1 id="details-title">{title}</h1>
            <div className="details-meta"><span>{date?.slice(0, 4) || t('media.yearUnknown')}</span><span>{details.runtime ? `${details.runtime} min` : details.number_of_seasons ? `${details.number_of_seasons} ${t('media.seasons')}` : t('media.runtimeUnknown')}</span><span className="rating"><Star size={14} fill="currentColor" /> {details.vote_average?.toFixed(1) || '—'}</span></div>
            <div className="genre-list">{details.genres?.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
            <p className="details-overview">{details.overview || t('media.noOverview')}</p>
            <div className="details-actions">
              <button className="button button-primary" type="button" onClick={handleWatchlist}>{saved ? <Check size={16} /> : <Plus size={16} />} {saved ? t('media.remove') : t('media.save')}</button>
              <button className="button button-secondary" type="button" onClick={handleWatched}>{watched ? <Check size={16} /> : <Clapperboard size={16} />} {watched ? t('media.watched') : t('media.watch')}</button>
              {trailer && <button className="button button-quiet" type="button" onClick={() => setIsTrailerOpen(true)}><Play size={16} /> {t('media.watchTrailer')}</button>}
            </div>
            {saved && <PersonalRating value={personalRating} onChange={(rating) => { setPersonalRating(details.id, mediaType, rating); showToast(rating ? t('rating.save') : t('rating.removed'), title) }} />}
          </div>
        </section>
        <section className="details-section" aria-labelledby="cast-title"><div className="section-heading"><div><p className="section-kicker">{t('media.people')}</p><h2 id="cast-title">{t('media.cast')}</h2></div></div>{cast.length ? <div className="cast-grid">{cast.map((person) => <div className="cast-item" key={person.credit_id || person.id}><ImageWithFallback src={getImageUrl(person.profile_path, 'w185')} alt={person.name} fallback={person.name.slice(0, 1)} /><strong>{person.name}</strong><span>{person.character || t('media.cast')}</span></div>)}</div> : <p className="details-muted">{t('media.castUnavailable')}</p>}</section>
        {isTV && <section className="details-section" aria-labelledby="seasons-title"><div className="section-heading"><div><p className="section-kicker">{t('media.chapters')}</p><h2 id="seasons-title">{t('media.seasons')}</h2></div></div><div className="season-grid">{(details.seasons || []).filter((season) => season.season_number > 0).map((season) => <div className="season-item" key={season.id}><ImageWithFallback src={getImageUrl(season.poster_path, 'w185')} alt="" fallback="S" /><div><strong>{season.name}</strong><span>{season.episode_count} {t('media.episodes')} <i>/</i> {season.air_date?.slice(0, 4) || t('media.dateUnknown')}</span></div></div>)}</div></section>}
      </div>
      {isTrailerOpen && trailer && <div className="trailer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsTrailerOpen(false)}><section className="trailer-modal" role="dialog" aria-modal="true" aria-labelledby="trailer-title"><div className="trailer-header"><h2 id="trailer-title">{title} {t('media.trailer')}</h2><button className="icon-button" type="button" onClick={() => setIsTrailerOpen(false)} aria-label={t('common.close')}><X size={18} /></button></div><div className="trailer-frame"><iframe title={`${title} ${t('media.trailer')}`} src={`https://www.youtube.com/embed/${trailer.key}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></section></div>}
    </div>
  )
}
