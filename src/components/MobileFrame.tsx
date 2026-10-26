import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Receipt,
  Target,
  Trophy,
  User,
  Plus,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { QuickExpenseModal } from './QuickExpenseModal';
import { NotificationModal } from './NotificationModal';
import { UndoToast } from './UndoToast';
import { LockScreen } from './LockScreen';
import { OnboardingModal } from './OnboardingModal';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    isQuickExpenseOpen,
    setIsQuickExpenseOpen,
    isNotificationOpen,
    setIsNotificationOpen,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'หน้าแรก', icon: Home },
    { id: 'transactions', label: 'รายการ', icon: Receipt },
    { id: 'goals', label: 'เป้าหมาย', icon: Target },
    { id: 'challenges', label: 'ชาเลนจ์', icon: Trophy },
    { id: 'profile', label: 'โปรไฟล์', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-[#DEDCD9] py-0 sm:py-6 flex items-center justify-center font-sans antialiased text-[#2B2B2B]">
      {/* Mobile Frame Container: 390px - 430px */}
      <div className="w-full sm:max-w-[410px] min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-[#F0EEEE] sm:rounded-[44px] shadow-2xl border-0 sm:border-[8px] sm:border-[#2B2B2B] flex flex-col relative overflow-hidden sm:ring-1 sm:ring-black/10">
        
        {/* Simulated Mobile Status Bar */}
        <div className="shrink-0 px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-[#2B2B2B] select-none bg-[#F0EEEE]">
          <span>{currentTime}</span>
          
          {/* Dynamic Island / Speaker Pill */}
          <div className="w-24 h-4 bg-[#2B2B2B] rounded-full mx-auto hidden sm:block shadow-inner" />

          <div className="flex items-center gap-1.5 text-[#2B2B2B]">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Viewport Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-1 pb-24 scroll-smooth">
          {children}
        </div>

        {/* Floating Quick Action Button: "+ จดรายจ่าย" (Thumb zone, min-height 44px) */}
        {activeTab === 'home' && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <button
              onClick={() => setIsQuickExpenseOpen(true)}
              className="min-h-[46px] px-6 py-2.5 bg-[#0F7A68] hover:bg-[#0B4D41] text-white rounded-full font-bold text-sm shadow-xl flex items-center gap-2 border-2 border-white active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>จดรายจ่าย</span>
            </button>
          </div>
        )}

        {/* Bottom Navigation Bar: 5 Tabs */}
        <nav className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#D9D5D5] px-2 py-1 flex items-center justify-around safe-area-bottom">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all select-none ${
                  isActive
                    ? 'text-[#0F7A68]'
                    : 'text-[#5E5E5E] hover:text-[#2B2B2B]'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#EEF8F5]' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Global Modals & Overlays */}
        <QuickExpenseModal
          isOpen={isQuickExpenseOpen}
          onClose={() => setIsQuickExpenseOpen(false)}
        />

        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        <LockScreen />
        <OnboardingModal />
        <UndoToast />
      </div>
    </div>
  );
};
