import { Account, Category, Transaction, Budget, Goal, Debt, Recurring, Mission, Badge, FriendChallenge, UserProfile, AppNotification } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'อาหารและเครื่องดื่ม', icon: 'Utensils', kind: 'expense', color: '#F97316' },
  { id: 'cat-coffee', name: 'กาแฟและคาเฟ่', icon: 'Coffee', kind: 'expense', color: '#8B5CF6' },
  { id: 'cat-transport', name: 'เดินทาง (BTS/MRT)', icon: 'Car', kind: 'expense', color: '#0EA5E9' },
  { id: 'cat-shopping', name: 'ช้อปปิ้งและของใช้', icon: 'ShoppingBag', kind: 'expense', color: '#EC4899' },
  { id: 'cat-bills', name: 'บิลและค่าน้ำไฟเน็ต', icon: 'Receipt', kind: 'expense', color: '#6366F1' },
  { id: 'cat-entertainment', name: 'บันเทิงและสตรีมมิ่ง', icon: 'Film', kind: 'expense', color: '#14B8A6' },
  { id: 'cat-health', name: 'สุขภาพและยา', icon: 'HeartPulse', kind: 'expense', color: '#EF4444' },
  { id: 'cat-other', name: 'อื่นๆ', icon: 'MoreHorizontal', kind: 'expense', color: '#64748B' },
  { id: 'cat-salary', name: 'เงินเดือนประจำ', icon: 'Briefcase', kind: 'income', color: '#10B981' },
  { id: 'cat-freelance', name: 'งานฟรีแลนซ์/โปรเจกต์', icon: 'Laptop', kind: 'income', color: '#0F7A68' },
  { id: 'cat-bonus', name: 'โบนัสและเงินพิเศษ', icon: 'Sparkles', kind: 'income', color: '#F59E0B' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-kbank', name: 'KBank กสิกรไทย', type: 'bank', balance: 24500, linked: true, accountNumber: 'xxx-2-84192-x', color: '#00A950' },
  { id: 'acc-scb', name: 'SCB ไทยพาณิชย์', type: 'bank', balance: 12800, linked: true, accountNumber: 'xxx-4-19283-x', color: '#4E2A84' },
  { id: 'acc-truemoney', name: 'TrueMoney Wallet', type: 'ewallet', balance: 1450, linked: false, accountNumber: '089-xxx-4192', color: '#F58220' },
  { id: 'acc-cash', name: 'เงินสดในกระเป๋า', type: 'cash', balance: 850, linked: false, color: '#0F7A68' },
];

// Helper to get formatted dates in current month
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const todayStr = now.toISOString().split('T')[0];

