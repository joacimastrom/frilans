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
  totalTax: {
    label: "Total skatt",
    color: "hsl(var(--chart-1))",
  },
  resultTax: {
    label: "Bolagsskatt",
    color: "hsl(var(--chart-4))",
  },
  dividendTax: {
    label: "Utdelningskatt",
    color: "hsl(var(--chart-5))",
  },
  yearlyIncomeTax: {
    label: "Löneskatt",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export type TaxChartData = {
  salary: number;
  yearlyIncomeTax: number;
  resultTax: number;
  dividendTax: number;
  totalTax: number;
};

type Props = {
  taxChartData: TaxChartData[];
  salary: number;
  onChartClick: (salary: number) => void;
  minTaxSalary: number;
};

export const TaxChart = ({
  taxChartData,
  salary,
  minTaxSalary,
  onChartClick,
}: Props) => (
  <ChartContainer config={chartConfig} className="-ml-4">
    <LineChart
      onClick={({ activeLabel }) => onChartClick(Number(activeLabel))}
      accessibilityLayer
      data={taxChartData}
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

      <ReferenceLine x={salary} stroke="green" />
      {minTaxSalary && (
        <ReferenceLine
          x={minTaxSalary}
          label="Min"
          stroke="green"
          strokeDasharray="3 3"
        />
      )}
      <Legend />
      <Line
        name="Total skatt"
        dataKey="totalTax"
        type="monotone"
        stroke="var(--color-totalTax)"
        strokeWidth={2}
        dot={false}
      />
      <Line
        name="Bolagsskatt"
        dataKey="resultTax"
        type="monotone"
        stroke="var(--color-resultTax)"
        strokeWidth={2}
        dot={false}
      />
      <Line
        name="Löneskatt"
        dataKey="yearlyIncomeTax"
        type="monotone"
        stroke="var(--color-yearlyIncomeTax)"
        strokeWidth={2}
        dot={false}
      />
      <Line
        name="Utdelningskatt"
        dataKey="dividendTax"
        type="monotone"
        stroke="var(--color-dividendTax)"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ChartContainer>
);
