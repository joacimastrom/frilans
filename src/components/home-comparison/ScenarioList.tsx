import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scenario } from "@/models/home-comparison";
import { Copy, Edit, Eye, EyeOff, Trash2 } from "lucide-react";

interface ScenarioListProps {
  scenarios: Scenario[];
  visibleScenarios: Set<string>;
  onToggleVisibility: (scenarioId: string) => void;
  onEditScenario: (scenario: Scenario) => void;
  onDuplicateScenario: (scenario: Scenario) => void;
  onDeleteScenario: (scenarioId: string) => void;
}

export default function ScenarioList({
  scenarios,
  visibleScenarios,
  onToggleVisibility,
  onEditScenario,
  onDuplicateScenario,
  onDeleteScenario,
}: ScenarioListProps) {
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Scenarior</h2>

      {scenarios.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Inga scenarior skapade än.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => {
            const isVisible = visibleScenarios.has(scenario.id);
            const totalPropertyValue = scenario.homeOwnership
              ? scenario.homeOwnership.downPayment +
                scenario.homeOwnership.loanAmount
              : 0;

            return (
              <Card
                key={scenario.id}
                className={`relative ${!isVisible ? "opacity-50" : ""}`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: scenario.color }}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleVisibility(scenario.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Investment Info */}
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Startkapital:</span>
                      <span>
                        {formatNumber(scenario.investment.startingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Månadsspar:</span>
                      <span>
                        {formatNumber(scenario.investment.monthlyDeposit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Årlig avkastning:</span>
                      <span>
                        {(
                          scenario.investment.expectedYearlyGrowth * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Home Info */}
                  {scenario.homeOwnership && (
                    <div className="text-sm space-y-1 pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bostadspris:</span>
                        <span>{formatNumber(totalPropertyValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kontantinsats:</span>
                        <span>
                          {formatNumber(scenario.homeOwnership.downPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lån:</span>
                        <span>
                          {formatNumber(scenario.homeOwnership.loanAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ränta:</span>
                        <span>
                          {(
                            scenario.homeOwnership.yearlyInterestRate * 100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-3 border-t">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditScenario(scenario)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateScenario(scenario)}
                        className="h-8 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    {!scenario.isBaseline && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteScenario(scenario.id)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
