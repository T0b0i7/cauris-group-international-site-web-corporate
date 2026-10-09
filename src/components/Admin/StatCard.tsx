import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, accent, delay = 0 }: {
  label: string; value: number | string; icon: LucideIcon; accent?: string; delay?: number;
}) {
  return (
    <motion.div
      className="stat-card stat-elegant"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <div className="stat-top">
        <div className="stat-icon" style={accent ? { background: accent } : undefined}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
