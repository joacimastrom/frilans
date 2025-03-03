import { getTitleByPeriod } from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { Calculator } from "lucide-react";
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
    <CardHeader className="border-b px-6 py-4">
      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h2>Kostnader</h2>
        <div className="ml-auto">{getTitleByPeriod(totalCosts)}</div>
        <InfoPopover />
      </CardTitle>
      <CardDescription>
        Ange samtliga kostnader för din verksamhet.
      </CardDescription>
    </CardHeader>
    <CardContent className="mt-2">
      <InputGroup inputs={costs} setInputs={(costs) => setCosts(costs)} />
    </CardContent>
  </Card>
);

export default AdditionalCosts;
