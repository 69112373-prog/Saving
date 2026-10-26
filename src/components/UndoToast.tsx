import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBaht } from '../utils/formatters';

export const UndoToast: React.FC = () => {
  const { undoItem, undoDeleteTransaction, dismissUndo } = useApp();

  useEffect(() => {
    if (!undoItem) return;
    const remainingTime = Math.max(0, undoItem.expiresAt - Date.now());
    const timer = setTimeout(() => {
      dismissUndo();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [undoItem, dismissUndo]);

  return (
    <AnimatePresence>
      {undoItem && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] bg-[#2B2B2B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-white/10"
        >
          <div className="flex flex-col text-sm pr-2">
            <span className="font-medium text-white/95">ลบรายการสำเร็จ</span>
            <span className="text-xs text-white/70 line-clamp-1">
              {undoItem.item.note || 'รายการ'} ({formatBaht(undoItem.item.amount)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={undoDeleteTransaction}
              className="bg-[#0F7A68] hover:bg-[#0B4D41] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เลิกทำ</span>
            </button>
            <button
              onClick={dismissUndo}
              className="text-white/60 hover:text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
