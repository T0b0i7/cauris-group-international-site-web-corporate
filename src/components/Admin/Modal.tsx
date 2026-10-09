import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({ open, title, onClose, onSave, saveLabel = 'Enregistrer', children }: {
  open: boolean; title: string; onClose: () => void; onSave: () => void; saveLabel?: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="modal-head"><h3>{title}</h3><button onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
            <div className="modal-body form-grid">{children}</div>
            <div className="modal-foot">
              <button className="btn-secondary" onClick={onClose}>Annuler</button>
              <button className="btn-primary" onClick={onSave}>{saveLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Skeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="table-wrap" style={{ padding: 16 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-line"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}
