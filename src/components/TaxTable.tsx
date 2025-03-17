import { DIVIDEND_TAX, RESULT_TAX_PERCENTAGE } from "@/lib/constants";
import { addThousandSeparator } from "@/lib/helpers";
import { Percent } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";
import { TaxChartData } from "./Form/charts/TaxChart";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type Props = {
  yearlyIncomeTax: number;
  profitTax: number;
  incomeTaxPercentage: number;
  dividendTax: number;
  setSalary: (salary: number) => void;
  minTaxObject: TaxChartData;
  employerFee: number;
};

const TaxTable = ({
  yearlyIncomeTax,
  profitTax,
  incomeTaxPercentage,
  dividendTax,
  setSalary,
  minTaxObject,
  employerFee,
}: Props) => (
  <CollapsibleCard
    title={
      <>
        <Percent className="h-5 w-5 text-blue-600" />
        <h2>Skatter & avgifter</h2>
        <Button
          size="sm"
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            setSalary(minTaxObject.salary);
          }}
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
            Bolagsskatt{" "}
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
            Arbetsgivaraftift{" "}
            <span className="text-muted-foreground whitespace-nowrap">
              (31.42%)
            </span>
          </TableCell>
          <TableCell className="text-right">
            {`${addThousandSeparator(employerFee)} kr / år`}
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
              dividendTax + profitTax + yearlyIncomeTax + employerFee
            )}`}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CollapsibleCard>
);

export default TaxTable;
