"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, UserCheck, Calendar, Trash2, X } from "lucide-react";

interface TertundaBulkBarProps {
  selectedCount: number;
  onClear: () => void;
  onSendReminder: () => void;
  onChangeEvaluator: () => void;
  onExtendDeadline: () => void;
  onCancelAssignment: () => void;
}

export default function TertundaBulkBar({
  selectedCount,
  onClear,
  onSendReminder,
  onChangeEvaluator,
  onExtendDeadline,
  onCancelAssignment,
}: TertundaBulkBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          className="dash-bulk-bar mb-4"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <div className="dash-bulk-left">
            <div className="dash-bulk-check-box" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="dash-bulk-count">
              <strong>{selectedCount}</strong> penugasan dipilih
            </span>
          </div>

          <div className="dash-bulk-right">
            <motion.button
              type="button"
              className="dash-btn-bulk"
              onClick={onSendReminder}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Send size={13} />
              <span>Kirim Reminder</span>
            </motion.button>
            <motion.button
              type="button"
              className="dash-btn-bulk"
              onClick={onChangeEvaluator}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <UserCheck size={13} />
              <span>Ganti Penilai</span>
            </motion.button>
            <motion.button
              type="button"
              className="dash-btn-bulk"
              onClick={onExtendDeadline}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Calendar size={13} />
              <span>Perpanjang</span>
            </motion.button>
            <motion.button
              type="button"
              className="dash-btn-bulk danger"
              onClick={onCancelAssignment}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Trash2 size={13} />
              <span>Batalkan</span>
            </motion.button>
            <motion.button
              type="button"
              className="dash-btn-bulk-close"
              onClick={onClear}
              aria-label="Batal pilih"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={15} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
