import { useState } from 'react'
import { X } from 'lucide-react'
import { getTodayDate } from '../../utils/date'
import { useLanguage } from '../../context/LanguageContext'

const CATEGORIES = ['Work', 'Personal', 'Study', 'Project', 'Other']
const PRIORITIES = ['low', 'medium', 'high']

const EMPTY_FORM = {
  title: '',
  description: '',
  date: getTodayDate(),
  time: '',
  priority: 'medium',
  category: 'Other',
}

export default function TaskForm({ task, onClose, onSave }) {
  const [form, setForm] = useState(task ? { ...EMPTY_FORM, ...task } : EMPTY_FORM)
  const [error, setError] = useState('')
  const { t } = useLanguage()
  const categoryLabels = { Work: t('tasks.work'), Personal: t('tasks.personal'), Study: t('tasks.study'), Project: t('tasks.project'), Other: t('tasks.other') }
  const priorityLabels = { low: t('tasks.low'), medium: t('tasks.medium'), high: t('tasks.high') }

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) {
      setError(t('tasks.validation'))
      return
    }
    onSave({ ...form, title })
  }

  return (
    <div className="form-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="task-form-modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="form-header">
          <div>
            <p className="section-kicker">{task ? t('tasks.editTask') : t('tasks.newTask')}</p>
            <h2 id="task-form-title">{task ? t('tasks.editPrompt') : t('tasks.titlePrompt')}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close task form" title="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="field field-wide">
            <span>{t('tasks.title')} <b aria-hidden="true">*</b></span>
            <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Finish portfolio review" autoFocus />
          </label>
          <label className="field field-wide">
            <span>{t('tasks.description')}</span>
            <textarea name="description" value={form.description} onChange={updateField} placeholder="A little context, if useful" rows="3" />
          </label>
          <div className="form-grid">
            <label className="field">
              <span>{t('tasks.date')}</span>
              <input type="date" name="date" value={form.date} onChange={updateField} />
            </label>
            <label className="field">
              <span>{t('tasks.time')}</span>
              <input type="time" name="time" value={form.time} onChange={updateField} />
            </label>
            <label className="field">
              <span>{t('tasks.priority')}</span>
              <select name="priority" value={form.priority} onChange={updateField}>
                {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>{t('tasks.category')}</span>
              <select name="category" value={form.category} onChange={updateField}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
            </label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button className="button button-quiet" type="button" onClick={onClose}>{t('common.cancel')}</button>
            <button className="button button-primary" type="submit">{task ? t('common.save') : t('tasks.add')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
