import { Recipe } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  selectedDate: Date | null;
  selectedMealType: "breakfast" | "lunch" | "dinner" | null;
  onAddMeal: (
    date: Date,
    mealType: "breakfast" | "lunch" | "dinner",
    recipeIds: string[]
  ) => Promise<void>;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  recipes,
  selectedDate,
  selectedMealType,
  onAddMeal,
}) => {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  };

  const mealTypeLabels = {
    breakfast: "breakfast",
    lunch: "lunch",
    dinner: "dinner",
  };

  const handleToggleRecipe = (recipeId: string) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedMealType || selectedRecipes.length === 0)
      return;
    setIsSubmitting(true);
    try {
      await onAddMeal(selectedDate, selectedMealType, selectedRecipes);
      onClose();
    } catch (e) {
      console.error("Failed to add meal:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add to Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <p className="mb-1 font-medium">Date:</p>
            <p>{formatDate(selectedDate)}</p>
          </div>
        </div>

        <div>
          <p className="mb-1 font-medium">Meal:</p>
          <p>
            {selectedMealType
              ? mealTypeLabels[selectedMealType as keyof typeof mealTypeLabels]
              : ""}
          </p>
        </div>

        <div>
          <p className="mb-3 font-medium">Choose recipe:</p>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                  selectedRecipes.includes(recipe.id)
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
                onClick={() => handleToggleRecipe(recipe.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden relative">
                    <Image
                      src={recipe.image_url || "/images/recipe-placeholder.png"}
                      alt={recipe.name}
                      fill
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{recipe.name}</h4>
                    <p className="text-sm text-gray-500">
                      {recipe.category} • {recipe.serving_size} servings
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-3">
            <Button variant="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedRecipes.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Add to meal"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
