import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScenarioCalculationResult } from "@/models/home-comparison";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonChartProps {
  results: ScenarioCalculationResult[];
  scenarios: { id: string; name: string; color: string; isBaseline: boolean }[];
  visibleScenarios: Set<string>;
}

interface ChartDataPoint {
  year: number;
  [key: string]: number; // Dynamic keys for each scenario
}

export default function ComparisonChart({
  results,
  scenarios,
  visibleScenarios,
}: ComparisonChartProps) {
  const [showInvestmentValue, setShowInvestmentValue] = useState(true);
  const [showHomeEquity, setShowHomeEquity] = useState(true);
  const [showNetWorth, setShowNetWorth] = useState(true);
  const [yearHorizon, setYearHorizon] = useState(10);

  // Prepare chart data
  const chartData: ChartDataPoint[] = [];

  if (results.length > 0) {
    const maxYears = Math.min(
      yearHorizon,
      Math.max(...results.map((r) => r.yearlyData.length))
    );

    for (let yearIndex = 0; yearIndex < maxYears; yearIndex++) {
      const dataPoint: ChartDataPoint = { year: yearIndex };

      results.forEach((result) => {
        if (yearIndex < result.yearlyData.length) {
          const yearData = result.yearlyData[yearIndex];
          const scenario = scenarios.find((s) => s.id === result.scenarioId);

          if (scenario && visibleScenarios.has(scenario.id)) {
            if (showNetWorth) {
              dataPoint[`${scenario.name}_netWorth`] = yearData.netWorth;
            }
            if (showInvestmentValue) {
              dataPoint[`${scenario.name}_investment`] =
                yearData.investmentValue;
            }
            if (showHomeEquity && yearData.homeEquity > 0) {
              dataPoint[`${scenario.name}_homeEquity`] = yearData.homeEquity;
            }
          }
        }
      });

      chartData.push(dataPoint);
    }
  }

  const formatCurrency = (value: number): string => {
    return (value / 1000000).toFixed(2);
  };

  const formatTooltipLabel = (dataKey: string): string => {
    const parts = dataKey.split("_");
    const scenarioName = parts[0];
    const metric = parts[1];

    let metricLabel = "";
    switch (metric) {
      case "netWorth":
        metricLabel = "Nettoförmögenhet";
        break;
      case "investment":
        metricLabel = "Investeringsvärde";
        break;
      case "homeEquity":
        metricLabel = "Bostadskapital";
        break;
      default:
        metricLabel = metric;
    }

    return `${scenarioName} - ${metricLabel}`;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`År ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${formatTooltipLabel(
                entry.dataKey as string
              )}: ${formatCurrency(entry.value || 0)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getLineOpacity = (dataKey: string): number => {
    if (dataKey.endsWith("_netWorth")) return 1.0;
    if (dataKey.endsWith("_investment")) return 0.7;
    if (dataKey.endsWith("_homeEquity")) return 0.5;
    return 0.8;
  };

  const getStrokeDashArray = (dataKey: string): string => {
    if (dataKey.endsWith("_netWorth")) return "0";
    if (dataKey.endsWith("_investment")) return "5 5";
    if (dataKey.endsWith("_homeEquity")) return "10 5";
    return "0";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Jämförelsediagram</span>
          <div className="flex space-x-4 items-center">
            <div className="flex items-center space-x-2">
              <Label htmlFor="year-horizon" className="text-sm">
                År:
              </Label>
              <Input
                id="year-horizon"
                type="number"
                min="1"
                max="50"
                value={yearHorizon}
                onChange={(e) => setYearHorizon(parseInt(e.target.value) || 10)}
                className="w-16 text-center"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-net-worth"
                checked={showNetWorth}
                onCheckedChange={setShowNetWorth}
              />
              <Label htmlFor="show-net-worth" className="text-sm">
                Nettoförmögenhet
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-investment"
                checked={showInvestmentValue}
                onCheckedChange={setShowInvestmentValue}
              />
              <Label htmlFor="show-investment" className="text-sm">
                Investeringar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-home-equity"
                checked={showHomeEquity}
                onCheckedChange={setShowHomeEquity}
              />
              <Label htmlFor="show-home-equity" className="text-sm">
                Bostadskapital
              </Label>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>
              Ingen data att visa. Skapa några scenarior för att se jämförelsen.
            </p>
          </div>
        ) : (
          <div style={{ width: "100%", height: "500px" }}>
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="year"
                  label={{ value: "År", position: "insideBottom", offset: -10 }}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  label={{
                    value: "Belopp (SEK)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => {
                    if (value.endsWith("_netWorth"))
                      return value.replace("_netWorth", " (Netto)");
                    if (value.endsWith("_investment"))
                      return value.replace("_investment", " (Investering)");
                    if (value.endsWith("_homeEquity"))
                      return value.replace("_homeEquity", " (Bostad)");
                    return value;
                  }}
                />

                {/* Render lines for each scenario and metric */}
                {Object.keys(chartData[0] || {})
                  .filter((key) => key !== "year")
                  .map((dataKey) => {
                    const scenarioName = dataKey.split("_")[0];
                    const scenario = scenarios.find(
                      (s) => s.name === scenarioName
                    );
                    const color = scenario?.color || "#666";

                    return (
                      <Line
                        key={dataKey}
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2}
                        strokeOpacity={getLineOpacity(dataKey)}
                        strokeDasharray={getStrokeDashArray(dataKey)}
                        dot={false}
                        activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
                      />
                    );
                  })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend explanation */}
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>
            <strong>Linjestiler:</strong>
          </p>
          <p>— Heldragna linjer: Nettoförmögenhet</p>
          <p>- - Streckade linjer: Investeringsvärde</p>
          <p>· · · Prickade linjer: Bostadskapital</p>
        </div>
      </CardContent>
    </Card>
  );
}
