import { MealRecipe, MealWithRecipes } from "@/types";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

interface MealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealWithRecipes | null | undefined;
  onEdit: () => void;
  onDelete: () => void;
  onAddToShoppingList: () => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  isOpen,
  onClose,
  meal,
  onEdit,
  onDelete,
  onAddToShoppingList,
}) => {
  if (!meal) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Meal Detail</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">date:</p>
            <p className="font-medium">{formatDate(meal.date)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">meal:</p>
            <p className="font-medium">
              {mealTypeLabels[meal.meal_type as keyof typeof mealTypeLabels]}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">recipe:</p>
            <div className="space-y-3">
              {meal.meal_recipes.map((mealRecipe: MealRecipe) => (
                <Card key={mealRecipe.id} className="overflow-hidden">
                  <div className="flex p-3">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full relative  flex items-center justify-center">
                      <Image
                        src={
                          mealRecipe.recipe?.image_url ||
                          "/images/recipe-placeholder.png"
                        }
                        alt={mealRecipe.recipe?.name || ""}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium">{mealRecipe.recipe?.name}</h4>
                    <p className="text-sm text-gray-500">
                      {mealRecipe.recipe?.category} •{" "}
                      {mealRecipe.recipe?.serving_size} servings
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-red-500"
            >
              Delete
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onEdit}>
                Edit
              </Button>
              <Button onClick={onAddToShoppingList}>
                Add to shopping list
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
