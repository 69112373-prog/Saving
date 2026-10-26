import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Plus,
  Repeat,
  CheckCircle2,
  Calendar,
  Layers,
  Briefcase,
  User,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { formatBaht, formatMaskedBaht, formatThaiDate } from '../utils/formatters';
import { motion, AnimatePresence } from 'motion/react';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    categories,
    recurring,
    deleteTransaction,
    profile,
    toggleBankSync,
    setIsQuickExpenseOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedWallet, setSelectedWallet] = useState<'all' | 'personal' | 'work'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (selectedKind !== 'all' && tx.kind !== selectedKind) return false;
      if (profile.isFreelancer && selectedWallet !== 'all' && tx.wallet !== selectedWallet) return false;
      if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = categories.find(c => c.id === tx.categoryId);
        const matchesNote = tx.note?.toLowerCase().includes(query);
        const matchesCat = cat?.name.toLowerCase().includes(query);
        const matchesAmount = String(tx.amount).includes(query);
        if (!matchesNote && !matchesCat && !matchesAmount) return false;
      }

      return true;
    });
  }, [transactions, selectedKind, selectedWallet, selectedCategory, searchQuery, categories, profile.isFreelancer]);

  // Total recurring cost monthly
  const totalMonthlyRecurring = recurring.reduce((sum, r) => sum + r.amount, 0);

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-[#0B4D41]">รายการรับ-จ่าย</h1>
          <p className="text-xs text-[#5E5E5E]">ประวัติการเงินและการเชื่อมต่อบัญชี</p>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsQuickExpenseOpen(true)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0F7A68] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>จดรายการ</span>
        </button>
      </div>

      {/* Simulated Bank Sync Switch Card */}
      <div className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            profile.bankSynced ? 'bg-[#EEF8F5] text-[#0F7A68]' : 'bg-[#F0EEEE] text-[#5E5E5E]'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#2B2B2B]">จำลองเชื่อมบัญชีธนาคาร</span>
              <span className="text-[10px] bg-[#EEF8F5] text-[#0F7A68] px-1.5 py-0.2 rounded font-medium">
                Auto Sync
              </span>
            </div>
            <p className="text-[11px] text-[#5E5E5E]">
              {profile.bankSynced ? 'ดึงสลิปและรายการจำลองอัตโนมัติ' : 'เปิดเพื่อเติมรายการจำลองจาก Mobile Banking'}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={profile.bankSynced}
            onChange={e => toggleBankSync(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#D9D5D5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F7A68]"></div>
        </label>
      </div>

      {/* Hidden Subscriptions & Recurring Banner */}
      <div
        onClick={() => setShowRecurringModal(true)}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EEF8F5] to-[#D5F0E8] border border-[#8FD6C2] flex items-center justify-between cursor-pointer hover:border-[#0F7A68] transition-all shadow-xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0F7A68] text-white flex items-center justify-center">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0B4D41]">ตรวจพบ "รายจ่ายที่ซ่อนอยู่" ({recurring.length} รายการ)</span>
            <p className="text-[11px] text-[#5E5E5E]">สมาชิกรายเดือนรวม {formatBaht(totalMonthlyRecurring)}/เดือน</p>
          </div>
        </div>
        <span className="text-xs text-[#0F7A68] font-bold">ดูรายละเอียด</span>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5E5E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อรายการ, หมวดหมู่, ยอดเงิน..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#D9D5D5] rounded-xl focus:border-[#0F7A68] focus:outline-none transition-all"
          />
        </div>

        {/* Filter chips: Kind */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedKind('all')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-full font-medium transition-all ${
              selectedKind === 'all'
                ? 'bg-[#0F7A68] text-white shadow-xs'
                : 'bg-white text-[#5E5E5E] border border-[#D9D5D5]'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedKind('expense')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-full font-medium transition-all ${
              selectedKind === 'expense'
                ? 'bg-[#C62828] text-white shadow-xs'
                : 'bg-white text-[#5E5E5E] border border-[#D9D5D5]'
            }`}
          >
            รายจ่าย
          </button>
          <button
            onClick={() => setSelectedKind('income')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-full font-medium transition-all ${
              selectedKind === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-[#5E5E5E] border border-[#D9D5D5]'
            }`}
          >
            รายรับ
          </button>

          {/* Freelancer wallet filter */}
          {profile.isFreelancer && (
            <>
              <div className="w-[1px] h-5 bg-[#D9D5D5] mx-1" />
              <button
                onClick={() => setSelectedWallet(selectedWallet === 'personal' ? 'all' : 'personal')}
                className={`min-h-[44px] px-3 py-1.5 rounded-full flex items-center gap-1 font-medium transition-all ${
                  selectedWallet === 'personal'
                    ? 'bg-[#0F7A68] text-white'
                    : 'bg-white text-[#5E5E5E] border border-[#D9D5D5]'
                }`}
              >
                <User className="w-3 h-3" />
                <span>ส่วนตัว</span>
              </button>
              <button
                onClick={() => setSelectedWallet(selectedWallet === 'work' ? 'all' : 'work')}
                className={`min-h-[44px] px-3 py-1.5 rounded-full flex items-center gap-1 font-medium transition-all ${
                  selectedWallet === 'work'
                    ? 'bg-[#0F7A68] text-white'
                    : 'bg-white text-[#5E5E5E] border border-[#D9D5D5]'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>งาน</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5E5E5E] px-1">
          <span>พบ {filteredTransactions.length} รายการ</span>
          <span>แตะที่ถังขยะเพื่อลบ (มีปุ่มเลิกทำ)</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#D9D5D5] space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#EEF8F5] text-[#0F7A68] mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-[#2B2B2B]">ไม่พบรายการตรงกับเงื่อนไข</p>
            <p className="text-[11px] text-[#5E5E5E]">ลองเปลี่ยนคำค้นหา หรือจดรายการแรกของวันนี้กันเลย!</p>
            <button
              onClick={() => setIsQuickExpenseOpen(true)}
              className="mt-2 px-4 py-2 bg-[#0F7A68] text-white text-xs font-semibold rounded-xl"
            >
              + จดรายจ่ายตอนนี้
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-[#D9D5D5] divide-y divide-[#F0EEEE] shadow-xs overflow-hidden">
            {filteredTransactions.map(tx => {
              const cat = categories.find(c => c.id === tx.categoryId);
              const isExpense = tx.kind === 'expense';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 flex items-center justify-between hover:bg-[#EEF8F5]/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isExpense ? 'bg-[#EEF8F5] text-[#0F7A68]' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {cat?.name.slice(0, 2) || 'จด'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#2B2B2B] truncate">
                        {tx.note || cat?.name || 'รายการ'}
                      </div>
                      <div className="text-[10px] text-[#5E5E5E] flex items-center gap-1.5 mt-0.5">
                        <span>{formatThaiDate(tx.date)}</span>
                        <span>•</span>
                        <span className="truncate">{cat?.name}</span>
                        {tx.source === 'synced' && (
                          <span className="bg-[#D5F0E8] text-[#0B4D41] px-1 py-0.2 rounded font-medium text-[9px]">
                            เชื่อมต่อแล้ว
                          </span>
                        )}
                        {profile.isFreelancer && (
                          <span className="text-[#5E5E5E]">
                            • {tx.wallet === 'work' ? '💼 งาน' : '👤 ส่วนตัว'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`text-xs font-bold tabular-nums ${isExpense ? 'text-[#2B2B2B]' : 'text-emerald-600'}`}>
                      {isExpense ? '-' : '+'} {formatMaskedBaht(tx.amount, profile.hideBalance)}
                    </div>

                    {/* Delete button (Required confirmation) */}
                    <button
                      onClick={() => setTxToDelete(tx.id)}
                      className="w-8 h-8 rounded-lg bg-[#F0EEEE] text-[#5E5E5E] hover:text-[#C62828] hover:bg-rose-50 flex items-center justify-center transition-colors"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Rule: ปุ่มที่ลบหรือเกี่ยวกับเงินต้องมีข้อยืนยัน) */}
      <AnimatePresence>
        {txToDelete && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[320px] w-full text-center border border-[#D9D5D5]"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#C62828] mx-auto flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2B2B2B]">ยืนยันการลบรายการ?</h3>
              <p className="text-xs text-[#5E5E5E] mt-1 mb-5">
                รายการนี้จะถูกนำออกจากบันทึก (คุณสามารถกด "เลิกทำ" ได้ภายใน 5 วินาทีหลังลบ)
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setTxToDelete(null)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-[#F0EEEE] text-[#2B2B2B] hover:bg-[#D9D5D5]"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-[#C62828] text-white hover:bg-rose-700 shadow-sm"
                >
                  ลบรายการ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recurring Details Modal */}
      <AnimatePresence>
        {showRecurringModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[380px] w-full border border-[#D9D5D5]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEEE]">
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-[#0F7A68]" />
                  <h3 className="font-bold text-base text-[#0B4D41]">รายจ่ายที่ซ่อนอยู่ (Subscriptions)</h3>
                </div>
                <button
                  onClick={() => setShowRecurringModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F0EEEE] flex items-center justify-center text-[#5E5E5E]"
                >
                  ✕
                </button>
              </div>

              <div className="py-3 space-y-2.5">
                <p className="text-xs text-[#5E5E5E]">
                  ระบบตรวจจับค่าบริการรายเดือนอัตโนมัติ เพื่อช่วยให้คุณไม่ลืมยกเลิกบริการที่ไม่ได้ใช้
                </p>

                <div className="space-y-2">
                  {recurring.map(r => (
                    <div key={r.id} className="p-3 bg-[#EEF8F5] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#2B2B2B]">{r.name}</div>
                        <div className="text-[10px] text-[#5E5E5E]">ตัดยอดถัดไป: {formatThaiDate(r.nextDate)}</div>
                      </div>
                      <div className="text-xs font-bold text-[#0F7A68]">
                        {formatBaht(r.amount)} / ด.
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-right text-xs font-bold text-[#0B4D41]">
                  รวมทั้งสิ้น: {formatBaht(totalMonthlyRecurring)} ต่อเดือน
                </div>
              </div>

              <button
                onClick={() => setShowRecurringModal(false)}
                className="w-full py-2.5 bg-[#0F7A68] text-white text-xs font-semibold rounded-xl mt-2"
              >
                เข้าใจแล้ว
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
