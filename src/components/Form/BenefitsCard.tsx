import { EMPLOYER_TAX } from "@/lib/constants";
import { addThousandSeparator } from "@/lib/helpers";
import { HeartHandshake } from "lucide-react";
import { CollapsibleCard } from "../CollapsibleCard";
import { Data } from "../Data";
import InfoPopover from "../InfoPopover";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

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
  maxSalary: number;
};

const BenefitsCard = ({
  benefits,
  setBenefits,
  lostRevenue,
  maxSalary,
}: Props) => (
  <CollapsibleCard
    title={
      <>
        <HeartHandshake className="h-5 w-5 text-blue-600" />
        <h2 className="mr-auto">Lön & Semester</h2>
      </>
    }
  >
    <div className="flex flex-col gap-2">
      <div>
        <Label htmlFor="salary">Månadslön</Label>
        <div className="flex">
          <Input
            id="salary"
            type="number"
            step={1}
            min={0}
            max={maxSalary}
            value={benefits.salary.toString()}
            onChange={(e) =>
              setBenefits({
                ...benefits,
                salary: Number(e.target.value),
              })
            }
          />
        </div>
        <Slider
          min={0}
          max={maxSalary}
          step={1}
          onValueChange={(value) =>
            setBenefits({
              ...benefits,
              salary: Number(value),
            })
          }
          value={[benefits.salary]}
          className="w-full mt-4"
        />
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

        <div className="flex width-full items-center mt-1 ">
          <Data
            className="text-muted-foreground ml-1"
            label="Indirekt kostnad"
            value={`${addThousandSeparator(lostRevenue)} kr`}
          />
          <InfoPopover className="ml-2">
            Semesterdagar är dagar som ej faktureras, detta räknas bort från
            totala omsättningen.
          </InfoPopover>
        </div>
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
              pension: Math.min(100, Number(e.target.value)),
            })
          }
        />
        <Data
          className="text-muted-foreground mt-1 ml-1 mb-1"
          label="Pensionskostnad"
          value={`${addThousandSeparator(
            (benefits.salary * benefits.pension) / 100
          )} kr`}
        />
      </div>
    </div>
  </CollapsibleCard>
);

export default BenefitsCard;
