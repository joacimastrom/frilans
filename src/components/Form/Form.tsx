import { DIVIDEND_TAX, EMPLOYER_TAX, RESULT_TAX } from "@/lib/constants";
import {
  getIncomeTax,
  getMaxSalary,
  getRevenueData,
  getSalaryData,
  getTaxBracket,
  getTaxData,
  getTitleByPeriod,
} from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { IncomeTable } from "../IncomeTable";
import { ResultTable } from "../ResultTable";
import TaxTable from "../TaxTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AdditionalCosts from "./AdditionalCosts";
import BenefitsCard from "./BenefitsCard";
import RevenueCard from "./RevenueCard";

export type Benefits = {
  salary: number;
  vacation: number;
  pension: number;
};
export type Revenue = {
  hourlyRate: number;
  scope: number;
};

type FormData = {
  revenue: Revenue;
  benefits: Benefits;
  costs: FinancialPost[];
};

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

  const { revenue, benefits, costs } = formData;

  const {
    totalRevenue,
    lostRevenue,
    totalAdditionalCosts,
    resultBeforeSalary,
  } = getRevenueData(revenue, benefits, costs);

  const maxSalary = getMaxSalary(resultBeforeSalary, benefits.pension);

  const { incomeChartData, taxChartData } = useMemo(() => {
    const salaryData = [];
    const taxData = [];
    for (let i = 0; i <= maxSalary; i += 1000) {
      const salaryObj = getSalaryData(i, resultBeforeSalary, benefits.pension);
      salaryData.push(salaryObj);
      taxData.push(
        getTaxData(i, salaryObj.maxDividend, salaryObj.resultAfterSalary)
      );
    }

    return {
      incomeChartData: salaryData,
      taxChartData: taxData,
    };
  }, [resultBeforeSalary, maxSalary, benefits.pension]);

  const { maxDividend, balancedResult } = incomeChartData.find(
    ({ salary }) => salary === benefits.salary
  ) || { maxDividend: 0, balancedResult: 0 };

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
  const { monthlyIncomeTax, yearlyIncomeTax, incomeTaxPercentage } =
    getIncomeTax(benefits.salary);

  const salaryAfterTaxes = benefits.salary - monthlyIncomeTax;
  const dividendAfterTaxes = maxDividend - dividendTax;

  const dividendAfterTaxesMonthly = dividendAfterTaxes / 12;

  const { referenceSalary } = getTaxBracket(
    salaryAfterTaxes + dividendAfterTaxesMonthly
  );

  const onSetRevenue = (revenue: Revenue) => {
    const { resultBeforeSalary } = getRevenueData(revenue, benefits, costs);
    const maxSalary = getMaxSalary(resultBeforeSalary, benefits.pension);
    if (maxSalary < benefits.salary) {
      setFormData({
        ...formData,
        benefits: {
          ...benefits,
          salary: Math.max(maxSalary, 0),
        },
        revenue,
      });
      return;
    }
    setFormData({ ...formData, revenue });
  };

  const setSalary = (salary: number) =>
    setFormData({
      ...formData,
      benefits: {
        ...benefits,
        salary,
      },
    });

  return (
    <div className="flex gap-8">
      <div className="flex flex-col shrink-0 basis-1/2">
        <div className="space-y-2">
          <RevenueCard
            revenue={revenue}
            setRevenue={onSetRevenue}
            totalRevenue={getTitleByPeriod(totalRevenue)}
          />
          <BenefitsCard
            benefits={benefits}
            setBenefits={(benefits) => setFormData({ ...formData, benefits })}
            lostRevenue={lostRevenue}
            maxSalary={maxSalary}
          />
          <AdditionalCosts
            costs={costs}
            setCosts={(costs) => setFormData({ ...formData, costs })}
            totalCosts={totalAdditionalCosts}
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
        <IncomeTable
          salary={totalSalary}
          dividend={maxDividend}
          referenceSalary={referenceSalary}
          incomeChartData={incomeChartData}
          setSalary={setSalary}
        />
        <TaxTable
          yearlyIncomeTax={yearlyIncomeTax}
          salary={benefits.salary}
          incomeTaxPercentage={incomeTaxPercentage}
          profitTax={resultTax}
          dividendTax={dividendTax}
          taxChartData={taxChartData}
          setSalary={setSalary}
        />
      </div>
    </div>
  );
};

export default Form;
