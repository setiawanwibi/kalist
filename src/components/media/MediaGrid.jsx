import { AnimatePresence } from 'framer-motion'
import MovieCard from './MovieCard'

export default function MediaGrid({ items, onRemove, onToggleWatched }) {
  return (
    <div className="media-grid">
      <AnimatePresence initial={false}>
        {items.map((item) => <MovieCard key={`${item.mediaType}-${item.id}`} item={item} onRemove={onRemove} onToggleWatched={onToggleWatched} />)}
      </AnimatePresence>
    </div>
  )
}
