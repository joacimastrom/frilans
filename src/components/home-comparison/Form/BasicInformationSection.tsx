import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getIncomeTax } from "@/lib/helpers";
import { PersonalFinances } from "@/models/home-comparison";
import FormattedNumberInput from "./FormattedNumberInput";
import LabelWithHelp from "./LabelWithHelp";

interface BasicInformationSectionProps {
  name: string;
  onNameChange: (name: string) => void;
  personalFinances: PersonalFinances;
  onPersonalFinancesChange: (
    field: keyof PersonalFinances,
    value: number
  ) => void;
  includeHome: boolean;
  onIncludeHomeChange: (include: boolean) => void;
  isBaseline: boolean;
  formatNumber: (value: number) => string;
  parseNumber: (value: string) => number;
}

export default function BasicInformationSection({
  name,
  onNameChange,
  personalFinances,
  onPersonalFinancesChange,
  includeHome,
  onIncludeHomeChange,
  isBaseline,
  formatNumber,
  parseNumber,
}: BasicInformationSectionProps) {
  // Calculate net salary
  const { monthlyIncomeTax } = getIncomeTax(personalFinances.monthlySalary);
  const netSalary = personalFinances.monthlySalary - monthlyIncomeTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grundinformation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Scenarionamn</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="T.ex. Köp lägenhet på Södermalm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="total-liquid-funds">
              Totala likvida medel (kr)
            </Label>
            <FormattedNumberInput
              id="total-liquid-funds"
              value={personalFinances.totalLiquidFunds}
              onChange={(value) =>
                onPersonalFinancesChange("totalLiquidFunds", value)
              }
              placeholder="T.ex. 2 000 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
          </div>

          <div>
            <LabelWithHelp
              htmlFor="monthly-salary"
              helpText="Avgör hur mycket du får låna"
            >
              Månadslön brutto
            </LabelWithHelp>
            <FormattedNumberInput
              id="monthly-salary"
              value={personalFinances.monthlySalary}
              onChange={(value) =>
                onPersonalFinancesChange("monthlySalary", value)
              }
              placeholder="T.ex. 65 000"
              formatNumber={formatNumber}
              parseNumber={parseNumber}
            />
            {personalFinances.monthlySalary > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Nettolön: {formatNumber(netSalary)} kr/månad
              </div>
            )}
          </div>
        </div>

        {!isBaseline && (
          <div className="flex items-center space-x-2">
            <Switch
              id="include-home"
              checked={includeHome}
              onCheckedChange={onIncludeHomeChange}
            />
            <Label htmlFor="include-home">Inkludera bostadsköp</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
