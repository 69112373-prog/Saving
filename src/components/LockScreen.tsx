import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Fingerprint, Delete } from 'lucide-react';
import { motion } from 'motion/react';

export const LockScreen: React.FC = () => {
  const { profile, isPinLocked, setIsPinLocked } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  if (!isPinLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        if (nextPin === profile.pin) {
          setIsPinLocked(false);
          setPinInput('');
        } else {
          setShake(true);
          setErrorMsg('รหัส PIN ไม่ถูกต้อง (ค่าเริ่มต้น 1234)');
          setTimeout(() => {
            setShake(false);
            setPinInput('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometricSim = () => {
    // Biometric success simulation
    setIsPinLocked(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F0EEEE] flex flex-col items-center justify-between p-6 max-w-[430px] mx-auto select-none">
      <div className="w-full flex flex-col items-center pt-12">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0F7A68] to-[#25AA94] flex items-center justify-center text-white shadow-lg mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0B4D41]">เหลือเก็บ ปลอดภัย</h2>
        <p className="text-sm text-[#5E5E5E] mt-1">กรุณาใส่รหัส PIN เพื่อเข้าใช้งาน</p>

        {/* PIN Dots */}
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 my-8"
        >
          {[0, 1, 2, 3].map(index => {
            const isFilled = index < pinInput.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled ? 'bg-[#0F7A68] scale-125' : 'bg-[#D9D5D5]'
                }`}
              />
            );
          })}
        </motion.div>

        {errorMsg && (
          <span className="text-xs text-[#C62828] font-medium animate-pulse">{errorMsg}</span>
        )}
      </div>

      {/* Keypad */}
      <div className="w-full max-w-[300px] mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-16 rounded-2xl bg-white text-xl font-semibold text-[#2B2B2B] shadow-sm hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center border border-[#D9D5D5]/50"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBiometricSim}
            className="h-16 rounded-2xl bg-white/70 text-[#0F7A68] shadow-sm hover:bg-white active:scale-95 transition-all flex flex-col items-center justify-center border border-[#D9D5D5]/40"
            title="สแกนนิ้ว/Face ID จำลอง"
          >
            <Fingerprint className="w-6 h-6" />
            <span className="text-[10px] text-[#5E5E5E] mt-0.5">สแกนนิ้ว</span>
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-16 rounded-2xl bg-white text-xl font-semibold text-[#2B2B2B] shadow-sm hover:bg-[#EEF8F5] active:bg-[#D5F0E8] active:scale-95 transition-all flex items-center justify-center border border-[#D9D5D5]/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-white/70 text-[#5E5E5E] shadow-sm hover:bg-white active:scale-95 transition-all flex items-center justify-center border border-[#D9D5D5]/40"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsPinLocked(false)}
            className="text-xs text-[#0F7A68] hover:underline font-medium"
          >
            ข้ามเพื่อทดสอบ (โหมดพัฒนา)
          </button>
        </div>
      </div>
    </div>
  );
};
