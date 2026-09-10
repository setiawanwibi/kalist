const STORAGE_PREFIX = 'kalist:'

export function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}
