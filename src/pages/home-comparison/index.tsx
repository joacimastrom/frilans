import ComparisonChart from "@/components/home-comparison/ComparisonChart";
import ScenarioForm from "@/components/home-comparison/ScenarioForm";
import ScenarioList from "@/components/home-comparison/ScenarioList";
import MaxWidthSection from "@/components/MaxWidthSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateScenario,
  clearScenarios,
  copyToClipboard,
  generateShareableUrl,
  loadScenarios,
  loadScenariosFromUrl,
  saveScenarios,
} from "@/lib/home-comparison";
import {
  BASELINE_COLOR,
  Scenario,
  SCENARIO_COLORS,
  ScenarioCalculationResult,
} from "@/models/home-comparison";
import { Home, Plus, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeComparisonPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [results, setResults] = useState<ScenarioCalculationResult[]>([]);
  const [visibleScenarios, setVisibleScenarios] = useState<Set<string>>(
    new Set()
  );
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = () => {
      // Clear any old data format from localStorage (temporary during development)
      try {
        const oldData = localStorage.getItem("homeComparison_v1");
        if (oldData) {
          const parsed = JSON.parse(oldData);
          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            !parsed[0].personalFinances
          ) {
            // Old format detected, clear it
            localStorage.removeItem("homeComparison_v1");
          }
        }
      } catch {
        // If there's any error parsing, just clear it
        localStorage.removeItem("homeComparison_v1");
      }

      // Try to load from URL first
      let loadedScenarios = loadScenariosFromUrl();

      // If no URL data, try localStorage
      if (!loadedScenarios) {
        loadedScenarios = loadScenarios();
      }

      // Validate loaded scenarios - check if they have the new structure
      if (loadedScenarios) {
        const validScenarios = loadedScenarios.filter(
          (scenario) =>
            scenario.personalFinances &&
            typeof scenario.personalFinances.totalLiquidFunds === "number" &&
            typeof scenario.personalFinances.monthlySalary === "number"
        );

        // If no valid scenarios with new structure, start fresh
        if (validScenarios.length === 0) {
          loadedScenarios = [];
        } else {
          loadedScenarios = validScenarios;
        }
      }

      // If no saved data, start with empty scenarios
      if (!loadedScenarios || loadedScenarios.length === 0) {
        loadedScenarios = [];
      }

      setScenarios(loadedScenarios);
      setVisibleScenarios(new Set(loadedScenarios.map((s) => s.id)));
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && scenarios.length > 0) {
      saveScenarios(scenarios);
    }
  }, [scenarios, isLoading]);

  // Calculate results whenever scenarios change
  useEffect(() => {
    const newResults = scenarios.map((scenario) =>
      calculateScenario(scenario, 20)
    );
    setResults(newResults);
  }, [scenarios]);

  const createScenario = (scenarioData: Scenario) => {
    let color: string;

    if (scenarioData.isBaseline) {
      color = BASELINE_COLOR;
    } else if (
      scenarioData.color &&
      (editingScenario || getAvailableColors().includes(scenarioData.color))
    ) {
      // Use the color from the form if it's valid
      color = scenarioData.color;
    } else {
      // Fallback: assign new color for new scenarios
      const availableColors = getAvailableColors();
      color =
        availableColors.length > 0
          ? availableColors[0]
          : SCENARIO_COLORS[
              scenarios.filter((s) => !s.isBaseline).length %
                SCENARIO_COLORS.length
            ];
    }

    const newScenario: Scenario = {
      ...scenarioData,
      id: scenarioData.id || crypto.randomUUID(),
      color,
    };

    if (editingScenario) {
      setScenarios((prev) =>
        prev.map((s) => (s.id === editingScenario.id ? newScenario : s))
      );
    } else {
      setScenarios((prev) => [...prev, newScenario]);
      setVisibleScenarios((prev) => new Set([...prev, newScenario.id]));
    }

    setEditingScenario(null);
    setShowForm(false);
  };

  const handleEditScenario = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setShowForm(true);
  };

  const handleDuplicateScenario = (scenario: Scenario) => {
    const existingNonBaselineCount = scenarios.filter(
      (s) => !s.isBaseline
    ).length;
    const duplicatedScenario: Scenario = {
      ...scenario,
      id: crypto.randomUUID(),
      name: `${scenario.name} (kopia)`,
      isBaseline: false,
      color: SCENARIO_COLORS[existingNonBaselineCount % SCENARIO_COLORS.length],
    };

    setScenarios((prev) => [...prev, duplicatedScenario]);
    setVisibleScenarios((prev) => new Set([...prev, duplicatedScenario.id]));
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
    setVisibleScenarios((prev) => {
      const newVisible = new Set(prev);
      newVisible.delete(scenarioId);
      return newVisible;
    });
  };

  const handleToggleVisibility = (scenarioId: string) => {
    setVisibleScenarios((prev) => {
      const newVisible = new Set(prev);
      if (newVisible.has(scenarioId)) {
        newVisible.delete(scenarioId);
      } else {
        newVisible.add(scenarioId);
      }
      return newVisible;
    });
  };

  const handleShareScenarios = async () => {
    try {
      const shareUrl = generateShareableUrl(scenarios);
      const success = await copyToClipboard(shareUrl);

      if (success) {
        alert("Delbar länk kopierad till urklipp!");
      } else {
        prompt("Kopiera denna länk för att dela dina scenarior:", shareUrl);
      }
    } catch (error) {
      console.error("Error sharing scenarios:", error);
      alert("Kunde inte skapa delbar länk.");
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        "Är du säker på att du vill återställa all data? Detta kan inte ångras."
      )
    ) {
      clearScenarios();
      setScenarios([]);
      setVisibleScenarios(new Set());
    }
  };

  const getAvailableColors = (): string[] => {
    const usedColors = scenarios
      .filter(
        (s) =>
          !s.isBaseline && (!editingScenario || s.id !== editingScenario.id)
      )
      .map((s) => s.color);

    const availableColors = SCENARIO_COLORS.filter(
      (color) => !usedColors.includes(color)
    );

    // If editing, ensure current color is included in available options
    if (
      editingScenario &&
      editingScenario.color &&
      !availableColors.includes(editingScenario.color)
    ) {
      availableColors.unshift(editingScenario.color);
    }

    return availableColors;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar bostadsjämförelse...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <MaxWidthSection className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Home className="h-8 w-8 text-blue-600" />
                {editingScenario ? "Redigera scenario" : "Skapa nytt scenario"}
              </h1>
              <p className="text-gray-600 mt-1">
                {editingScenario
                  ? "Uppdatera scenarioinställningar"
                  : "Lägg till ett nytt finansiellt scenario att jämföra"}
              </p>
            </div>
          </div>

          <ScenarioForm
            scenario={editingScenario || undefined}
            onSave={createScenario}
            onCancel={() => {
              setShowForm(false);
              setEditingScenario(null);
            }}
            isBaseline={editingScenario?.isBaseline}
            availableColors={getAvailableColors()}
          />
        </div>
      </MaxWidthSection>
    );
  }

  return (
    <MaxWidthSection className="py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-4">
            <Home className="h-10 w-10 text-blue-600" />
            Bostadsjämförelse
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jämför olika finansiella scenarior för bostadsköp över tid. Se hur
            investeringar, lånevillkor och kostnader påverkar din totala
            ekonomi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Skapa nytt scenario
          </Button>

          <Button
            variant="outline"
            onClick={handleShareScenarios}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Dela scenarior
          </Button>

          <Button
            variant="outline"
            onClick={handleResetData}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Återställ data
          </Button>
        </div>

        {/* Empty State or Content */}
        {scenarios.length === 0 ? (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-12 text-center">
              <Home className="h-16 w-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Välkommen till Bostadsjämförelsen
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Jämför olika finansiella scenarior för bostadsköp över tid.
                Verktyget hjälper dig att förstå hur investeringar, lånevillkor
                och kostnader påverkar din totala ekonomi enligt svenska regler.
              </p>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-white/60 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Vad kan du jämföra?
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2 text-left">
                    <li>• Olika bostadspriser och lånevillkor</li>
                    <li>• Kontantinsats vs investeringsavkastning</li>
                    <li>• Månadskostand för bostad vs sparande</li>
                    <li>• Långsiktig förmögenhetsutveckling</li>
                  </ul>
                </div>

                <div className="bg-white/60 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Svenska regelverk
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2 text-left">
                    <li>• Max lån: 5,5x årslön</li>
                    <li>• Minst 15% kontantinsats</li>
                    <li>• Automatiska amorteringskrav</li>
                    <li>• Skatteeffekter på investeringar</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="text-lg px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Skapa ditt första scenario
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Scenario List */}
            <ScenarioList
              scenarios={scenarios}
              visibleScenarios={visibleScenarios}
              onToggleVisibility={handleToggleVisibility}
              onEditScenario={handleEditScenario}
              onDuplicateScenario={handleDuplicateScenario}
              onDeleteScenario={handleDeleteScenario}
            />

            {/* Comparison Chart */}
            <ComparisonChart
              results={results}
              scenarios={scenarios}
              visibleScenarios={visibleScenarios}
            />
          </>
        )}

        {/* Help Text */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Så fungerar verktyget
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                • <strong>Baseline-scenario:</strong> Ditt nuvarande läge utan
                bostadsköp
              </p>
              <p>
                • <strong>Bostadsscenarior:</strong> Olika alternativ för
                bostadsköp med specifika villkor
              </p>
              <p>
                • <strong>Amorteringskrav:</strong> Beräknas automatiskt enligt
                svenska regler
              </p>
              <p>
                • <strong>Skatteeffekter:</strong> ISK/KF använder
                schablonintäkt, Depå kapitalvinstskatt
              </p>
              <p>
                • <strong>Delning:</strong> Skapa länk för att dela dina
                scenarior med andra
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthSection>
  );
}
