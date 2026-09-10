const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

export function getTodayDate() {
  return getDateValue(new Date())
}

export function getDateValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function formatDate(dateValue, options = {}) {
  if (!dateValue) return 'No date'
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'No date'
  if (options.short) return SHORT_DATE_FORMATTER.format(date)
  return DATE_FORMATTER.format(date)
}

export function isToday(dateValue) {
  return dateValue === getTodayDate()
}

export function isUpcoming(dateValue) {
  return Boolean(dateValue && dateValue > getTodayDate())
}

export function getGreetingKey(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}

export function compareTasksByDateTime(firstTask, secondTask) {
  const first = `${firstTask.date || '9999-12-31'}T${firstTask.time || '23:59'}`
  const second = `${secondTask.date || '9999-12-31'}T${secondTask.time || '23:59'}`
  return first.localeCompare(second) || second.createdAt.localeCompare(first.createdAt)
}

export function compareTasksByPriority(firstTask, secondTask) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return (priorityOrder[firstTask.priority] ?? 3) - (priorityOrder[secondTask.priority] ?? 3)
}

export function formatTime(timeValue) {
  if (!timeValue) return 'Any time'
  const [hours, minutes] = timeValue.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
