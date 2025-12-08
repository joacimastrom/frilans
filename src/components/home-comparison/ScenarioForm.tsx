import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIncomeTax } from "@/lib/helpers";
import { calculateAmortization } from "@/lib/homeOwnershipHelpers";
import {
  BASELINE_COLOR,
  DEFAULT_HOME_OWNERSHIP,
  DEFAULT_INVESTMENT,
  DEFAULT_PERSONAL_FINANCES,
  HomeOwnership,
  Investment,
  PersonalFinances,
  Scenario,
} from "@/models/home-comparison";
import { useState } from "react";
import ActionButtonsSection from "./Form/ActionButtonsSection";
import BasicInformationSection from "./Form/BasicInformationSection";
import HomeOwnershipSection from "./Form/HomeOwnershipSection";
import InvestmentSettingsSection from "./Form/InvestmentSettingsSection";

interface ScenarioFormProps {
  scenario?: Scenario;
  onSave: (scenario: Scenario) => void;
  onCancel: () => void;
  isBaseline?: boolean;
  availableColors?: string[];
}

export default function ScenarioForm({
  scenario,
  onSave,
  onCancel,
  isBaseline = false,
  availableColors = [],
}: ScenarioFormProps) {
  const [formData, setFormData] = useState<Scenario>({
    id: scenario?.id || crypto.randomUUID(),
    name:
      scenario?.name || (isBaseline ? "Nuvarande situation" : "Nytt scenario"),
    isBaseline: isBaseline,
    color: scenario?.color || (isBaseline ? BASELINE_COLOR : "#3B82F6"),
    personalFinances: scenario?.personalFinances || {
      ...DEFAULT_PERSONAL_FINANCES,
    },
    investment: scenario?.investment || { ...DEFAULT_INVESTMENT },
    homeOwnership:
      scenario?.homeOwnership ||
      (isBaseline ? undefined : { ...DEFAULT_HOME_OWNERSHIP }),
  });

  const [includeHome, setIncludeHome] = useState(
    !!scenario?.homeOwnership || !isBaseline
  );

  const updatePersonalFinances = (
    field: keyof PersonalFinances,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      personalFinances: {
        ...prev.personalFinances,
        [field]: value,
      },
    }));
  };

  const updateInvestment = (
    field: keyof Investment,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      investment: {
        ...prev.investment,
        [field]: value,
      },
    }));
  };

  const updateHomeOwnership = (
    field: keyof HomeOwnership,
    value: string | number | undefined | HomeOwnership["monthlyCosts"]
  ) => {
    setFormData((prev) => ({
      ...prev,
      homeOwnership: prev.homeOwnership
        ? {
            ...prev.homeOwnership,
            [field]: value,
          }
        : { ...DEFAULT_HOME_OWNERSHIP, [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scenarioToSave: Scenario = {
      ...formData,
      homeOwnership: includeHome ? formData.homeOwnership : undefined,
      selling: includeHome ? formData.selling : undefined,
    };

    onSave(scenarioToSave);
  };

  // Calculate net salary and total monthly costs for investment section
  const { monthlyIncomeTax } = getIncomeTax(
    formData.personalFinances.monthlySalary
  );
  const netSalary = formData.personalFinances.monthlySalary - monthlyIncomeTax;

  // Calculate total monthly housing costs if home ownership is included
  let totalMonthlyCosts = 0;
  if (includeHome && formData.homeOwnership) {
    const loanAmount =
      (formData.homeOwnership.purchasePrice || 0) -
      (formData.homeOwnership.downPayment || 0);
    const monthlyInterest =
      (loanAmount * (formData.homeOwnership.yearlyInterestRate || 0)) / 12;
    const { requiredMonthlyAmount: monthlyAmortization } =
      calculateAmortization(
        loanAmount,
        formData.homeOwnership.purchasePrice || 0,
        formData.personalFinances.monthlySalary * 12
      );

    const monthlyCosts = formData.homeOwnership.monthlyCosts;
    const monthlyFees = monthlyCosts
      ? monthlyCosts.avgift + monthlyCosts.drift
      : 0;

    totalMonthlyCosts = monthlyInterest + monthlyAmortization + monthlyFees;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInformationSection
        name={formData.name}
        onNameChange={(name) => setFormData((prev) => ({ ...prev, name }))}
        personalFinances={formData.personalFinances}
        onPersonalFinancesChange={updatePersonalFinances}
        includeHome={includeHome}
        onIncludeHomeChange={setIncludeHome}
        isBaseline={isBaseline}
      />

      {/* Color Picker - Only show for non-baseline scenarios with available colors */}
      {!isBaseline && availableColors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scenariofärg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color
                      ? "border-gray-900 scale-110"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Välj färg: ${color}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Välj en färg för att identifiera scenariot i diagram
            </p>
          </CardContent>
        </Card>
      )}

      {/* Home Ownership */}
      {includeHome && (
        <HomeOwnershipSection
          homeOwnership={formData.homeOwnership}
          onHomeOwnershipChange={updateHomeOwnership}
          monthlySalary={formData.personalFinances.monthlySalary}
          totalLiquidFunds={formData.personalFinances.totalLiquidFunds}
        />
      )}
      <InvestmentSettingsSection
        investment={formData.investment}
        onInvestmentChange={updateInvestment}
        totalLiquidFunds={formData.personalFinances.totalLiquidFunds}
        downPayment={formData.homeOwnership?.downPayment || 0}
        netSalary={netSalary}
        totalMonthlyCosts={totalMonthlyCosts}
      />

      <ActionButtonsSection onCancel={onCancel} isEditing={!!scenario} />
    </form>
  );
}
