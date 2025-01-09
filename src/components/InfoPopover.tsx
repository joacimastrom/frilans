import { InfoIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {};

const InfoPopover = (props: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="ml-2 text-gray-500 w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};

export default InfoPopover;
