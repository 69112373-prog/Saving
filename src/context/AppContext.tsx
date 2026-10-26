import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Account,
  Category,
  Transaction,
  Budget,
  Goal,
  Debt,
  Recurring,
  Mission,
  Badge,
  FriendChallenge,
  UserProfile,
  AppNotification,
  Streak,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_DEBTS,
  INITIAL_RECURRING,
  INITIAL_MISSIONS,
  INITIAL_BADGES,
  INITIAL_FRIEND_CHALLENGES,
  INITIAL_PROFILE,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { computeBudgetMetrics, BudgetCalculations, calculateRoundup, calculateFreelanceSplit } from '../utils/calculations';
import {
  auth,
  db,
  signInWithGoogle as fbSignInWithGoogle,
  signInAsGuest as fbSignInAsGuest,
  logOut as fbLogOut,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

interface UndoState {
  item: Transaction;
  expiresAt: number;
}

interface AppContextType {
  activeTab: 'home' | 'transactions' | 'goals' | 'challenges' | 'profile';
  setActiveTab: (tab: 'home' | 'transactions' | 'goals' | 'challenges' | 'profile') => void;
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  recurring: Recurring[];
  missions: Mission[];
  badges: Badge[];
  friendChallenges: FriendChallenge[];
  profile: UserProfile;
  notifications: AppNotification[];
  streak: Streak;
  metrics: BudgetCalculations;
  isQuickExpenseOpen: boolean;
  setIsQuickExpenseOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isPinLocked: boolean;
  setIsPinLocked: (locked: boolean) => void;
  undoItem: UndoState | null;
  undoDeleteTransaction: () => void;
  dismissUndo: () => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'> & { date?: string }) => { roundupSaved?: number; freelanceSplit?: any };
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'saved'>) => void;
  addMoneyToGoal: (id: string, amount: number) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudgetLimit: (id: string, limit: number) => void;
  recordDebtPayment: (id: string, amount: number) => void;
  useStreakTicket: () => boolean;
  completeMission: (id: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  toggleBankSync: (enable: boolean) => void;
  markNotificationRead: (id: string) => void;
  resetAllData: () => void;
  triggerCelebration: () => void;
  // Firebase Auth & Cloud Sync
  user: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInAsGuest: () => Promise<any>;
  logOut: () => Promise<void>;
  isCloudSynced: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_PREFIX = 'luea_kep_v1_';

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
  }
  return defaultValue;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'transactions' | 'goals' | 'challenges' | 'profile'>('home');

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Core data states
  const [profile, setProfile] = useState<UserProfile>(() => loadStorage('profile', INITIAL_PROFILE));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStorage('transactions', INITIAL_TRANSACTIONS));
  const [accounts, setAccounts] = useState<Account[]>(() => loadStorage('accounts', INITIAL_ACCOUNTS));
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>(() => loadStorage('budgets', INITIAL_BUDGETS));
  const [goals, setGoals] = useState<Goal[]>(() => loadStorage('goals', INITIAL_GOALS));
  const [debts, setDebts] = useState<Debt[]>(() => loadStorage('debts', INITIAL_DEBTS));
  const [recurring, setRecurring] = useState<Recurring[]>(() => loadStorage('recurring', INITIAL_RECURRING));
  const [missions, setMissions] = useState<Mission[]>(() => loadStorage('missions', INITIAL_MISSIONS));
  const [badges, setBadges] = useState<Badge[]>(() => loadStorage('badges', INITIAL_BADGES));
  const [friendChallenges] = useState<FriendChallenge[]>(INITIAL_FRIEND_CHALLENGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadStorage('notifications', INITIAL_NOTIFICATIONS));

  const [streak, setStreak] = useState<Streak>(() =>
    loadStorage('streak', {
      current: 5,
      best: 14,
      lastDate: new Date().toISOString().split('T')[0],
      skipTickets: 1,
    })
  );

  // Modals & UI states
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPinLocked, setIsPinLocked] = useState(() => profile.appLocked);
  const [undoItem, setUndoItem] = useState<UndoState | null>(null);

  // Test Firestore Connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        setIsCloudSynced(true);
      } else {
        setIsCloudSynced(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Real-Time Subscriptions when User is Authenticated
  useEffect(() => {
    if (!user) return;

    const userDocPath = `users/${user.uid}`;
    // 1. Sync User Profile from Firestore
    const unsubUser = onSnapshot(
      doc(db, 'users', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          setProfile(prev => ({
            ...prev,
            monthlyBudget: cloudData.monthlyBudget ?? prev.monthlyBudget,
            monthlyIncome: cloudData.monthlyIncome ?? prev.monthlyIncome,
            monthlySavingsTarget: cloudData.monthlySavingsTarget ?? prev.monthlySavingsTarget,
            isFreelancer: cloudData.isFreelancer ?? prev.isFreelancer,
            emergencyFundPercent: cloudData.emergencyFundPercent ?? prev.emergencyFundPercent,
            taxDeductionPercent: cloudData.taxDeductionPercent ?? prev.taxDeductionPercent,
            virtualSavingsPool: cloudData.virtualSavingsPool ?? prev.virtualSavingsPool,
            xp: cloudData.xp ?? prev.xp,
            level: cloudData.level ?? prev.level,
          }));
        } else {
          // Initialize document in Firestore
          setDoc(doc(db, 'users', user.uid), {
            monthlyBudget: profile.monthlyBudget,
            monthlyIncome: profile.monthlyIncome,
            monthlySavingsTarget: profile.monthlySavingsTarget,
            isFreelancer: profile.isFreelancer,
            emergencyFundPercent: profile.emergencyFundPercent,
            taxDeductionPercent: profile.taxDeductionPercent,
            virtualSavingsPool: profile.virtualSavingsPool,
            xp: profile.xp,
            level: profile.level,
          }).catch(err => handleFirestoreError(err, OperationType.WRITE, userDocPath));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userDocPath);
      }
    );

    // 2. Sync Transactions from Firestore
    const txsPath = `users/${user.uid}/transactions`;
    const unsubTxs = onSnapshot(
      collection(db, 'users', user.uid, 'transactions'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudTxs: Transaction[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<Transaction, 'id'>),
          }));
          setTransactions(cloudTxs);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, txsPath);
      }
    );

    // 3. Sync Goals from Firestore
    const goalsPath = `users/${user.uid}/goals`;
    const unsubGoals = onSnapshot(
      collection(db, 'users', user.uid, 'goals'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudGoals: Goal[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<Goal, 'id'>),
          }));
          setGoals(cloudGoals);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, goalsPath);
      }
    );

    // 4. Sync Debts from Firestore
    const debtsPath = `users/${user.uid}/debts`;
    const unsubDebts = onSnapshot(
      collection(db, 'users', user.uid, 'debts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudDebts: Debt[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<Debt, 'id'>),
          }));
          setDebts(cloudDebts);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, debtsPath);
      }
    );

    return () => {
      unsubUser();
      unsubTxs();
      unsubGoals();
      unsubDebts();
    };
  }, [user]);

  // Sync to localStorage
  useEffect(() => saveStorage('profile', profile), [profile]);
  useEffect(() => saveStorage('transactions', transactions), [transactions]);
  useEffect(() => saveStorage('accounts', accounts), [accounts]);
  useEffect(() => saveStorage('budgets', budgets), [budgets]);
  useEffect(() => saveStorage('goals', goals), [goals]);
  useEffect(() => saveStorage('debts', debts), [debts]);
  useEffect(() => saveStorage('recurring', recurring), [recurring]);
  useEffect(() => saveStorage('missions', missions), [missions]);
  useEffect(() => saveStorage('badges', badges), [badges]);
  useEffect(() => saveStorage('streak', streak), [streak]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);

  // Compute metrics
  const metrics = useMemo(() => {
    return computeBudgetMetrics(transactions, profile);
  }, [transactions, profile]);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F7A68', '#25AA94', '#8FD6C2', '#F2B01E', '#FFFFFF'],
      });
    }).catch(() => {});
  }, []);

  // Update profile patch
  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...patch };
      if (user) {
        setDoc(doc(db, 'users', user.uid), {
          monthlyBudget: updated.monthlyBudget,
          monthlyIncome: updated.monthlyIncome,
          monthlySavingsTarget: updated.monthlySavingsTarget,
          isFreelancer: updated.isFreelancer,
          emergencyFundPercent: updated.emergencyFundPercent,
          taxDeductionPercent: updated.taxDeductionPercent,
          virtualSavingsPool: updated.virtualSavingsPool,
          xp: updated.xp,
          level: updated.level,
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
      }
      return updated;
    });
  }, [user]);

  // Add transaction with prompt rules
  const addTransaction = useCallback((txData: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newTxId = 'tx-' + Date.now();
    const newTx: Transaction = {
      ...txData,
      id: newTxId,
      date: txData.date || todayStr,
    };

    let roundupSaved = 0;
    let freelanceSplit = null;

    // Auto roundup rule: ปัดเศษเงินออมเสมือน
    if (newTx.kind === 'expense' && profile.autoRoundup) {
      roundupSaved = calculateRoundup(newTx.amount, 10);
      if (roundupSaved > 0) {
        setProfile(prev => {
          const nextPool = prev.virtualSavingsPool + roundupSaved;
          if (user) {
            setDoc(doc(db, 'users', user.uid), { virtualSavingsPool: nextPool }, { merge: true })
              .catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
          }
          return { ...prev, virtualSavingsPool: nextPool };
        });
      }
    }

    // Freelance mode rule: ทุกครั้งที่บันทึกรายรับ ให้กันเงินสำรอง 10% และภาษี 5% อัตโนมัติ
    if (newTx.kind === 'income' && profile.isFreelancer) {
      freelanceSplit = calculateFreelanceSplit(
        newTx.amount,
        profile.emergencyFundPercent,
        profile.taxDeductionPercent
      );
    }

    // Update transactions list locally
    setTransactions(prev => [newTx, ...prev]);

    // Save to Firestore if user logged in
    if (user) {
      const path = `users/${user.uid}/transactions/${newTxId}`;
      setDoc(doc(db, 'users', user.uid, 'transactions', newTxId), {
        accountId: newTx.accountId,
        categoryId: newTx.categoryId,
        amount: newTx.amount,
        kind: newTx.kind,
        note: newTx.note || '',
        date: newTx.date,
        source: newTx.source,
        wallet: newTx.wallet,
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
    }

    // Update streak: นับวันที่มีการจดอย่างน้อย 1 รายการ
    setStreak(prev => {
      if (prev.lastDate === todayStr) {
        return prev;
      }
      return {
        ...prev,
        current: prev.current + 1,
        best: Math.max(prev.best, prev.current + 1),
        lastDate: todayStr,
      };
    });

    // Check mission progress (e.g. daily entry)
    setMissions(prev =>
      prev.map(m => {
        if (m.id === 'm-2') {
          const nextProg = Math.min(m.goal, m.progress + 1);
          return { ...m, progress: nextProg, done: nextProg >= m.goal };
        }
        return m;
      })
    );

    // Award XP
    setProfile(prev => {
      const newXp = prev.xp + 15;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });

    return { roundupSaved, freelanceSplit };
  }, [profile, user]);

  // Delete transaction with undo feature
  const deleteTransaction = useCallback((id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    setUndoItem({
      item: target,
      expiresAt: Date.now() + 5000,
    });

    setTransactions(prev => prev.filter(t => t.id !== id));

    if (user) {
      const path = `users/${user.uid}/transactions/${id}`;
      deleteDoc(doc(db, 'users', user.uid, 'transactions', id))
        .catch(err => handleFirestoreError(err, OperationType.DELETE, path));
    }
  }, [transactions, user]);

  // Undo delete
  const undoDeleteTransaction = useCallback(() => {
    if (undoItem) {
      const restored = undoItem.item;
      setTransactions(prev => [restored, ...prev]);

      if (user) {
        const path = `users/${user.uid}/transactions/${restored.id}`;
        setDoc(doc(db, 'users', user.uid, 'transactions', restored.id), {
          accountId: restored.accountId,
          categoryId: restored.categoryId,
          amount: restored.amount,
          kind: restored.kind,
          note: restored.note || '',
          date: restored.date,
          source: restored.source,
          wallet: restored.wallet,
        }).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
      }

      setUndoItem(null);
    }
  }, [undoItem, user]);

  const dismissUndo = useCallback(() => {
    setUndoItem(null);
  }, []);

  // Goals
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'saved'>) => {
    const newId = 'g-' + Date.now();
    const newGoal: Goal = {
      ...goalData,
      id: newId,
      saved: 0,
    };
    setGoals(prev => [newGoal, ...prev]);

    if (user) {
      const path = `users/${user.uid}/goals/${newId}`;
      setDoc(doc(db, 'users', user.uid, 'goals', newId), {
        name: newGoal.name,
        target: newGoal.target,
        saved: 0,
        deadline: newGoal.deadline,
        image: newGoal.image || '',
        autoSave: newGoal.autoSave,
        category: newGoal.category || 'ทั่วไป',
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
    }
  }, [user]);

  const addMoneyToGoal = useCallback((id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const updatedSaved = g.saved + amount;
          if (updatedSaved >= g.target && g.saved < g.target) {
            triggerCelebration();
          }

          if (user) {
            const path = `users/${user.uid}/goals/${id}`;
            setDoc(doc(db, 'users', user.uid, 'goals', id), { saved: updatedSaved }, { merge: true })
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, path));
          }

          return { ...g, saved: updatedSaved };
        }
        return g;
      })
    );
  }, [triggerCelebration, user]);

  // Budgets
  const addBudget = useCallback((budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: 'b-' + Date.now(),
    };
    setBudgets(prev => [...prev, newBudget]);
  }, []);

  const updateBudgetLimit = useCallback((id: string, limit: number) => {
    setBudgets(prev =>
      prev.map(b => (b.id === id ? { ...b, limit } : b))
    );
  }, []);

  // Debt payment
  const recordDebtPayment = useCallback((id: string, amount: number) => {
    setDebts(prev =>
      prev.map(d => {
        if (d.id === id) {
          const remaining = Math.max(0, d.remaining - amount);

          if (user) {
            const path = `users/${user.uid}/debts/${id}`;
            setDoc(doc(db, 'users', user.uid, 'debts', id), { remaining }, { merge: true })
              .catch(err => handleFirestoreError(err, OperationType.UPDATE, path));
          }

          return { ...d, remaining };
        }
        return d;
      })
    );

    addTransaction({
      accountId: 'acc-kbank',
      categoryId: 'cat-bills',
      amount,
      kind: 'expense',
      note: 'ชำระหนี้ตามงวด',
      source: 'manual',
      wallet: 'personal',
    });
  }, [addTransaction, user]);

  // Use skip ticket for streak
  const useStreakTicket = useCallback(() => {
    if (streak.skipTickets > 0) {
      setStreak(prev => ({
        ...prev,
        skipTickets: prev.skipTickets - 1,
      }));
      return true;
    }
    return false;
  }, [streak.skipTickets]);

  // Mission completion
  const completeMission = useCallback((id: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === id && !m.done) {
          updateProfile({ xp: profile.xp + m.xp });
          triggerCelebration();
          return { ...m, done: true, progress: m.goal };
        }
        return m;
      })
    );
  }, [profile.xp, updateProfile, triggerCelebration]);

  // Bank sync toggle
  const toggleBankSync = useCallback((enable: boolean) => {
    setProfile(prev => ({ ...prev, bankSynced: enable }));
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.type === 'bank') {
          return { ...acc, linked: enable };
        }
        return acc;
      })
    );

    if (enable) {
      const sampleSynced: Transaction = {
        id: 'tx-sync-' + Date.now(),
        accountId: 'acc-kbank',
        categoryId: 'cat-food',
        amount: 85,
        kind: 'expense',
        note: 'สแกนจ่าย QR พร้อมเพย์ ร้านข้าวมันไก่',
        date: new Date().toISOString().split('T')[0],
        source: 'synced',
        wallet: 'personal',
      };
      setTransactions(prev => [sampleSynced, ...prev]);
    }
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const resetAllData = useCallback(() => {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    setProfile(INITIAL_PROFILE);
    setTransactions(INITIAL_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setDebts(INITIAL_DEBTS);
    setRecurring(INITIAL_RECURRING);
    setMissions(INITIAL_MISSIONS);
    setBadges(INITIAL_BADGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setStreak({
      current: 5,
      best: 14,
      lastDate: new Date().toISOString().split('T')[0],
      skipTickets: 1,
    });
    setIsPinLocked(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        transactions,
        accounts,
        categories,
        budgets,
        goals,
        debts,
        recurring,
        missions,
        badges,
        friendChallenges,
        profile,
        notifications,
        streak,
        metrics,
        isQuickExpenseOpen,
        setIsQuickExpenseOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isPinLocked,
        setIsPinLocked,
        undoItem,
        undoDeleteTransaction,
        dismissUndo,
        addTransaction,
        deleteTransaction,
        addGoal,
        addMoneyToGoal,
        addBudget,
        updateBudgetLimit,
        recordDebtPayment,
        useStreakTicket,
        completeMission,
        updateProfile,
        toggleBankSync,
        markNotificationRead,
        resetAllData,
        triggerCelebration,
        user,
        isAuthLoading,
        signInWithGoogle: fbSignInWithGoogle,
        signInAsGuest: fbSignInAsGuest,
        logOut: fbLogOut,
        isCloudSynced,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
