import { motion } from 'framer-motion'
import { Check, Edit3, Trash2 } from 'lucide-react'
import { formatDate, formatTime } from '../../utils/date'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const { showToast } = useToast()
  const { t } = useLanguage()
  function handleDelete() {
    if (window.confirm(`Delete “${task.title}”?`)) { onDelete(task.id); showToast(t('tasks.deleted')) }
  }

  return (
    <motion.article className={`task-item${task.completed ? ' task-completed' : ''}`} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
      <button className="task-check" type="button" onClick={() => onToggle(task.id)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`} title={task.completed ? 'Mark incomplete' : 'Mark complete'}>
        {task.completed && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={15} strokeWidth={2.5} /></motion.span>}
      </button>
      <div className="task-content">
        <div className="task-title-line">
          <h3>{task.title}</h3>
          <span className={`priority-dot priority-${task.priority}`} title={`${task.priority} priority`} aria-label={`${task.priority} priority`} />
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span>{task.category}</span>
          <span>{formatDate(task.date, { short: true })}</span>
          {task.time && <span>{formatTime(task.time)}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-button" type="button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task"><Edit3 size={15} /></button>
        <button className="icon-button danger-button" type="button" onClick={handleDelete} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={15} /></button>
      </div>
    </motion.article>
  )
}
