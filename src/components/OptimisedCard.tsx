import { DIVIDEND_TAX } from "@/lib/constants";
import {
  addThousandSeparator,
  getIncomeTax,
  getTaxBracket,
} from "@/lib/helpers";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
    <Card className="bg-gradient-to-br from-indigo-400 to-blue-700 text-white rounded-lg shadow-md overflow-hidden">
      <CardHeader className="text-white border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 " />
          Optimerad Sammanställning
        </CardTitle>
        <CardDescription className="text-white">
          Din optimala lön och utdelning
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
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
            <div className="flex justify-between mb-1">
              <p className="text-sm text-blue-100">Total personlig inkomst</p>
              <p className="text-xl font-bold">
                {addThousandSeparator(totalIncome)} kr
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-blue-100">Månatlig jämförelselön</p>
              <p className="text-lg font-medium">
                {addThousandSeparator(referenceSalary)} kr
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimisedCard;
