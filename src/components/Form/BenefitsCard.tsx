import { addThousandSeparator } from "@/lib/helpers";
import { Slider } from "@radix-ui/react-slider";
import { Data } from "../Data";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  benefits: {
    salary: number;
    vacation: number;
    pension: number;
  };
  setBenefits: ({
    vacation,
    pension,
    salary,
  }: {
    vacation: number;
    pension: number;
    salary: number;
  }) => void;
  lostRevenue: number;
  pensionCost: number;
};

const BenefitsCard = ({ benefits, setBenefits, lostRevenue }: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">Förmåner</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div>
        <Label htmlFor="salary">Månadslön</Label>
        <div className="flex">
          <Input
            id="salary"
            type="number"
            min={0}
            value={benefits.salary.toString()}
            onChange={(e) =>
              setBenefits({
                ...benefits,
                salary: Number(e.target.value),
              })
            }
          />
          <Slider></Slider>
        </div>
      </div>
      <div>
        <Label htmlFor="vacation">Semesterdagar</Label>
        <Input
          id="vacation"
          type="number"
          min={0}
          value={benefits.vacation.toString()}
          onChange={(e) =>
            setBenefits({
              ...benefits,
              vacation: Number(e.target.value),
            })
          }
        />
        {lostRevenue > 0 && (
          <Data
            className="text-muted-foreground mt-1 ml-1"
            label="Indirekt kostnad"
            value={`${addThousandSeparator(lostRevenue)} kr`}
          />
        )}
      </div>
      <div>
        <Label htmlFor="pension">Pension (% av lön)</Label>
        <Input
          id="pension"
          type="number"
          min={0}
          max={100}
          value={benefits.pension.toString()}
          onChange={(e) =>
            setBenefits({
              ...benefits,
              pension: Number(e.target.value),
            })
          }
        />
      </div>
    </CardContent>
  </Card>
);

export default BenefitsCard;
