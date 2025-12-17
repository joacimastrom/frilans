import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIncomeTax } from "@/lib/helpers";
import { formatNumber, parseNumber } from "@/lib/numberUtils";
import { HomeOwnershipType, PersonalFinances } from "@/models/home-comparison";
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
  homeOwnershipType: HomeOwnershipType;
  onHomeOwnershipTypeChange: (type: HomeOwnershipType) => void;
  isBaseline: boolean;
}

export default function BasicInformationSection({
  name,
  onNameChange,
  personalFinances,
  onPersonalFinancesChange,
  homeOwnershipType,
  onHomeOwnershipTypeChange,
  isBaseline,
}: BasicInformationSectionProps) {
  // Calculate net salary and total annual income
  const { monthlyIncomeTax } = getIncomeTax(personalFinances.monthlySalary);
  const netSalary = personalFinances.monthlySalary - monthlyIncomeTax;
  const totalAnnualIncome =
    personalFinances.monthlySalary * 12 + personalFinances.yearlyCapitalIncome;

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
                {totalAnnualIncome > personalFinances.monthlySalary * 12 && (
                  <>
                    <br />
                    Total årsinkomst: {formatNumber(totalAnnualIncome)} kr/år
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <LabelWithHelp
            htmlFor="yearly-capital-income"
            helpText="Utdelningar, räntor och andra kapitalinkomster som räknas in i lånekalkylen"
          >
            Årlig kapitalinkomst (kr)
          </LabelWithHelp>
          <FormattedNumberInput
            id="yearly-capital-income"
            value={personalFinances.yearlyCapitalIncome}
            onChange={(value) =>
              onPersonalFinancesChange("yearlyCapitalIncome", value)
            }
            placeholder="T.ex. 50 000"
            formatNumber={formatNumber}
            parseNumber={parseNumber}
          />
        </div>

        {!isBaseline && (
          <div className="space-y-2">
            <Label htmlFor="home-ownership-type">Bostadssituation</Label>
            <Select
              value={homeOwnershipType}
              onValueChange={onHomeOwnershipTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj bostadssituation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ingen bostad</SelectItem>
                <SelectItem value="purchase">Bostadsköp</SelectItem>
                <SelectItem value="owned">Redan ägd bostad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
