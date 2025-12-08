import { Label } from "@/components/ui/label";

interface LabelWithHelpProps {
  htmlFor: string;
  children: React.ReactNode;
  helpText?: string;
}

export default function LabelWithHelp({
  htmlFor,
  children,
  helpText,
}: LabelWithHelpProps) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {helpText && (
        <span className="text-sm text-gray-500 mb-2 ml-1">- {helpText}</span>
      )}
    </Label>
  );
}