const dayAgo = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    accountId: 'acc-kbank',
    categoryId: 'cat-food',
    amount: 120,
    kind: 'expense',
    note: 'ข้าวกะเพราหมูกรอบไข่ดาว + ชามะนาว',
    date: todayStr,
    source: 'manual',
    wallet: 'personal',
  },
  {
    id: 'tx-2',
    accountId: 'acc-scb',
    categoryId: 'cat-coffee',
    amount: 65,
    kind: 'expense',
    note: 'ลาเต้เย็นหวานน้อย อเมซอน',
    date: todayStr,
    source: 'manual',
    wallet: 'personal',
  },
  {
    id: 'tx-3',
    accountId: 'acc-kbank',
    categoryId: 'cat-transport',
    amount: 47,
    kind: 'expense',
    note: 'รถไฟฟ้า BTS อโศก -> สยาม',
    date: dayAgo(1),
    source: 'manual',
    wallet: 'work',
  },
  {
    id: 'tx-4',
    accountId: 'acc-truemoney',
    categoryId: 'cat-food',
    amount: 350,
    kind: 'expense',
    note: 'มื้อเย็นกินสุกี้กับเพื่อนร่วมงาน',
    date: dayAgo(2),
    source: 'synced',
    wallet: 'personal',
  },
  {
    id: 'tx-5',
    accountId: 'acc-kbank',
    categoryId: 'cat-shopping',
    amount: 590,
    kind: 'expense',
    note: 'เสื้อยืด Uniqlo',
    date: dayAgo(3),
    source: 'manual',
    wallet: 'personal',
  },
  {
    id: 'tx-6',
    accountId: 'acc-kbank',
    categoryId: 'cat-freelance',
    amount: 15000,
    kind: 'income',
    note: 'รับชำระงวดแรก ออกแบบ UI เว็บไซต์',
    date: dayAgo(5),
    source: 'synced',
    wallet: 'work',
  },
  {
    id: 'tx-7',
    accountId: 'acc-scb',
    categoryId: 'cat-entertainment',
    amount: 419,
    kind: 'expense',
    note: 'Netflix Premium 4K รายเดือน',
    date: dayAgo(8),
    source: 'synced',
    wallet: 'personal',
  },
  {
    id: 'tx-8',
    accountId: 'acc-kbank',
    categoryId: 'cat-bills',
    amount: 850,
    kind: 'expense',
    note: 'ค่าอินเทอร์เน็ตคอนโด AIS Fibre',
    date: dayAgo(10),
    source: 'synced',
    wallet: 'personal',
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', categoryId: 'cat-food', month: `${year}-${month}`, limit: 5500, mode: 'fixed' },
  { id: 'b-2', categoryId: 'cat-coffee', month: `${year}-${month}`, limit: 1200, mode: 'flexible' },
  { id: 'b-3', categoryId: 'cat-transport', month: `${year}-${month}`, limit: 2500, mode: 'fixed' },
  { id: 'b-4', categoryId: 'cat-shopping', month: `${year}-${month}`, limit: 3000, mode: 'flexible' },
  { id: 'b-5', categoryId: 'cat-bills', month: `${year}-${month}`, limit: 2000, mode: 'fixed' },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-japan',
    name: 'ทริปเที่ยวญี่ปุ่น (โอซาก้า-เกียวโต)',
    target: 100000,
    saved: 65000,
    deadline: `${year + 1}-04-15`,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    autoSave: true,
    category: 'ท่องเที่ยว',
  },
  {
    id: 'g-macbook',
    name: 'MacBook Pro ชิป M4 สำหรับงานฟรีแลนซ์',
    target: 59000,
    saved: 32000,
    deadline: `${year}-12-31`,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    autoSave: false,
    category: 'อุปกรณ์ทำงาน',
  },
  {
    id: 'g-emergency',
    name: 'กองทุนสำรองฉุกเฉิน (6 เดือน)',
    target: 90000,
    saved: 45000,
    deadline: `${year + 1}-08-30`,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    autoSave: true,
    category: 'ความมั่นคง',
  },
];

export const INITIAL_DEBTS: Debt[] = [
  {
    id: 'd-student',
    name: 'หนี้ กยศ. เพื่อการศึกษา',
    total: 120000,
    remaining: 48000,
    interest: 1.0,
    dueDate: '2026-07-05',
    minPayment: 1500,
  },
  {
    id: 'd-credit',
    name: 'บัตรเครดิต SCB Ultra Platinum',
    total: 15000,
    remaining: 8500,
    interest: 16.0,
    dueDate: `${year}-${month}-28`,
    minPayment: 850,
  },
];

export const INITIAL_RECURRING: Recurring[] = [
  { id: 'rec-1', name: 'Netflix Premium', amount: 419, cycle: 'monthly', nextDate: `${year}-${month}-08`, category: 'สตรีมมิ่ง' },
  { id: 'rec-2', name: 'Spotify Family', amount: 209, cycle: 'monthly', nextDate: `${year}-${month}-15`, category: 'เพลง' },
  { id: 'rec-3', name: 'iCloud+ 200GB', amount: 99, cycle: 'monthly', nextDate: `${year}-${month}-20`, category: 'คลาวด์' },
  { id: 'rec-4', name: 'ChatGPT Plus', amount: 750, cycle: 'monthly', nextDate: `${year}-${month}-25`, category: 'เครื่องมือ AI' },
];

