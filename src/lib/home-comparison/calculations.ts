import {
  Scenario,
  ScenarioCalculationResult,
  ScenarioSummary,
  YearlyData,
} from "@/models/home-comparison";

/**
 * Calculate Swedish amorteringskrav (mandatory amortization)
 * Based on LTV (loan-to-value) ratio and loan size
 */
export function calculateAmorteringskrav(
  loanAmount: number,
  propertyValue: number
): number {
  const ltv = loanAmount / propertyValue;

  // Swedish amorteringskrav rules as of 2024:
  // - LTV > 70%: amortize 2% of original loan amount per year
  // - LTV 50-70%: amortize 1% of original loan amount per year
  // - LTV < 50%: no mandatory amortization
  // - Additional rule: if loan > 4.5x income, amortize until loan ≤ 4.5x income

  if (ltv > 0.7) {
    return (loanAmount * 0.02) / 12; // 2% per year, divided by 12 months
  } else if (ltv > 0.5) {
    return (loanAmount * 0.01) / 12; // 1% per year, divided by 12 months
  } else {
    return 0; // No mandatory amortization
  }
}

/**
 * Calculate investment value with monthly compounding (more accurate)
 */
export function calculateInvestmentGrowth(
  startingAmount: number,
  monthlyDeposit: number,
  yearlyGrowth: number,
  years: number,
  annualDeposit: number = 0
): { value: number; totalTax: number; yearlyTaxes: number[] } {
  let value = startingAmount;
  const monthlyGrowthRate = yearlyGrowth / 12; // Convert yearly rate to monthly
  const totalMonths = years * 12;

  for (let month = 1; month <= totalMonths; month++) {
    // Add annual deposit at the beginning of each year (month 1, 13, 25, etc.)
    if ((month - 1) % 12 === 1 && month > 1) {
      value += annualDeposit;
    }

    // Add monthly deposit at the beginning of each month
    value += monthlyDeposit;

    // Apply monthly compound growth
    value *= 1 + monthlyGrowthRate;
  }

  return { value, totalTax: 0, yearlyTaxes: [] };
}
/**
 * Calculate loan amortization schedule
 */
export function calculateLoanSchedule(
  initialLoan: number,
  yearlyInterestRate: number,
  monthlyAmortization: number,
  years: number,
  amorteringsbefrielse?: { enabled: boolean; months?: number; years?: number }
): {
  remainingLoan: number;
  totalInterestPaid: number;
  yearlyData: Array<{ remainingLoan: number; interestPaid: number }>;
} {
  let remainingLoan = initialLoan;
  let totalInterestPaid = 0;
  const yearlyData: Array<{ remainingLoan: number; interestPaid: number }> = [];

  const monthlyInterestRate = yearlyInterestRate / 12;

  // Calculate amorteringsbefrielse period
  let amorteringsfreiPeriod = 0;
  if (amorteringsbefrielse?.enabled) {
    if (amorteringsbefrielse.months) {
      amorteringsfreiPeriod = amorteringsbefrielse.months;
    } else if (amorteringsbefrielse.years) {
      amorteringsfreiPeriod = amorteringsbefrielse.years * 12;
    }
  }

  for (let year = 1; year <= years; year++) {
    let yearlyInterest = 0;
    const startingLoanBalance = remainingLoan;

    for (let month = 1; month <= 12; month++) {
      const monthlyInterest = remainingLoan * monthlyInterestRate;
      yearlyInterest += monthlyInterest;
      totalInterestPaid += monthlyInterest;

      // Apply amortization (skip during amorteringsbefrielse period)
      const totalMonths = (year - 1) * 12 + month;
      if (totalMonths > amorteringsfreiPeriod) {
        remainingLoan = Math.max(0, remainingLoan - monthlyAmortization);
      }

      if (remainingLoan <= 0) break;
    }

    yearlyData.push({ remainingLoan, interestPaid: yearlyInterest });
    if (remainingLoan <= 0) break;
  }

  return { remainingLoan, totalInterestPaid, yearlyData };
}

/**
 * Calculate property value growth
 */
export function calculatePropertyValue(
  initialValue: number,
  yearlyGrowth: number,
  years: number
): number {
  return initialValue * Math.pow(1 + yearlyGrowth, years);
}

/**
 * Calculate total monthly housing costs with yearly increase
 */
