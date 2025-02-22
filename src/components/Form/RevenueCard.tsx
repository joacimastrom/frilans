import InfoPopover from "../InfoPopover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  revenue: {
    hourlyRate: number;
    scope: number;
  };
  setRevenue: ({
    hourlyRate,
    scope,
  }: {
    hourlyRate: number;
    scope: number;
  }) => void;
  totalRevenue: string;
};

const RevenueCard = ({ revenue, setRevenue, totalRevenue }: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        Intäkter
        <CardDescription className="ml-auto flex items-center">
          {totalRevenue}
          <InfoPopover />
        </CardDescription>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex gap-4">
      <div>
        <Label htmlFor="hourly-rate">Timpris</Label>
        <Input
          id="hourly-rate"
          type="number"
          value={String(revenue.hourlyRate)}
          onChange={(e) =>
            setRevenue({
              ...revenue,
              hourlyRate: Number(e.target.value),
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="scope">Omfattning (%)</Label>
        <Input
          id="scope"
          type="number"
          min={0}
          max={100}
          value={revenue.scope.toString()}
          onChange={(e) => {
            const numberValue = Number(e.target.value) || 100;
            const clampedValue = Math.min(Math.max(numberValue, 1), 100);

            setRevenue({
              ...revenue,
              scope: Number(clampedValue),
            });
          }}
        />
      </div>
    </CardContent>
  </Card>
);

export default RevenueCard;
