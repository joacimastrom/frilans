import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const InfoPopover = ({ children, className }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <CircleHelpIcon className={cn("text-gray-500 w-5 h-5", className)} />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
