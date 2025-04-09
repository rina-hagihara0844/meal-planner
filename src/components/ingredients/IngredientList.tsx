import { Ingredient } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "../ui/Button";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";

interface ingredientListProps {
  ingredients: Ingredient[];
  onAddIngredient: () => void;
  onEditIngredient: (id: string) => void;
  onDeleteIngredient: (id: string) => void;
}

export const IngredientList: React.FC<ingredientListProps> = ({
  ingredients,
  onAddIngredient,
  onEditIngredient,
  onDeleteIngredient,
}) => {
  //食材をカテゴリ毎に分類
  const groupedIngredients = ingredients.reduce<Record<string, Ingredient[]>>(
    (acc, ingredient) => {
      const category = ingredient.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(ingredient);
      return acc;
    },
    {}
  );

  //カテゴリでソートする
  const sortedCategories = Object.keys(groupedIngredients).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Ingredient List</h2>
        <Button onClick={onAddIngredient} className="bg-emerald-500 text-white">Add Ingredient</Button>
      </div>
      <div className="space-y-6">
        {sortedCategories.map((category) => {
          const categoryIngredients = groupedIngredients[category];
          return (
            <Card key={category} className="bg-emerald-50">
              <CardHeader className="py-3 px-4">
                <h3 className="font-medium">{category}</h3>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryIngredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-white w-full border rounded-lg p-3 hover:border-emerald-300 border-2 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{ingredient.name}</h4>
                          <p className="text-sm text-gray-500">
                            Unit: {ingredient.unit}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => onEditIngredient(ingredient.id)}
                          >
                            <Pencil />
                          </button>
                          <button
                            type="button"
                            className="text-red-400 hover:text-red-600"
                            onClick={() => onDeleteIngredient(ingredient.id)}
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};