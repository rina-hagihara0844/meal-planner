import { Ingredient } from "./ingredient";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  serving_size: number;
  instructions: string;
  country_of_origin: string | undefined;
  image_url: string | undefined;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
  ingredient?: Ingredient;
}
export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients: (RecipeIngredient & {
    ingredient: Ingredient;
  })[];
}
