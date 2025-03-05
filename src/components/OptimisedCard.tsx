import { DIVIDEND_TAX } from "@/lib/constants";
import {
  addThousandSeparator,
  getIncomeTax,
  getTaxBracket,
} from "@/lib/helpers";
import { TrendingUp } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";

type Props = {
  monthlySalary: number;
  dividend: number;
  totalIncome: number;
};

const OptimisedCard = ({ monthlySalary, dividend, totalIncome }: Props) => {
  const { monthlyIncomeTax } = getIncomeTax(monthlySalary);

  const dividendTax = dividend * DIVIDEND_TAX;
  const salaryAfterTaxes = monthlySalary - monthlyIncomeTax;
  const dividendAfterTaxes = dividend - dividendTax;

  const dividendAfterTaxesMonthly = dividendAfterTaxes / 12;

  const { referenceSalary } = getTaxBracket(
    salaryAfterTaxes + dividendAfterTaxesMonthly
  );

  return (
    <CollapsibleCard
      defaultOpen
      title={
        <>
          <TrendingUp className="h-5 w-5 " />
          <h2 className="mr-auto">Optimerad Sammanställning</h2>
        </>
      }
      className="bg-gradient-to-br from-indigo-400 to-blue-700 text-white rounded-lg shadow-md overflow-hidden"
      description={
        <span className="text-white">Din optimala lön och utdelning</span>
      }
    >
      <div className="pt-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 p-2 rounded-lg">
            <p className="text-sm text-blue-100">Månadslön</p>
            <p className="text-2xl font-bold">
              {addThousandSeparator(monthlySalary)} kr
            </p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg text-right">
            <p className="text-sm text-blue-100">Utdelning</p>
            <p className="text-2xl font-bold">
              {addThousandSeparator(dividend)} kr
            </p>
          </div>
        </div>
        <div className="bg-white/10 p-2 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-blue-100">Total personlig inkomst</p>
            <p className="text-xl font-bold">
              {addThousandSeparator(totalIncome)} kr
            </p>
          </div>
          {/*   <div className="flex justify-between">
            <p className="text-sm text-blue-100">Månatlig jämförelselön</p>
            <p className="text-lg font-medium">
              {addThousandSeparator(referenceSalary)} kr
            </p>
          </div> */}
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default OptimisedCard;
