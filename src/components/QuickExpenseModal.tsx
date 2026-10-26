import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Utensils,
  Coffee,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  Sparkles,
  Delete,
  Briefcase,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBaht } from '../utils/formatters';

interface QuickExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({ isOpen, onClose }) => {
  const { categories, accounts, profile, addTransaction, setActiveTab, triggerCelebration } = useApp();

  const [kind, setKind] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string>('cat-food');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('acc-kbank');
  const [wallet, setWallet] = useState<'personal' | 'work'>('personal');
  const [note, setNote] = useState<string>('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState<{ roundupSaved?: number; freelanceSplit?: any } | null>(null);

  if (!isOpen) return null;

  const currentAmount = parseFloat(amountStr) || 0;
  const isSaveDisabled = currentAmount <= 0 || isSaving;

  // Keypad clicks
  const handleKeyClick = (val: string) => {
    if (val === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr(prev => (prev === '' ? '0.' : prev + '.'));
      }
      return;
    }
    // Limit decimal to 2 places
    if (amountStr.includes('.')) {
      const parts = amountStr.split('.');
      if (parts[1]?.length >= 2) return;
    }
    // Limit max digits
    if (amountStr.replace('.', '').length >= 7) return;

    setAmountStr(prev => (prev === '0' ? val : prev + val));
  };

