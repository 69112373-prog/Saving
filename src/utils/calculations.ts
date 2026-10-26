import { Transaction, UserProfile, Goal } from '../types';
import { getDaysRemainingInMonth, getTotalDaysInMonth, getCurrentMonthKey, getDaysUntil } from './formatters';

export interface BudgetCalculations {
  monthlyBudget: number;
  totalExpenseThisMonth: number;
  totalIncomeThisMonth: number;
  remainingMonthlyBudget: number;
  daysRemaining: number;
  totalDaysInMonth: number;
  currentDay: number;
  dailyBudgetBaseline: number; // งบเฉลี่ยต่อวันตั้งต้น = งบเดือน / วันทั้งเดือน
  todayAllowance: number; // วงเงินใช้ได้วันนี้
  spentToday: number; // ยอดที่ใช้ไปแล้วในวันนี้
  todayRemainingAfterSpent: number; // วันนี้ใช้ได้อีกเท่าไหร่
  avgDailySpentSoFar: number; // ค่าเฉลี่ยใช้จ่ายต่อวัน
  isSpendingFast: boolean; // เตือนใช้เร็วกว่าปกติ > 15%
  paceExcessPercent: number;
  projectedMonthEndExpense: number; // ค่าเฉลี่ยต่อวัน * วันทั้งเดือน
  projectedMonthEndSavings: number; // รายได้หรือรายได้พึงได้ - ค่าใช้จ่ายคาดการณ์
  savingsRatePercent: number;
}

export function computeBudgetMetrics(
  transactions: Transaction[],
  profile: UserProfile,
  referenceDate = new Date()
): BudgetCalculations {
  const currentMonthKey = getCurrentMonthKey(referenceDate);
  const todayStr = referenceDate.toISOString().split('T')[0];
  const currentDay = referenceDate.getDate();
  const totalDays = getTotalDaysInMonth(referenceDate);
  const daysRemaining = getDaysRemainingInMonth(referenceDate);

  // Filter transactions for this month
  const thisMonthTxs = transactions.filter(t => t.date.startsWith(currentMonthKey));

  // Compute expenses and income
  const totalExpenseThisMonth = thisMonthTxs
    .filter(t => t.kind === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncomeThisMonth = thisMonthTxs
    .filter(t => t.kind === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Spent today
  const spentToday = transactions
    .filter(t => t.date === todayStr && t.kind === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBudget = profile.monthlyBudget || 15000;
  const remainingMonthlyBudget = Math.max(0, monthlyBudget - totalExpenseThisMonth);

  // กฎ: วงเงินใช้ได้วันนี้ = (งบเดือน − ยอดใช้จ่ายสะสม) ÷ จำนวนวันที่เหลือในเดือน (รวมวันนี้)
  // หมายเหตุ: ยอดใช้จ่ายสะสมที่คำนวณก่อนวันนี้ คือ totalExpenseThisMonth - spentToday
  const expenseBeforeToday = Math.max(0, totalExpenseThisMonth - spentToday);
  const budgetForTodayAndFuture = Math.max(0, monthlyBudget - expenseBeforeToday);
  const todayAllowance = daysRemaining > 0 ? (budgetForTodayAndFuture / daysRemaining) : 0;
  const todayRemainingAfterSpent = Math.max(0, todayAllowance - spentToday);

  // Baseline daily budget: งบต่อวัน = งบเดือน / วันทั้งเดือน
  const dailyBudgetBaseline = totalDays > 0 ? monthlyBudget / totalDays : 0;

  // Average daily spent so far
  const daysPassed = Math.max(1, currentDay);
  const avgDailySpentSoFar = totalExpenseThisMonth / daysPassed;

  // กฎ: เตือน "ใช้เร็วกว่าปกติ" เมื่อ ค่าเฉลี่ยรายวันสูงกว่างบรายวันเกิน 15%
  const isSpendingFast = avgDailySpentSoFar > (dailyBudgetBaseline * 1.15) && totalExpenseThisMonth > 0;
  const paceExcessPercent = dailyBudgetBaseline > 0
    ? Math.round(((avgDailySpentSoFar - dailyBudgetBaseline) / dailyBudgetBaseline) * 100)
    : 0;

  // กฎ: คาดการณ์สิ้นเดือน = รายได้/งบเดือน − (ค่าเฉลี่ยใช้จ่ายต่อวัน × จำนวนวันทั้งเดือน)
  const projectedMonthEndExpense = avgDailySpentSoFar * totalDays;
  const referenceIncome = profile.monthlyIncome > 0 ? profile.monthlyIncome : monthlyBudget;
  const projectedMonthEndSavings = referenceIncome - projectedMonthEndExpense;

  const savingsRatePercent = referenceIncome > 0
    ? Math.max(0, Math.min(100, Math.round((projectedMonthEndSavings / referenceIncome) * 100)))
    : 0;

  return {
    monthlyBudget,
    totalExpenseThisMonth,
    totalIncomeThisMonth,
    remainingMonthlyBudget,
    daysRemaining,
    totalDaysInMonth: totalDays,
    currentDay,
    dailyBudgetBaseline,
    todayAllowance,
    spentToday,
    todayRemainingAfterSpent,
    avgDailySpentSoFar,
    isSpendingFast,
    paceExcessPercent,
    projectedMonthEndExpense,
    projectedMonthEndSavings,
    savingsRatePercent,
  };
}

/**
 * Calculate goal savings requirement breakdown
 */
export function calculateGoalPacing(goal: Goal) {
  const remainingAmount = Math.max(0, goal.target - goal.saved);
  const daysLeft = Math.max(1, getDaysUntil(goal.deadline));
  const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
  const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));

  return {
    remainingAmount,
    daysLeft,
    requiredPerDay: Math.ceil(remainingAmount / daysLeft),
    requiredPerWeek: Math.ceil(remainingAmount / weeksLeft),
    requiredPerMonth: Math.ceil(remainingAmount / monthsLeft),
    percentCompleted: Math.min(100, Math.round((goal.saved / goal.target) * 100)),
  };
}

/**
 * Calculate freelance splits for income: emergency fund & tax
 */
export function calculateFreelanceSplit(
  amount: number,
  emergencyPercent: number = 10,
  taxPercent: number = 5
) {
  const emergencyFund = (amount * emergencyPercent) / 100;
  const taxReserve = (amount * taxPercent) / 100;
  const netSpendable = amount - emergencyFund - taxReserve;

  return {
    emergencyFund: Math.round(emergencyFund * 100) / 100,
    taxReserve: Math.round(taxReserve * 100) / 100,
    netSpendable: Math.round(netSpendable * 100) / 100,
  };
}

/**
 * Auto roundup calculation for spare change
 * e.g. 142 -> rounds to 150 (spare change 8)
 * e.g. 45 -> rounds to 50 (spare change 5)
 */
export function calculateRoundup(amount: number, step: number = 10): number {
  if (amount <= 0) return 0;
  const remainder = amount % step;
  if (remainder === 0) return 0;
  return step - remainder;
}
