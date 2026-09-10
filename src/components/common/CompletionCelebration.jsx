import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function CompletionCelebration({ onClose }) {
  const { t } = useLanguage()
  return <div className="celebration-backdrop" role="presentation"><motion.section className="celebration-modal" role="dialog" aria-modal="true" aria-labelledby="celebration-title" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }}>
    <button className="icon-button celebration-close" type="button" onClick={onClose} aria-label={t('common.close')}><X size={17} /></button>
    <div className="celebration-icon"><Check size={27} /></div>
    <p className="eyebrow">{t('tasks.dayCompleted')}</p>
    <h2 id="celebration-title">{t('tasks.dayMessage')}</h2>
    <button className="button button-primary" type="button" onClick={onClose}>{t('common.close')}</button>
  </motion.section></div>
}
