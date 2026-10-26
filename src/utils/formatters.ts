/**
 * Format Thai Baht currency
 * Standard: ฿ 1,234 or ฿ 1,234.50
 */
export function formatBaht(amount: number, hideDecimalsIfZero: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '฿ 0';
  }

  const hasDecimals = amount % 1 !== 0;
  const decimals = hideDecimalsIfZero && !hasDecimals ? 0 : 2;

  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  }).format(amount);

  return `฿ ${formatted}`;
}

/**
 * Format masked baht when eye icon is toggled
 */
export function formatMaskedBaht(amount: number, isHidden: boolean): string {
  if (isHidden) {
    return '฿ •••••';
  }
  return formatBaht(amount);
}

/**
 * Thai date formatter
 */
export function formatThaiDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) {
      return 'วันนี้';
    } else if (dateStr === yesterdayStr) {
      return 'เมื่อวาน';
    }

    const thaiYear = year + 543;
    return `${day} ${thaiMonths[month - 1]} ${thaiYear.toString().slice(-2)}`;
  } catch {
    return dateStr;
  }
}

/**
 * Get days remaining in the current month (including today)
 */
export function getDaysRemainingInMonth(referenceDate = new Date()): number {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const currentDay = referenceDate.getDate();
  return Math.max(1, totalDays - currentDay + 1);
}

/**
 * Get total days in the current month
 */
export function getTotalDaysInMonth(referenceDate = new Date()): number {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get ISO month string 'YYYY-MM'
 */
export function getCurrentMonthKey(referenceDate = new Date()): string {
  const y = referenceDate.getFullYear();
  const m = String(referenceDate.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Calculate difference in days between two dates
 */
export function getDaysUntil(deadlineStr: string): number {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(deadlineStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 30;
  }
}
