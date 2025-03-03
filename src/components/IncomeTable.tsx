import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { Wallet } from "lucide-react";
import { IncomeChartData } from "./Form/IncomeChart";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  salary: number;
  dividend: number;
  referenceSalary: number;
  setSalary: (salary: number) => void;
  maxIncomeObject: IncomeChartData;
};

export const IncomeTable = ({
  salary,
  dividend,
  referenceSalary,
  maxIncomeObject,
  setSalary,
}: Props) => (
  <Card>
    <CardHeader className="border-b px-6 py-4">
      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Wallet className="h-5 w-5 text-blue-600" />
        <h2>Personliga intäkter</h2>
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
    </CardContent>
  </Card>
);
