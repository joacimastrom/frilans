import { Button } from "@/components/ui/button";

interface ActionButtonsSectionProps {
  onCancel: () => void;
  isEditing: boolean;
}

export default function ActionButtonsSection({
  onCancel,
  isEditing,
}: ActionButtonsSectionProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Avbryt
      </Button>
      <Button type="submit">
        {isEditing ? "Uppdatera scenario" : "Skapa scenario"}
      </Button>
    </div>
  );
}
