export type AmortizationData = {
  requiredAnnualRate: number;
  requiredMonthlyAmount: number;
  ltvBasedRate: number;
  incomeBasedRate: number;
};

/**
 * Calculates required mortgage amortization according to Swedish banking regulations
 *
 * Swedish amortization requirements (amorteringskrav):
 * 1. LTV-based requirement (belåningsgrad):
 *    - Over 70% LTV: 2% annual amortization
 *    - 50-70% LTV: 1% annual amortization
 *    - Under 50% LTV: 0% amortization
 *
 * 2. Income-based requirement (skuldkvot):
 *    - Over 4.5x annual income: Additional 1% annual amortization
 *
 * The requirements are additive, so maximum is 3% (2% + 1%).
 */
export const calculateAmortization = (
  loanAmount: number,
  propertyValue: number,
  annualIncome: number
): AmortizationData => {
  if (!loanAmount || !propertyValue || !annualIncome) {
    return {
      requiredAnnualRate: 0,
      requiredMonthlyAmount: 0,
      ltvBasedRate: 0,
      incomeBasedRate: 0,
    };
  }

  const ltv = loanAmount / propertyValue;
  const debtToIncome = loanAmount / annualIncome;

  let ltvBasedRate = 0;
  let incomeBasedRate = 0;

  // LTV-based requirement (belåningsgrad)
  if (ltv > 0.7) {
    ltvBasedRate = 0.02; // 2% for loans over 70% LTV
  } else if (ltv > 0.5) {
    ltvBasedRate = 0.01; // 1% for loans 50-70% LTV
  }
  // 0% for loans under 50% LTV

  // Income-based additional requirement (skuldkvot)
  if (debtToIncome > 4.5) {
    incomeBasedRate = 0.01; // Additional 1% for loans over 4.5x annual income
  }

  const totalRate = ltvBasedRate + incomeBasedRate;
  const annualAmount = loanAmount * totalRate;
  const monthlyAmount = Math.round(annualAmount / 12);

  return {
    requiredAnnualRate: totalRate,
    requiredMonthlyAmount: monthlyAmount,
    ltvBasedRate,
    incomeBasedRate,
  };
};