export function calculateMonthlyCosts(
  baseCosts: {
    avgift: number;
    drift: number;
    el: number;
    värme: number;
    försäkring: number;
    övrigt: number;
  },
  yearlyIncrease: number = 0,
  year: number = 0
): number {
  const totalBaseCosts = Object.values(baseCosts).reduce(
    (sum, cost) => sum + cost,
    0
  );
  return totalBaseCosts * Math.pow(1 + yearlyIncrease, year);
}

/**
 * Calculate opportunity cost of down payment
 */
export function calculateLostGrowth(
  downPayment: number,
  yearlyGrowth: number,
  years: number
): number {
  // What the down payment would have been worth if invested instead
  const wouldHaveBeenWorth = downPayment * Math.pow(1 + yearlyGrowth, years);
  return wouldHaveBeenWorth - downPayment;
}

/**
 * Main calculation function for a scenario
 */
export function calculateScenario(
  scenario: Scenario,
  years: number = 20
): ScenarioCalculationResult {
  const yearlyData: YearlyData[] = [];
  let totalInterestPaid = 0;
  let totalCostsPaid = 0;

  // Calculate loan schedule if home ownership scenario
  let loanSchedule: ReturnType<typeof calculateLoanSchedule> | null = null;
  if (scenario.homeOwnership) {
    const monthlyAmortization =
      scenario.homeOwnership.monthlyAmortering ||
      calculateAmorteringskrav(
        scenario.homeOwnership.loanAmount,
        scenario.homeOwnership.purchasePrice
      );

    loanSchedule = calculateLoanSchedule(
      scenario.homeOwnership.loanAmount,
      scenario.homeOwnership.yearlyInterestRate,
      monthlyAmortization,
      years,
      scenario.homeOwnership.amorteringsbefrielse
    );
    totalInterestPaid = loanSchedule.totalInterestPaid;
  }

  // Calculate property growth if applicable
  const initialPropertyValue = scenario.homeOwnership
    ? scenario.homeOwnership.purchasePrice
    : 0;

  const propertyGrowthRate = 0.03; // Default 3% property growth

  // Generate yearly data
  for (let year = 0; year <= years; year++) {
    // Investment value (calculated year by year to include monthly deposits)
    const investmentValue =
      year === 0
        ? scenario.investment.startingAmount
        : calculateInvestmentGrowth(
            scenario.investment.startingAmount,
            scenario.investment.monthlyDeposit,
            scenario.investment.expectedYearlyGrowth,
            year,
            scenario.investment.annualDeposit
          ).value;

    // Loan and property values
    let remainingLoan = 0;
    let homeValue = 0;
    let monthlyCosts = 0;

    if (scenario.homeOwnership && loanSchedule) {
      const loanDataIndex = Math.min(
        year - 1,
        loanSchedule.yearlyData.length - 1
      );
      const loanData = year > 0 ? loanSchedule.yearlyData[loanDataIndex] : null;
      remainingLoan =
        year === 0
          ? scenario.homeOwnership.loanAmount
          : loanData?.remainingLoan || 0;

      homeValue =
        year === 0
          ? initialPropertyValue
          : calculatePropertyValue(
              initialPropertyValue,
              propertyGrowthRate,
              year
            );

      monthlyCosts = calculateMonthlyCosts(
        scenario.homeOwnership.monthlyCosts,
        scenario.homeOwnership.yearlyIncrease || 0,
        year
      );

      totalCostsPaid += monthlyCosts * 12;
    }

    const homeEquity = Math.max(0, homeValue - remainingLoan);

    const netWorth = investmentValue + homeEquity;

    // Lost growth from down payment
    const lostGrowthFromDownPayment = scenario.homeOwnership
      ? calculateLostGrowth(
          scenario.homeOwnership.downPayment,
          scenario.investment.expectedYearlyGrowth,
          year
        )
      : 0;

    yearlyData.push({
      year,
      investmentValue,
      remainingLoan,
      homeValue,
      homeEquity,
      netWorth,
      totalMonthlyCosts: monthlyCosts,
      lostGrowthFromDownPayment,
    });
  }

  const finalData = yearlyData[yearlyData.length - 1];
  const summary: ScenarioSummary = {
    totalNetWorth: finalData.netWorth,
    totalInvestmentValue: finalData.investmentValue,
    totalHomeEquity: finalData.homeEquity,
    totalInterestPaid,
    totalCostsPaid,
  };

  return {
    scenarioId: scenario.id,
    yearlyData,
    summary,
  };
}
