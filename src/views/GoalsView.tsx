import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Plus,
  Calendar,
  PiggyBank,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CreditCard,
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';
import { formatBaht, formatThaiDate } from '../utils/formatters';
import { calculateGoalPacing, calculateRoundup } from '../utils/calculations';
import { motion, AnimatePresence } from 'motion/react';

export const GoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    addMoneyToGoal,
    budgets,
    categories,
    transactions,
    debts,
    recordDebtPayment,
    profile,
    updateProfile,
    triggerCelebration
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'goals' | 'budgets' | 'debts'>('goals');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [payDebtId, setPayDebtId] = useState<string | null>(null);
  const [debtAmount, setDebtAmount] = useState<string>('');

  // New goal form states
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalImageUrl, setGoalImageUrl] = useState('');

  // Calculate pacing for preview when creating goal
  const previewPacing = (() => {
    const target = parseFloat(goalTarget.replace(/,/g, '')) || 0;
    if (target <= 0 || !goalDeadline) return null;
    return calculateGoalPacing({
      id: 'preview',
      name: goalName,
      target,
      saved: 0,
      deadline: goalDeadline,
      autoSave: false,
    });
  })();

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget.replace(/,/g, ''));
    if (!goalName || !target || !goalDeadline) return;

    addGoal({
      name: goalName,
      target,
      deadline: goalDeadline,
      image: goalImageUrl.trim() || undefined,
      autoSave: true,
    });

    setGoalName('');
    setGoalTarget('');
    setGoalDeadline('');
    setGoalImageUrl('');
    setShowNewGoalModal(false);
    triggerCelebration();
  };

  const handleDepositSubmit = () => {
    const amt = parseFloat(depositAmount);
    if (depositGoalId && amt > 0) {
      addMoneyToGoal(depositGoalId, amt);
      setDepositGoalId(null);
    }
  };

  const handlePayDebtSubmit = () => {
    const amt = parseFloat(debtAmount);
    if (payDebtId && amt > 0) {
      recordDebtPayment(payDebtId, amt);
      setPayDebtId(null);
      setDebtAmount('');
      triggerCelebration();
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-[#0B4D41]">เป้าหมายและงบประมาณ</h1>
          <p className="text-xs text-[#5E5E5E]">วางแผนอนาคต ควบคุมงบ และปลดหนี้</p>
        </div>
      </div>

      {/* Sub Tabs: Goals / Category Budgets / Debts */}
      <div className="flex p-1 bg-[#F0EEEE] rounded-2xl border border-[#D9D5D5]/60 text-xs">
        <button
          onClick={() => setActiveSubTab('goals')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeSubTab === 'goals'
              ? 'bg-white text-[#0B4D41] shadow-xs'
              : 'text-[#5E5E5E] hover:text-[#2B2B2B]'
          }`}
        >
          🎯 เป้าออมเงิน ({goals.length})
        </button>
        <button
          onClick={() => setActiveSubTab('budgets')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeSubTab === 'budgets'
              ? 'bg-white text-[#0B4D41] shadow-xs'
              : 'text-[#5E5E5E] hover:text-[#2B2B2B]'
          }`}
        >
          📊 งบรายหมวด
        </button>
        <button
          onClick={() => setActiveSubTab('debts')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeSubTab === 'debts'
              ? 'bg-white text-[#0B4D41] shadow-xs'
              : 'text-[#5E5E5E] hover:text-[#2B2B2B]'
          }`}
        >
          💳 ตัวติดตามหนี้ ({debts.length})
        </button>
      </div>

      {/* Auto-roundup Virtual Savings Switch Banner */}
      <div className="p-4 rounded-2xl bg-[#EEF8F5] border border-[#8FD6C2] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F7A68] text-white flex items-center justify-center">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#0B4D41]">สวิตช์ออมอัตโนมัติ (ปัดเศษ)</span>
              <span className="text-[10px] bg-white text-[#0F7A68] px-1.5 py-0.2 rounded font-medium border border-[#8FD6C2]">
                เสมือน
              </span>
            </div>
            <p className="text-[11px] text-[#5E5E5E]">
              ปัดเศษเงินทอนทุกครั้งที่จ่าย (ไม่ย้ายเงินจริง) สะสมแล้ว {formatBaht(profile.virtualSavingsPool)}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={profile.autoRoundup}
            onChange={e => updateProfile({ autoRoundup: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#D9D5D5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F7A68]"></div>
        </label>
      </div>

      {/* SUBTAB 1: GOALS */}
      {activeSubTab === 'goals' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {goals.map(goal => {
              const pacing = calculateGoalPacing(goal);
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs space-y-3 hover:border-[#8FD6C2] transition-colors"
                >
                  <div className="flex gap-3">
                    {goal.image ? (
                      <img
                        src={goal.image}
                        alt={goal.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#D9D5D5]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#EEF8F5] text-[#0F7A68] flex items-center justify-center shrink-0">
                        <Target className="w-7 h-7" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-bold text-[#2B2B2B] truncate">{goal.name}</h3>
                        <span className="text-xs font-bold text-[#0F7A68] shrink-0">
                          {pacing.percentCompleted}%
                        </span>
                      </div>

                      <div className="text-xs text-[#5E5E5E] mt-0.5">
                        เก็บแล้ว <strong className="text-[#0B4D41] font-semibold">{formatBaht(goal.saved)}</strong> / เป้าหมาย {formatBaht(goal.target)}
                      </div>

                      <div className="text-[10px] text-[#5E5E5E] mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#0F7A68]" />
                        <span>เดดไลน์: {formatThaiDate(goal.deadline)} (เหลือ {pacing.daysLeft} วัน)</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-[#F0EEEE] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pacing.percentCompleted}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#25AA94] to-[#0F7A68] rounded-full"
                    />
                  </div>

                  {/* Dynamic calculation banner: "ต้องเก็บวันละ / สัปดาห์ละ / เดือนละเท่าไหร่" */}
                  <div className="p-2.5 bg-[#EEF8F5] rounded-xl text-xs flex items-center justify-between text-[#0B4D41]">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0F7A68]" />
                      <span>
                        ต้องเก็บวันละ <strong>{formatBaht(pacing.requiredPerDay)}</strong> (หรือ ~{formatBaht(pacing.requiredPerMonth)}/ด.)
                      </span>
                    </div>

                    <button
                      onClick={() => setDepositGoalId(goal.id)}
                      className="px-2.5 py-1 bg-[#0F7A68] text-white text-[11px] font-semibold rounded-lg hover:bg-[#0B4D41] active:scale-95 transition-all"
                    >
                      + เติมเงินออม
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: BUDGETS (Color threshold rule: <70% Green, 70-90% Amber, >90% Red with TEXT LABELS) */}
      {activeSubTab === 'budgets' && (
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-[#D9D5D5] text-xs text-[#5E5E5E] space-y-1">
            <div className="font-semibold text-[#2B2B2B] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#0F7A68]" />
              <span>เกณฑ์ควบคุมงบประมาณ</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
              <span className="text-[#0F7A68]">● &lt;70% ปลอดภัย</span>
              <span className="text-[#B26A00]">● 70-90% ใกล้เต็ม</span>
              <span className="text-[#C62828]">● &gt;90% เกินงบ</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {budgets.map(b => {
              const cat = categories.find(c => c.id === b.categoryId);
              // Calculate spent for this category this month
              const spent = transactions
                .filter(t => t.categoryId === b.categoryId && t.kind === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

              const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

              // Rule: <70% Green, 70-90% Amber, >90% Red with clear text label (ไม่พึ่งสีอย่างเดียว)
              let statusLabel = 'ปลอดภัย';
              let statusColorClass = 'text-[#0F7A68] bg-[#EEF8F5] border-[#8FD6C2]';
              let barColorClass = 'bg-[#0F7A68]';

              if (percent > 90) {
                statusLabel = 'เกินงบหรือใกล้เต็มแล้ว';
                statusColorClass = 'text-[#C62828] bg-rose-50 border-rose-200';
                barColorClass = 'bg-[#C62828]';
              } else if (percent >= 70) {
                statusLabel = 'ใช้ไปเยอะแล้ว ระวัง';
                statusColorClass = 'text-[#B26A00] bg-amber-50 border-amber-200';
                barColorClass = 'bg-[#B26A00]';
              }

              return (
                <div key={b.id} className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#2B2B2B]">{cat?.name || 'หมวดหมู่'}</h3>
                      <div className="text-[11px] text-[#5E5E5E] mt-0.5">
                        ใช้แล้ว {formatBaht(spent)} / เพดาน {formatBaht(b.limit)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold tabular-nums text-[#2B2B2B]">{percent}%</span>
                      <div className={`mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusColorClass}`}>
                        {statusLabel}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-[#F0EEEE] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColorClass} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DEBTS TRACKER */}
      {activeSubTab === 'debts' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200 text-xs text-[#2B2B2B]">
            <div className="font-bold text-[#C62828] flex items-center gap-1.5 mb-1">
              <CreditCard className="w-4 h-4" />
              <span>ติดตามและเร่งปลดหนี้</span>
            </div>
            <p className="text-[11px] text-[#5E5E5E]">
              จ่ายตรงเวลาเพื่อไม่เสียประวัติและลดดอกเบี้ยสะสม ระบบจะแจ้งเตือนก่อนครบกำหนด
            </p>
          </div>

          <div className="space-y-3">
            {debts.map(debt => {
              const paidPercent = debt.total > 0
                ? Math.min(100, Math.round(((debt.total - debt.remaining) / debt.total) * 100))
                : 0;

              return (
                <div key={debt.id} className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#2B2B2B]">{debt.name}</h3>
                      <div className="text-sm font-extrabold text-[#C62828] mt-0.5">
                        คงเหลือ {formatBaht(debt.remaining)}
                      </div>
                      <div className="text-[10px] text-[#5E5E5E]">จากยอดเต็ม {formatBaht(debt.total)} (ดอกเบี้ย {debt.interest}%)</div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#B26A00] font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ครบกำหนด: {formatThaiDate(debt.dueDate)}
                      </span>
                      <div className="text-[11px] text-[#5E5E5E] mt-1">
                        ขั้นต่ำ {formatBaht(debt.minPayment)}
                      </div>
                    </div>
                  </div>

                  {/* Progress paid */}
                  <div>
                    <div className="flex justify-between text-[11px] text-[#5E5E5E] mb-1">
                      <span>ปลดหนี้แล้ว</span>
                      <span className="font-bold text-[#0F7A68]">{paidPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F0EEEE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0F7A68] rounded-full"
                        style={{ width: `${paidPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Pay button */}
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setPayDebtId(debt.id);
                        setDebtAmount(String(debt.minPayment));
                      }}
                      className="px-3 py-1.5 bg-[#0F7A68] hover:bg-[#0B4D41] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <span>บันทึกจ่ายค่างวด</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STICKY BOTTOM BUTTON: "+ ตั้งเป้าใหม่" (Prompt specification) */}
      <div className="pt-2">
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="w-full min-h-[48px] bg-[#0F7A68] hover:bg-[#0B4D41] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>+ ตั้งเป้าใหม่</span>
        </button>
      </div>

      {/* Modal: Create New Goal with Live Pacing Calculation */}
      <AnimatePresence>
        {showNewGoalModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[390px] w-full border border-[#D9D5D5] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEEE]">
                <h3 className="font-bold text-base text-[#0B4D41]">ตั้งเป้าหมายออมใหม่</h3>
                <button
                  onClick={() => setShowNewGoalModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F0EEEE] flex items-center justify-center text-[#5E5E5E]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="py-3 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">
                    ชื่อเป้าหมาย (เช่น เที่ยวญี่ปุ่น, ซื้อไอโฟน)
                  </label>
                  <input
                    type="text"
                    value={goalName}
                    onChange={e => setGoalName(e.target.value)}
                    placeholder="เช่น เที่ยวไต้หวันปลายปี"
                    className="w-full px-3 py-2 text-xs bg-[#F0EEEE] rounded-xl border border-transparent focus:border-[#0F7A68] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">
                    จำนวนเงินเป้าหมาย (บาท)
                  </label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={e => setGoalTarget(e.target.value)}
                    placeholder="เช่น 35000"
                    className="w-full px-3 py-2 text-xs bg-[#F0EEEE] rounded-xl border border-transparent focus:border-[#0F7A68] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">
                    เดดไลน์ที่ต้องการบรรลุ
                  </label>
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={e => setGoalDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F0EEEE] rounded-xl border border-transparent focus:border-[#0F7A68] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2B2B] block mb-1">
                    ลิงก์รูปภาพประกอบ (ไม่บังคับ)
                  </label>
                  <input
                    type="url"
                    value={goalImageUrl}
                    onChange={e => setGoalImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-[#F0EEEE] rounded-xl border border-transparent focus:border-[#0F7A68] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Calculation preview */}
                {previewPacing && (
                  <div className="p-3 bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-xs text-[#0B4D41] space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#0F7A68]" />
                      <span>แอปคำนวณให้แล้ว:</span>
                    </div>
                    <div>• ต้องเก็บวันละ: <strong>{formatBaht(previewPacing.requiredPerDay)}</strong></div>
                    <div>• หรือสัปดาห์ละ: <strong>{formatBaht(previewPacing.requiredPerWeek)}</strong></div>
                    <div>• หรือเดือนละ: <strong>{formatBaht(previewPacing.requiredPerMonth)}</strong></div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewGoalModal(false)}
                    className="flex-1 py-2.5 bg-[#F0EEEE] text-xs font-semibold rounded-xl text-[#2B2B2B]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#0F7A68] text-white text-xs font-semibold rounded-xl hover:bg-[#0B4D41]"
                  >
                    ตั้งเป้าใหม่
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Deposit into Goal */}
      <AnimatePresence>
        {depositGoalId && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[320px] w-full border border-[#D9D5D5]"
            >
              <h3 className="font-bold text-sm text-[#0B4D41] mb-2">เติมเงินออมเข้าเป้าหมาย</h3>
              <p className="text-xs text-[#5E5E5E] mb-3">ระบุจำนวนเงินที่ต้องการออมเพิ่ม</p>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0F7A68]">฿</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-base font-bold bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-[#0B4D41] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 py-2 bg-[#F0EEEE] text-xs font-semibold rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDepositSubmit}
                  className="flex-1 py-2 bg-[#0F7A68] text-white text-xs font-semibold rounded-xl"
                >
                  บันทึก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Pay Debt */}
      <AnimatePresence>
        {payDebtId && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[320px] w-full border border-[#D9D5D5]"
            >
              <h3 className="font-bold text-sm text-[#2B2B2B] mb-2">บันทึกชำระหนี้</h3>
              <p className="text-xs text-[#5E5E5E] mb-3">ยอดชำระนี้จะถูกบันทึกเป็นรายจ่ายอัตโนมัติ</p>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#C62828]">฿</span>
                <input
                  type="number"
                  value={debtAmount}
                  onChange={e => setDebtAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-base font-bold bg-rose-50 border border-rose-200 rounded-xl text-[#C62828] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPayDebtId(null)}
                  className="flex-1 py-2 bg-[#F0EEEE] text-xs font-semibold rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handlePayDebtSubmit}
                  className="flex-1 py-2 bg-[#0F7A68] text-white text-xs font-semibold rounded-xl"
                >
                  ยืนยันจ่าย
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
