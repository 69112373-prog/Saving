import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  EyeOff,
  Bell,
  Flame,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  PiggyBank,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { formatBaht, formatMaskedBaht, formatThaiDate } from '../utils/formatters';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const {
    metrics,
    profile,
    updateProfile,
    streak,
    goals,
    transactions,
    categories,
    setActiveTab,
    setIsNotificationOpen,
    notifications,
    setIsQuickExpenseOpen
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentTransactions = transactions.slice(0, 4);
  const featuredGoals = goals.slice(0, 2);

  // Calculate percentage of today's remaining
  const todayProgressPercent = metrics.todayAllowance > 0
    ? Math.min(100, Math.max(0, Math.round((metrics.todayRemainingAfterSpent / metrics.todayAllowance) * 100)))
    : 0;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#5E5E5E]">สวัสดีวันนี้ 👋</span>
            <span className="text-[10px] font-bold text-[#0F7A68] bg-[#D5F0E8] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Firebase ซิงค์แล้ว
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#0B4D41] tracking-tight">เหลือเก็บ</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Eye hide balance toggle */}
          <button
            onClick={() => updateProfile({ hideBalance: !profile.hideBalance })}
            className="w-10 h-10 rounded-full bg-white text-[#5E5E5E] hover:text-[#0F7A68] flex items-center justify-center shadow-xs border border-[#D9D5D5] active:scale-95 transition-all"
            title={profile.hideBalance ? 'แสดงยอดเงิน' : 'ซ่อนยอดเงิน'}
          >
            {profile.hideBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          {/* Notification Button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative w-10 h-10 rounded-full bg-white text-[#5E5E5E] hover:text-[#0F7A68] flex items-center justify-center shadow-xs border border-[#D9D5D5] active:scale-95 transition-all"
            title="การแจ้งเตือน"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#C62828] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Gentle warning banner when spending pace is fast (>15%) - Non-judgmental tone */}
      {metrics.isSpendingFast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-[#EEF8F5] border border-[#8FD6C2] rounded-2xl flex items-start gap-3 shadow-xs"
        >
          <div className="p-1.5 bg-[#8FD6C2] rounded-xl text-[#0B4D41] shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-[#B26A00]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B26A00]">ใช้จ่ายเร็วกว่าปกตินิดหน่อย (+{metrics.paceExcessPercent}%)</span>
            </div>
            <p className="text-xs text-[#5E5E5E] mt-0.5 leading-relaxed">
              ช่วงนี้ลองชะลอค่ากาแฟหรือของจุกจิกลงสักนิด เพื่อให้มีเงินเหลือเก็บตามเป้าสิ้นเดือนนะ
            </p>
          </div>
        </motion.div>
      )}

      {/* BIG CARD: วันนี้ใช้ได้อีก ฿ X (ตัวเลขนี้ใหญ่ที่สุดในหน้า) */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#5CC9AE] to-[#1E9E88] text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-white/20 text-7xl font-black select-none pointer-events-none">
          ฿
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-white/90">
              โควตาวันนี้
            </span>
            <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-medium">
              เหลืออีก {metrics.daysRemaining} วันในเดือนนี้
            </span>
          </div>

          <div className="mt-3">
            <span className="text-xs text-white/80 block">วันนี้ใช้ได้อีก</span>
            <div className="text-[38px] sm:text-[44px] font-black tracking-tight leading-none text-[#0B4D41] drop-shadow-xs my-1 tabular-nums">
              {formatMaskedBaht(metrics.todayRemainingAfterSpent, profile.hideBalance)}
            </div>
          </div>

          {/* Progress bar and comparison */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs mb-1.5 text-white/95">
              <span>
                จากงบเฉลี่ยวันละ <strong className="font-bold">{formatMaskedBaht(metrics.dailyBudgetBaseline, profile.hideBalance)}</strong>
              </span>
              <span className="font-semibold">{todayProgressPercent}% คงเหลือ</span>
            </div>
            <div className="w-full h-2.5 bg-black/15 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todayProgressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-white rounded-full shadow-xs"
              />
            </div>
            {metrics.spentToday > 0 && (
              <span className="text-[11px] text-white/80 mt-1 block">
                (วันนี้ใช้ไปแล้ว {formatMaskedBaht(metrics.spentToday, profile.hideBalance)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DUAL CARD: คาดการณ์เหลือสิ้นเดือน & Streak N วัน */}
      <div className="grid grid-cols-2 gap-3">
        {/* Forecast Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5E5E5E]">
            <span className="font-medium">คาดการณ์สิ้นเดือน</span>
            <div className="w-6 h-6 rounded-lg bg-[#EEF8F5] flex items-center justify-center text-[#0F7A68]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2">
            <div className={`text-xl font-bold tracking-tight tabular-nums ${metrics.projectedMonthEndSavings >= 0 ? 'text-[#0F7A68]' : 'text-[#C62828]'}`}>
              {formatMaskedBaht(metrics.projectedMonthEndSavings, profile.hideBalance)}
            </div>
            <span className="text-[10px] text-[#5E5E5E]">
              {metrics.projectedMonthEndSavings >= 0 ? 'มีแนวโน้มเหลือเก็บ' : 'อาจใช้เกินงบ'}
            </span>
          </div>
          <div className="text-[11px] text-[#0F7A68] font-semibold flex items-center gap-1">
            <span>ออมราว {metrics.savingsRatePercent}% ของรายได้</span>
          </div>
        </div>

        {/* Streak Card */}
        <div
          onClick={() => setActiveTab('challenges')}
          className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#F2B01E] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#5E5E5E]">
            <span className="font-medium">Streak บันทึก</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-[#F2B01E]">
              <Flame className="w-3.5 h-3.5 fill-[#F2B01E]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-[#2B2B2B] tracking-tight">
              {streak.current} <span className="text-sm font-normal text-[#5E5E5E]">วันติด</span>
            </div>
            <span className="text-[10px] text-[#5E5E5E]">สถิติดีสุด: {streak.best} วัน</span>
          </div>
          <div className="text-[11px] text-[#B26A00] font-semibold flex items-center justify-between">
            <span>ตั๋วพัก: {streak.skipTickets} ใบ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Freelance Reserves Card (If Freelancer Mode active) */}
      {profile.isFreelancer && (
        <div className="p-4 rounded-2xl bg-[#EEF8F5] border border-[#8FD6C2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F7A68] text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0B4D41]">กระเป๋าฟรีแลนซ์อัตโนมัติ</div>
              <div className="text-[11px] text-[#5E5E5E]">
                กันสำรอง {profile.emergencyFundPercent}% • สำรองภาษี {profile.taxDeductionPercent}%
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-bold text-[#0F7A68] hover:underline"
          >
            ตั้งค่า
          </button>
        </div>
      )}

      {/* Auto Roundup Virtual Piggy bank widget */}
      {profile.autoRoundup && profile.virtualSavingsPool > 0 && (
        <div className="p-3.5 rounded-2xl bg-white border border-[#8FD6C2] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8FD6C2] text-[#0B4D41] flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0B4D41]">กระปุกเศษเงินปัดเศษ</span>
              <p className="text-[10px] text-[#5E5E5E]">สะสมเงินทอนเสมือนแล้ว</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-[#0F7A68]">
              +{formatBaht(profile.virtualSavingsPool)}
            </span>
          </div>
        </div>
      )}

      {/* Featured Goals: 1-2 Cards with progress bar & 65,000 / 100,000 บาท */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B2B2B]">เป้าหมายออมหลัก</h2>
          <button
            onClick={() => setActiveTab('goals')}
            className="text-xs font-semibold text-[#0F7A68] flex items-center gap-0.5 hover:underline"
          >
            <span>ดูทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {featuredGoals.map(goal => {
            const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
            return (
              <div
                key={goal.id}
                onClick={() => setActiveTab('goals')}
                className="p-3.5 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs hover:border-[#8FD6C2] cursor-pointer transition-all flex items-center gap-3.5"
              >
                {goal.image ? (
                  <img
                    src={goal.image}
                    alt={goal.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#D9D5D5]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#EEF8F5] text-[#0F7A68] flex items-center justify-center shrink-0">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#2B2B2B] truncate">{goal.name}</h3>
                    <span className="text-xs font-bold text-[#0F7A68]">{percent}%</span>
                  </div>

                  <div className="text-[11px] text-[#5E5E5E] mt-0.5 mb-1.5">
                    {formatBaht(goal.saved)} / {formatBaht(goal.target)}
                  </div>

                  <div className="w-full h-2 bg-[#F0EEEE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#25AA94] to-[#0F7A68] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions: 3-5 items + Link "ดูทั้งหมด" */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B2B2B]">รายการล่าสุด</h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-[#0F7A68] flex items-center gap-0.5 hover:underline"
          >
            <span>ดูทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-white border border-[#D9D5D5] divide-y divide-[#F0EEEE] shadow-xs overflow-hidden">
          {recentTransactions.map(tx => {
            const cat = categories.find(c => c.id === tx.categoryId);
            const isExpense = tx.kind === 'expense';
            return (
              <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-[#EEF8F5]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold ${
                    isExpense ? 'bg-[#EEF8F5] text-[#0F7A68]' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {cat?.name.slice(0, 2) || 'จด'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2B2B2B]">{tx.note || cat?.name || 'รายการ'}</div>
                    <div className="text-[10px] text-[#5E5E5E] flex items-center gap-1.5 mt-0.5">
                      <span>{formatThaiDate(tx.date)}</span>
                      {tx.source === 'synced' && (
                        <span className="bg-[#D5F0E8] text-[#0B4D41] px-1.5 py-0.2 rounded-md font-medium text-[9px]">
                          เชื่อมบัญชี
                        </span>
                      )}
                      {profile.isFreelancer && (
                        <span className="text-[#5E5E5E]">
                          • {tx.wallet === 'work' ? 'งาน' : 'ส่วนตัว'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`text-xs font-bold tabular-nums ${isExpense ? 'text-[#2B2B2B]' : 'text-emerald-600'}`}>
                  {isExpense ? '-' : '+'} {formatMaskedBaht(tx.amount, profile.hideBalance)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
