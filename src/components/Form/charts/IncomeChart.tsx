import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  salary: {
    label: "Lön",
  },
  maxDividend: {
    label: "Utdelning",
    color: "hsl(var(--chart-1))",
  },
  totalIncome: {
    label: "Total inkomst",
    color: "hsl(var(--chart-2))",
  },
  balancedResult: {
    label: "Resultat",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export type IncomeChartData = {
  salary: number;
  maxDividend: number;
  totalIncome: number;
  balancedResult: number;
};

type Props = {
  incomeChartData: IncomeChartData[];
  onChartClick: (salary: number) => void;
  salary: number;
  maxIncomeSalary: number;
};

export const IncomeChart = ({
  incomeChartData,
  onChartClick,
  salary,
  maxIncomeSalary,
}: Props) => {
  return (
    <ChartContainer config={chartConfig} className="-ml-4">
      <LineChart
        onClick={({ activeLabel }) => onChartClick(Number(activeLabel))}
        accessibilityLayer
        data={incomeChartData}
        margin={{
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="salary" tickFormatter={(value) => String(value / 1000)}>
          <Label value="Lön (TKR)" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis tickFormatter={(value) => String(value / 1000)}>
          <Label value="TKR" offset={0} position="insideLeft" />
        </YAxis>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Legend />

        {maxIncomeSalary && (
          <ReferenceLine
            x={maxIncomeSalary}
            label="Max"
            stroke="green"
            strokeDasharray="3 3"
          />
        )}
        <ReferenceLine x={salary} stroke="green" />
        <Line
          name="Total inkomst"
          dataKey="totalIncome"
          type="monotone"
          stroke="var(--color-totalIncome)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          name="Utdelning"
          dataKey="maxDividend"
          type="monotone"
          stroke="var(--color-maxDividend)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          name="Resultat"
          dataKey="balancedResult"
          type="monotone"
          stroke="var(--color-balancedResult)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};
