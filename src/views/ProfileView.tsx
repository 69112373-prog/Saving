import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  KeyRound,
  Crown,
  HelpCircle,
  Briefcase,
  Building2,
  Trash2,
  BellRing,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
  Percent,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut as LogOutIcon,
  User as UserIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBaht } from '../utils/formatters';

export const ProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    toggleBankSync,
    resetAllData,
    triggerCelebration,
    user,
    isAuthLoading,
    signInWithGoogle,
    signInAsGuest,
    logOut,
    isCloudSynced,
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Freelance config temporary edits
  const [emergencyPercent, setEmergencyPercent] = useState(profile.emergencyFundPercent);
  const [taxPercent, setTaxPercent] = useState(profile.taxDeductionPercent);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
      triggerCelebration();
    } catch (e: any) {
      console.error(e);
      setAuthError(e?.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้');
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setAuthError(null);
      await signInAsGuest();
      triggerCelebration();
    } catch (e: any) {
      console.error(e);
      setAuthError(e?.message || 'ไม่สามารถเข้าสู่ระบบแบบ Guest ได้');
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      updateProfile({ pin: newPin });
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setShowPinModal(false);
        setNewPin('');
      }, 1200);
    }
  };

  const handleConfirmUnlink = () => {
    toggleBankSync(false);
    setShowUnlinkModal(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="pt-1">
        <h1 className="text-xl font-bold text-[#0B4D41]">โปรไฟล์และการตั้งค่า</h1>
        <p className="text-xs text-[#5E5E5E]">จัดการความปลอดภัยและโหมดพิเศษ</p>
      </div>

      {/* Firebase Cloud Sync Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#8FD6C2] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF8F5] text-[#0F7A68] flex items-center justify-center">
              <Cloud className="w-5 h-5 text-[#0F7A68]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0B4D41]">Firebase Cloud Sync</span>
                <span className="text-[9px] bg-[#EEF8F5] text-[#0F7A68] px-1.5 py-0.5 rounded-full font-bold">
                  savings-984f9
                </span>
              </div>
              <p className="text-[11px] text-[#5E5E5E]">
                {user ? `ซิงค์คลาวด์แล้ว: ${user.email || 'Guest ID: ' + user.uid.slice(0, 8)}` : 'ข้อมูลบันทึกลงในเครื่อง (เชื่อมต่อเพื่อซิงค์ข้ามอุปกรณ์)'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {user ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F7A68] bg-[#D5F0E8] px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                ออนไลน์
              </span>
            ) : (
              <span className="text-[10px] text-[#5E5E5E] bg-[#F0EEEE] px-2 py-1 rounded-full">
                ออฟไลน์
              </span>
            )}
          </div>
        </div>

        {authError && (
          <div className="p-2 text-[11px] text-[#C62828] bg-rose-50 rounded-xl">
            {authError}
          </div>
        )}

        <div className="pt-1 flex gap-2">
          {user ? (
            <button
              onClick={() => logOut()}
              className="w-full py-2 bg-[#F0EEEE] hover:bg-[#D9D5D5] text-[#2B2B2B] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOutIcon className="w-3.5 h-3.5 text-[#C62828]" />
              <span>ออกจากระบบ Firebase</span>
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleGoogleSignIn}
                className="flex-1 py-2.5 bg-[#0F7A68] hover:bg-[#0B4D41] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ Google</span>
              </button>
              <button
                onClick={handleGuestSignIn}
                className="py-2.5 px-3 bg-[#EEF8F5] text-[#0F7A68] hover:bg-[#D5F0E8] text-xs font-semibold rounded-xl transition-all"
              >
                Guest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#D9D5D5] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF8F5] text-[#0F7A68] flex items-center justify-center text-xl font-bold border border-[#8FD6C2] overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span>🧑🏻‍💼</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2B2B2B] truncate max-w-[150px]">
                {user?.displayName || 'ผู้ใช้งานเหลือเก็บ'}
              </span>
              {profile.isFreelancer && (
                <span className="bg-[#D5F0E8] text-[#0B4D41] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  ฟรีแลนซ์
                </span>
              )}
            </div>
            <div className="text-xs text-[#5E5E5E]">
              งบเดือน {formatBaht(profile.monthlyBudget)} • เป้าออม {formatBaht(profile.monthlySavingsTarget)}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPremiumModal(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#F2B01E] text-[#2B2B2B] text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
        >
          <Crown className="w-3.5 h-3.5 fill-[#2B2B2B]" />
          <span>PRO</span>
        </button>
      </div>

      {/* Section 1: Freelance Mode Settings */}
      <div className="p-4 rounded-3xl bg-white border border-[#D9D5D5] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF8F5] text-[#0F7A68] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#2B2B2B]">โหมดฟรีแลนซ์ (Freelancer Mode)</h3>
              <p className="text-[11px] text-[#5E5E5E]">แยกกระเป๋าและกันเงินสำรอง/ภาษีอัตโนมัติ</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.isFreelancer}
              onChange={e => updateProfile({ isFreelancer: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#D9D5D5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F7A68]"></div>
          </label>
        </div>

        {profile.isFreelancer && (
          <div className="pt-2 border-t border-[#F0EEEE] space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#EEF8F5] rounded-xl border border-[#8FD6C2]">
                <label className="text-[11px] font-semibold text-[#0B4D41] block mb-1">
                  กันเงินสำรองฉุกเฉิน (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={emergencyPercent}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setEmergencyPercent(val);
                      updateProfile({ emergencyFundPercent: val });
                    }}
                    className="w-full bg-white px-2 py-1 rounded-lg text-xs font-bold border border-[#8FD6C2]"
                  />
                  <span className="font-bold text-[#0B4D41]">%</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#EEF8F5] rounded-xl border border-[#8FD6C2]">
                <label className="text-[11px] font-semibold text-[#0B4D41] block mb-1">
                  กันเงินภาษีหัก ณ ที่จ่าย (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setTaxPercent(val);
                      updateProfile({ taxDeductionPercent: val });
                    }}
                    className="w-full bg-white px-2 py-1 rounded-lg text-xs font-bold border border-[#8FD6C2]"
                  />
                  <span className="font-bold text-[#0B4D41]">%</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[#5E5E5E]">
              💡 ทุกครั้งที่คุณบันทึกรายรับ ระบบจะคำนวณแบ่งเงินเข้ากระเป๋าสำรองเหล่านี้ให้เห็นชัดเจน
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Security & App Lock (PIN / Fingerprint) */}
      <div className="p-4 rounded-3xl bg-white border border-[#D9D5D5] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#2B2B2B] flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#0F7A68]" />
          <span>ความปลอดภัยและความเป็นส่วนตัว</span>
        </h3>

        <div className="divide-y divide-[#F0EEEE] text-xs">
          {/* Lock App Switch */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#2B2B2B]">ล็อกแอปด้วย PIN / สแกนนิ้ว</span>
              <p className="text-[11px] text-[#5E5E5E]">ต้องใส่รหัส PIN ก่อนเปิดเข้าดูยอดเงิน</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.appLocked}
                onChange={e => updateProfile({ appLocked: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#D9D5D5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F7A68]"></div>
            </label>
          </div>

          {/* Change PIN button */}
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#2B2B2B]">เปลี่ยนรหัส PIN (4 หลัก)</span>
              <p className="text-[11px] text-[#5E5E5E]">รหัสปัจจุบัน: ••••</p>
            </div>
            <button
              onClick={() => setShowPinModal(true)}
              className="px-3 py-1.5 bg-[#EEF8F5] text-[#0F7A68] hover:bg-[#D5F0E8] font-semibold rounded-xl text-xs transition-colors"
            >
              เปลี่ยน PIN
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Bank Connection Management */}
      <div className="p-4 rounded-3xl bg-white border border-[#D9D5D5] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#2B2B2B] flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#0F7A68]" />
          <span>การเชื่อมต่อบัญชีธนาคาร (จำลอง)</span>
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-[#2B2B2B]">
              สถานะ: {profile.bankSynced ? 'เชื่อมต่อ KBank และ SCB แล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
            </span>
            <p className="text-[11px] text-[#5E5E5E]">
              {profile.bankSynced ? 'ดึงสลิปและยอดเงินอัตโนมัติ' : 'กดสวิตช์เพื่อทดสอบการเชื่อมต่อ'}
            </p>
          </div>

          {profile.bankSynced ? (
            /* Red button requiring confirmation as requested in prompt! */
            <button
              onClick={() => setShowUnlinkModal(true)}
              className="px-3 py-1.5 bg-[#C62828] hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors active:scale-95"
            >
              ยกเลิกการเชื่อม
            </button>
          ) : (
            <button
              onClick={() => toggleBankSync(true)}
              className="px-3 py-1.5 bg-[#0F7A68] hover:bg-[#0B4D41] text-white font-semibold rounded-xl text-xs shadow-xs transition-colors active:scale-95"
            >
              เชื่อมบัญชี
            </button>
          )}
        </div>
      </div>

      {/* Section 4: Premium Plans & Support */}
      <div className="rounded-3xl bg-white border border-[#D9D5D5] divide-y divide-[#F0EEEE] shadow-xs overflow-hidden text-xs">
        <button
          onClick={() => setShowPremiumModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#EEF8F5]/30 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#2B2B2B]">เหลือเก็บ Premium (59 - 99 บาท/เดือน)</span>
              <p className="text-[11px] text-[#5E5E5E]">วิเคราะห์ลึก กราฟสถิติ ไม่จำกัดเป้าหมาย</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5E5E5E]" />
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#EEF8F5]/30 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EEF8F5] text-[#0F7A68] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#2B2B2B]">ศูนย์ช่วยเหลือและคำแนะนำ (FAQ)</span>
              <p className="text-[11px] text-[#5E5E5E]">วิธีใช้งาน สูตรคำนวณ และเคล็ดลับการออม</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5E5E5E]" />
        </button>
      </div>

      {/* Reset Data Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-[#5E5E5E] hover:text-[#C62828] flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตข้อมูลตัวอย่างทั้งหมด</span>
        </button>
      </div>

      {/* Modal: Change PIN */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[320px] w-full border border-[#D9D5D5]"
            >
              <h3 className="font-bold text-sm text-[#0B4D41] mb-1">ตั้งรหัส PIN ใหม่</h3>
              <p className="text-xs text-[#5E5E5E] mb-4">ระบุตัวเลข 4 หลักเพื่อความปลอดภัย</p>

              <form onSubmit={handleSavePin} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="เช่น 5678"
                  className="w-full text-center tracking-widest text-2xl font-bold py-2 bg-[#EEF8F5] border border-[#8FD6C2] rounded-xl text-[#0B4D41] focus:outline-none"
                  required
                />

                {pinChangeSuccess && (
                  <div className="text-xs text-emerald-600 text-center font-bold">
                    ✓ เปลี่ยนรหัส PIN สำเร็จ!
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 py-2 bg-[#F0EEEE] text-xs font-semibold rounded-xl text-[#2B2B2B]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#0F7A68] text-white text-xs font-semibold rounded-xl"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Unlink Confirmation (Red button requires double confirmation) */}
      <AnimatePresence>
        {showUnlinkModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[320px] w-full text-center border border-[#D9D5D5]"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#C62828] mx-auto flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2B2B2B]">ยืนยันยกเลิกการเชื่อมต่อ?</h3>
              <p className="text-xs text-[#5E5E5E] mt-1 mb-5">
                รายการซิงค์จาก Mobile Banking จะหยุดอัปเดตอัตโนมัติ คุณยังสามารถเชื่อมต่อใหม่ได้ทุกเมื่อ
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowUnlinkModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-[#F0EEEE] text-[#2B2B2B]"
                >
                  คงไว้ก่อน
                </button>
                <button
                  onClick={handleConfirmUnlink}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-[#C62828] text-white hover:bg-rose-700 shadow-sm"
                >
                  ยืนยันยกเลิก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Premium Pricing Demo */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[380px] w-full border border-[#D9D5D5] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEEE]">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="font-bold text-base text-[#0B4D41]">เหลือเก็บ Premium</h3>
                </div>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F0EEEE] flex items-center justify-center text-[#5E5E5E]"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="text-center">
                  <span className="text-xs text-[#5E5E5E]">ปลดล็อกพลังการเงินขั้นสูงสุด</span>
                  <div className="text-2xl font-black text-[#0B4D41] mt-1">
                    เริ่มต้น ฿59 <span className="text-sm font-normal text-[#5E5E5E]">/เดือน</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-[#EEF8F5] border border-[#8FD6C2] text-center">
                    <span className="text-xs font-bold text-[#0F7A68]">รายเดือน</span>
                    <div className="text-lg font-black text-[#0B4D41] my-1">฿ 99</div>
                    <span className="text-[10px] text-[#5E5E5E]">ยกเลิกได้ตลอด</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-center relative overflow-hidden">
                    <span className="absolute top-0 right-0 bg-[#F2B01E] text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg text-[#2B2B2B]">
                      สุดคุ้ม
                    </span>
                    <span className="text-xs font-bold text-[#B26A00]">รายปี (เฉลี่ย)</span>
                    <div className="text-lg font-black text-[#2B2B2B] my-1">฿ 59</div>
                    <span className="text-[10px] text-[#5E5E5E]">฿ 690 / ปี</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#2B2B2B]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F7A68] shrink-0" />
                    <span>สร้างเป้าหมายออมเงินได้ไม่จำกัด (ฟรีสร้างได้ 3 เป้าหมาย)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F7A68] shrink-0" />
                    <span>ระบบส่งออกรายงาน Excel/PDF สรุปรายรับรายจ่ายส่งสรรพากร</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F7A68] shrink-0" />
                    <span>การ์ดธีมสีทองคำและปลดล็อกไอคอนพิเศษ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F7A68] shrink-0" />
                    <span>ตั๋วพักวัน Streak Freeze ไม่จำกัด</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerCelebration();
                    setShowPremiumModal(false);
                  }}
                  className="w-full py-3 bg-[#0F7A68] hover:bg-[#0B4D41] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  ทดลองใช้งานฟรี 14 วัน (Demo)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: FAQ & Help */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[380px] w-full border border-[#D9D5D5] max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEEE]">
                <h3 className="font-bold text-base text-[#0B4D41]">ศูนย์ช่วยเหลือ (FAQ)</h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F0EEEE] flex items-center justify-center text-[#5E5E5E]"
                >
                  ✕
                </button>
              </div>

              <div className="py-3 space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-[#2B2B2B]">Q: "วันนี้ใช้ได้อีกเท่าไหร่" คำนวณอย่างไร?</h4>
                  <p className="text-[#5E5E5E] mt-0.5 leading-relaxed">
                    สูตรคำนวณคือ: (งบเดือน − ยอดใช้จ่ายสะสม) ÷ จำนวนวันที่เหลือในเดือน (รวมวันนี้) ทำให้ทุกๆ วันคุณจะมีโควตาการใช้จ่ายที่ยืดหยุ่นตามพฤติกรรมจริง
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#2B2B2B]">Q: ตั๋วพักวัน (Streak Freeze) ทำงานอย่างไร?</h4>
                  <p className="text-[#5E5E5E] mt-0.5 leading-relaxed">
                    หากวันไหนคุณลืมเปิดแอปหรือไม่ได้จดรายการ สามารถกดใช้ตั๋วพักวันเพื่อไม่ให้สถิติ Streak หลุดได้ โดยแอปแจกให้ฟรี 1 ใบทุกเดือน
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#2B2B2B]">Q: โหมดฟรีแลนซ์กันเงินอัตโนมัติอย่างไร?</h4>
                  <p className="text-[#5E5E5E] mt-0.5 leading-relaxed">
                    เมื่อคุณบันทึกรายรับจากงานฟรีแลนซ์ แอปจะคำนวณแบ่งเงินสำรองฉุกเฉิน 10% และภาษี 5% (ปรับสัดส่วนได้) เพื่อป้องกันปัญหาเงินไม่พอจ่ายภาษีสิ้นปี
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 bg-[#F0EEEE] text-[#2B2B2B] text-xs font-semibold rounded-xl"
              >
                ปิดหน้าต่าง
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Confirm Reset Mock Data */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 shadow-2xl max-w-[300px] w-full text-center border border-[#D9D5D5]"
            >
              <h3 className="font-bold text-sm text-[#2B2B2B] mb-2">ล้างและรีเซ็ตข้อมูลตัวอย่าง?</h3>
              <p className="text-xs text-[#5E5E5E] mb-4">
                ข้อมูลจะถูกรีเซ็ตกลับเป็นค่าเริ่มต้นทั้งหมด
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-[#F0EEEE] text-xs font-semibold rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2 bg-[#C62828] text-white text-xs font-semibold rounded-xl"
                >
                  รีเซ็ต
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
