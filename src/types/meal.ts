import { Recipe } from "./recipe";

export interface Meal {
  id: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner";
  created_at: string;
  updated_at: string;
}

export interface MealRecipe {
  id: string;
  meal_id: string;
  recipe_id: string;
  created_at: string;
  updated_at: string;
  recipe?: Recipe;
}

export interface MealWithRecipes extends Meal {
  meal_recipes: (MealRecipe & {
    recipe: Recipe;
  })[];
}
