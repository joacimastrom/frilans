import {
  HOURS_PER_WORKDAY,
  MUNICIPAL_TAX,
  STATE_TAX,
  TAX_LIMIT,
  WORKDAYS__PER_MONTH,
  WORKDAYS_PER_WEEK,
  WORKING_DAYS_SWEDEN,
} from "./constants";
import { FinancialPost } from "./types";

export const periodOptions = [
  {
    label: "Timvis",
    alternateLabel: "Timmar",
    value: "hourly",
  },
  {
    label: "Veckovis",
    alternateLabel: "Veckor",
    value: "weekly",
  },
  {
    label: "Månadsvis",
    alternateLabel: "Månader",
    value: "monthly",
  },
  {
    label: "Årsvis",
    alternateLabel: "År",
    value: "yearly",
  },
];

/**
 * Calculates the yearly income based on the given array of incomes.
 * @param {Array} incomes - Array of income objects with "amount" and "period".
 * @returns {number} - Total yearly income.
 */
export const calculateYearlyInput = (incomes: FinancialPost[]) => {
  if (!Array.isArray(incomes)) {
    throw new Error("Input must be an array of incomes.");
  }

  return incomes.reduce((total, income) => {
    const { amount, period } = income;

    const number = Number(amount);

    if (typeof number !== "number" || number < 0) {
      throw new Error("Number must be a positive number.");
    }

    switch (period) {
      case "hourly":
        total += number * HOURS_PER_WORKDAY * WORKING_DAYS_SWEDEN;
        break;
      case "daily":
        total += number * WORKING_DAYS_SWEDEN;
        break;
      case "weekly":
        total += number * 52; // 52 weeks in a year
        break;
      case "monthly":
        total += number * 12; // 12 months in a year
        break;
      case "yearly":
        total += number; // Already yearly
        break;
      default:
        throw new Error(`Unknown period: ${period}`);
    }

    return total;
  }, 0);
};

export const calculateDaysOfLostRevenue = (lostRevenues: FinancialPost[]) =>
  lostRevenues.reduce((total, lostRevenue) => {
    return total + calculateWorkingDays(lostRevenue);
  }, 0);

export const calculateWorkingDays = ({
  amount,
  period,
}: FinancialPost): number => {
  switch (period) {
    case "hourly":
      return Math.ceil(amount / HOURS_PER_WORKDAY); // Convert hours to days
    case "dayly":
      return amount; // Already in days
    case "weekly":
      return amount * WORKDAYS_PER_WEEK; // Convert weeks to days
    case "monthly":
      return amount * WORKDAYS__PER_MONTH; // Convert months to days
    default:
      throw new Error(
        `Invalid unit: ${period}. Allowed values are "hour", "day", "week", "month".`
      );
  }
};

export const getTitleByPeriod = (value: number, monthly = false) => {
  if (monthly) return addThousandSeparator(value / 12) + " kr / månad";
  return addThousandSeparator(value) + " kr / år";
};

export const addThousandSeparator = (number: number, separator = " ") =>
  Math.floor(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

export const getNearestHundreds = (num: number) => {
  if (num > 90000) {
    // Nearest even 400s logic
    const roundedDown = Math.floor(num / 400) * 400 - 399; // Nearest 400 rounded down + 1
    const roundedUp = Math.ceil(num / 400) * 400; // Nearest 400 rounded up
    return { roundedDown, roundedUp };
  }
  if (num > 20000) {
    // Nearest even 200s logic
    const roundedDown = Math.floor(num / 200) * 200 - 199; // Nearest 200 rounded down + 1
    const roundedUp = Math.ceil(num / 200) * 200; // Nearest 200 rounded up
    return { roundedDown, roundedUp };
  }

  // Nearest 100s logic
  const roundedDown = Math.floor(num / 100) * 100 + 1; // Nearest 100 rounded down + 1
  const roundedUp = Math.ceil(num / 100) * 100; // Nearest 100 rounded up

  // Adjust for exact multiples of 100
  if (num % 100 === 0) {
    return { roundedDown: roundedDown - 100, roundedUp };
  }

  return { roundedDown, roundedUp };
};

export const getHighIncomeTaxPercentage = (monthlySalary: number) => {
  if (monthlySalary > 141000) return 41;
  if (monthlySalary > 128800) return 40;
  if (monthlySalary > 118400) return 39;
  if (monthlySalary > 109600) return 38;
  if (monthlySalary > 102000) return 37;
  if (monthlySalary > 95400) return 36;
  if (monthlySalary > 89601) return 35;
  if (monthlySalary > 84600) return 34;
  return 33;
};

export const swedishIncomeTax = (yearlyIncome: number) => {
  const incomeOverLimit = Math.max(yearlyIncome - TAX_LIMIT, 0);
  const highIncomeTax = incomeOverLimit * (MUNICIPAL_TAX + STATE_TAX);

  const incomeUnderLimit = Math.min(yearlyIncome, TAX_LIMIT);
  const lowIncomeTax = incomeUnderLimit * MUNICIPAL_TAX;

  const totalTax = lowIncomeTax + highIncomeTax;
  const effectiveTaxRate = (totalTax / yearlyIncome) * 100;

  return Math.floor(effectiveTaxRate * 100) / 100;
};
