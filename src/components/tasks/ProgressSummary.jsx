import { useLanguage } from '../../context/LanguageContext'

export default function ProgressSummary({ tasks, compact = false }) {
  const { t } = useLanguage()
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const remaining = total - completed
  const percentage = total ? Math.round((completed / total) * 100) : 0

  return (
    <section className={`progress-summary${compact ? ' progress-summary-compact' : ''}`} aria-label={t('today.progress')}>
      <div className="progress-heading">
        <div>
          <p className="section-kicker">{t('today.progress')}</p>
          <p className="progress-count"><strong>{completed}</strong> {t('today.of')} {total} {t('today.completed')}</p>
        </div>
        <span className="progress-percent">{percentage}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${percentage}%` }} />
      </div>
      <p className="progress-detail">{remaining} {t('tasks.remaining')}</p>
    </section>
  )
}
