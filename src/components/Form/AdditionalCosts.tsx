import { addThousandSeparator, getTitleByPeriod } from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { Data } from "../Data";
import InfoPopover from "../InfoPopover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import InputGroup from "./InputGroup";

type Props = {
  costs: FinancialPost[];
  setCosts: (costs: FinancialPost[]) => void;
  totalCosts: number;
  employerFee: number;
  pensionCost: number;
  showMonthly: boolean;
  vacationCost: number;
};

const AdditionalCosts = ({
  costs,
  setCosts,
  totalCosts,
  employerFee,
  pensionCost,
  showMonthly,
  vacationCost,
}: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        Kostnader
        <CardDescription className="ml-auto flex items-center">
          {getTitleByPeriod(totalCosts, showMonthly)}
          <InfoPopover />
        </CardDescription>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {employerFee > 0 && (
        <Data
          className="text-muted-foreground mt-1 ml-1"
          label="Arbetsgivaragift (31.42%)"
          value={`${addThousandSeparator(employerFee)} kr`}
        />
      )}
      {vacationCost > 0 && (
        <Data
          className="text-muted-foreground mt-1 ml-1"
          label="Indirekt kostnad"
          value={`${addThousandSeparator(vacationCost)} kr`}
        />
      )}
      {pensionCost > 0 && (
        <Data
          className="text-muted-foreground mt-1 ml-1 mb-1"
          label="Pensionskostnad"
          value={`${addThousandSeparator(pensionCost)} kr`}
        />
      )}
      <InputGroup inputs={costs} setInputs={(costs) => setCosts(costs)} />
    </CardContent>
  </Card>
);

export default AdditionalCosts;
