import { Search, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const FILTERS = [
  { value: 'all', label: 'All tasks' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'high', label: 'High priority' },
]

export default function TaskFilters({ search, onSearchChange, filter, onFilterChange, category, onCategoryChange, sort, onSortChange, categories }) {
  const { t } = useLanguage()
  const labels = { all: t('tasks.all'), today: t('tasks.todayTasks'), upcoming: t('tasks.upcoming'), completed: t('tasks.completedFilter'), high: t('tasks.high') }
  const categoryLabels = { Work: t('tasks.work'), Personal: t('tasks.personal'), Study: t('tasks.study'), Project: t('tasks.project'), Other: t('tasks.other') }
  return (
    <div className="task-toolbar">
      <label className="search-field">
        <Search size={16} />
        <span className="sr-only">{t('tasks.search')}</span>
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={t('tasks.search')} />
      </label>
      <div className="filter-scroll" aria-label="Task filters">
        <SlidersHorizontal className="filter-icon" size={16} aria-hidden="true" />
        {FILTERS.map((item) => (
          <button key={item.value} className={`filter-button${filter === item.value ? ' selected' : ''}`} type="button" onClick={() => onFilterChange(item.value)}>{labels[item.value]}</button>
        ))}
      </div>
      <div className="select-filters">
        <label>
          <span className="sr-only">{t('tasks.category')}</span>
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="all">{t('tasks.allCategories')}</option>
            {categories.map((item) => <option key={item} value={item}>{categoryLabels[item] || item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">{t('tasks.status')}</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            <option value="relevant">{t('tasks.nearest')}</option>
            <option value="date">{t('tasks.dateSort')}</option>
            <option value="priority">{t('tasks.prioritySort')}</option>
            <option value="created">{t('tasks.created')}</option>
            <option value="status">{t('tasks.status')}</option>
          </select>
        </label>
      </div>
    </div>
  )
}
