import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DIVIDEND_TAX } from "@/lib/constants";
import { addThousandSeparator, getNearestHundreds } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";

type Props = {
  salary: number;
  dividend: number;
};

export const IncomeTable = ({ salary, dividend }: Props) => {
  const [debouncedSalary] = useDebounce(salary, 2000);
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
  });

  if (isPending) return <p>Hämtar skattesats...</p>;

  const taxPercentage = Math.round((data / monthlySalary) * 100 * 100) / 100;
  const salaryAfterTaxes = salary - data * 12;
  const dividendAfterTaxes = dividend * (1 - DIVIDEND_TAX);

  return (
    <Table className="font-bold">
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Årslön</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(salary)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Utdelning</TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(dividend)}
          </TableCell>
        </TableRow>
        <TableRow>
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
          <TableCell className="font-bold">Total </TableCell>
          <TableCell className="text-right">
            {addThousandSeparator(salaryAfterTaxes + dividendAfterTaxes)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
