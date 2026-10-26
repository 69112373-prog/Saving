import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Briefcase, Wallet, Target, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OnboardingModal: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [income, setIncome] = useState(profile.monthlyIncome ? String(profile.monthlyIncome) : '35000');
  const [budget, setBudget] = useState(profile.monthlyBudget ? String(profile.monthlyBudget) : '18000');
  const [savingsTarget, setSavingsTarget] = useState(profile.monthlySavingsTarget ? String(profile.monthlySavingsTarget) : '10000');
  const [isFreelancer, setIsFreelancer] = useState(profile.isFreelancer || false);

  if (profile.hasOnboarded) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numIncome = parseFloat(income.replace(/,/g, '')) || 30000;
    const numBudget = parseFloat(budget.replace(/,/g, '')) || 15000;
    const numTarget = parseFloat(savingsTarget.replace(/,/g, '')) || 5000;

    updateProfile({
      monthlyIncome: numIncome,
      monthlyBudget: numBudget,
      monthlySavingsTarget: numTarget,
      isFreelancer,
      hasOnboarded: true,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-[390px] rounded-3xl p-6 shadow-2xl border border-[#D9D5D5] flex flex-col max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F7A68] to-[#25AA94] mx-auto flex items-center justify-center text-white shadow-md mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#0B4D41]">ยินดีต้อนรับสู่ เหลือเก็บ</h1>
            <p className="text-sm text-[#5E5E5E] mt-1">
              แอปที่จะช่วยให้คุณรู้ว่า <span className="font-semibold text-[#0F7A68]">"วันนี้ใช้ได้อีกเท่าไหร่"</span> และวางแผนเหลือเงินเก็บชิลๆ
            </p>
          </div>

          {/* Form with 3 questions */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Q1: Monthly Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-[#0F7A68]" />
                1. รายได้ต่อเดือน (โดยประมาณ)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5E5E5E]">฿</span>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  placeholder="เช่น 30000"
                  className="w-full pl-8 pr-4 py-3 bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-base font-bold text-[#0B4D41] focus:outline-none focus:ring-2 focus:ring-[#0F7A68]"
                  required
                />
              </div>
            </div>

            {/* Q2: Monthly Expense Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#0F7A68]" />
                2. งบใช้จ่ายต่อเดือนที่ตั้งใจไว้
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5E5E5E]">฿</span>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="เช่น 15000"
                  className="w-full pl-8 pr-4 py-3 bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-base font-bold text-[#0B4D41] focus:outline-none focus:ring-2 focus:ring-[#0F7A68]"
                  required
                />
              </div>
              <p className="text-[11px] text-[#5E5E5E]">แอปจะนำไปแบ่งเป็นโควตาใช้จ่ายต่อวันให้อัตโนมัติ</p>
            </div>

            {/* Q3: Savings Target */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#0F7A68]" />
                3. เป้าหมายเงินออมที่อยากได้ต่อเดือน
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5E5E5E]">฿</span>
                <input
                  type="number"
                  value={savingsTarget}
                  onChange={e => setSavingsTarget(e.target.value)}
                  placeholder="เช่น 8000"
                  className="w-full pl-8 pr-4 py-3 bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-base font-bold text-[#0B4D41] focus:outline-none focus:ring-2 focus:ring-[#0F7A68]"
                  required
                />
              </div>
            </div>

            {/* Freelancer toggle */}
            <div
              onClick={() => setIsFreelancer(!isFreelancer)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isFreelancer ? 'bg-[#D5F0E8] border-[#0F7A68]' : 'bg-[#F0EEEE] border-[#D9D5D5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isFreelancer ? 'bg-[#0F7A68] text-white' : 'bg-white text-[#5E5E5E]'}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#2B2B2B]">ฉันเป็นฟรีแลนซ์ / รับงานอิสระ</div>
                  <div className="text-[11px] text-[#5E5E5E]">กันเงินสำรอง 10% และภาษี 5% อัตโนมัติทุกรายรับ</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFreelancer}
                onChange={() => {}}
                className="w-5 h-5 accent-[#0F7A68] cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full min-h-[48px] bg-[#0F7A68] hover:bg-[#0B4D41] active:scale-[0.98] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-4"
            >
              <span>เริ่มใช้งาน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
