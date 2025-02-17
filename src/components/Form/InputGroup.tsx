import { periodOptions } from "@/lib/helpers";
import { FinancialPost } from "@/lib/types";
import { PlusIcon, TrashIcon } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  inputs: FinancialPost[];
  setInputs: (inputs: FinancialPost[]) => void;
  additionalRowData?: (input: FinancialPost) => ReactNode;
  alternateLabel?: boolean;
  isArray?: boolean;
};

const InputGroup = ({
  inputs,
  setInputs,
  additionalRowData,
  alternateLabel,
  isArray = true,
}: Props) => {
  const onInputChange = (id, name, value) =>
    setInputs(
      inputs.map((input) =>
        input.id === id
          ? {
              ...input,
              [name]: value,
            }
          : input
      )
    );

  const shouldAutoFocus = useRef(false);
  const refToLast = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputs.length > 0 && shouldAutoFocus.current && refToLast.current) {
      refToLast.current?.focus();
      shouldAutoFocus.current = false;
    }
  }, [inputs.length]);

  return (
    <div>
      {inputs.map((input) => (
        <div key={input.id} className="first:mt-0 mt-2">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              size={2}
              name="description"
              placeholder="Beskrivning"
              value={input.description}
              ref={refToLast}
              onChange={(e) =>
                onInputChange(input.id, "description", e.target.value)
              }
            />
            <Select
              value={input.period}
              name="period"
              onValueChange={(value) =>
                onInputChange(input.id, "period", value)
              }
            >
              <SelectTrigger className="min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {alternateLabel ? option.alternateLabel : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              name="amount"
              placeholder="Belopp"
              value={input.amount}
              onChange={(e) =>
                onInputChange(input.id, "amount", e.target.value)
              }
            />
            {isArray && (
              <TrashIcon
                className="shrink-0 h-4 w-4 text-red-500 cursor-pointer"
                onClick={() =>
                  setInputs(
                    inputs.filter((prevInput) => prevInput.id !== input.id)
                  )
                }
              />
            )}
          </div>
          {additionalRowData && additionalRowData(input)}
        </div>
      ))}
      {isArray && (
        <Button
          size="sm"
          className="flex items-center mt-2"
          onClick={() => {
            shouldAutoFocus.current = true;
            setInputs([
              ...inputs,
              { id: Date.now(), description: "", amount: 0, period: "monthly" },
            ]);
          }}
        >
          Lägg till <PlusIcon className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default InputGroup;
