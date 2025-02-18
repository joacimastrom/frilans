import {
  DIVIDEND_TAX,
  EMPLOYER_TAX,
  RESULT_TAX,
  WORKING_DAYS_SWEDEN,
} from "@/lib/constants";
import {
  calculateYearlyInput,
  getIncomeTax,
  getSalaryData,
  getTitleByPeriod,
} from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { useEffect, useState } from "react";
import { IncomeTable } from "../IncomeTable";
import { ResultTable } from "../ResultTable";
import TaxTable from "../TaxTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AdditionalCosts from "./AdditionalCosts";
import BenefitsCard from "./BenefitsCard";
import PeriodToggle from "./PeriodToggle";
import RevenueCard from "./RevenueCard";

type FormData = {
  revenue: {
    hourlyRate: number;
    scope: number;
  };
  benefits: {
    salary: number;
    vacation: number;
    pension: number;
  };
  lostRevenue: FinancialPost[];
  salaries: FinancialPost[];
  costs: FinancialPost[];
};

/* 
  Calculate values for salary +/- 10k and make graphs for the different values
*/

const Form = () => {
  const savedData = localStorage.getItem("formData");
  const jsonData = savedData && JSON.parse(savedData);
  const [formData, setFormData] = useState<FormData>({
    revenue: {
      hourlyRate: 900,
      scope: 100,
    },
    benefits: {
      salary: 45000,
      vacation: 25,
      pension: 4.5,
    },
    costs: [
      {
        id: 1738783675953,
        description: "Telefon",
        amount: "450",
        period: "monthly",
      },
      {
        id: 1738783727097,
        description: "Bil",
        amount: "2500",
        period: "monthly",
      },
      {
        id: 1738783731573,
        description: "Försäkring",
        amount: "5000",
        period: "monthly",
      },
    ],
    ...jsonData,
  });

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const [showMonthly, setShowMonthly] = useState(false);

  const { revenue, benefits, costs } = formData;

  // Revenue calculations
  const dailyRevenue = revenue.hourlyRate * (revenue.scope / 100) * 8;
  const totalLostRevenue = Math.floor(benefits.vacation * dailyRevenue);
  const totalRevenue = dailyRevenue * WORKING_DAYS_SWEDEN;
  const adjustedRevenue = totalRevenue - totalLostRevenue;

  const totalAdditionalCosts = calculateYearlyInput(costs);
  const resultBeforeSalary = adjustedRevenue - totalAdditionalCosts;

  // const salaryMax = getSalaryMax(resultBeforeSalary, benefits.pension);
  const { maxDividend, balancedResult } = getSalaryData(
    resultBeforeSalary,
    benefits.salary,
    benefits.pension
  );

  // Tax calculations
  const totalSalary = benefits.salary * 12;
  const totalSalaryCost =
    totalSalary * (1 + EMPLOYER_TAX + benefits.pension / 100);

  const resultBeforeTax = resultBeforeSalary - totalSalaryCost;
  const resultTax = resultBeforeTax * RESULT_TAX;
  const resultAfterTax = resultBeforeTax - resultTax;

  // Dividend calculations
  const dividendTax = maxDividend * DIVIDEND_TAX;

  // Income calculations
  const incomeTaxPercentage = getIncomeTax(totalSalary);

  const incomeTax = totalSalary * (incomeTaxPercentage / 100);
  const salaryAfterTaxes = totalSalary - incomeTax;
  const dividendAfterTaxes = maxDividend - dividendTax;

  const referenceTaxPercentage = incomeTaxPercentage + 2; // Add 2% to the tax percentage to account for
  const referenceSalary =
    (salaryAfterTaxes + dividendAfterTaxes) /
    (1 - referenceTaxPercentage / 100) /
    12;

  return (
    <div className="flex gap-8">
      <div className="mt-2 flex flex-col shrink-0 basis-1/2">
        <PeriodToggle
          showMonthly={showMonthly}
          setShowMonthly={setShowMonthly}
        />
        <div className="mt-2 space-y-2">
          <RevenueCard
            revenue={revenue}
            setRevenue={(revenue) => setFormData({ ...formData, revenue })}
            totalRevenue={getTitleByPeriod(totalRevenue, showMonthly)}
          />
          <BenefitsCard
            benefits={benefits}
            setBenefits={(benefits) => setFormData({ ...formData, benefits })}
            lostRevenue={totalLostRevenue}
          />
          <AdditionalCosts
            costs={costs}
            setCosts={(costs) => setFormData({ ...formData, costs })}
            totalCosts={totalAdditionalCosts}
            showMonthly={showMonthly}
          />
        </div>
      </div>
      <div className="shrink-0 basis-1/2 sticky h-fit top-[72px] flex flex-col gap-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              Resultatsräkning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResultTable
              resultAfterTax={resultAfterTax}
              maxDividend={maxDividend}
              balancedResult={balancedResult}
            />
          </CardContent>
        </Card>
        <TaxTable
          incomeTax={incomeTax}
          incomeTaxPercentage={incomeTaxPercentage}
          profitTax={resultTax}
          dividendTax={dividendTax}
        />
        <IncomeTable
          salary={totalSalary}
          dividend={maxDividend}
          referenceSalary={referenceSalary}
        />
      </div>
    </div>
  );
};

export default Form;
