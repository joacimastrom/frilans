import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { Wallet } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import { IncomeChartData } from "./Form/charts/IncomeChart";
import { Button } from "./ui/button";

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
  <CollapsibleCard
    defaultOpen
    title={
      <>
        <Wallet className="h-5 w-5 text-blue-600" />
        <h2>Personlig inkomst</h2>
        <Button
          size="sm"
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            setSalary(maxIncomeObject.salary);
          }}
        >
          Maximera inkomst
        </Button>
      </>
    }
  >
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
  </CollapsibleCard>
);
