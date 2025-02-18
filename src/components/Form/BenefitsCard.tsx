import { EMPLOYER_TAX } from "@/lib/constants";
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
            step={1000}
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
      <Data
        className="text-muted-foreground mt-1 ml-1"
        label="Arbetsgivaragift (31.42%)"
        value={`${addThousandSeparator(benefits.salary * EMPLOYER_TAX)} kr`}
      />
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
        {benefits.salary > 0 && (
          <Data
            className="text-muted-foreground mt-1 ml-1 mb-1"
            label="Pensionskostnad"
            value={`${addThousandSeparator(
              (benefits.salary * benefits.pension) / 100
            )} kr`}
          />
        )}
      </div>
    </CardContent>
  </Card>
);

export default BenefitsCard;
