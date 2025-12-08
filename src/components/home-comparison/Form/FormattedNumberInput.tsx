import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface FormattedNumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  formatNumber: (value: number) => string;
  parseNumber: (value: string) => number;
}

export default function FormattedNumberInput({
  id,
  value,
  onChange,
  placeholder,
  formatNumber,
  parseNumber,
}: FormattedNumberInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Update display value when the prop value changes and input is not focused
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isFocused, formatNumber]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number without formatting when focused
    setDisplayValue(value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsedValue = parseNumber(displayValue);
    onChange(parsedValue);
    // Format the display value
    setDisplayValue(formatNumber(parsedValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}
