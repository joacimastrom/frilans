import { CircleDollarSign } from "lucide-react";
import { CollapsibleCard } from "../CollapsibleCard";
import InfoPopover from "../InfoPopover";
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
  <CollapsibleCard
    defaultOpen
    title={
      <>
        <CircleDollarSign className="h-5 w-5 text-blue-600" />
        <h2>Intäkter</h2>
        <div className="ml-auto">{totalRevenue}</div>
        <InfoPopover>
          Totala intäkter är beräknade på timpris och omfattning över 249
          arbetsdagar för 2025.
        </InfoPopover>
      </>
    }
    description="Ange ditt arvode och din omfattning för att beräkna dina intäkter."
  >
    <div className="flex gap-4">
      <div className="basis-1/2">
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
      <div className="basis-1/2">
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
    </div>
  </CollapsibleCard>
);

export default RevenueCard;
