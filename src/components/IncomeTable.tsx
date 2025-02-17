import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  salary: number;
  dividend: number;
  referenceSalary: number;
};

export const IncomeTable = ({ salary, dividend, referenceSalary }: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        Personliga intäkter
        <Button size="sm" className="ml-auto">
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
