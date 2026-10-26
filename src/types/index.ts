export type Account = {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'ewallet' | 'credit';
  balance: number;
  linked: boolean;
  accountNumber?: string;
  color?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  kind: 'expense' | 'income';
  color?: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  kind: 'expense' | 'income';
  note?: string;
  date: string; // YYYY-MM-DD
  source: 'manual' | 'synced';
  wallet: 'personal' | 'work';
};

export type Budget = {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM
  limit: number;
  mode: 'fixed' | 'flexible';
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  image?: string;
  autoSave: boolean;
  category?: string;
};

export type Debt = {
  id: string;
  name: string;
  total: number;
  remaining: number;
  interest: number;
  dueDate: string; // day of month or YYYY-MM-DD
  minPayment: number;
};

export type Recurring = {
  id: string;
  name: string;
  amount: number;
  cycle: 'weekly' | 'monthly';
  nextDate: string;
  icon?: string;
  category: string;
};

export type Streak = {
  current: number;
  best: number;
  lastDate: string;
  skipTickets: number;
};

export type Mission = {
  id: string;
  title: string;
  progress: number;
  goal: number;
  xp: number;
  done: boolean;
  type: 'daily' | 'weekly';
};

export type Badge = {
  id: string;
  name: string;
  unlocked: boolean;
  icon: string;
  desc: string;
  unlockedAt?: string;
};

export type FriendChallenge = {
  id: string;
  name: string;
  targetDesc: string;
  friends: {
    name: string;
    avatar: string;
    progressPercent: number;
    isUser?: boolean;
  }[];
  deadline: string;
};

export type UserProfile = {
  monthlyIncome: number;
  monthlyBudget: number;
  monthlySavingsTarget: number;
  isFreelancer: boolean;
  taxDeductionPercent: number; // e.g. 5
  emergencyFundPercent: number; // e.g. 10
  activeWallet: 'all' | 'personal' | 'work';
  hideBalance: boolean;
  appLocked: boolean;
  pin: string;
  hasOnboarded: boolean;
  autoRoundup: boolean;
  virtualSavingsPool: number;
  bankSynced: boolean;
  xp: number;
  level: number;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'cheer' | 'system' | 'streak';
  read: boolean;
};
