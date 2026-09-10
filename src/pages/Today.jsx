import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, ListChecks, Plus, Sparkles } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import ProgressSummary from '../components/tasks/ProgressSummary'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'
import { compareTasksByDateTime, compareTasksByPriority, formatDate, formatTime, getDateValue, getGreetingKey, getTodayDate, isToday, isUpcoming } from '../utils/date'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import CompletionCelebration from '../components/common/CompletionCelebration'
import MetricCard from '../components/common/MetricCard'
import EmptyState from '../components/common/EmptyState'

export default function Today() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks()
  const [editingTask, setEditingTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const { t } = useLanguage()
  const { showToast } = useToast()
  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 60000)
    return () => window.clearInterval(clock)
  }, [])
  const todayTasks = useMemo(() => tasks.filter((task) => isToday(task.date)).sort((first, second) => {
    return compareTasksByDateTime(first, second) || compareTasksByPriority(first, second)
  }), [tasks])
  const upcomingTasks = useMemo(() => tasks.filter((task) => !task.completed && isUpcoming(task.date)).sort(compareTasksByDateTime).slice(0, 5), [tasks])

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

  const allTodayComplete = todayTasks.length > 0 && todayTasks.every((task) => task.completed)

  function handleToggle(taskId) {
    const target = todayTasks.find((task) => task.id === taskId)
    toggleTask(taskId)
    if (target && !target.completed) {
      showToast(t('tasks.completed'), t('tasks.nice'))
      if (todayTasks.every((task) => task.id === taskId || task.completed) && sessionStorage.getItem(`kalist:celebrated:${getTodayDate()}`) !== '1') {
        sessionStorage.setItem(`kalist:celebrated:${getTodayDate()}`, '1')
        setShowCelebration(true)
      }
    } else showToast(t('tasks.incomplete'))
  }

  return (
    <div className="productivity-page today-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">{formatDate(getDateValue(currentTime))}</p>
          <h1>{t(`greeting.${getGreetingKey(currentTime.getHours())}`)}</h1>
          <p className="page-subtitle">{t('today.subtitle')}</p>
        </div>
        <button className="button button-primary add-task-button" type="button" onClick={() => showForm()}><Plus size={17} /> {t('tasks.add')}</button>
      </header>

      <div className="today-metrics">
        <MetricCard icon={ListChecks} label={t('today.tasks')} value={todayTasks.length} detail={t('today.focus')} />
        <MetricCard icon={CheckCircle2} label={t('today.completedMetric')} value={todayTasks.filter((task) => task.completed).length} detail={t('today.completed')} accent />
        <MetricCard icon={CalendarDays} label={t('today.remainingMetric')} value={todayTasks.filter((task) => !task.completed).length} detail={t('tasks.remaining')} />
        <MetricCard icon={Sparkles} label="Progress" value={`${todayTasks.length ? Math.round((todayTasks.filter((task) => task.completed).length / todayTasks.length) * 100) : 0}%`} detail={t('today.progress')} accent />
      </div>
      <div className="today-grid">
        <div className="today-main">
          <ProgressSummary tasks={todayTasks} />
          <section className="task-section" aria-labelledby="today-tasks-title">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{t('tasks.focus')}</p>
                <h2 id="today-tasks-title">{t('tasks.todayTasks')}</h2>
              </div>
              <span className="section-count">{todayTasks.length}</span>
            </div>
            {todayTasks.length === 0 ? <EmptyState icon={CalendarDays} title={t('today.clearTitle')} description={t('today.clearDescription')} action={<button className="button button-primary" type="button" onClick={() => showForm()}><Plus size={16} /> {t('tasks.add')}</button>} /> : <TaskList
              tasks={todayTasks}
              onToggle={handleToggle}
              onEdit={showForm}
              onDelete={deleteTask}
              emptyTitle={allTodayComplete ? t('tasks.clear') : t('tasks.nothing')}
              emptyDescription={t('tasks.empty')}
            />}
          </section>
        </div>

        <aside className="upcoming-panel" aria-labelledby="upcoming-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{t('tasks.upcoming')}</p>
              <h2 id="upcoming-title">{t('tasks.upcoming')}</h2>
            </div>
          </div>
          {upcomingTasks.length ? (
            <div className="upcoming-list">
              {upcomingTasks.map((task) => (
                <button className="upcoming-item" type="button" key={task.id} onClick={() => showForm(task)}>
                  <span className="upcoming-date">{formatDate(task.date, { short: true })}</span>
                  <span className="upcoming-title">{task.title}</span>
                  <span className="upcoming-time">{formatTime(task.time)} <i className={`priority-dot priority-${task.priority}`} /></span>
                </button>
              ))}
            </div>
          ) : (
            <p className="upcoming-empty">{t('today.upcomingEmpty')}</p>
          )}
        </aside>
      </div>
      {isFormOpen && <TaskForm task={editingTask} onClose={closeForm} onSave={saveTask} />}
      {showCelebration && <CompletionCelebration onClose={() => setShowCelebration(false)} />}
    </div>
  )
}
