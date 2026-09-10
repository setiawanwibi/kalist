import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div className="designed-empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <span className="empty-icon"><Icon size={22} /></span>
      <span className="empty-accent" />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </motion.div>
  )
}