export const INITIAL_MISSIONS: Mission[] = [
  { id: 'm-1', title: 'ใช้ไม่เกินงบรายวันของวันนี้', progress: 185, goal: 480, xp: 50, done: false, type: 'daily' },
  { id: 'm-2', title: 'จดบันทึกรายจ่ายติดต่อกันครบ 7 วัน', progress: 5, goal: 7, xp: 120, done: false, type: 'weekly' },
  { id: 'm-3', title: 'ไม่กดสั่งเดลิเวอรี่มื้อเย็น 1 วัน', progress: 1, goal: 1, xp: 40, done: true, type: 'daily' },
  { id: 'm-4', title: 'กันเงินสำรองฟรีแลนซ์ 1 งาน', progress: 1, goal: 1, xp: 80, done: true, type: 'weekly' },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b-1', name: 'ออมครบ 10,000 แรก', unlocked: true, icon: 'Trophy', desc: 'สะสมเงินออมในเป้าหมายถึง 10,000 บาท', unlockedAt: '12 ต.ค.' },
  { id: 'b-2', name: 'เดือนนี้ไม่เกินงบ', unlocked: true, icon: 'ShieldCheck', desc: 'ควบคุมรายจ่ายทั้งเดือนไม่เกินเพดานที่ตั้งไว้', unlockedAt: '30 ก.ย.' },
  { id: 'b-3', name: 'Streak 7 วันติด', unlocked: true, icon: 'Flame', desc: 'เปิดแอปและจดบันทึกติดต่อกัน 7 วัน', unlockedAt: 'เมื่อวาน' },
  { id: 'b-4', name: 'ฟรีแลนซ์มีวินัย', unlocked: false, icon: 'Sparkles', desc: 'กันเงินภาษีและสำรองฉุกเฉินครบ 5 โปรเจกต์' },
  { id: 'b-5', name: 'จดไวใน 5 วินาที', unlocked: true, icon: 'Zap', desc: 'บันทึกรายจ่ายผ่านคีย์แพดด่วนสำเร็จ 20 ครั้ง', unlockedAt: '24 ต.ค.' },
  { id: 'b-6', name: 'สไนเปอร์ล่าเงินทอน', unlocked: false, icon: 'PiggyBank', desc: 'สะสมเงินทอนปัดเศษครบ 500 บาท' },
];

export const INITIAL_FRIEND_CHALLENGES: FriendChallenge[] = [
  {
    id: 'fc-1',
    name: 'ก๊วนเก็บเงินไปโอซาก้า 🇯🇵',
    targetDesc: 'เป้าหมายออมเฉลี่ย 100,000 บาท เพื่อทริปสิ้นปี',
    deadline: `${year + 1}-04-15`,
    friends: [
      { name: 'บอลลูน', avatar: '👩🏻‍💻', progressPercent: 85 },
      { name: 'คุณ (ฉัน)', avatar: '🧑🏻‍💼', progressPercent: 65, isUser: true },
      { name: 'นัท Designer', avatar: '🎨', progressPercent: 92 },
      { name: 'ป้อง Freelance', avatar: '💻', progressPercent: 54 },
    ],
  },
  {
    id: 'fc-2',
    name: 'งดกาแฟแก้วสอง 30 วัน ☕️',
    targetDesc: 'ลดกาแฟแฟรนไชส์ ประหยัดวันละ 65 บาท',
    deadline: `${year}-${month}-30`,
    friends: [
      { name: 'คุณ (ฉัน)', avatar: '🧑🏻‍💼', progressPercent: 78, isUser: true },
      { name: 'เมย์', avatar: '👩🏼', progressPercent: 90 },
      { name: 'ต้น', avatar: '👨🏻‍🦱', progressPercent: 60 },
    ],
  },
];

export const INITIAL_PROFILE: UserProfile = {
  monthlyIncome: 35000,
  monthlyBudget: 18000,
  monthlySavingsTarget: 10000,
  isFreelancer: true,
  taxDeductionPercent: 5,
  emergencyFundPercent: 10,
  activeWallet: 'all',
  hideBalance: false,
  appLocked: false,
  pin: '1234',
  hasOnboarded: true,
  autoRoundup: true,
  virtualSavingsPool: 480, // สะสมเศษเหรียญเสมือน 480 บาท
  bankSynced: true,
  xp: 380,
  level: 4,
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'ใช้จ่ายราบรื่นดีมาก 🎉',
    message: 'วันนี้คุณใช้งบไปเพียง ฿ 185 ยังเหลือใช้สบายๆ อีก ฿ 295 ของวันนี้',
    date: '10 นาทีที่แล้ว',
    type: 'cheer',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'เตือนชำระบัตรเครดิต 💳',
    message: 'บัตรเครดิต SCB มีกำหนดชำระขั้นต่ำ ฿ 850 ในอีก 2 วันข้างหน้า',
    date: 'เมื่อวานนี้',
    type: 'alert',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Streak รักษาไว้ได้ 5 วันแล้ว 🔥',
    message: 'จดบันทึกอีก 2 วันเพื่อปลดล็อกแบดจ์ Streak 7 วันติด!',
    date: '2 วันที่แล้ว',
    type: 'streak',
    read: true,
  },
];
