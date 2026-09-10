import { createContext, useContext, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

const TASKS_STORAGE_KEY = 'tasks'
const TaskContext = createContext(null)

function createTaskId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function normalizeTask(task) {
  return {
    id: task.id || createTaskId(),
    title: task.title || '',
    description: task.description || '',
    completed: Boolean(task.completed),
    priority: task.priority || 'medium',
    category: task.category || 'Other',
    date: task.date || '',
    time: task.time || '',
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
  }
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = readStorage(TASKS_STORAGE_KEY, [])
    return Array.isArray(storedTasks) ? storedTasks.map(normalizeTask) : []
  })

  useEffect(() => {
    writeStorage(TASKS_STORAGE_KEY, tasks)
  }, [tasks])

  function addTask(taskDetails) {
    const timestamp = new Date().toISOString()
    const task = normalizeTask({ ...taskDetails, id: createTaskId(), createdAt: timestamp, updatedAt: timestamp })
    setTasks((currentTasks) => [task, ...currentTasks])
    return task
  }

  function updateTask(taskId, taskDetails) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId
        ? normalizeTask({ ...task, ...taskDetails, id: task.id, updatedAt: new Date().toISOString() })
        : task
    )))
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    )))
  }

  function clearCompletedTasks() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  function clearAllTasks() {
    setTasks([])
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTask, clearCompletedTasks, clearAllTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within a TaskProvider')
  return context
}
