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
import MaxWidthSection from "../MaxWidthSection";
import OptimisedCard from "../OptimisedCard";
import { ResultTable } from "../ResultTable";
import TaxTable from "../TaxTable";
import { Table, TableCell, TableRow } from "../ui/table";
import AdditionalCosts from "./AdditionalCosts";
import BenefitsCard from "./BenefitsCard";
import CalculationSteps from "./CalculationSteps";
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

const initialState: FormData = {
  revenue: {
    hourlyRate: 800,
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
      amount: 450,
      period: "monthly",
    },
    {
      id: 1738783727097,
      description: "Bil",
      amount: 2500,
      period: "monthly",
    },
    {
      id: 1738783731573,
      description: "Försäkring",
      amount: 5000,
      period: "yearly",
    },
  ],
};

const Form = () => {
  const savedData = localStorage.getItem("formData");
  const jsonData = savedData && JSON.parse(savedData);
  const [formData, setFormData] = useState<FormData>(jsonData || initialState);

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

  const { incomeChartData, taxChartData, combinedChartData } = useMemo(() => {
    const incomeChartData = [];
    const taxChartData = [];
    const combinedChartData = [];
    for (let i = 0; i <= maxSalary; i += 1000) {
      const salaryObj = getSalaryData(i, resultBeforeSalary, benefits.pension);
      incomeChartData.push(salaryObj);
      const taxObj = getTaxData(
        i,
        salaryObj.maxDividend,
        salaryObj.resultAfterSalary
      );
      taxChartData.push(taxObj);
      const totalTaxPercent =
        Math.round((taxObj.totalTax / salaryObj.totalIncome) * 10000) / 100;
      combinedChartData.push({
        salary: i,
        totalTaxPercent,
        totalTax: taxObj.totalTax,
      });
    }

    return {
      incomeChartData,
      taxChartData,
      combinedChartData,
    };
  }, [resultBeforeSalary, maxSalary, benefits.pension]);

  const { maxDividend, balancedResult } = incomeChartData.find(
    ({ salary }) => salary === benefits.salary
  ) || { maxDividend: 0, balancedResult: 0 };

  // Tax calculations
  const totalSalary = benefits.salary * 12;
  const employerFee = totalSalary * EMPLOYER_TAX;
  const totalSalaryCost =
    totalSalary * (1 + benefits.pension / 100) + employerFee;

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
    <>
      <MaxWidthSection className="py-12">
        <h2
          id="calculate"
          className="text-3xl mb-8 font-bold text-gray-900 max-w-4xl mx-auto text-center"
        >
          Räkna på din ekonomi
        </h2>
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
                setBenefits={(benefits) =>
                  setFormData({ ...formData, benefits })
                }
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
                      <TableCell className="text-right">
                        {totalRevenue}
                      </TableCell>
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
              incomeTaxPercentage={incomeTaxPercentage}
              employerFee={employerFee}
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
          combinedChartData={combinedChartData}
        />
      </MaxWidthSection>
      <CalculationSteps />
    </>
  );
};

export default Form;
