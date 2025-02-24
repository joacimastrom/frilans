import { DIVIDEND_TAX, RESULT_TAX_PERCENTAGE } from "@/lib/constants";
import { addThousandSeparator } from "@/lib/helpers";
import { TaxChart, TaxChartData } from "./Form/taxChart";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type Props = {
  yearlyIncomeTax: number;
  profitTax: number;
  incomeTaxPercentage: number;
  dividendTax: number;
  taxChartData: TaxChartData[];
  salary: number;
  setSalary: (salary: number) => void;
};

const TaxTable = ({
  salary,
  yearlyIncomeTax,
  profitTax,
  incomeTaxPercentage,
  dividendTax,
  taxChartData,
  setSalary,
}: Props) => {
  const minTaxObject = taxChartData.reduce((acc, curr) => {
    if (curr.totalTax < acc.totalTax) {
      return curr;
    }
    return acc;
  }, taxChartData[0]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          Skatter
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => setSalary(minTaxObject.salary)}
          >
            Minimera skatt
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
        <TaxChart
          taxChartData={taxChartData}
          salary={salary}
          minTaxSalary={minTaxObject.salary}
          onChartClick={setSalary}
        />
      </CardContent>
    </Card>
  );
};

export default TaxTable;