  const handleDelete = () => {
    setAmountStr(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmountStr('');
  };

  const handleAttemptClose = () => {
    if (currentAmount > 0) {
      setShowConfirmClose(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setAmountStr('');
    setNote('');
    setShowConfirmClose(false);
    setIsSaving(false);
    setSaveSuccess(false);
    setSavedFeedback(null);
    onClose();
  };

  const handleSave = () => {
    if (isSaveDisabled) return;

    setIsSaving(true);
    const result = addTransaction({
      accountId: selectedAccountId,
      categoryId: selectedCatId,
      amount: currentAmount,
      kind,
      note: note.trim() || undefined,
      source: 'manual',
      wallet,
    });

    setSavedFeedback(result);
    setSaveSuccess(true);
    triggerCelebration();

    // Short animation feedback then return to home tab and update figures immediately
    setTimeout(() => {
      resetAndClose();
      setActiveTab('home');
    }, 900);
  };

  const quickCategories = categories.filter(c => c.kind === kind).slice(0, 6);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Car': return <Car className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'Receipt': return <Receipt className="w-4 h-4" />;
      case 'Film': return <Film className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="bg-white w-full max-w-[430px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
      >
        {/* Header Bar */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-[#F0EEEE]">
          <div className="flex items-center gap-1.5 p-1 bg-[#EEF8F5] rounded-xl border border-[#D5F0E8]">
            <button
              onClick={() => {
                setKind('expense');
                setSelectedCatId('cat-food');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                kind === 'expense'
                  ? 'bg-[#C62828] text-white shadow-xs'
                  : 'text-[#5E5E5E] hover:text-[#2B2B2B]'
              }`}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => {
                setKind('income');
                setSelectedCatId('cat-freelance');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                kind === 'income'
                  ? 'bg-[#0F7A68] text-white shadow-xs'
                  : 'text-[#5E5E5E] hover:text-[#2B2B2B]'
              }`}
            >
              รายรับ
            </button>
          </div>

          {/* Wallet switch for freelancers */}
          {profile.isFreelancer && (
            <div className="flex items-center gap-1 bg-[#F0EEEE] p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setWallet('personal')}
                className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                  wallet === 'personal' ? 'bg-white font-semibold text-[#0F7A68] shadow-xs' : 'text-[#5E5E5E]'
                }`}
              >
                <User className="w-3 h-3" />
                <span>ส่วนตัว</span>
              </button>
              <button
                onClick={() => setWallet('work')}
                className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                  wallet === 'work' ? 'bg-white font-semibold text-[#0F7A68] shadow-xs' : 'text-[#5E5E5E]'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>งาน</span>
              </button>
            </div>
          )}

          <button
            onClick={handleAttemptClose}
            className="w-8 h-8 rounded-full bg-[#F0EEEE] flex items-center justify-center text-[#5E5E5E] hover:bg-[#D9D5D5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col space-y-4 overflow-y-auto">
          {/* Big Amount Display (เสร็จใน 3 แตะ) */}
          <div className="text-center py-2 bg-gradient-to-b from-[#EEF8F5]/80 to-transparent rounded-2xl border border-[#D5F0E8]/50">
            <span className="text-xs text-[#5E5E5E] font-medium block">
              {kind === 'expense' ? 'ระบุจำนวนเงินที่จ่าย' : 'ระบุจำนวนเงินที่ได้รับ'}
            </span>
            <div className="text-4xl font-extrabold text-[#0B4D41] mt-1 tracking-tight flex items-center justify-center">
              <span className="text-2xl mr-1 text-[#0F7A68]">฿</span>
              <span className="tabular-nums">
                {amountStr ? Number(amountStr).toLocaleString('th-TH') : '0'}
              </span>
            </div>

            {/* Freelance income preview */}
            {kind === 'income' && profile.isFreelancer && currentAmount > 0 && (
              <div className="mt-2 text-[11px] text-[#0F7A68] flex items-center justify-center gap-2 bg-[#D5F0E8] py-1 px-3 rounded-full mx-auto w-fit">
                <span>🛡️ กันสำรอง {profile.emergencyFundPercent}%: {formatBaht((currentAmount * profile.emergencyFundPercent) / 100)}</span>
                <span>•</span>
                <span>📑 ภาษี {profile.taxDeductionPercent}%: {formatBaht((currentAmount * profile.taxDeductionPercent) / 100)}</span>
              </div>
            )}
          </div>

          {/* Quick Category Chips */}
          <div>
            <span className="text-xs font-semibold text-[#5E5E5E] mb-2 block">หมวดหมู่</span>
            <div className="flex flex-wrap gap-2">
              {quickCategories.map(cat => {
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 border ${
                      isSelected
                        ? 'bg-[#0F7A68] text-white border-[#0F7A68] shadow-sm'
                        : 'bg-[#F0EEEE] text-[#2B2B2B] border-transparent hover:bg-[#EEF8F5]'
                    }`}
                  >
                    <span>{getCategoryIcon(cat.icon)}</span>
                    <span>{cat.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note (optional) */}
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="โน้ตเพิ่มเติม เช่น ข้าวกะเพราหมูกรอบ (ไม่บังคับ)"
              className="w-full px-3.5 py-2.5 text-xs bg-[#F0EEEE] rounded-xl border border-transparent focus:border-[#0F7A68] focus:bg-white focus:outline-none transition-all placeholder:text-[#5E5E5E]"
            />
          </div>

          {/* Account Selector Chip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#5E5E5E] text-[11px] shrink-0">บัญชี:</span>
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 border transition-all ${
                  selectedAccountId === acc.id
                    ? 'bg-[#EEF8F5] text-[#0F7A68] border-[#8FD6C2] font-semibold'
                    : 'bg-white text-[#5E5E5E] border-[#D9D5D5]'
                }`}
              >
                {acc.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Custom Keypad (0-9, ., Backspace, Clear) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {['1', '2', '3'].map(k => (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                className="h-12 rounded-xl bg-[#F0EEEE] text-lg font-bold text-[#2B2B2B] hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center"
              >
                {k}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="h-12 rounded-xl bg-[#F0EEEE]/70 text-xs font-semibold text-[#5E5E5E] hover:bg-rose-50 hover:text-[#C62828] active:scale-95 transition-all flex items-center justify-center"
            >
              ล้าง
            </button>

            {['4', '5', '6'].map(k => (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                className="h-12 rounded-xl bg-[#F0EEEE] text-lg font-bold text-[#2B2B2B] hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center"
              >
                {k}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="h-12 rounded-xl bg-[#F0EEEE]/70 text-[#5E5E5E] hover:bg-rose-50 hover:text-[#C62828] active:scale-95 transition-all flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>

            {['7', '8', '9'].map(k => (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                className="h-12 rounded-xl bg-[#F0EEEE] text-lg font-bold text-[#2B2B2B] hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center"
              >
                {k}
              </button>
            ))}
            <button
              onClick={() => handleKeyClick('.')}
              className="h-12 rounded-xl bg-[#F0EEEE] text-lg font-bold text-[#2B2B2B] hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center"
            >
              .
            </button>

            <button
              onClick={() => handleKeyClick('0')}
              className="col-span-4 h-12 rounded-xl bg-[#F0EEEE] text-lg font-bold text-[#2B2B2B] hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center"
            >
              0
            </button>
          </div>

          {/* Success Animation Notification */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-center text-[#0F7A68] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-sm">
                  บันทึกสำเร็จ! {savedFeedback?.roundupSaved ? `(ปัดเศษออม ฿${savedFeedback.roundupSaved})` : ''}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Save Button - 4 states: Normal, Pressed, Disabled, Loading */}
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`w-full min-h-[48px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              isSaveDisabled
                ? 'bg-[#D9D5D5] text-[#5E5E5E] cursor-not-allowed'
                : isSaving
                ? 'bg-[#0B4D41] text-white opacity-80 cursor-wait'
                : 'bg-[#0F7A68] hover:bg-[#0B4D41] active:bg-[#0B4D41] active:scale-[0.98] text-white'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <span>บันทึก</span>
            )}
          </button>
        </div>

        {/* Confirmation Modal when Closing with Pending Amount */}
        <AnimatePresence>
          {showConfirmClose && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-5 shadow-xl max-w-[280px] w-full text-center border border-[#D9D5D5]"
              >
                <AlertCircle className="w-10 h-10 text-[#B26A00] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#2B2B2B]">มีตัวเลขค้างอยู่</h4>
                <p className="text-xs text-[#5E5E5E] mt-1 mb-4">
                  ต้องการทิ้งรายการ {formatBaht(currentAmount)} และปิดหรือไม่?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmClose(false)}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#F0EEEE] text-[#2B2B2B] hover:bg-[#D9D5D5]"
                  >
                    กลับไปกรอก
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#C62828] text-white hover:bg-red-700"
                  >
                    ทิ้งรายการ
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
