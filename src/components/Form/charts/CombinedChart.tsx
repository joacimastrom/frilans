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
  totalTaxPercent: {
    label: "Total procentuell skatt",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export type CombinedChartData = {
  salary: number;
  totalTaxPercent: number;
};

type Props = {
  combinedChartData: CombinedChartData[];
  salary: number;
  onChartClick: (salary: number) => void;
};

export const CombinedChart = ({
  combinedChartData,
  salary,
  onChartClick,
}: Props) => (
  <ChartContainer config={chartConfig} className="-ml-4">
    <LineChart
      onClick={({ activeLabel }) => onChartClick(Number(activeLabel))}
      accessibilityLayer
      data={combinedChartData}
      margin={{
        right: 12,
      }}
    >
      <CartesianGrid vertical={false} />
      <XAxis dataKey="salary" tickFormatter={(value) => String(value / 1000)}>
        <Label value="Lön (TKR)" offset={0} position="insideBottom" />
      </XAxis>
      <YAxis>
        <Label value="Skatt %" offset={30} position="insideLeft" angle={90} />
      </YAxis>
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <ReferenceLine x={salary} stroke="green" />
      <Legend />
      <Line
        name="Skatt per utbetald krona"
        dataKey="totalTaxPercent"
        type="monotone"
        stroke="var(--color-totalTaxPercent)"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ChartContainer>
);
