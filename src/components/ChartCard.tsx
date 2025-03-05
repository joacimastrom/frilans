import { cn } from "@/lib/utils";
import { BarChart2 } from "lucide-react";
import { useState } from "react";
import { CombinedChart, CombinedChartData } from "./Form/charts/CombinedChart";
import { IncomeChart, IncomeChartData } from "./Form/charts/IncomeChart";
import { TaxChart, TaxChartData } from "./Form/charts/TaxChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  incomeChartData: IncomeChartData[];
  salary: number;
  setSalary: (salary: number) => void;
  maxIncomeObject: IncomeChartData;
  taxChartData: TaxChartData[];
  minTaxObject: TaxChartData;
  combinedChartData: CombinedChartData[];
};

enum Chart {
  TAX = "TAX",
  SALARY = "SALARY",
  COMBINED = "COMBINED",
}

const ChartCard = ({
  incomeChartData,
  salary,
  setSalary,
  maxIncomeObject,
  taxChartData,
  minTaxObject,
  combinedChartData,
}: Props) => {
  const [selectedChart, setSelectedChart] = useState<Chart>(Chart.SALARY);

  return (
    <Card className="mt-2">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <BarChart2 className="h-5 w-5 text-blue-600" />
          Visualisering
          <div className="inline-flex bg-gray-100 rounded-md ml-auto p-1">
            <button
              className={cn(
                "px-4 py-2 text-sm rounded-md flex items-center gap-2",
                selectedChart === Chart.SALARY
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600"
              )}
              onClick={() => setSelectedChart(Chart.SALARY)}
            >
              Inkomst
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm rounded-md flex items-center gap-2",
                selectedChart === Chart.TAX
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600"
              )}
              onClick={() => setSelectedChart(Chart.TAX)}
            >
              Skatt (SEK)
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm rounded-md flex items-center gap-2",
                selectedChart === Chart.COMBINED
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600"
              )}
              onClick={() => setSelectedChart(Chart.COMBINED)}
            >
              Skatt (%)
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedChart === Chart.SALARY && (
          <IncomeChart
            incomeChartData={incomeChartData}
            salary={salary}
            onChartClick={setSalary}
            maxIncomeSalary={maxIncomeObject.salary}
          />
        )}
        {selectedChart === Chart.TAX && (
          <TaxChart
            taxChartData={taxChartData}
            salary={salary}
            minTaxSalary={minTaxObject.salary}
            onChartClick={setSalary}
          />
        )}
        {selectedChart === Chart.COMBINED && (
          <CombinedChart
            combinedChartData={combinedChartData}
            salary={salary}
            onChartClick={setSalary}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
