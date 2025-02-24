import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { IncomeChart, IncomeChartData } from "./Form/IncomeChart";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  salary: number;
  dividend: number;
  referenceSalary: number;
  incomeChartData: IncomeChartData[];
  setSalary: (salary: number) => void;
};

export const IncomeTable = ({
  salary,
  dividend,
  referenceSalary,
  incomeChartData,
  setSalary,
}: Props) => {
  const maxIncomeObject = incomeChartData.reduce((acc, curr) => {
    if (curr.totalIncome > acc.totalIncome) {
      return curr;
    }
    return acc;
  }, incomeChartData[0]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          Personliga intäkter
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => setSalary(maxIncomeObject.salary)}
          >
            Maximera intäkter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Månadslön </TableCell>
              <TableCell className="text-right">
                {addThousandSeparator(salary / 12)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Utdelning</TableCell>
              <TableCell className="text-right">
                {addThousandSeparator(dividend)}
              </TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {addThousandSeparator(salary + dividend)}
              </TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Jämförelselön</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {addThousandSeparator(referenceSalary) + " kr / månad"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <IncomeChart
          incomeChartData={incomeChartData}
          salary={salary / 12}
          onChartClick={setSalary}
          maxIncomeSalary={maxIncomeObject.salary}
        />
      </CardContent>
    </Card>
  );
};
