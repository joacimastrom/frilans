import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const InfoPopover = ({ children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <CircleHelpIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={cn("text-gray-500 w-5 h-5", className)}
        />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
