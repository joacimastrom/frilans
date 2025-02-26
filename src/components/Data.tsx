import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label: string;
  value: string | number;
};

export const Data = ({ label, value, className }: Props) => {
  const classes = cn("flex justify-between w-full", className);
  return (
    <h2 className={classes}>
      <span>{label}</span>
      <span>{value}</span>
    </h2>
  );
};
