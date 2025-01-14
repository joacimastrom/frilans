import {
  BASE_DIVIDEND,
  RESULT_TAX,
  WORKING_DAYS_SWEDEN,
} from "@/lib/constants";
import {
  addThousandSeparator,
  calculateDaysOfLostRevenue,
  calculateYearlyInput,
  getTitleByPeriod,
} from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { useEffect, useState } from "react";
import { Data } from "../Data";
import { IncomeTable } from "../IncomeTable";
import InfoPopover from "../InfoPopover";
import { ResultTable } from "../ResultTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import InputGroup from "./InputGroup";

type FormData = {
  revenue: FinancialPost[];
  lostRevenue: FinancialPost[];
  salaries: FinancialPost[];
  costs: FinancialPost[];
};

const Form = () => {
  const savedData = localStorage.getItem("formData");
  const jsonData = savedData && JSON.parse(savedData);
  const [formData, setFormData] = useState<FormData>(
    jsonData || {
      revenue: [
        {
          id: 1,
          description: "Fakturering",
          amount: 850,
          period: "hourly",
        },
      ],
      lostRevenue: [
        {
          id: 1,
          description: "Semester",
          amount: 6,
          period: "weekly",
        },
      ],
      salaries: [
        {
          id: 1,
          description: "Lön",
          amount: 45000,
          period: "monthly",
        },
      ],
      costs: [],
    }
  );

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const [showMonthly, setShowMonthly] = useState(false);

  const { revenue, salaries, costs, lostRevenue } = formData;

  const totalRevenue = calculateYearlyInput(revenue);
  const dailyRevenue = totalRevenue / WORKING_DAYS_SWEDEN;

  const daysOfLostRevenue = calculateDaysOfLostRevenue(formData.lostRevenue);
  const totalLostRevenue = Math.floor(daysOfLostRevenue * dailyRevenue);
  const adjustedRevenue = totalRevenue - totalLostRevenue;

  const totalSalaries = calculateYearlyInput(salaries);
  const totalSalaryCosts = totalSalaries * 1.3142;
  const totalCosts = calculateYearlyInput(costs);

  const resultBeforeTax = adjustedRevenue - totalCosts - totalSalaryCosts;
  const resultAfterTax = resultBeforeTax * (1 - RESULT_TAX);

  // Schablon > Utdelning > Resultat efter skatt

  const maxDividend = Math.min(
    Math.max(totalSalaries / 2, BASE_DIVIDEND),
    resultAfterTax
  );
  const balancedProfit = resultAfterTax - maxDividend;

  return (
    <div className="flex gap-8">
      <div className="mt-2 flex flex-col shrink-0 basis-3/5">
        <div className="flex items-center space-x-2">
          <div className="ml-auto flex items-center space-x-2">
            <Label htmlFor="monthly-mode">Årsvis</Label>
            <Switch
              id="monthly-mode"
              checked={showMonthly}
              onCheckedChange={() => setShowMonthly(!showMonthly)}
            />
            <Label htmlFor="monthly-mode">Månadsvis</Label>
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                Intäkter
                <CardDescription className="ml-auto flex items-center">
                  {getTitleByPeriod(totalRevenue, showMonthly)}
                  <InfoPopover />
                </CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InputGroup
                inputs={revenue}
                setInputs={(revenue) => setFormData({ ...formData, revenue })}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                Uteblivna intäkter
                <CardDescription className="ml-auto flex items-center">
                  {getTitleByPeriod(totalLostRevenue, showMonthly)}
                  <InfoPopover />
                </CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InputGroup
                inputs={lostRevenue || []}
                setInputs={(lostRevenue) =>
                  setFormData({ ...formData, lostRevenue })
                }
                alternateLabel
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                Lön
                <CardDescription className="ml-auto flex items-center">
                  {getTitleByPeriod(totalSalaryCosts, showMonthly)}
                  <InfoPopover />
                </CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InputGroup
                inputs={salaries}
                isArray={false}
                setInputs={(salaries) => setFormData({ ...formData, salaries })}
                additionalRowData={(input) =>
                  !!input.amount && (
                    <Data
                      className="text-muted-foreground mt-1 ml-1"
                      label="+ Arbetsgivaragift (31.42%)"
                      value={`${addThousandSeparator(
                        input.amount * 0.3142
                      )} kr`}
                    />
                  )
                }
              />
            </CardContent>
          </Card>
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
              <InputGroup
                inputs={costs}
                setInputs={(costs) => setFormData({ ...formData, costs })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="shrink-0 basis-2/5 sticky h-fit top-[72px] flex flex-col gap-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              Resultatsräkning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResultTable
              resultBeforeTax={resultBeforeTax}
              resultAfterTax={resultAfterTax}
              maxDividend={maxDividend}
              balancedProfit={balancedProfit}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              Personliga intäkter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeTable salary={totalSalaries} dividend={maxDividend} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Form;
