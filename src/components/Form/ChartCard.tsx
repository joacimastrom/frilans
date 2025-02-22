import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const chartConfig = {
  salary: {
    label: "Lön",
  },
  maxDividend: {
    label: "Utdelning",
    color: "#2563eb",
  },
  totalIncome: {
    label: "Total inkomst",
    color: "#14b8a6",
  },
  balancedResult: {
    label: "Resultat",
    color: "#f97316",
  },
} satisfies ChartConfig;

type Props = {
  chartData: {
    salary: number;
    maxDividend: number;
    totalIncome: number;
    balancedResult: number;
  }[];
  onChartClick: (salary: number) => void;
  salary: number;
};

export const ChartCard = ({ chartData, onChartClick, salary }: Props) => {
  const maxIncomeObject = chartData.reduce((acc, curr) => {
    if (curr.totalIncome > acc.totalIncome) {
      return curr;
    }
    return acc;
  }, chartData[0]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          Visualisering av lön (TKR)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ChartContainer config={chartConfig}>
          <LineChart
            onClick={({ activeLabel }) => onChartClick(Number(activeLabel))}
            accessibilityLayer
            data={chartData}
            margin={{
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="salary"
              tickFormatter={(value) => String(value / 1000)}
            />
            <YAxis tickFormatter={(value) => String(value / 1000)} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-56" />}
            />
            {maxIncomeObject && (
              <ReferenceLine
                x={maxIncomeObject.salary}
                label="Max"
                stroke="red"
                strokeDasharray="3 3"
              />
            )}
            <ReferenceLine x={salary} stroke="green" />
            <Line
              dataKey="salary"
              type="monotone"
              stroke="var(--color-salary)"
              strokeWidth={0}
              dot={false}
            />
            <Line
              dataKey="maxDividend"
              type="monotone"
              stroke="var(--color-maxDividend)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="totalIncome"
              type="monotone"
              stroke="var(--color-totalIncome)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="balancedResult"
              type="monotone"
              stroke="var(--color-balancedResult)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
