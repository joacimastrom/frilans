import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type MaxWidthSectionProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

const MaxWidthSection = <T extends ElementType = "section">({
  as,
  children,
  className,
}: MaxWidthSectionProps<T>) => {
  const Component = as || "section";

  return (
    <Component
      className={cn("w-full px-4 py-12 flex justify-center", className)}
    >
      <div className="max-w-[1020px] w-full">{children}</div>
    </Component>
  );
};

export default MaxWidthSection;
