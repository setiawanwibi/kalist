import { motion } from 'framer-motion'

export default function MetricCard({ icon: Icon, label, value, accent = false, detail }) {
  return (
    <motion.div className={`metric-card${accent ? ' metric-card-accent' : ''}`} whileHover={{ y: -2 }}>
      <span className="metric-icon"><Icon size={17} /></span>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </motion.div>
  )
}
