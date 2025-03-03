import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { TrendingUp } from "lucide-react";
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
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Resultatsräkning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Resultat efter skatt</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {addThousandSeparator(resultAfterTax)}
                  <InfoPopover>{resultDescription}</InfoPopover>
                </div>
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
