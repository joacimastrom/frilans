export interface PersonalFinances {
  totalLiquidFunds: number; // Total available money (savings + investments)
  monthlySalary: number; // Monthly gross salary for loan calculations
  yearlyCapitalIncome: number; // Yearly capital income (dividends, interest, etc.)
}

export interface Investment {
  startingAmount: number; // Will be calculated as totalLiquidFunds - downPayment
  monthlyDeposit: number;
  annualDeposit: number; // Lump sum at the beginning of each year
  expectedYearlyGrowth: number; // as decimal (e.g., 0.07 for 7%)
}

export type HomeOwnershipType = "none" | "purchase" | "owned";

export interface HomeOwnership {
  type: HomeOwnershipType;
  // For purchase scenarios
  purchasePrice?: number; // Total cost of the home
  downPayment?: number; // Must be at least 15% of purchasePrice
  // For both purchase and owned scenarios
  currentValue?: number; // Current market value (for owned) or purchase price (for purchase)
  loanAmount: number; // Current loan amount or calculated as purchasePrice - downPayment
  yearlyInterestRate: number; // as decimal (e.g., 0.04 for 4%)
  monthlyAmortering?: number; // optional, will calculate from amorteringskrav if not provided
  monthlyCosts: {
    avgift: number;
    drift: number;
    el: number;
    värme: number;
    försäkring: number;
    övrigt: number;
  };
  yearlyIncrease?: number; // optional yearly cost increase percentage as decimal
  amorteringsbefrielse?: {
    enabled: boolean;
    months?: number;
    years?: number;
  };
}

export interface Selling {
  expectedSellingPrice?: number;
  yearlyPriceGrowth?: number; // as decimal, alternative to expectedSellingPrice
  yearsUntilSale: number;
  mäklarkostnad: number; // selling fee as percentage (decimal)
  // Capital gains tax is fixed at 22% in Sweden
}

export interface Scenario {
  id: string;
  name: string;
  isBaseline: boolean;
  personalFinances: PersonalFinances;
  investment: Investment;
  homeOwnership?: HomeOwnership; // Only for home purchase scenarios
  selling?: Selling; // Only for home purchase scenarios
  color: string; // hex color for charts
}

export interface ScenarioCalculationResult {
  scenarioId: string;
  yearlyData: YearlyData[];
  summary: ScenarioSummary;
}

export interface YearlyData {
  year: number;
  investmentValue: number;
  remainingLoan: number;
  homeValue: number;
  homeEquity: number; // homeValue - remainingLoan
  netWorth: number; // investmentValue + homeEquity
  totalMonthlyCosts: number;
  lostGrowthFromDownPayment: number; // opportunity cost
}

export interface ScenarioSummary {
  totalNetWorth: number;
  totalInvestmentValue: number;
  totalHomeEquity: number;
  totalInterestPaid: number;
  totalCostsPaid: number;
}

// Default values for new scenarios
export const DEFAULT_PERSONAL_FINANCES: PersonalFinances = {
  totalLiquidFunds: 1000000, // 1M SEK liquid funds
  monthlySalary: 50000, // 50k SEK monthly salary
  yearlyCapitalIncome: 0, // Default no capital income
};

export const DEFAULT_INVESTMENT: Investment = {
  startingAmount: 1000000, // Will be calculated dynamically
  monthlyDeposit: 5000,
  annualDeposit: 0,
  expectedYearlyGrowth: 0.08,
};

export const DEFAULT_HOME_OWNERSHIP: HomeOwnership = {
  type: "purchase",
  purchasePrice: 0,
  downPayment: 0,
  loanAmount: 0,
  yearlyInterestRate: 0.03,
  monthlyCosts: {
    avgift: 3000,
    drift: 1000,
    el: 800,
    värme: 1200,
    försäkring: 400,
    övrigt: 500,
  },
  yearlyIncrease: 0.02,
  amorteringsbefrielse: {
    enabled: false,
  },
};

