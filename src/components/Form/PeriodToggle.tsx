import React from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  showMonthly: boolean;
  setShowMonthly: React.Dispatch<React.SetStateAction<boolean>>;
};

const PeriodToggle: React.FC<Props> = ({
  showMonthly,
  setShowMonthly,
}: Props) => (
  <div className="flex items-center space-x-2">
    <div className="ml-auto flex items-center space-x-2">
      <Label htmlFor="monthly-mode">Årsvis</Label>
      <Switch
        id="monthly-mode"
        checked={showMonthly}
        onCheckedChange={() => setShowMonthly(!showMonthly)}
      />
      <Label htmlFor="monthly-mode">Månadsvis</Label>
    </div>
  </div>
);

export default PeriodToggle;
