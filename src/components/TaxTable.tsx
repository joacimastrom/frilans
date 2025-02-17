import { DIVIDEND_TAX, RESULT_TAX_PERCENTAGE } from "@/lib/constants";
import { addThousandSeparator } from "@/lib/helpers";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type Props = {
  incomeTax: number;
  profitTax: number;
  incomeTaxPercentage: number;
  dividendTax: number;
};

const TaxTable = ({
  incomeTax,
  profitTax,
  incomeTaxPercentage,
  dividendTax,
}: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        Skatter{" "}
        <Button size="sm" className="ml-auto">
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
              {`${addThousandSeparator(incomeTax / 12)} kr / månad`}
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
              {`${addThousandSeparator(dividendTax + profitTax + incomeTax)}`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default TaxTable;