export const DEFAULT_OWNED_HOME: HomeOwnership = {
  type: "owned",
  currentValue: 5000000,
  loanAmount: 3500000, // Example: 70% LTV
  yearlyInterestRate: 0.03,
  monthlyAmortering: 7000,
  monthlyCosts: {
    avgift: 3000,
    drift: 1000,
    el: 800,
    värme: 1200,
    försäkring: 400,
    övrigt: 500,
  },
  yearlyIncrease: 0.02,
  amorteringsbefrielse: {
    enabled: false,
  },
};

export const DEFAULT_SELLING: Selling = {
  yearlyPriceGrowth: 0.03,
  yearsUntilSale: 10,
  mäklarkostnad: 0.02, // 2%
};

// Colors for scenarios (excluding baseline which uses a fixed color)
export const SCENARIO_COLORS = [
  "#8B5CF6", // violet-500
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#F97316", // orange-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
];

export const BASELINE_COLOR = "#6B7280"; // gray-500

// Swedish mortgage calculation utilities
export const MORTGAGE_CONSTANTS = {
  MAX_LOAN_TO_INCOME_RATIO: 5.5, // Maximum loan is 5.5x yearly salary
  MINIMUM_DOWN_PAYMENT_RATIO: 0.15, // 15% minimum down payment
  MAXIMUM_LTV_RATIO: 0.85, // Maximum 85% loan-to-value
} as const;

/**
 * Calculate maximum purchase price based on salary, capital income and liquid funds
 */
export function calculateMaxPurchasePrice(
  monthlySalary: number,
  yearlyCapitalIncome: number,
  totalLiquidFunds: number
): number {
  const yearlyIncome = monthlySalary * 12 + yearlyCapitalIncome;
  const maxLoanBasedOnIncome =
    yearlyIncome * MORTGAGE_CONSTANTS.MAX_LOAN_TO_INCOME_RATIO;

  // Max purchase considering both loan limit and available funds
  // Purchase = downPayment + loan
  // Where downPayment >= 15% of purchase and loan <= maxLoanBasedOnIncome
  // So: purchase = downPayment + min(maxLoanBasedOnIncome, 85% of purchase)
  // This gives us: purchase <= (liquidFunds + maxLoanBasedOnIncome) / 1.15 when liquidFunds is limiting
  // Or: purchase <= maxLoanBasedOnIncome / 0.85 when income is limiting

  const maxPurchaseBasedOnIncome =
    maxLoanBasedOnIncome / MORTGAGE_CONSTANTS.MAXIMUM_LTV_RATIO;
  const maxPurchaseBasedOnFunds =
    (totalLiquidFunds + maxLoanBasedOnIncome) /
    (1 + MORTGAGE_CONSTANTS.MINIMUM_DOWN_PAYMENT_RATIO);

  return Math.min(maxPurchaseBasedOnIncome, maxPurchaseBasedOnFunds);
}

/**
 * Calculate valid down payment range
 */
export function calculateDownPaymentRange(
  purchasePrice: number,
  totalLiquidFunds: number
): { min: number; max: number } {
  const minDownPayment =
    purchasePrice * MORTGAGE_CONSTANTS.MINIMUM_DOWN_PAYMENT_RATIO;
  const maxDownPayment = Math.min(totalLiquidFunds, purchasePrice);

  return {
    min: minDownPayment,
    max: maxDownPayment,
  };
}

/**
 * Validate if a loan amount is allowed based on income
 */
export function validateLoanAmount(
  loanAmount: number,
  monthlySalary: number,
  yearlyCapitalIncome: number
): boolean {
  const yearlyIncome = monthlySalary * 12 + yearlyCapitalIncome;
  const maxAllowedLoan =
    yearlyIncome * MORTGAGE_CONSTANTS.MAX_LOAN_TO_INCOME_RATIO;

  return loanAmount <= maxAllowedLoan;
}
