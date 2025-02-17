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
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Resultat innan skatt</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(resultBeforeTax)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Resultat efter skatt</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(resultAfterTax)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Max utdelning</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(maxDividend)}
          </TableCell>
        </TableRow>
        <TableRow className="font-bold">
          <TableCell>Balanserad vinst</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(balancedProfit)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
