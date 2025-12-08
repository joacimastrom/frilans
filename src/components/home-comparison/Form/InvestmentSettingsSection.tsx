import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Investment } from "@/models/home-comparison";
import FormattedNumberInput from "./FormattedNumberInput";
import LabelWithHelp from "./LabelWithHelp";

interface InvestmentSettingsSectionProps {
  investment: Investment;
  onInvestmentChange: (field: keyof Investment, value: number) => void;
  formatNumber: (value: number) => string;
  parseNumber: (value: string) => number;
  formatToTwoDecimals: (value: number) => number;
  totalLiquidFunds: number;
  downPayment: number;
  netSalary?: number;
  totalMonthlyCosts?: number;
}

export default function InvestmentSettingsSection({
  investment,
  onInvestmentChange,
  formatNumber,
  parseNumber,
  formatToTwoDecimals,
  totalLiquidFunds,
  downPayment,
  netSalary = 0,
  totalMonthlyCosts = 0,
}: InvestmentSettingsSectionProps) {
  const maxStartingAmount = Math.max(0, totalLiquidFunds - downPayment);
  const remainingNetSalary = Math.max(0, netSalary - totalMonthlyCosts);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Investeringar</span>
          {netSalary > 0 && totalMonthlyCosts > 0 && (
            <span className="text-sm font-normal text-gray-600">
              Disponibel inkomst: {formatNumber(remainingNetSalary)} kr/månad
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelWithHelp
              htmlFor="starting-amount"
              helpText={`Max: ${formatNumber(maxStartingAmount)}`}
            >
              Startkapital
            </LabelWithHelp>
            <FormattedNumberInput
              id="starting-amount"
              value={Math.min(investment.startingAmount, maxStartingAmount)}
              onChange={(value) =>
                onInvestmentChange(
                  "startingAmount",
                  Math.min(value, maxStartingAmount)
                )
              }
              placeholder="T.ex. 500 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>

          <div>
            <LabelWithHelp htmlFor="monthly-deposit">Månadsspar</LabelWithHelp>
            <FormattedNumberInput
              id="monthly-deposit"
              value={investment.monthlyDeposit}
              onChange={(value) => onInvestmentChange("monthlyDeposit", value)}
              placeholder="T.ex. 10 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <LabelWithHelp htmlFor="annual-deposit">
              Årsinsättning
            </LabelWithHelp>
            <FormattedNumberInput
              id="annual-deposit"
              value={investment.annualDeposit}
              onChange={(value) => onInvestmentChange("annualDeposit", value)}
              placeholder="T.ex. 50 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>

          <div>
            <LabelWithHelp htmlFor="yearly-growth">
              Förväntad årlig avkastning (%)
            </LabelWithHelp>
            <Input
              id="yearly-growth"
              type="number"
              step="0.01"
              value={(investment.expectedYearlyGrowth * 100).toFixed(2)}
              onChange={(e) =>
                onInvestmentChange(
                  "expectedYearlyGrowth",
                  formatToTwoDecimals(parseFloat(e.target.value) / 100)
                )
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
