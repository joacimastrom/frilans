import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calculateAmortization } from "@/lib/homeOwnershipHelpers";
import { HomeOwnership } from "@/models/home-comparison";
import { useEffect } from "react";
import FormattedNumberInput from "./FormattedNumberInput";
import LabelWithHelp from "./LabelWithHelp";

interface HomeOwnershipSectionProps {
  homeOwnership?: HomeOwnership;
  onHomeOwnershipChange: (
    field: keyof HomeOwnership,
    value: string | number | undefined | HomeOwnership["monthlyCosts"]
  ) => void;
  formatNumber: (value: number) => string;
  parseNumber: (value: string) => number;
  formatToTwoDecimals: (value: number) => number;
  monthlySalary: number;
  totalLiquidFunds: number;
}

export default function HomeOwnershipSection({
  homeOwnership,
  onHomeOwnershipChange,
  formatNumber,
  parseNumber,
  monthlySalary,
  totalLiquidFunds,
}: HomeOwnershipSectionProps) {
  // Calculate max purchase price based on Swedish mortgage rules
  const maxByIncome = monthlySalary * 12 * 5.5; // 5.5x yearly salary
  const maxByLiquidFunds = totalLiquidFunds / 0.15; // Liquid funds / 15% down payment requirement
  const maxPurchasePrice = Math.min(maxByIncome, maxByLiquidFunds);

  // Calculate loan amount automatically
  const purchasePrice = homeOwnership?.purchasePrice || 0;
  const downPayment = homeOwnership?.downPayment || 0;
  const calculatedLoanAmount = Math.max(0, purchasePrice - downPayment);

  // Calculate required amortization based on Swedish rules
  const annualIncome = monthlySalary * 12;
  const { requiredMonthlyAmount } = calculateAmortization(
    calculatedLoanAmount,
    purchasePrice,
    annualIncome
  );

  // Update loan amount when purchase price or down payment changes
  useEffect(() => {
    if (calculatedLoanAmount !== (homeOwnership?.loanAmount || 0)) {
      onHomeOwnershipChange("loanAmount", calculatedLoanAmount);
    }
  }, [calculatedLoanAmount, homeOwnership?.loanAmount, onHomeOwnershipChange]);

  // Update amortization when calculation changes
  useEffect(() => {
    if (requiredMonthlyAmount !== (homeOwnership?.monthlyAmortering || 0)) {
      onHomeOwnershipChange("monthlyAmortering", requiredMonthlyAmount);
    }
  }, [
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
  const monthlyInterest =
    (calculatedLoanAmount * (homeOwnership?.yearlyInterestRate || 0)) / 12;
  const monthlyFees =
    (homeOwnership?.monthlyCosts?.avgift || 0) +
    (homeOwnership?.monthlyCosts?.drift || 0);
  const totalMonthlyCost =
    monthlyInterest + requiredMonthlyAmount + monthlyFees;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Bostadsköp</span>
          {totalMonthlyCost > 0 && (
            <span className="text-sm font-normal text-gray-600">
              Totalt per månad: {formatNumber(totalMonthlyCost)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelWithHelp
              htmlFor="down-payment"
              helpText={`Max: ${formatNumber(
                totalLiquidFunds
              )} (Dina likvida medel)`}
            >
              Kontantinsats
            </LabelWithHelp>
            <FormattedNumberInput
              id="down-payment"
              value={Math.min(
                homeOwnership?.downPayment || 0,
                totalLiquidFunds
              )}
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

          <div>
            <LabelWithHelp htmlFor="loan-amount">Lånebelopp</LabelWithHelp>
            <Input
              id="loan-amount"
              type="text"
              value={formatNumber(calculatedLoanAmount)}
              readOnly
              disabled
              className="bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <LabelWithHelp
              htmlFor="interest-rate"
              helpText="Aktuell bolåneränta från din bank"
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
            <LabelWithHelp htmlFor="monthly-amortization">
              Amortering per månad
            </LabelWithHelp>
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
