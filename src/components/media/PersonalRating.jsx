import { motion } from 'framer-motion'
import { RotateCcw, Star } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

export default function PersonalRating({ value, onChange }) {
  const { t } = useLanguage()
  return (
    <div className="personal-rating" aria-label={t('rating.myRating')}>
      <div className="rating-heading"><span>{t('rating.myRating')}</span><strong>{value ? value.toFixed(1) : t('rating.noRating')}</strong></div>
      <div className="rating-stars" role="radiogroup" aria-label={t('rating.myRating')}>
        {VALUES.map((rating) => <motion.button key={rating} className={`rating-star${value >= rating ? ' selected' : ''}`} type="button" role="radio" aria-checked={value === rating} aria-label={`${rating} ${rating % 1 ? t('rating.half') : t('rating.full')}`} onClick={() => onChange(value === rating ? null : rating)} whileTap={{ scale: .86 }} whileHover={{ scale: 1.12 }}><Star size={21} fill={value >= rating ? 'currentColor' : 'none'} /></motion.button>)}
      </div>
      {value && <button className="rating-reset" type="button" onClick={() => onChange(null)}><RotateCcw size={12} /> {t('rating.remove')}</button>}
    </div>
  )
}
