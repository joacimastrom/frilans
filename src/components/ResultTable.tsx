import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { ReactNode } from "react";
import InfoPopover from "./InfoPopover";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  resultAfterTax: number;
  maxDividend: number;
  balancedResult: number;
  resultDescription: ReactNode;
};

export const ResultTable = ({
  resultAfterTax,
  maxDividend,
  balancedResult,
  resultDescription,
}: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">Resultatsräkning</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Resultat efter skatt</TableCell>
              <TableCell className="text-right">
                {addThousandSeparator(resultAfterTax)}
                <InfoPopover>{resultDescription}</InfoPopover>
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
      </CardContent>
    </Card>
  );
};
