import { Benefits, Revenue } from "@/components/Form/Form";
import { taxData } from "../data/taxData";
import {
  BASE_DIVIDEND,
  DIVIDEND_TAX,
  EMPLOYER_TAX,
  HOURS_PER_WORKDAY,
  RESULT_TAX,
  SALARY_PERCENTAGE_LIMIT,
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

export const calculateYearlyRevenue = (rate: number, scope: number): number =>
  rate * (scope / 100) * HOURS_PER_WORKDAY * WORKING_DAYS_SWEDEN;

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

export const getIncomeTax = (monthlyIncome: number) => {
  if (!monthlyIncome || monthlyIncome < 0)
    return {
      yearlyIncomeTax: 0,
      monthlyIncomeTax: 0,
      incomeTaxPercentage: 0,
    };

  const taxBracket = taxData.find(
    ({ salaryFrom, salaryTo }) =>
      monthlyIncome >= salaryFrom && monthlyIncome <= salaryTo
  );

  if (!taxBracket) {
    throw new Error(
      "No tax bracket found for the given income: " + monthlyIncome
    );
  }

  if (monthlyIncome <= 80000) {
    return {
      monthlyIncomeTax: taxBracket.tax,
      yearlyIncomeTax: taxBracket.tax * 12,
      incomeTaxPercentage:
        Math.floor((taxBracket.tax / monthlyIncome) * 100 * 100) / 100,
    };
  }
  const monthlyIncomeTax = Math.floor((monthlyIncome * taxBracket.tax) / 100);
  return {
    incomeTaxPercentage: taxBracket.tax,
    monthlyIncomeTax,
    yearlyIncomeTax: monthlyIncomeTax * 12,
  };
};

export const getTaxBracket = (monthlyIncomeAfterTax: number) => {
  let previousTaxBracket;

  for (let i = 0; i < taxData.length; i++) {
    const { salaryFrom, tax } = taxData[i];
    if (salaryFrom < SALARY_PERCENTAGE_LIMIT) {
      if (salaryFrom - tax < monthlyIncomeAfterTax) {
        previousTaxBracket = taxData[i];
      } else {
        break;
      }
    } else {
      if (monthlyIncomeAfterTax > salaryFrom * (1 - tax / 100)) {
        previousTaxBracket = taxData[i];
      } else {
        break;
      }
    }
  }

  if (!previousTaxBracket) {
    return {
      referenceSalary: 0,
      taxPercentage: 0,
    };
  }

  if (previousTaxBracket.salaryFrom < SALARY_PERCENTAGE_LIMIT) {
    return {
      referenceSalary: previousTaxBracket.salaryTo,
      taxPercentage: previousTaxBracket.tax / previousTaxBracket.salaryTo,
    };
  }

  return {
    referenceSalary: monthlyIncomeAfterTax / (1 - previousTaxBracket.tax / 100),
    taxPercentage: previousTaxBracket?.tax,
  };
};

export const getMaxSalary = (result: number, pension: number) =>
  Math.max(
    0,
    Math.round(result / 12 / (1 + EMPLOYER_TAX + pension / 100) / 1000) * 1000
  );

export const getSalaryData = (
  salary: number,
  result: number,
  pension: number
) => {
  // Calculate result before tax excluding salary costs from scratch
  const salaryCosts = salary * (1 + EMPLOYER_TAX + pension / 100) * 12;
  const resultAfterSalary = result - salaryCosts;
  const resultAfterTax = Math.floor(resultAfterSalary * (1 - RESULT_TAX));

  const maxDividend = Math.max(
    Math.min(Math.max((salary * 12) / 2, BASE_DIVIDEND), resultAfterTax),
    0
  );

  const balancedResult = resultAfterTax - maxDividend;
  return {
    salary,
    maxDividend,
    totalIncome: salary * 12 + maxDividend,
    balancedResult,
    resultAfterSalary,
  };
};

export const getTaxData = (
  salary: number,
  dividend: number,
  result: number
) => {
  const { yearlyIncomeTax, incomeTaxPercentage, monthlyIncomeTax } =
    getIncomeTax(salary);
  const resultTax = Math.round(result * RESULT_TAX);
  const dividendTax = Math.round(dividend * DIVIDEND_TAX);
  const employerFee = salary * 12 * EMPLOYER_TAX;

  return {
    salary,
    yearlyIncomeTax,
    monthlyIncomeTax,
    yearlyEmployerFee: employerFee,
    monthlyEmployerFee: employerFee / 12,
    incomeTaxPercentage,
    resultTax,
    dividendTax,
    totalTax: yearlyIncomeTax + resultTax + dividendTax + employerFee,
  };
};

export const getRevenueData = (
  revenue: Revenue,
  benefits: Benefits,
  costs: FinancialPost[]
) => {
  const dailyRevenue = revenue.hourlyRate * (revenue.scope / 100) * 8;
  const totalRevenue = dailyRevenue * WORKING_DAYS_SWEDEN;
  const lostRevenue = dailyRevenue * benefits.vacation;
  const adjustedRevenue = Math.max(totalRevenue - lostRevenue, 0);

  const totalAdditionalCosts = calculateYearlyInput(costs);
  const resultBeforeSalary = adjustedRevenue - totalAdditionalCosts;
  return {
    totalRevenue,
    lostRevenue,
    totalAdditionalCosts,
    resultBeforeSalary,
  };
};
