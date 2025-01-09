import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";

type Props = {
  resultBeforeTax: number;
  resultAfterTax: number;
  maxDividend: number;
  balancedProfit: number;
};

export const ResultTable = ({
  resultBeforeTax,
  resultAfterTax,
  maxDividend,
  balancedProfit,
}: Props) => {
  return (
    <Table className="font-bold">
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Resultat innan skatt</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(resultBeforeTax)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Resultat efter skatt</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(resultAfterTax)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Max utdelning</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(maxDividend)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Balanserad vinst</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(balancedProfit)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
