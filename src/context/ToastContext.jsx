import { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  function showToast(message, detail = '') {
    setToast({ message, detail, id: Date.now() })
    window.setTimeout(() => setToast(null), 3200)
  }

  return <ToastContext.Provider value={{ showToast }}>
    {children}
    <AnimatePresence>
      {toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} key={toast.id}>
        <span className="toast-icon"><Check size={14} /></span><span><strong>{toast.message}</strong>{toast.detail && <small>{toast.detail}</small>}</span><button type="button" onClick={() => setToast(null)} aria-label="Close notification"><X size={14} /></button>
      </motion.div>}
    </AnimatePresence>
  </ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
