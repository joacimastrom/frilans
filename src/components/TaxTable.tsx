import { DIVIDEND_TAX, RESULT_TAX_PERCENTAGE } from "@/lib/constants";
import { addThousandSeparator } from "@/lib/helpers";
import { Percent } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import { TaxChartData } from "./Form/TaxChart";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type Props = {
  yearlyIncomeTax: number;
  profitTax: number;
  incomeTaxPercentage: number;
  dividendTax: number;
  setSalary: (salary: number) => void;
  minTaxObject: TaxChartData;
};

const TaxTable = ({
  yearlyIncomeTax,
  profitTax,
  incomeTaxPercentage,
  dividendTax,
  setSalary,
  minTaxObject,
}: Props) => (
  <CollapsibleCard
    title={
      <>
        <Percent className="h-5 w-5 text-blue-600" />
        <h2>Skatter</h2>
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => setSalary(minTaxObject.salary)}
        >
          Minimera skatt
        </Button>
      </>
    }
  >
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            Vinstskatt{" "}
            <span className="text-muted-foreground whitespace-nowrap">
              ({RESULT_TAX_PERCENTAGE}%)
            </span>
          </TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(profitTax)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Löneskatt{" "}
            <span className="text-muted-foreground whitespace-nowrap">
              ({incomeTaxPercentage}%)
            </span>
          </TableCell>
          <TableCell className="text-right">
            {`${addThousandSeparator(yearlyIncomeTax)} kr / år`}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Utdelningsskatt{" "}
            <span className="text-muted-foreground whitespace-nowrap">
              ({DIVIDEND_TAX * 100}%)
            </span>
          </TableCell>
          <TableCell className="text-right">
            {`${addThousandSeparator(dividendTax)}`}
          </TableCell>
        </TableRow>
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {`${addThousandSeparator(
              dividendTax + profitTax + yearlyIncomeTax
            )}`}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CollapsibleCard>
);

export default TaxTable;
