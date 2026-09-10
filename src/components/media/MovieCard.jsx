import { motion } from 'framer-motion'
import { Check, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/imageUrl'
import ImageWithFallback from '../common/ImageWithFallback'
import { useLanguage } from '../../context/LanguageContext'

export default function MovieCard({ item, onAdd, isSaved, onRemove, onToggleWatched }) {
  const mediaType = item.mediaType || (item.name ? 'tv' : 'movie')
  const title = item.title || item.name || 'Untitled'
  const posterPath = item.posterPath || item.poster_path
  const releaseDate = item.releaseDate || item.release_date || item.first_air_date
  const detailPath = `/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`
  const year = releaseDate?.slice(0, 4) || 'Unknown year'
  const rating = Number(item.voteAverage ?? item.vote_average ?? 0)
  const { t } = useLanguage()

  return (
    <motion.article className={`media-card${item.watched ? ' media-watched' : ''}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link className="media-poster" to={detailPath} aria-label={`${t('common.open')} ${title}`}>
        <ImageWithFallback src={getImageUrl(posterPath)} alt={`${title} poster`} fallback={title.slice(0, 1)} />
        {item.watched && <span className="watched-badge"><Check size={12} /> Watched</span>}
      </Link>
      <div className="media-card-body">
        <div className="media-title-row">
          <Link to={detailPath}><h3>{title}</h3></Link>
          {rating > 0 && <span className="media-rating">{rating.toFixed(1)}</span>}
        </div>
        <p className="media-meta">{year} <span>/</span> {mediaType === 'tv' ? t('media.tv') : t('media.movie')}{item.personalRating ? <><span>/</span> <b className="my-rating-inline">★ {item.personalRating.toFixed(1)}</b></> : null}</p>
        <div className="media-actions">
          {onAdd ? <button className="media-action" type="button" onClick={() => onAdd(item)} disabled={isSaved}>{isSaved ? <Check size={14} /> : <Plus size={14} />} {isSaved ? t('media.savedAction') : t('media.save')}</button> : <button className="media-action" type="button" onClick={() => onToggleWatched(item.id, mediaType)}>{item.watched ? <EyeOff size={14} /> : <Eye size={14} />} {item.watched ? t('media.unwatch') : t('media.watch')}</button>}
          {onRemove && <button className="media-action media-remove" type="button" onClick={() => onRemove(item.id, mediaType)} aria-label={`${t('media.remove')} ${title}`} title={t('media.remove')}><Trash2 size={14} /></button>}
        </div>
      </div>
    </motion.article>
  )
}
