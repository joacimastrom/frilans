import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Title = ({ children, className }: Props) => {
  const classes = cn(
    "scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight first:mt-0 mt-4 flex justify-between",
    className
  );
  return <h2 className={classes}>{children}</h2>;
};
