import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";

type Props = {
  resultAfterTax: number;
  maxDividend: number;
  balancedResult: number;
};

export const ResultTable = ({
  resultAfterTax,
  maxDividend,
  balancedResult,
}: Props) => {
  return (
    <Table>
      <TableBody>
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
            {addThousandSeparator(balancedResult)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
