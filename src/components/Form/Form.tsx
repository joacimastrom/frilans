import {
  BASE_DIVIDEND,
  DIVIDEND_TAX,
  RESULT_TAX,
  SALARY_TAX,
  WORKING_DAYS_SWEDEN,
} from "@/lib/constants";
import {
  calculateYearlyInput,
  getIncomeTax,
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

  const dailyRevenue = revenue.hourlyRate * (revenue.scope / 100) * 8;

  const totalLostRevenue = Math.floor(benefits.vacation * dailyRevenue);
  const pensionCost = benefits.salary * (benefits.pension / 100);

  const totalRevenue = dailyRevenue * WORKING_DAYS_SWEDEN;
  const adjustedRevenue = totalRevenue - totalLostRevenue;

  const totalSalary = benefits.salary * 12;
  const employerFee = benefits.salary * SALARY_TAX;
  const totalSalaryCosts = benefits.salary + employerFee;

  const incomeTagPercentage = getIncomeTax(benefits.salary * 12);
  const incomeTax = totalSalary * (incomeTagPercentage / 100);

  const totalAdditionalCosts = calculateYearlyInput(costs);

  const totalCosts =
    totalAdditionalCosts + (totalSalaryCosts + pensionCost) * 12;

  // Result calculations
  const resultBeforeTax = adjustedRevenue - totalCosts - totalSalaryCosts;
  const profitTax = resultBeforeTax * RESULT_TAX;
  const resultAfterTax = resultBeforeTax - profitTax;

  // Dividend calculations
  const maxDividend = Math.min(
    Math.max(totalSalary / 2, BASE_DIVIDEND),
    resultAfterTax
  );

  const dividendTax = maxDividend * DIVIDEND_TAX;
  const balancedProfit = resultAfterTax - maxDividend;

  // Income calculations
  const taxPercentage = getIncomeTax(totalSalary);

  const salaryAfterTaxes = totalSalary * (1 - taxPercentage / 100);
  const dividendAfterTaxes = maxDividend - dividendTax;

  const referenceTaxPercentage = taxPercentage + 2; // Add 2% to the tax percentage to account for
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
            pensionCost={pensionCost}
          />
          <AdditionalCosts
            costs={costs}
            setCosts={(costs) => setFormData({ ...formData, costs })}
            totalCosts={totalAdditionalCosts}
            employerFee={employerFee}
            pensionCost={pensionCost}
            showMonthly={showMonthly}
            vacationCost={totalLostRevenue}
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
              resultBeforeTax={resultBeforeTax}
              resultAfterTax={resultAfterTax}
              maxDividend={maxDividend}
              balancedProfit={balancedProfit}
            />
          </CardContent>
        </Card>
        <TaxTable
          incomeTax={incomeTax}
          incomeTaxPercentage={incomeTagPercentage}
          profitTax={profitTax}
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
