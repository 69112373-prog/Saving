import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Check, Flame, AlertTriangle, Sparkles, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-5 h-5 text-[#F2B01E]" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-[#B26A00]" />;
      case 'cheer':
        return <Sparkles className="w-5 h-5 text-[#0F7A68]" />;
      default:
        return <Bell className="w-5 h-5 text-[#25AA94]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-[380px] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-[#D9D5D5]"
      >
        <div className="p-4 border-b border-[#F0EEEE] flex items-center justify-between bg-[#EEF8F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8FD6C2] flex items-center justify-center text-[#0B4D41]">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0B4D41] text-base">การแจ้งเตือน</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5E5E5E] hover:bg-[#D9D5D5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-[#5E5E5E] text-sm">
              ไม่มีการแจ้งเตือนใหม่ในขณะนี้
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  n.read
                    ? 'bg-[#F0EEEE]/50 border-transparent text-[#5E5E5E]'
                    : 'bg-[#EEF8F5] border-[#8FD6C2] shadow-xs'
                }`}
              >
                <div className="shrink-0 mt-0.5">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${n.read ? 'text-[#2B2B2B]' : 'text-[#0B4D41]'}`}>
                      {n.title}
                    </span>
                    <span className="text-[10px] text-[#5E5E5E]">{n.date}</span>
                  </div>
                  <p className="text-xs text-[#5E5E5E] mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-[#F0EEEE] bg-white text-center">
          <button
            onClick={() => {
              notifications.forEach(n => markNotificationRead(n.id));
            }}
            className="text-xs text-[#0F7A68] hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>อ่านทั้งหมดแล้ว</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
