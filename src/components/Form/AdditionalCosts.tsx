import { getTitleByPeriod } from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
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
};

const AdditionalCosts = ({ costs, setCosts, totalCosts }: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        Kostnader
        <CardDescription className="ml-auto flex items-center">
          {getTitleByPeriod(totalCosts)}
          <InfoPopover />
        </CardDescription>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <InputGroup inputs={costs} setInputs={(costs) => setCosts(costs)} />
    </CardContent>
  </Card>
);

export default AdditionalCosts;
