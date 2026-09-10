import { AnimatePresence } from 'framer-motion'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onEdit, onDelete, emptyTitle = 'Nothing here yet.', emptyDescription = 'Add a task to give this list some shape.' }) {
  if (!tasks.length) {
    return (
      <div className="task-empty">
        <span className="empty-line" />
        <h3>{emptyTitle}</h3>
        <p>{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      <AnimatePresence initial={false}>
        {tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)}
      </AnimatePresence>
    </div>
  )
}
