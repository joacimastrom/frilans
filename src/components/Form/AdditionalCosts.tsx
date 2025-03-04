import { getTitleByPeriod } from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { Calculator } from "lucide-react";
import { CollapsibleCard } from "../CollapsibleCard";
import InfoPopover from "../InfoPopover";
import InputGroup from "./InputGroup";

type Props = {
  costs: FinancialPost[];
  setCosts: (costs: FinancialPost[]) => void;
  totalCosts: number;
};

const AdditionalCosts = ({ costs, setCosts, totalCosts }: Props) => (
  <CollapsibleCard
    title={
      <>
        <Calculator className="h-5 w-5 text-blue-600" />
        <h2>Kostnader</h2>
        <div className="ml-auto">{getTitleByPeriod(totalCosts)}</div>
        <InfoPopover />
      </>
    }
    description="Ange samtliga kostnader för din verksamhet."
  >
    <InputGroup inputs={costs} setInputs={(costs) => setCosts(costs)} />
  </CollapsibleCard>
);

export default AdditionalCosts;
