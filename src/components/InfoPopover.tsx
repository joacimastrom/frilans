import { CircleHelpIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  children?: React.ReactNode;
};

const InfoPopover = ({ children }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <CircleHelpIcon className="ml-2 text-gray-500 w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
