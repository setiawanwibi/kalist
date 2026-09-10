import { Moon, Sun, Trash2 } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { useTheme } from '../context/ThemeContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useLanguage } from '../context/LanguageContext'

export default function Settings() {
  const { tasks, clearCompletedTasks, clearAllTasks } = useTasks()
  const { theme, setTheme } = useTheme()
  const { watchlist, clearWatchlist } = useWatchlist()
  const { language, setLanguage, t } = useLanguage()

  function resetAllData() {
    if (!window.confirm(t('settings.confirmReset'))) return
    clearAllTasks()
    clearWatchlist()
  }

  function clearCompleted() {
    if (window.confirm(t('settings.confirmCompleted'))) clearCompletedTasks()
  }

  function clearSavedTitles() {
    if (window.confirm(t('settings.confirmSaved'))) clearWatchlist()
  }

  return (
    <div className="productivity-page settings-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">{t('settings.preferences')}</p>
          <h1>{t('settings.title')}</h1>
          <p className="page-subtitle">{t('settings.sub')}</p>
        </div>
      </header>
      <div className="settings-list">
        <section className="settings-row">
          <div><p className="settings-label">{t('settings.appearance')}</p><h2>{t('settings.theme')}</h2><p>{t('settings.themeHint')}</p></div>
          <div className="theme-options" role="group" aria-label={t('settings.themeSelection')}>
            <button className={`theme-option${theme === 'dark' ? ' selected' : ''}`} type="button" onClick={() => setTheme('dark')}><Moon size={16} /> {t('settings.dark')}</button>
            <button className={`theme-option${theme === 'light' ? ' selected' : ''}`} type="button" onClick={() => setTheme('light')}><Sun size={16} /> {t('settings.light')}</button>
          </div>
        </section>
        <section className="settings-row">
          <div><p className="settings-label">{t('settings.language')}</p><h2>{t('settings.language')}</h2><p>{t('settings.languageHint')}</p></div>
          <div className="theme-options" role="group" aria-label={t('settings.language')}>
            <button className={`theme-option${language === 'en' ? ' selected' : ''}`} type="button" onClick={() => setLanguage('en')}>{t('settings.english')}</button>
            <button className={`theme-option${language === 'id' ? ' selected' : ''}`} type="button" onClick={() => setLanguage('id')}>{t('settings.indonesian')}</button>
          </div>
        </section>
        <section className="settings-row">
          <div><p className="settings-label">{t('settings.tasks')}</p><h2>{t('settings.clearCompleted')}</h2><p>{tasks.filter((task) => task.completed).length} {t('settings.clearCompletedHint')}</p></div>
          <button className="button button-secondary" type="button" onClick={clearCompleted} disabled={!tasks.some((task) => task.completed)}><Trash2 size={15} /> {t('settings.clearTasks')}</button>
        </section>
        <section className="settings-row">
          <div><p className="settings-label">{t('settings.watchlist')}</p><h2>{t('settings.clearSaved')}</h2><p>{watchlist.length} {t('settings.clearSavedHint')}</p></div>
          <button className="button button-secondary" type="button" onClick={clearSavedTitles} disabled={!watchlist.length}><Trash2 size={15} /> {t('settings.clearWatchlist')}</button>
        </section>
        <section className="settings-row settings-danger-row">
          <div><p className="settings-label">{t('settings.reset')}</p><h2>{t('settings.resetTitle')}</h2><p>{t('settings.resetHint')}</p></div>
          <button className="button button-danger" type="button" onClick={resetAllData}><Trash2 size={15} /> {t('settings.resetData')}</button>
        </section>
        <p className="tmdb-attribution">{t('settings.attribution')}</p>
      </div>
    </div>
  )
}
