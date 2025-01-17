import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DIVIDEND_TAX } from "@/lib/constants";
import { addThousandSeparator, swedishIncomeTax } from "@/lib/helpers";

type Props = {
  salary: number;
  dividend: number;
};

export const IncomeTable = ({ salary, dividend }: Props) => {
  /*   const [debouncedSalary] = useDebounce(salary, 2000);
  const monthlySalary = debouncedSalary / 12;
  const { roundedDown, roundedUp } = getNearestHundreds(monthlySalary);

  const { isPending, error, data } = useQuery({
    queryKey: ["taxTable", roundedDown, roundedUp],
    queryFn: async ({ queryKey }) => {
      const [_, roundedDown, roundedUp] = queryKey;
      const { data } = await axios.get(
        `https://skatteverket.entryscape.net/rowstore/dataset/88320397-5c32-4c16-ae79-d36d95b17b95?_limit=10&_offset=0&inkomst+fr.o.m.=${roundedDown}&inkomst+t.o.m.=${roundedUp}&tabellnr=31&år=2025`
      );
      if (data?.results.length > 1) console.log("More than one result");
      return data?.results[0]["kolumn 1"];
    },
    enabled: monthlySalary < 80000,
  });

  if (isPending) return <p>Hämtar skattesats...</p>; 

  const taxPercentage =
    monthlySalary < 80000
      ? Math.round((data / monthlySalary) * 100 * 100) / 100
      : getHighIncomeTaxPercentage(monthlySalary);
*/

  const taxPercentage = swedishIncomeTax(salary);

  const salaryAfterTaxes = salary * (1 - taxPercentage / 100);
  const dividendAfterTaxes = dividend * (1 - DIVIDEND_TAX);

  const referenceTaxPercentage = taxPercentage + 2;

  console.log(referenceTaxPercentage, salaryAfterTaxes);
  const referenceSalary =
    (salaryAfterTaxes + dividendAfterTaxes) /
    (1 - referenceTaxPercentage / 100) /
    12;

  return (
    <Table className="font-bold">
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            Månadslön{" "}
            <span className="text-muted-foreground whitespace-nowrap">
              ({taxPercentage}% skatt)
            </span>
          </TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(salary / 12)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Utdelning</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(dividend)}
          </TableCell>
        </TableRow>
        {/* <TableRow>
          <TableCell className="font-medium">
            Lön efter skatt
            <span className="text-muted-foreground"> ({taxPercentage}%)</span>
          </TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(salaryAfterTaxes)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">
            Utdelning efter skatt
            <span className="text-muted-foreground">
              {" "}
              ({DIVIDEND_TAX * 100}%)
            </span>
          </TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(dividendAfterTaxes)}
          </TableCell>
        </TableRow> 
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(salary + dividend)}
          </TableCell>
        </TableRow>*/}
        <TableRow>
          <TableCell className="font-bold">Jämförelselön</TableCell>
          <TableCell className="text-right whitespace-nowrap">
            {addThousandSeparator(referenceSalary) + " kr / månad"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
