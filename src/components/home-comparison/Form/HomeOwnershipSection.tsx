import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calculateAmortization } from "@/lib/homeOwnershipHelpers";
import { formatNumber, parseNumber } from "@/lib/numberUtils";
import { HomeOwnership } from "@/models/home-comparison";
import { Info } from "lucide-react";
import { useEffect } from "react";
import FormattedNumberInput from "./FormattedNumberInput";
import LabelWithHelp from "./LabelWithHelp";

interface HomeOwnershipSectionProps {
  homeOwnership?: HomeOwnership;
  onHomeOwnershipChange: (
    field: keyof HomeOwnership,
    value: string | number | undefined | HomeOwnership["monthlyCosts"]
  ) => void;
  monthlySalary: number;
  yearlyCapitalIncome: number;
  totalLiquidFunds: number;
  homeOwnershipType: "purchase" | "owned";
}

export default function HomeOwnershipSection({
  homeOwnership,
  onHomeOwnershipChange,
  monthlySalary,
  yearlyCapitalIncome,
  totalLiquidFunds,
  homeOwnershipType,
}: HomeOwnershipSectionProps) {
  // Calculate max loan and purchase price based on Swedish mortgage rules
  const totalAnnualIncome = monthlySalary * 12 + yearlyCapitalIncome;
  const maxLoanByIncome = totalAnnualIncome * 5.5; // 5.5x total yearly income
  const maxPurchasePrice = maxLoanByIncome + totalLiquidFunds; // Max loan + available liquid funds

  // Calculate loan amount automatically for purchase scenarios
  const purchasePrice = homeOwnership?.purchasePrice || 0;
  let downPayment = homeOwnership?.downPayment || 0;

  // For purchase scenarios, ensure loan doesn't exceed income limits
  let calculatedLoanAmount = 0;
  if (homeOwnershipType === "purchase") {
    const desiredLoan = Math.max(0, purchasePrice - downPayment);
    calculatedLoanAmount = Math.min(desiredLoan, maxLoanByIncome);

    // If loan is capped by income, adjust down payment accordingly
    if (desiredLoan > maxLoanByIncome && purchasePrice > 0) {
      const requiredDownPayment = purchasePrice - maxLoanByIncome;
      downPayment = Math.max(downPayment, requiredDownPayment);
    }
  } else {
    calculatedLoanAmount = homeOwnership?.loanAmount || 0;
  }

  // Calculate required amortization based on Swedish rules
  const annualIncome = totalAnnualIncome;
  let requiredMonthlyAmount = 0;
  let amortizationData = {
    ltvBasedRate: 0,
    incomeBasedRate: 0,
    requiredMonthlyAmount: 0,
  };

  if (homeOwnershipType === "purchase") {
    amortizationData = calculateAmortization(
      calculatedLoanAmount,
      purchasePrice,
      annualIncome
    );
    requiredMonthlyAmount = amortizationData.requiredMonthlyAmount;
  } else if (homeOwnershipType === "owned") {
    // For owned homes, calculate amortization based on current loan and market value
    const currentMarketValue = homeOwnership?.currentValue || 0;
    const currentLoan = homeOwnership?.loanAmount || 0;
    if (currentMarketValue > 0 && currentLoan > 0) {
      amortizationData = calculateAmortization(
        currentLoan,
        currentMarketValue,
        annualIncome
      );
      requiredMonthlyAmount = amortizationData.requiredMonthlyAmount;
    }
  }

  // Update loan amount and down payment when calculations change (only for purchase scenarios)
  useEffect(() => {
    if (homeOwnershipType === "purchase") {
      if (calculatedLoanAmount !== (homeOwnership?.loanAmount || 0)) {
        onHomeOwnershipChange("loanAmount", calculatedLoanAmount);
      }

      // Update down payment if it was adjusted due to loan limits
      if (downPayment !== (homeOwnership?.downPayment || 0)) {
        onHomeOwnershipChange("downPayment", downPayment);
      }
    }
  }, [
    homeOwnershipType,
    calculatedLoanAmount,
    downPayment,
    homeOwnership?.loanAmount,
    homeOwnership?.downPayment,
    onHomeOwnershipChange,
  ]);

  // Update amortization when calculation changes (for both purchase and owned scenarios)
  useEffect(() => {
    if (
      (homeOwnershipType === "purchase" || homeOwnershipType === "owned") &&
      requiredMonthlyAmount !== (homeOwnership?.monthlyAmortering || 0)
    ) {
      onHomeOwnershipChange("monthlyAmortering", requiredMonthlyAmount);
    }
  }, [
    homeOwnershipType,
    requiredMonthlyAmount,
    homeOwnership?.monthlyAmortering,
    onHomeOwnershipChange,
  ]);

  // Helper function to update monthly costs
  const updateMonthlyCost = (field: string, value: number) => {
    const currentCosts = homeOwnership?.monthlyCosts || {
      avgift: 0,
      drift: 0,
      el: 0,
      värme: 0,
      försäkring: 0,
      övrigt: 0,
    };

    const updatedCosts = {
      ...currentCosts,
      [field]: value,
    };

    onHomeOwnershipChange("monthlyCosts", updatedCosts);
  };

  // Calculate total monthly costs
  const loanAmount =
    homeOwnershipType === "purchase"
      ? calculatedLoanAmount
      : homeOwnership?.loanAmount || 0;
  const monthlyInterest =
    (loanAmount * (homeOwnership?.yearlyInterestRate || 0)) / 12;
  const monthlyFees =
    (homeOwnership?.monthlyCosts?.avgift || 0) +
    (homeOwnership?.monthlyCosts?.drift || 0);

  const monthlyAmortization =
    homeOwnershipType === "purchase"
      ? requiredMonthlyAmount
      : homeOwnership?.monthlyAmortering || 0;

  const totalMonthlyCost = monthlyInterest + monthlyAmortization + monthlyFees;

  // Generate detailed amortization explanation with calculations
  const getAmortizationExplanation = () => {
    const propertyValue =
      homeOwnershipType === "purchase"
        ? purchasePrice
        : homeOwnership?.currentValue || 0;
    const loanAmount =
      homeOwnershipType === "purchase"
        ? calculatedLoanAmount
        : homeOwnership?.loanAmount || 0;
    const ltv = propertyValue > 0 ? loanAmount / propertyValue : 0;
    const debtToIncome = loanAmount / annualIncome;

    let explanation = "BERÄKNING AV AMORTERING:\n\n";

    // Show basic values
    explanation += "Grundvärden:\n";
    explanation += `• Lånebelopp: ${formatNumber(loanAmount)} kr\n`;
    explanation += `• ${
      homeOwnershipType === "purchase" ? "Köpeskilling" : "Marknadsvärde"
    }: ${formatNumber(propertyValue)} kr\n`;
    explanation += `• Årsinkomst: ${formatNumber(annualIncome)} kr\n\n`;

    // LTV calculation and rule
    explanation += "1. BELÅNINGSGRAD (LTV):\n";
    explanation += `Lånebelopp ÷ ${
      homeOwnershipType === "purchase" ? "Köpeskilling" : "Marknadsvärde"
    } = ${formatNumber(loanAmount)} ÷ ${formatNumber(propertyValue)} = ${(
      ltv * 100
    ).toFixed(1)}%\n\n`;

    if (ltv > 0.7) {
      explanation += `Resultat: ${(ltv * 100).toFixed(
        1
      )}% > 70% → 2% årlig amortering krävs\n`;
      explanation += `LTV-amortering: ${formatNumber(
        loanAmount
      )} × 2% = ${formatNumber(loanAmount * 0.02)} kr/år\n`;
    } else if (ltv > 0.5) {
      explanation += `Resultat: 50% < ${(ltv * 100).toFixed(
        1
      )}% ≤ 70% → 1% årlig amortering krävs\n`;
      explanation += `LTV-amortering: ${formatNumber(
        loanAmount
      )} × 1% = ${formatNumber(loanAmount * 0.01)} kr/år\n`;
    } else {
      explanation += `Resultat: ${(ltv * 100).toFixed(
        1
      )}% ≤ 50% → Ingen LTV-amortering krävs\n`;
      explanation += `LTV-amortering: 0 kr/år\n`;
    }

    // Debt-to-income calculation and rule
    explanation += "\n2. SKULDKVOT:\n";
    explanation += `Lånebelopp ÷ Årsinkomst = ${formatNumber(
      loanAmount
    )} ÷ ${formatNumber(annualIncome)} = ${debtToIncome.toFixed(1)}x\n\n`;

    if (debtToIncome > 4.5) {
      explanation += `Resultat: ${debtToIncome.toFixed(
        1
      )}x > 4,5x → +1% extra amortering krävs\n`;
      explanation += `Skuldkvot-amortering: ${formatNumber(
        loanAmount
      )} × 1% = ${formatNumber(loanAmount * 0.01)} kr/år\n`;
    } else {
      explanation += `Resultat: ${debtToIncome.toFixed(
        1
      )}x ≤ 4,5x → Ingen extra amortering krävs\n`;
      explanation += `Skuldkvot-amortering: 0 kr/år\n`;
    }

    // Final calculation
    const ltvAmount = loanAmount * amortizationData.ltvBasedRate;
    const incomeAmount = loanAmount * amortizationData.incomeBasedRate;
    const totalAnnual = ltvAmount + incomeAmount;

    explanation += "\n3. SLUTBERÄKNING:\n";
    explanation += `Total årlig amortering = ${formatNumber(
      ltvAmount
    )} + ${formatNumber(incomeAmount)} = ${formatNumber(totalAnnual)} kr\n`;
    explanation += `Månadsbelopp = ${formatNumber(
      totalAnnual
    )} ÷ 12 = ${formatNumber(totalAnnual / 12)} kr\n`;
    explanation += `Avrundat månadsbelopp = ${formatNumber(
      requiredMonthlyAmount
    )} kr`;

    return explanation;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {homeOwnershipType === "purchase"
              ? "Bostadsköp"
              : "Redan ägd bostad"}
          </span>
          {totalMonthlyCost > 0 && (
            <span className="text-sm font-normal text-gray-600">
              Total kostnad per månad: {formatNumber(totalMonthlyCost)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {homeOwnershipType === "purchase" && (
          <div>
            <LabelWithHelp
              htmlFor="purchase-price"
              helpText={`Max: ${formatNumber(maxPurchasePrice)}`}
            >
              Förväntad köpeskilling
            </LabelWithHelp>
            <FormattedNumberInput
              id="purchase-price"
              value={Math.min(
                homeOwnership?.purchasePrice || 0,
                maxPurchasePrice
              )}
              onChange={(value) =>
                onHomeOwnershipChange(
                  "purchasePrice",
                  Math.min(value, maxPurchasePrice)
                )
              }
              placeholder="T.ex. 5 000 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>
        )}

        {homeOwnershipType === "owned" && (
          <div>
            <LabelWithHelp htmlFor="current-value">
              Nuvarande marknadsvärde
            </LabelWithHelp>
            <FormattedNumberInput
              id="current-value"
              value={homeOwnership?.currentValue || 0}
              onChange={(value) => onHomeOwnershipChange("currentValue", value)}
              placeholder="T.ex. 5 000 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {homeOwnershipType === "purchase" && (
            <div>
              <LabelWithHelp
                htmlFor="down-payment"
                helpText={`Min: ${formatNumber(
                  Math.max(
                    purchasePrice * 0.15, // 15% regulatory minimum
                    purchasePrice - maxLoanByIncome // Purchase price minus max loan
                  )
                )} (${
                  purchasePrice > 0 &&
                  purchasePrice - maxLoanByIncome > purchasePrice * 0.15
                    ? "Lånebegränsning"
                    : "15%"
                }).`}
              >
                Kontantinsats
              </LabelWithHelp>
              <FormattedNumberInput
                id="down-payment"
                value={Math.min(downPayment, totalLiquidFunds)}
                onChange={(value) =>
                  onHomeOwnershipChange(
                    "downPayment",
                    Math.min(value, totalLiquidFunds)
                  )
                }
                placeholder="T.ex. 750 000"
                formatNumber={formatNumber}
                parseNumber={parseNumber}
              />
            </div>
          )}

          <div>
            <LabelWithHelp
              htmlFor="loan-amount"
              helpText={
                homeOwnershipType === "purchase"
                  ? `Max lån: ${formatNumber(
                      maxLoanByIncome
                    )} (5,5x total årsinkomst).`
                  : ""
              }
            >
              {homeOwnershipType === "purchase"
                ? "Lånebelopp"
                : "Nuvarande lånebelopp"}
            </LabelWithHelp>
            {homeOwnershipType === "purchase" ? (
              <Input
                id="loan-amount"
                type="text"
                value={formatNumber(calculatedLoanAmount)}
                readOnly
                disabled
                className="bg-gray-50 text-gray-600"
              />
            ) : (
              <FormattedNumberInput
                id="loan-amount"
                value={homeOwnership?.loanAmount || 0}
                onChange={(value) => onHomeOwnershipChange("loanAmount", value)}
                placeholder="T.ex. 3 500 000"
                formatNumber={formatNumber}
                parseNumber={parseNumber}
              />
            )}
          </div>
          <div>
            <LabelWithHelp
              htmlFor="interest-rate"
              helpText={`Månadskostnad: ${formatNumber(monthlyInterest)} kr`}
            >
              Ränta (%)
            </LabelWithHelp>
            <Input
              id="interest-rate"
              type="text"
              defaultValue={(homeOwnership?.yearlyInterestRate || 0) * 100}
              onBlur={(e) => {
                const value = e.target.value.replace(",", ".");
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                  onHomeOwnershipChange("yearlyInterestRate", numValue / 100);
                }
              }}
              placeholder="T.ex. 3,25"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LabelWithHelp htmlFor="monthly-amortization">
                Amortering per månad
              </LabelWithHelp>
              {(homeOwnershipType === "purchase" ||
                homeOwnershipType === "owned") && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Information om amorteringskrav"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Amorteringskrav enligt svenska regler
                      </h4>
                      <div className="text-xs space-y-1 text-gray-600">
                        <div className="whitespace-pre-line">
                          {getAmortizationExplanation()}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <Input
              id="monthly-amortization"
              type="text"
              value={formatNumber(requiredMonthlyAmount)}
              readOnly
              disabled
              className="bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelWithHelp htmlFor="monthly-fee">Månadsavgift</LabelWithHelp>
            <FormattedNumberInput
              id="monthly-fee"
              value={homeOwnership?.monthlyCosts?.avgift || 0}
              onChange={(value) => updateMonthlyCost("avgift", value)}
              placeholder="T.ex. 4 500"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>

          <div>
            <LabelWithHelp
              htmlFor="operating-costs"
              helpText="Värme, el, försäkring etc."
            >
              Driftskostnad per månad
            </LabelWithHelp>
            <FormattedNumberInput
              id="operating-costs"
              value={homeOwnership?.monthlyCosts?.drift || 0}
              onChange={(value) => updateMonthlyCost("drift", value)}
              placeholder="T.ex. 2 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
