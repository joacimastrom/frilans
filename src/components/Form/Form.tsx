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
import ChartCard from "../ChartCard";
import { IncomeTable } from "../IncomeTable";
import OptimisedCard from "../OptimisedCard";
import { ResultTable } from "../ResultTable";
import TaxTable from "../TaxTable";
import { Table, TableCell, TableRow } from "../ui/table";
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

  useEffect(() => {
    if (benefits.salary > maxSalary) {
      setFormData((formData) => ({
        ...formData,
        benefits: {
          ...benefits,
          salary: maxSalary,
        },
      }));
    }
  }, [benefits, maxSalary]);

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

  const maxIncomeObject = incomeChartData.reduce((acc, curr) => {
    if (curr.totalIncome > acc.totalIncome) {
      return curr;
    }
    return acc;
  }, incomeChartData[0]);

  const minTaxObject = taxChartData.reduce((acc, curr) => {
    if (curr.totalTax < acc.totalTax) {
      return curr;
    }
    return acc;
  }, taxChartData[0]);

  const setSalary = (salary: number) =>
    setFormData({
      ...formData,
      benefits: {
        ...benefits,
        salary,
      },
    });

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Frilanskalkylatorn
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col">
          <div className="space-y-2">
            <RevenueCard
              revenue={revenue}
              setRevenue={(revenue: Revenue) =>
                setFormData({ ...formData, revenue })
              }
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
            <ResultTable
              resultAfterTax={resultAfterTax}
              maxDividend={maxDividend}
              balancedResult={balancedResult}
              resultDescription={
                <Table>
                  <TableRow>
                    <TableCell>Årliga intäkter</TableCell>
                    <TableCell className="text-right">{totalRevenue}</TableCell>
                  </TableRow>
                </Table>
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <OptimisedCard
            monthlySalary={maxIncomeObject.salary}
            dividend={maxIncomeObject.maxDividend}
            totalIncome={maxIncomeObject.totalIncome}
          />
          <IncomeTable
            salary={totalSalary}
            dividend={maxDividend}
            referenceSalary={referenceSalary}
            setSalary={setSalary}
            maxIncomeObject={maxIncomeObject}
          />
          <TaxTable
            yearlyIncomeTax={yearlyIncomeTax}
            salary={benefits.salary}
            incomeTaxPercentage={incomeTaxPercentage}
            profitTax={resultTax}
            dividendTax={dividendTax}
            setSalary={setSalary}
            minTaxObject={minTaxObject}
          />
        </div>
      </div>
      <ChartCard
        incomeChartData={incomeChartData}
        salary={benefits.salary}
        setSalary={setSalary}
        maxIncomeObject={maxIncomeObject}
        taxChartData={taxChartData}
        minTaxObject={minTaxObject}
      />
    </div>
  );
};

export default Form;
