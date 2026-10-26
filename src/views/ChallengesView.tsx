import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Trophy,
  Award,
  Users,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ChallengesView: React.FC = () => {
  const {
    streak,
    missions,
    badges,
    friendChallenges,
    useStreakTicket,
    completeMission,
    profile,
    updateProfile,
    triggerCelebration
  } = useApp();

  const [activeTab, setActiveTab] = useState<'missions' | 'badges' | 'friends' | 'rewards'>('missions');
  const [ticketUsedToast, setTicketUsedToast] = useState(false);
  const [redeemedToast, setRedeemedToast] = useState<string | null>(null);

  const handleUseTicket = () => {
    const success = useStreakTicket();
    if (success) {
      setTicketUsedToast(true);
      triggerCelebration();
      setTimeout(() => setTicketUsedToast(false), 3000);
    }
  };

  const handleRedeemReward = (rewardTitle: string, costXp: number) => {
    if (profile.xp >= costXp) {
      updateProfile({ xp: profile.xp - costXp });
      triggerCelebration();
      setRedeemedToast(`แลกรับ "${rewardTitle}" สำเร็จ!`);
      setTimeout(() => setRedeemedToast(null), 3500);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-[#0B4D41]">ชาเลนจ์และการเติบโต</h1>
          <p className="text-xs text-[#5E5E5E]">วินัยทางการเงินที่สนุกและไม่กดดัน</p>
        </div>

        {/* User Level and XP */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-[#F2B01E]/40 text-[#2B2B2B] shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-[#B26A00]" />
          <span className="text-xs font-bold">เลเวล {profile.level}</span>
          <span className="text-[10px] text-[#5E5E5E]">({profile.xp} XP)</span>
        </div>
      </div>

      {/* Streak Hero Card (Special Golden Accent for Streak/Rewards) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border border-[#F2B01E]/50 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2B01E] flex items-center justify-center text-[#2B2B2B] shadow-md">
              <Flame className="w-7 h-7 fill-[#2B2B2B]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#B26A00] uppercase tracking-wide">
                รักษาวินัยการจด
              </span>
              <div className="text-2xl font-black text-[#2B2B2B] tracking-tight">
                Streak {streak.current} วันติด 🔥
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#5E5E5E]">สถิติสูงสุด: {streak.best} วัน</span>
          </div>
        </div>

        {/* Skip Ticket Section (ตั๋วพักวัน 1 ใบต่อเดือน) */}
        <div className="mt-4 pt-3 border-t border-[#F2B01E]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F2B01E]/20 text-[#B26A00]">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2B2B2B]">
                ตั๋วพักวัน (Streak Freeze): {streak.skipTickets} ใบ
              </div>
              <div className="text-[10px] text-[#5E5E5E]">
                ช่วยไม่ให้ Streak หลุด หากลืมจด 1 วัน (แจกฟรี 1 ใบทุกเดือน)
              </div>
            </div>
          </div>

          <button
            onClick={handleUseTicket}
            disabled={streak.skipTickets <= 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              streak.skipTickets > 0
                ? 'bg-[#F2B01E] text-[#2B2B2B] hover:bg-amber-400 active:scale-95'
                : 'bg-[#D9D5D5] text-[#5E5E5E] cursor-not-allowed'
            }`}
          >
            ใช้ตั๋ว
          </button>
        </div>

        {/* Ticket used toast */}
        <AnimatePresence>
          {ticketUsedToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 text-center font-semibold"
            >
              🎉 ใช้ตั๋วพักวันสำเร็จ! Streak ของคุณได้รับการคุ้มครอง
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sub Tabs */}
      <div className="flex p-1 bg-[#F0EEEE] rounded-2xl border border-[#D9D5D5]/60 text-xs">
        <button
          onClick={() => setActiveTab('missions')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeTab === 'missions' ? 'bg-white text-[#0B4D41] shadow-xs' : 'text-[#5E5E5E]'
          }`}
        >
          ภารกิจ ({missions.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeTab === 'badges' ? 'bg-white text-[#0B4D41] shadow-xs' : 'text-[#5E5E5E]'
          }`}
        >
          แบดจ์ทอง
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeTab === 'friends' ? 'bg-white text-[#0B4D41] shadow-xs' : 'text-[#5E5E5E]'
          }`}
        >
          ชาเลนจ์เพื่อน
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 min-h-[44px] rounded-xl font-semibold transition-all ${
            activeTab === 'rewards' ? 'bg-white text-[#0B4D41] shadow-xs' : 'text-[#5E5E5E]'
          }`}
        >
          แลกรางวัล
        </button>
      </div>

      {/* Success Toast for rewards */}
      <AnimatePresence>
        {redeemedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold text-center shadow-xs"
          >
            {redeemedToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB 1: MISSIONS */}
      {activeTab === 'missions' && (
        <div className="space-y-2.5">
          {missions.map(m => {
            const percent = Math.min(100, Math.round((m.progress / m.goal) * 100));
            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  m.done
                    ? 'bg-[#EEF8F5]/50 border-[#8FD6C2]'
                    : 'bg-white border-[#D9D5D5] shadow-xs'
                }`}
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      m.type === 'daily' ? 'bg-[#EEF8F5] text-[#0F7A68]' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {m.type === 'daily' ? 'ประจำวัน' : 'รายสัปดาห์'}
                    </span>
                    <h3 className="text-xs font-bold text-[#2B2B2B]">{m.title}</h3>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-[#5E5E5E] mb-1">
                      <span>ความคืบหน้า</span>
                      <span className="font-semibold">{m.progress} / {m.goal}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F0EEEE] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.done ? 'bg-[#0F7A68]' : 'bg-[#25AA94]'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {m.done ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-[#0F7A68] bg-[#D5F0E8] px-2.5 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>รับแล้ว</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => completeMission(m.id)}
                      className="px-3 py-1.5 bg-[#0F7A68] hover:bg-[#0B4D41] text-white text-xs font-semibold rounded-xl flex items-center gap-1 active:scale-95 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>+{m.xp} XP</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: BADGES (Gold theme for badges as specified) */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] ${
                b.unlocked
                  ? 'bg-gradient-to-b from-amber-50 to-white border-[#F2B01E] shadow-xs'
                  : 'bg-[#F0EEEE]/40 border-[#D9D5D5] opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-2 ${
                  b.unlocked
                    ? 'bg-[#F2B01E] text-[#2B2B2B] shadow-sm ring-4 ring-[#F2B01E]/20'
                    : 'bg-[#D9D5D5] text-[#5E5E5E]'
                }`}
              >
                {b.unlocked ? '🏅' : '🔒'}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#2B2B2B]">{b.name}</h4>
                <p className="text-[10px] text-[#5E5E5E] mt-0.5 line-clamp-2">{b.desc}</p>
              </div>

              <div className="mt-2 text-[9px] font-semibold">
                {b.unlocked ? (
                  <span className="text-[#B26A00] bg-amber-100/70 px-2 py-0.5 rounded-full">
                    ปลดล็อกแล้ว {b.unlockedAt ? `(${b.unlockedAt})` : ''}
                  </span>
                ) : (
                  <span className="text-[#5E5E5E]">ยังไม่ปลดล็อก</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FRIEND CHALLENGES (Rule: แสดงเป็น % ความสำเร็จ ไม่แสดงยอดเงินจริงของเพื่อน) */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-[#D9D5D5] text-xs text-[#5E5E5E]">
            🔒 <strong className="text-[#2B2B2B]">เน้นความเป็นส่วนตัว:</strong> แสดงความคืบหน้าเฉพาะเครื่องหมายเปอร์เซ็นต์ (%) โดยไม่มีการเปิดเผยจำนวนเงินจริงของเพื่อน
          </div>

          {friendChallenges.map(fc => (
            <div key={fc.id} className="p-4 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#2B2B2B]">{fc.name}</h3>
                  <p className="text-[11px] text-[#5E5E5E] mt-0.5">{fc.targetDesc}</p>
                </div>
                <span className="text-[10px] text-[#0F7A68] bg-[#EEF8F5] px-2 py-0.5 rounded-full font-medium">
                  สิ้นสุด: {fc.deadline}
                </span>
              </div>

              {/* Friends Leaderboard / Progress */}
              <div className="space-y-2 pt-1">
                {fc.friends.map((friend, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl flex items-center justify-between text-xs ${
                      friend.isUser ? 'bg-[#EEF8F5] border border-[#8FD6C2]' : 'bg-[#F0EEEE]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{friend.avatar}</span>
                      <span className={`font-semibold ${friend.isUser ? 'text-[#0B4D41]' : 'text-[#2B2B2B]'}`}>
                        {friend.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-[#D9D5D5] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${friend.isUser ? 'bg-[#0F7A68]' : 'bg-[#25AA94]'}`}
                          style={{ width: `${friend.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs tabular-nums text-[#0B4D41] w-8 text-right">
                        {friend.progressPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: REWARDS REDEEM */}
      {activeTab === 'rewards' && (
        <div className="space-y-2.5">
          {[
            { id: 'rew-1', title: 'คูปองลด 20 บาท ร้านกาแฟอเมซอน', desc: 'ใช้แต้ม XP แลกรับโค้ดส่วนลดเครื่องดื่ม', xp: 150, icon: '☕️' },
            { id: 'rew-2', title: 'ตั๋วพักวัน Streak Freeze (+1 ใบ)', desc: 'สะสมตั๋วสำรองเพื่อรักษาวินัย streak', xp: 200, icon: '🎟️' },
            { id: 'rew-3', title: 'ธีมแอปสีทองคำพรีเมียม (Gold Edition)', desc: 'ปลดล็อกไอคอนและหน้าบัตรสีทองหรูหรา', xp: 350, icon: '✨' },
            { id: 'rew-4', title: 'สิทธิ์ลุ้นรับกระเป๋าผ้าเหลือเก็บ Limited', desc: 'ร่วมกิจกรรมสุ่มแจกของรางวัลปลายเดือน', xp: 500, icon: '🎁' },
          ].map(reward => {
            const canAfford = profile.xp >= reward.xp;
            return (
              <div
                key={reward.id}
                className="p-3.5 rounded-2xl bg-white border border-[#D9D5D5] shadow-xs flex items-center justify-between hover:border-[#F2B01E] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-xl flex items-center justify-center border border-amber-200">
                    {reward.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2B2B]">{reward.title}</h4>
                    <p className="text-[10px] text-[#5E5E5E]">{reward.desc}</p>
                    <span className="text-[10px] text-[#B26A00] font-bold">ใช้ {reward.xp} XP</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeemReward(reward.title, reward.xp)}
                  disabled={!canAfford}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    canAfford
                      ? 'bg-[#F2B01E] text-[#2B2B2B] hover:bg-amber-400 active:scale-95 shadow-xs'
                      : 'bg-[#F0EEEE] text-[#5E5E5E] cursor-not-allowed'
                  }`}
                >
                  แลกรางวัล
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
