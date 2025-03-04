import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addThousandSeparator } from "@/lib/helpers";
import { TrendingUp } from "lucide-react";
import { ReactNode } from "react";
import { CollapsibleCard } from "./CollapsibleCard";
import InfoPopover from "./InfoPopover";

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
    <CollapsibleCard
      title={
        <>
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="mr-auto">Resultatsräkning</h2>
        </>
      }
    >
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
    </CollapsibleCard>
  );
};
