import { CircleDollarSign } from "lucide-react";
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
  <>
    {/*  <CollapsibleCard
      title="Intäkter"
      description="Ange ditt arvode och din omfattning för att beräkna dina intäkter."
    >
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
    </CollapsibleCard> */}
    <Card>
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <CircleDollarSign className="h-5 w-5 text-blue-600" />
          <h2>Intäkter</h2>
          <div className="ml-auto">{totalRevenue}</div>
          <InfoPopover>
            Totala intäkter är beräknade på timpris och omfattning över 249
            arbetsdagar för 2025.
          </InfoPopover>
        </CardTitle>
        <CardDescription className="ml-auto flex items-center">
          Ange ditt arvode och din omfattning för att beräkna dina intäkter.
        </CardDescription>
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
  </>
);

export default RevenueCard;
