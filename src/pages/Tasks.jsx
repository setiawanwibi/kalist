import { useMemo, useState } from 'react'
import { CheckCircle2, ListChecks, Plus, Timer } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import ProgressSummary from '../components/tasks/ProgressSummary'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'
import { compareTasksByDateTime, compareTasksByPriority, isToday, isUpcoming } from '../utils/date'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import MetricCard from '../components/common/MetricCard'

const CATEGORIES = ['Work', 'Personal', 'Study', 'Project', 'Other']

function sortTasks(tasks, sort) {
  const sorted = [...tasks]
  if (sort === 'priority') return sorted.sort((first, second) => compareTasksByPriority(first, second) || compareTasksByDateTime(first, second))
  if (sort === 'created') return sorted.sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  if (sort === 'status') return sorted.sort((first, second) => Number(first.completed) - Number(second.completed) || compareTasksByDateTime(first, second))
  return sorted.sort(compareTasksByDateTime)
}

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks()
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('relevant')
  const [search, setSearch] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { showToast } = useToast()
  const { t } = useLanguage()

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = tasks.filter((task) => {
      const matchesQuery = !query || [task.title, task.description, task.category].some((value) => value.toLowerCase().includes(query))
      const matchesFilter = filter === 'all'
        || (filter === 'today' && isToday(task.date))
        || (filter === 'upcoming' && isUpcoming(task.date) && !task.completed)
        || (filter === 'completed' && task.completed)
        || (filter === 'high' && task.priority === 'high')
      const matchesCategory = category === 'all' || task.category === category
      return matchesQuery && matchesFilter && matchesCategory
    })
    return sortTasks(filtered, sort)
  }, [tasks, search, filter, category, sort])

  function showForm(task = null) {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingTask(null)
    setIsFormOpen(false)
  }

  function saveTask(taskDetails) {
    if (editingTask) {
      updateTask(editingTask.id, taskDetails)
      showToast(t('tasks.updated'))
    } else {
      addTask(taskDetails)
      showToast(t('tasks.added'))
    }
    closeForm()
  }

  return (
    <div className="productivity-page tasks-page">
      <header className="page-heading tasks-heading">
        <div>
          <p className="eyebrow">{t('tasks.library')}</p>
          <h1>{t('tasks.libraryTitle')}</h1>
          <p className="page-subtitle">{t('tasks.librarySub')}</p>
        </div>
        <button className="button button-primary add-task-button" type="button" onClick={() => showForm()}><Plus size={17} /> {t('tasks.add')}</button>
      </header>

      <div className="tasks-overview">
        <ProgressSummary tasks={tasks} compact />
        <div className="task-metrics">
          <MetricCard icon={ListChecks} label={t('today.tasks')} value={tasks.length} />
          <MetricCard icon={CheckCircle2} label={t('today.completedMetric')} value={tasks.filter((task) => task.completed).length} accent />
          <MetricCard icon={Timer} label={t('today.remainingMetric')} value={tasks.filter((task) => !task.completed).length} />
        </div>
      </div>
      <TaskFilters search={search} onSearchChange={setSearch} filter={filter} onFilterChange={setFilter} category={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort} categories={CATEGORIES} />
      <section className="task-section all-tasks-section" aria-labelledby="all-tasks-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{t('tasks.yourList')}</p>
            <h2 id="all-tasks-title">{t('tasks.allTasks')}</h2>
          </div>
          <span className="section-count">{visibleTasks.length}</span>
        </div>
        <TaskList tasks={visibleTasks} onToggle={toggleTask} onEdit={showForm} onDelete={deleteTask} emptyTitle={search || filter !== 'all' || category !== 'all' ? t('tasks.noMatch') : t('tasks.quiet')} emptyDescription={search || filter !== 'all' || category !== 'all' ? t('tasks.tryFilter') : t('tasks.addRemember')} />
      </section>
      {isFormOpen && <TaskForm task={editingTask} onClose={closeForm} onSave={saveTask} />}
    </div>
  )
}
